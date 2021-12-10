import { Injectable, Logger, LoggerFactory, ValidationUtils } from "ferrum-plumbing";
import { UserBridgeWithdrawableBalanceItem } from "types";
import { BridgeNodesRemoteAccessClient } from "../nodeRemoteAccess/BridgeNodesRemoteAccessClient";
import { TokenBridgeContractClinet } from "../TokenBridgeContractClient";
import { NodeUtils } from "./common/NodeUtils";
import { PrivateKeyProvider } from "../common/PrivateKeyProvider";
import { NodeProcessor } from "../common/TokenBridgeTypes";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";

const EXPECTED_SCHEMA_VERSION = '1.0';

export class WithdrawItemValidator implements Injectable, NodeProcessor {
    private log: Logger;
    constructor(
        private client: BridgeNodesRemoteAccessClient,
        private bridgeContract: TokenBridgeContractClinet,
        private helper: EthereumSmartContractHelper,
        private key: PrivateKeyProvider,
        logFac: LoggerFactory,
    ) {
        this.log = logFac.getLogger(WithdrawItemValidator);
    }

    __name__(): string { return 'WithdrawItemValidator'; }

    /**
     * 1. Get all the pending withdraw items
     * 2. Validate it
     * 3. Create a signature and register it back
     */
    async processForNetwork(network: string) {
        const pending = await this.client.getPendingWithdrawItems(
            this.key.privateKey(),
            EXPECTED_SCHEMA_VERSION,
            network);
        ValidationUtils.isTrue(!!pending, 'Error when getPendingWithdrawItems. No response');
        this.log.info(`Recieved ${pending.length} pendingWithdrawItems`);
        for (const wi of pending) {
            await this.processSingleTransaction(wi);
        }
    }

    async processSingleTransactionById(network: string, txId: string) {
        const wi = await this.client.getPendingWithdrawItemById(
            this.key.privateKey(),
            EXPECTED_SCHEMA_VERSION,
            network,
            txId);
        ValidationUtils.isTrue(!!wi, `Withdraw item not found ${network}:${txId}`);
        await this.processSingleTransaction(wi);
    }

    /**
     * 1. Validate the wi.
     * 2. Make sure it matches the network.
     */
    async processSingleTransaction(wi: UserBridgeWithdrawableBalanceItem) {
        try {
            NodeUtils.validateWithdrawItem(wi);
            const swap = await this.bridgeContract.getSwapEventByTxId(
                wi.receiveNetwork, wi.receiveTransactionId);
            const newWi = await NodeUtils.withdrawItemFromSwap(
                EXPECTED_SCHEMA_VERSION,
                await this.key.address(),
                swap,
                this.helper); 
            NodeUtils.validateWithdrawItem(newWi);
            // TODO: make sure wi and newWi match.
            ensureWithdrawsMatch(wi, newWi);

            const hash = NodeUtils.bridgeV1Hash(wi);
            const sig = this.key.sign(hash);
            this.client.registerWithdrawItemHashVerification(
                this.key.privateKey(),
                await this.key.address(),
                wi.receiveNetwork,
                wi.receiveTransactionId,
                hash,
                sig,
                Date.now());
            this.log.info(`Registered verification of "${await this.key.address()}" for: ${wi.receiveNetwork}:${wi.receiveTransactionId}`);
        } catch (e) {
            console.error(`Error processing withdraw item "${JSON.stringify(wi)}"`, e as Error);
        }
    }
}

function ensureWithdrawsMatch(
    wi: UserBridgeWithdrawableBalanceItem,
    newWi: UserBridgeWithdrawableBalanceItem) {
    const wiJ = JSON.stringify(wi);
    const newWiJ = JSON.stringify(newWi);
    ValidationUtils.isTrue(
        wi.execution.status === newWi.execution.status &&
        wi.execution.transactions.length === newWi.execution.transactions.length &&
        wi.originCurrency === newWi.originCurrency &&
        wi.receiveAddress === newWi.receiveAddress &&
        wi.receiveAmount === wi.receiveAmount &&
        wi.receiveCurrency === newWi.receiveCurrency &&
        wi.receiveNetwork === newWi.receiveNetwork &&
        wi.receiveTransactionId === newWi.receiveTransactionId &&
        wi.sendAddress === newWi.sendAddress &&
        wi.sendAmount === newWi.sendAmount &&
        wi.sendCurrency === newWi.sendCurrency &&
        wi.sendNetwork === newWi.sendNetwork &&
        wi.sendTimestamp === 0 &&
        wi.sendToCurrency === newWi.sendToCurrency &&
        wi.signatures === 0 &&
        wi.v === 0 &&
        wi.version === EXPECTED_SCHEMA_VERSION,
        `Old and new WI fields do not match: ${wiJ} - vs - ${newWiJ}`);
    const p1 = wi.payBySig;
    const p2 = newWi.payBySig;
    ValidationUtils.isTrue(
        p1.amount === p2.amount &&
        p1.contractAddress === p2.contractAddress &&
        p1.contractName === p2.contractName &&
        p1.contractVersion === p2.contractVersion &&
        p1.hash === p2.hash &&
        p1.payee === p2.payee &&
        p1.sourceChainId === p2.sourceChainId &&
        p1.swapTxId === p2.swapTxId &&
        p1.toToken === p2.toToken &&
        p1.token === p2.token &&
        p1.signatures.length == 0,
        `Old and new "payBySig" do not match: ${wiJ} - vs - ${newWiJ}`);
}
