import { Injectable, Logger, LoggerFactory, ValidationUtils, Networks, LocalCache } from "ferrum-plumbing";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { MongooseConnection } from 'aws-lambda-helper';
import { Connection, Document, Model } from 'mongoose';
import { QuantumPortalMinedBlockModel, QuantumPortalRemoteTransactoin,
    QuantumPortalRemoteTransactoinModel, quantumPortalContracts, QuantumPortalBlockFinalization, QuantumPortalMinedBlock } from 'qp-explorer-commons';
import { QpExplorerNodeConfig } from "../QpExplorerNodeConfig";
import { QuantumPortalLedgerMgr, QuantumPortalLedgerMgr__factory, } from "../resources";
import { Utils } from "types";


export class QpExplorerService extends MongooseConnection implements Injectable  {
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
        this.log = logFac.getLogger(QpExplorerService);
    }

    __name__(): string { return 'QpExplorerService'; }

    initModels(con: Connection): void {
        this.blockModel = QuantumPortalMinedBlockModel(con);
        this.txModel = QuantumPortalRemoteTransactoinModel(con);
    }

    async recentBlocks(page: number, pageSize: number): Promise<QuantumPortalMinedBlock[]> {
        ValidationUtils.isTrue(pageSize > 0, '"pageSize" required');
        this.verifyInit();
        const rv = await this.blockModel.find().sort({timestamp: -1}).skip(page * pageSize).limit(pageSize).exec();
        return rv.map(b => b.toJSON());
    }

   async recentTxs(page: number, pageSize: number): Promise<QuantumPortalRemoteTransactoin[]> {
        ValidationUtils.isTrue(pageSize > 0, '"pageSize" required');
        this.verifyInit();
        const rv = await this.txModel.find().sort({timestamp: -1}).skip(page * pageSize).limit(pageSize).exec();
        return rv.map(b => b.toJSON());
   }

   async blockByHash(networkId: string, blockHash: string): Promise<QuantumPortalMinedBlock> {
       ValidationUtils.isTrue(!!networkId, '"networkId" required');
       ValidationUtils.isTrue(!!blockHash, '"blockHash" required');
       this.verifyInit();
       const rv = await this.blockModel.findOne({networkId, blockHash}).exec();
       ValidationUtils.isTrue(!!rv, `Block with hash ${networkId}:${blockHash} not found`);
       return rv.toJSON();
   }

   async blockTxs(networkId: string, blockHash: string): Promise<QuantumPortalRemoteTransactoin[]> {
       ValidationUtils.isTrue(!!networkId, '"networkId" required');
       ValidationUtils.isTrue(!!blockHash, '"blockHash" required');
       this.verifyInit();
       const rv = await this.txModel.find({blockHash}).sort({timesstamp: -1}).exec();
       return rv.map(t => t.toJSON());
   }

   async tx(networkId: string, txId: string): Promise<QuantumPortalRemoteTransactoin> {
       ValidationUtils.isTrue(!!networkId, '"networkId" required');
       ValidationUtils.isTrue(!!txId, '"txId" required');
       this.verifyInit();
       const rv = await this.txModel.findOne({hash: txId}).sort({timesstamp: -1}).exec();
       ValidationUtils.isTrue(!!rv, `Tx with hash ${networkId}:${txId} not found`);
       return rv.toJSON();
   }

   	private async mgr(network: string): Promise<QuantumPortalLedgerMgr> {
		const provider = await this.helper.ethersProvider(network);
        const contract = quantumPortalContracts(network);
		return QuantumPortalLedgerMgr__factory.connect(contract.manager, provider);
	}

    private async mgrVersion(network): Promise<string> {
        return this.cache.getAsync(network + 'MGR_VERSION', async () => {
            const mgr = await this.mgr(network);
            return mgr.VERSION.toString();
        });
    }
}