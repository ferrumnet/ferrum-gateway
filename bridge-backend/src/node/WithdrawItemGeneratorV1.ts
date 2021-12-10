import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, Logger, LoggerFactory, ValidationUtils } from "ferrum-plumbing";
import { NodeProcessor } from "../common/TokenBridgeTypes";
import { BridgeNodesRemoteAccessClient } from "../nodeRemoteAccess/BridgeNodesRemoteAccessClient";
import { TokenBridgeContractClinet } from "../TokenBridgeContractClient";
import { BridgeNodeConfig } from "./BridgeNodeConfig";
import { NodeUtils } from "./common/NodeUtils";

const DEFAULT_LOOK_BACK_MILLIS = 1000 * 3600 * 24;

export class WithdrawItemGeneratorV1 implements Injectable, NodeProcessor {
    private log: Logger;
    constructor(
        private client: BridgeNodesRemoteAccessClient,
        private bridgeContract: TokenBridgeContractClinet,
        private helper: EthereumSmartContractHelper,
        private config: BridgeNodeConfig,
        private publicApiKey: string,
        private secretApiKey: string,
        logFac: LoggerFactory,
    ) {
        this.log = logFac.getLogger(WithdrawItemGeneratorV1);
    }

    __name__(): string { return 'WithdrawItemGeneratorV1'; }

    /**
     * 1. Check from network.
     * 2. Check from db.
     * 3. Produce wi for each item. (save locally)
     * 4. Get list of latest WI's tx IDs for this network.
     */
    async processForNetwork(network: string) {
        const soFar = await this.client.getWithdrawItemTransactionIds(
            this.publicApiKey,
            this.secretApiKey,
            '1.0',
            network,
            this.config.lookBackMillis || DEFAULT_LOOK_BACK_MILLIS,
        );
        ValidationUtils.isTrue(!!soFar, 'Error getting getWithdrawItemTransactionIds! No response');
        const pending = await this.client.getPendingSwapTxIds(
            this.publicApiKey,
            this.secretApiKey,
            network);
        ValidationUtils.isTrue(!!pending, 'Error getting getPendingSwapTxIds! No response');
        const fromNetwork = (await this.bridgeContract.getSwapEvents(network)) || [];

        // txs = fromNetwork + pending - soFar
        const allTxIds = new Set<string>();
        pending.filter(p => p.network === network).forEach(p =>  allTxIds.add(p.id));
        fromNetwork.forEach(p => allTxIds.add(p.transactionId));
        soFar.forEach(p => allTxIds.delete(p));
        this.log.info(`Need to process ${allTxIds.size} transactions for ${network}`);
        for(const tx of Array.from(allTxIds)) {
            await this.processSingleTransactionById(network, tx);
        }
    }

    /**
     * Get tx from the network.
     * Create a withdraw item.
     * Register it.
     */
    async processSingleTransactionById(network: string, txId: string) {
        try {
            const swap = await this.bridgeContract.getSwapEventByTxId(network, txId);
            const wi = await NodeUtils.withdrawItemFromSwap(
                '1.0',
                this.publicApiKey,
                swap,
                this.helper);
            NodeUtils.validateWithdrawItem(wi);
            await this.client.registerWithdrawItem(
                this.publicApiKey,
                this.secretApiKey,
                wi);
            this.log.info(`Registered PWI: ${network}:${txId}`);
        } catch (e) {
            console.error(`Error processing tx ${network}:${txId}`, e as Error);
        }
    }
}