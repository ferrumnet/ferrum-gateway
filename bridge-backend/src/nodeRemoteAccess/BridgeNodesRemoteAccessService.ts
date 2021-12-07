import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationError, ValidationUtils, Networks } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import {
  TransactionTrackable,
  UserBridgeWithdrawableBalanceItem,
  UserBridgeWithdrawableBalanceItemModel,
  TRANSACTION_MINIMUM_CONFIRMATION,
} from "types";
import { EXPECTED_WI_SCHEMA_VERSIONS, NodeUtils } from "../node/common/NodeUtils";
import { TokenBridgeService } from "../TokenBridgeService";

function validateWithdrawItem(wi: UserBridgeWithdrawableBalanceItem): string {
  try {
    NodeUtils.validateWithdrawItem(wi);
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
    ValidationUtils.isTrue(EXPECTED_WI_SCHEMA_VERSIONS.indexOf(schemaVersioin) >= 0,
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
