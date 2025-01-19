import {
  Injectable,
  LocalCache,
  Logger,
  LoggerFactory,
  ValidationUtils,
} from "ferrum-plumbing";
import { TokenBridgeContractClinet } from "../../TokenBridgeContractClient";
import { BridgeNodeConfig } from "../BridgeNodeConfig";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { NodeUtils } from "../common/NodeUtils";
import { NODE_CACHE_TIMEOUT } from "../../common/TokenBridgeTypes";
import { NodeErrorHandling } from "../common/NodeErrorHandling";
import { PrivateKeyProvider } from "../../common/PrivateKeyProvider";
import { MultiSigSignature } from "types";
import { BridgeNodesRemoteAccessService } from "../../nodeRemoteAccess/BridgeNodesRemoteAccessService";
import { TokenBridgeService } from "../../TokenBridgeService";

/**
 * A simple node. Just reads from DB an signs given an env
 */
export class SimpleNode implements Injectable {
  private log: Logger;
  private cache: LocalCache = new LocalCache();
  constructor(
    private bridgeContract: TokenBridgeContractClinet,
    private svc: BridgeNodesRemoteAccessService,
    private bridgeSvc: TokenBridgeService,
    private helper: EthereumSmartContractHelper,
    private key: PrivateKeyProvider,
    logFac: LoggerFactory
  ) {
    this.log = logFac.getLogger(SimpleNode);
  }

  __name__() {
    return "SimpleNode";
  }

  async processSingleTransactionById(network: string, txId: string) {
    this.log.info(`Processing ${network}:${txId}`);
    txId = txId.toLowerCase();
    // Get the tx from chain, verify and create the withdraw item
    // Sign the withdraw item
    // Register the withdraw item
    const cacheKey = `${network}:${txId}`;
    try {
      if (!!this.cache.get(cacheKey)) {
        this.log.info(`Already processed ${network}:${txId}`);
        return;
      }
      const swap = await this.bridgeContract.getSwapEventByTxId(network, txId);
      const wi = await NodeUtils.withdrawItemFromSwap(
        "1.0",
        "SIMPLE_NODE",
        swap,
        this.helper
      );
      NodeUtils.validateWithdrawItem(wi);

      // Now sign the withdraw item
      const hash = NodeUtils.bridgeV1Hash(wi);
      const sig = this.key.sign(hash.replace("0x", ""));
      wi.payBySig.signature = sig;
      wi.payBySig.signatures.push({
        creationTime: Date.now(),
        signature: sig,
        creator: await this.key.address(),
      } as MultiSigSignature);

      // Register the withdraw item
      await this.svc.registerWithdrawItem('SIMPLE_NODE', wi);
      // console.log("Registered PWI: ", wi);
      this.log.info(`Registered PWI: ${network}:${txId}`);
      // Save the withdraw item
      this.cache.set(cacheKey, "done", NODE_CACHE_TIMEOUT);
    } catch (e) {
      const err = e as Error;
      if (NodeErrorHandling.ignorable(err)) {
        this.cache.set(cacheKey, {}, NODE_CACHE_TIMEOUT);
      } else {
        this.log.error(
          `Error processing tx ${network}:${txId} - ${(e as Error).toString()}`
        );
      }
    }
  }

  async processPending() {
    const pending = await this.bridgeSvc.getPendingSwapTxIds();
    ValidationUtils.isTrue(
      !!pending,
      "Error getting getPendingSwapTxIds! No response"
    );

    this.log.info(`Need to process ${pending.length} transactions `);
    for (const tx of pending) {
      await this.processSingleTransactionById(tx.network, tx.id);
    }
  }
}
