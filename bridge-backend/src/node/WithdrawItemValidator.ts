import { Injectable } from "ferrum-plumbing";
import { UserBridgeWithdrawableBalanceItem } from "types";
import { BridgeNodesRemoteAccessClient } from "../nodeRemoteAccess/BridgeNodesRemoteAccessClient";
import { TokenBridgeContractClinet } from "../TokenBridgeContractClient";
import { NodeUtils } from "./common/NodeUtils";
import { PrivateKeyProvider } from "../common/PrivateKeyProvider";
import { NodeProcessor } from "../common/TokenBridgeTypes";
import { BridgeNodeConfig } from "./BridgeNodeConfig";

const EXPECTED_SCHEMA_VERSION = '1.0';

export class WithdrawItemValidator implements Injectable, NodeProcessor {
    constructor(
        private client: BridgeNodesRemoteAccessClient,
        private bridgeContract: TokenBridgeContractClinet,
        private key: PrivateKeyProvider,
        private config: BridgeNodeConfig,
    ) {}
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
        for (const wi of pending) {
            await this.processSingleTransaction(wi);
        }
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
            const newWi = await NodeUtils.withdrawItemFromSwap(swap); 
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
        } catch (e) {
            console.error(`Error processing withdraw item "${JSON.stringify(wi)}"`, e as Error);
        }
    }
}

function ensureWithdrawsMatch(
    wi: UserBridgeWithdrawableBalanceItem,
    newWi: UserBridgeWithdrawableBalanceItem) {

    throw new Error("Function not implemented.");
}
