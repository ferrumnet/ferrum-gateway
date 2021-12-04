import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationError, ValidationUtils, Networks } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import {
    BridgeContractNames,
    BridgeContractVersions,
  BRIDGE_V12_CONTRACTS,
  BRIDGE_V1_CONTRACTS,
  TransactionTrackable,
  UserBridgeWithdrawableBalanceItem,
  UserBridgeWithdrawableBalanceItemModel,
  Utils,
  TRANSACTION_MINIMUM_CONFIRMATION,
} from "types";
import { NodeUtils } from "../node/common/NodeUtils";
import { TokenBridgeService } from "../TokenBridgeService";

const EXPECTED_VERSIONS = ["0.1", "1.0", "1.2"];

function validateWithdrawItem(wi: UserBridgeWithdrawableBalanceItem): string {
  try {
    ValidationUtils.isTrue(
      EXPECTED_VERSIONS.indexOf(wi.version) >= 0,
      "Invalid schema version"
    );
    ValidationUtils.allRequired(
      [
        "receiveNetwork",
        "receiveCurrency",
        "receiveTransactionId",
        "receiveAddress",
        "receiveAmount",

        "sendNetwork",
        "sendAddress",
        "sendCurrency",
        "payBySig",
      ],
      wi
    );
    ValidationUtils.allRequired(
      [
        "token",
        "payee",
        "amount",
        "toToken",
        "sourceChainId",
        "swapTxId",
        "contractName",
        "contractVersion",
        "contractAddress",
        "hash",
        "signatures",
      ],
      wi.payBySig
    );
    const contractVer = (wi.version === '0.1' || wi.version == '1.0') ?
        BridgeContractVersions.V1_0 : BridgeContractVersions.V1_2;
    ValidationUtils.isTrue(wi.payBySig.payee === wi.sendAddress, 'Invalid payBySig.payee');
    ValidationUtils.isTrue(wi.payBySig.token === 
        Utils.parseCurrency(wi.sendToCurrency)[0], 'Invalid payBySig.token');
    ValidationUtils.isTrue(wi.payBySig.sourceChainId ===
        Networks.for(wi.receiveNetwork).chainId, 'Invalid payBySig.sourceChainId');
    ValidationUtils.isTrue(wi.payBySig.toToken ===
        Utils.parseCurrency(wi.sendToCurrency)[0], 'Invalid payBySig.toToken');
    const expectedSwapTxId = contractVer == BridgeContractVersions.V1_0 ?
        NodeUtils.bridgeV1Salt(wi) : wi.receiveTransactionId;
    ValidationUtils.isTrue(wi.payBySig.swapTxId === expectedSwapTxId,
        'Invalid payBySig.swapTxId');
    ValidationUtils.isTrue(wi.payBySig.contractVersion === contractVer, 
        'Invalid payBySig.contractVersion');
    const expectedContractName = contractVer === BridgeContractVersions.V1_0 ?
        BridgeContractNames.V1_0 : BridgeContractNames.V1_2;
    ValidationUtils.isTrue(wi.payBySig.contractName === expectedContractName,
        'Invalid payBySig.contractName');
    const expectedContractAddress = contractVer === BridgeContractVersions.V1_0 ?
        BRIDGE_V1_CONTRACTS[wi.sendNetwork] :
        BRIDGE_V12_CONTRACTS[wi.sendNetwork]?.router;
    ValidationUtils.isTrue(wi.payBySig.contractAddress === expectedContractAddress,
        'Invalid payBySig.contractAddress');
    const expectedHash = contractVer === BridgeContractVersions.V1_0 ?
        NodeUtils.bridgeV1Hash(wi) : NodeUtils.bridgeV12Hash(wi);
    ValidationUtils.isTrue(wi.payBySig.hash === expectedHash,
        'Invalid payBySig.hash');
  } catch (e) {
    if (e instanceof ValidationError) {
      return (e as ValidationError).message;
    }
  }
}

export class BridgeNodesRemoteAccessService
  extends MongooseConnection
  implements Injectable
{
  private con: Connection | undefined;
  private balanceItem?: Model<UserBridgeWithdrawableBalanceItem & Document>;
  constructor(
    private bridgeSvc: TokenBridgeService,
    private helper: EthereumSmartContractHelper,
  ) {
    super();
  }

  __name__(): string {
    return "BridgeNodesRemoteAccessService";
  }

  initModels(con: Connection): void {
    this.balanceItem = UserBridgeWithdrawableBalanceItemModel(con);
    this.con = con;
  }

  async registerWithdrawItem(
    creator: string,
    wi: UserBridgeWithdrawableBalanceItem
  ) {
    validateWithdrawItem(wi);
    wi.v = 0;
    wi.timestamp = Date.now();
    wi.used = "";
    wi.useTransactions = [];
    wi.execution = {
      status: "",
      transactions: [],
    } as TransactionTrackable;
    wi.creator = creator;
    const txSum = await this.helper.getTransactionSummary(
      wi.receiveNetwork, wi.receiveTransactionId);
    ValidationUtils.isTrue(!!txSum,
      `Transaction ${wi.receiveNetwork}:${wi.receiveTransactionId} not found`);
    wi.receiveTransactionTimestamp = txSum.confirmationTime;
    ValidationUtils.isTrue((txSum.confirmations || 0) >= 
      (TRANSACTION_MINIMUM_CONFIRMATION[wi.receiveNetwork] ||
        TRANSACTION_MINIMUM_CONFIRMATION['DEFAULT']), 
      `Transaction ${wi.receiveNetwork}:${wi.receiveTransactionId} needs more confirmations`);
    const regWi = new this.balanceItem!(wi).save();
    await this.bridgeSvc.updateProcessedSwapTxs(wi.receiveNetwork, wi.receiveTransactionId);
    return regWi;
  }

  async getPendingWithdrawItems(
    schemaVersioin: string,
    network: string,
  ) {
    ValidationUtils.isTrue(EXPECTED_VERSIONS.indexOf(schemaVersioin) >= 0,
      'invalid schemaVersion');
    ValidationUtils.isTrue(!!network, 'network is required');
    const wis = await this.balanceItem!.find({
      '$and': [
        {version: schemaVersioin}, {network}, {signatures: 0},
      ]}).exec();
    return wis.map(w => w.toJSON());
  }

  async registerWithdrawItemHashVerification(
      signer: string,
      receiveNetwork: string,
      receiveTransactionId: string,
      hash: string,
      signature: string,
      signatrueCreationTime: number,
  ) {
      const wi = await this.balanceItem!.findOne({receiveNetwork, receiveTransactionId}).exec();
      ValidationUtils.isTrue(!!wi, 'No withdraw item is registered');
      // 1. Verify the sig,
      // 2. Verify signer is allowed
      // 3. Record.
  }

  async close() {
    if (this.con) {
      await this.con!.close();
    }
  }
}
