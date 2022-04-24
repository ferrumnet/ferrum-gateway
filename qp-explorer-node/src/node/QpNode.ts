import { Injectable, Logger, LoggerFactory, ValidationUtils, Networks, LocalCache } from "ferrum-plumbing";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { MongooseConnection } from 'aws-lambda-helper';
import { Connection, Document, Model } from 'mongoose';
import { QuantumPortalMinedBlock, QuantumPortalMinedBlockModel, QuantumPortalRemoteTransactoin,
    QuantumPortalRemoteTransactoinModel, quantumPortalContracts, QuantumPortalBlockFinalization } from 'qp-explorer-commons';
import { QpExplorerNodeConfig } from "../QpExplorerNodeConfig";
import { QuantumPortalLedgerMgr, QuantumPortalLedgerMgr__factory, } from "../resources";
import { Utils } from "types";
import { QpUtils } from "../QpUtils";

export class QpNode extends MongooseConnection implements Injectable  {
    private cache = new LocalCache();
    private log: Logger;
    private blockModel: Model<QuantumPortalMinedBlock&Document> | undefined;
    private txModel: Model<QuantumPortalRemoteTransactoin&Document> | undefined;

    constructor(
        logFac: LoggerFactory,
        private helper: EthereumSmartContractHelper,
        private config: QpExplorerNodeConfig,
    ) {
        super();
        this.log = logFac.getLogger(QpNode);
    }

    __name__(): string { return 'QpNode'; }

    initModels(con: Connection): void {
        this.blockModel = QuantumPortalMinedBlockModel(con);
        this.txModel = QuantumPortalRemoteTransactoinModel(con);
    }

    async process(network: string) {
        // Process blocks for a network
        // For simplicity we only pick blocks are are finalized.
        // TODO: Include non-finalized blocks and update them as they are finalized
        const lastBlockNonce = await this.getLastBlockNonceFromDb(network);
        const currentBlockNonce = await this.getCurrentBlockNonce(network);
        this.log.info(`Loading blocks from ${lastBlockNonce} to ${currentBlockNonce}`);
        // TODO: Run in parallel if necessary
        for (let i=lastBlockNonce + 1; i<=currentBlockNonce; i++) {
            this.log.info(`Processing block ${network}:${i}`);
            await this.processBlockByNonce(network, i);
        }
    }

    async processBlockByNonce(network: string, i: number) {
        // Get the mined block and transactions.
        // Save them all in the db.
        // Update the last db loaded
        const block = await this.getBlockByNonce(network, i);
        const txs = block.transactions;
        txs.forEach((t, i) => {
            t.blockHash = block.blockHash;
            t.blockIdx = i;
            t.hash = QpUtils.txHash(t);
        });
        await this.saveBlock(block);
        await this.saveTransactions(txs);
    }

    private async getLastBlockNonceFromDb(network: string): Promise<number> {
        const lb = await this.blockModel.find({network}).sort({nonce: -1}).limit(1).exec();
        if (!lb.length) {
            return 0;
        }
        return lb[0].nonce;
    }

    private async getCurrentBlockNonce(network: string): Promise<number> {
        // lastFinalizedBlock
        const mgr = await this.mgr(network);
        const chainId = Networks.for(network).chainId;
        const fb = await mgr.lastFinalizedBlock(chainId);
        return fb.nonce.toNumber();
        // TODO: Update to include mined blocks and finalized blocks in parallel
    }

    private async getBlockByNonce(network: string, nonce: number): Promise<QuantumPortalMinedBlock> {
        // minedBlockByNonce -> Block & Transactions
        // key -> FinKey
        // Get finalization for the block
        const mgr = await this.mgr(network);
        const version = await mgr.VERSION();
        const chainId = Networks.for(network).chainId;
        const [block, txs] = await mgr.minedBlockByNonce(chainId, nonce);
        const minerAddress = block.miner;
        const transactions: QuantumPortalRemoteTransactoin[] = [];
        for (let t of txs) {
            const tokenId = Utils.toCurrency(network, t.token.toString());
            const amountDisplay = await this.helper.amountToHuman(tokenId, t.amount.toString());
            const transaction = {
                timestamp: t.timestamp.toNumber(),
                remoteContract: t.remoteContract.toString(),
                sourceMsgSender: t.sourceMsgSender.toString(),
                sourceBeneficiary: t.sourceBeneficiary.toString(),
                tokenId,
                amountRaw: t.amount.toString(),
                amountDisplay,
                method: t.method.toString(),
                gas: t.gas.toString(),
                blockHash: block.blockHash.toString(),
            } as QuantumPortalRemoteTransactoin;
            transactions.push(transaction);
        }
        const finalizationMeta = await mgr.finalizations(nonce);
        const finalization = {
            timestamp: block.blockMetadata.timestamp.toNumber(),
            executorId: Utils.toCurrency(network, finalizationMeta.executor),
            finalizedBlockHash: finalizationMeta.finalizedBlocksHash,
            finalizerHash: finalizationMeta.finalizersHash,
            totalBlockStake: finalizationMeta.totalBlockStake.toString(),
        } as QuantumPortalBlockFinalization;
        return {
            blockHash: block.blockHash,
            minerId: `${Utils.toCurrency(network, minerAddress)}`,
            networkId: network,
            nonce: block.blockMetadata.nonce.toNumber(),
            stake: block.stake.toString(),
            timestamp: block.blockMetadata.timestamp.toNumber(),
            totalValue: block.totalValue.toString(),
            version: await this.mgrVersion(network),
            transactions,
            transactionCount: transactions.length,
            finalization,
        } as QuantumPortalMinedBlock;
    }

    private async saveBlock(block: QuantumPortalMinedBlock) {
        this.verifyInit();
        const res = await new this.blockModel!({...block, transactions: []});
        ValidationUtils.isTrue(!!res, 'Error saving block' + block);
    }

    private async saveTransactions(txs: QuantumPortalRemoteTransactoin[]) {
        this.verifyInit();
        const res = await this.txModel.insertMany(txs);
        ValidationUtils.isTrue(!!res, 'Error saving transactions');
    }

   	async mgr(network: string): Promise<QuantumPortalLedgerMgr> {
		const provider = await this.helper.ethersProvider(network);
        const contract = quantumPortalContracts(network);
		return QuantumPortalLedgerMgr__factory.connect(contract.manager, provider);
	}

    async mgrVersion(network): Promise<string> {
        return this.cache.getAsync(network + 'MGR_VERSION', async () => {
            const mgr = await this.mgr(network);
            return mgr.VERSION.toString();
        });
    }
}