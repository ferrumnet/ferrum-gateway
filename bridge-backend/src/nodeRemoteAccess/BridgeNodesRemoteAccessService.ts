import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationError, ValidationUtils } from "ferrum-plumbing";
import { Connection, Model, Document, Schema } from "mongoose";
import {
  TransactionTrackable,
  UserBridgeWithdrawableBalanceItem,
  UserBridgeWithdrawableBalanceItemModel,
  TRANSACTION_MINIMUM_CONFIRMATION,
  WithdrawItemHashVerification,
  Utils,
} from "types";
import { EXPECTED_WI_SCHEMA_VERSIONS, NodeUtils } from "../node/common/NodeUtils";
import { TokenBridgeService } from "../TokenBridgeService";
import { Ecdsa } from "ferrum-crypto";
import { ChainUtils } from "ferrum-chain-clients";

const DEFAULT_LOOK_BACK_MILLIS = 1000 * 3600 * 24;

const withdrawItemHashVerificationSchema = new Schema<WithdrawItemHashVerification & Document>({
  signer: String,
  network: String,
  transactionId: String,
  hash: String,
  signature: String,
  signatrueCreationTime: Number,
});

const WithdrawItemHashVerificationModel = (c: Connection) =>
  c.model<WithdrawItemHashVerification & Document>(
    "withdrawItemHashVerification",
    withdrawItemHashVerificationSchema
);


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
  private wiHashVerification?: Model<WithdrawItemHashVerification & Document>;
  constructor(
    private bridgeSvc: TokenBridgeService,
    private helper: EthereumSmartContractHelper,
    private validatorAddressesV1: string[],
  ) {
    super();
  }

  __name__(): string {
    return "BridgeNodesRemoteAccessService";
  }

  initModels(con: Connection): void {
    this.balanceItem = UserBridgeWithdrawableBalanceItemModel(con);
    this.wiHashVerification = WithdrawItemHashVerificationModel(con);
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
    schemaVersion: string,
    network: string,
  ) {
    ValidationUtils.isTrue(EXPECTED_WI_SCHEMA_VERSIONS.indexOf(schemaVersion) >= 0,
      'invalid schemaVersion');
    ValidationUtils.isTrue(!!network, 'network is required');
    const wis = await this.balanceItem!.find({
      '$and': [
        {version: schemaVersion}, {receiveNetwork: network}, {signatures: 0},
      ]}).exec();
    return wis.map(w => w.toJSON());
  }

  async getWithdrawItemTransactionIds(
    schemaVersion: string,
    network: string,
    lookbackMillis?: string,
  ) {
    ValidationUtils.isTrue(EXPECTED_WI_SCHEMA_VERSIONS.indexOf(schemaVersion) >= 0,
      'invalid schemaVersion');
    ValidationUtils.isTrue(!!network, 'network is required');
    this.verifyInit();
    const fromTime = Date.now() - Number(lookbackMillis || DEFAULT_LOOK_BACK_MILLIS);
    const ids = await this.balanceItem!.find(
      {'$and': [
        {version: schemaVersion}, {receiveNetwork: network}, {timestamp: { '$gt': fromTime }}]})
        .select('recieveTransactionId')
        .exec();
    return ids.map(id => id.receiveTransactionId);
  }

  async getPendingWithdrawItemById(
    schemaVersioin: string,
    network: string,
    receiveTransactionId
  ) {
    ValidationUtils.isTrue(EXPECTED_WI_SCHEMA_VERSIONS.indexOf(schemaVersioin) >= 0,
      'invalid schemaVersion');
    ValidationUtils.isTrue(!!network, 'network is required');
    this.verifyInit();
    const w = await this.balanceItem!.findOne({
      '$and': [
        {version: schemaVersioin}, {receiveNetwork: network}, {receiveTransactionId}, {signatures: 0}, // For V12, signatures can be more than 0
      ]}).exec();
    return !!w ? w.toJSON() : undefined;
  }

  async registerWithdrawItemHashVerification(
      signer: string,
      receiveNetwork: string,
      receiveTransactionId: string,
      hash: string,
      signature: string,
      signatrueCreationTime: number,
  ) {
      ValidationUtils.isTrue(!!signer, 'signer is required');
      ValidationUtils.isTrue(!!receiveNetwork, 'receiveNetwork is required');
      ValidationUtils.isTrue(!!receiveTransactionId, 'receiveTransactionId is required');
      ValidationUtils.isTrue(!!hash, 'hash is required');
      ValidationUtils.isTrue(!!signature, 'signature is required');
      ValidationUtils.isTrue(!!signatrueCreationTime, 'signatrueCreationTime is required');
      this.verifyInit();
      signer = signer.toLowerCase();
      receiveNetwork = receiveNetwork.toUpperCase();
      receiveTransactionId = receiveTransactionId.toLowerCase();
      const wi = await this.balanceItem!.findOne({receiveNetwork, receiveTransactionId}).exec();
      ValidationUtils.isTrue(!!wi, 'No withdraw item is registered');
      ValidationUtils.isTrue(wi.payBySig?.hash === hash, 'Provided hash doesn\'t match withdraw item\'s');
      // 1. Verify the sig,
      const recovered = Ecdsa.recoverAddress(Utils.trim0x(signature), hash);
      ValidationUtils.isTrue(ChainUtils.addressesAreEqual(wi.sendNetwork as any, signer, recovered),
        'Invalid signature');
      // 2. Verify signer is allowed
      this.validateSignerIsAllowed(signer);

      const exists = await this.wiHashVerification!.exists({'$and': [
        {network: receiveNetwork},
        {transactionId: receiveTransactionId},
        {signer},
      ]});
      ValidationUtils.isTrue(!exists, 'already registered!');

      // 3. Record.
      const wihv = {
        signer,
        network: receiveNetwork,
        transactionId: receiveTransactionId,
        hash,
        signature,
        signatrueCreationTime,
      } as WithdrawItemHashVerification;
      return await new this.wiHashVerification!(wihv).save();
  }

  validateSignerIsAllowed(signer: string) {
    ValidationUtils.isTrue(this.validatorAddressesV1.indexOf(signer) >= 0, `Signer "${signer}" is not allowed`);
  }

  async close() {
    if (this.con) {
      await this.con!.close();
    }
  }
}
