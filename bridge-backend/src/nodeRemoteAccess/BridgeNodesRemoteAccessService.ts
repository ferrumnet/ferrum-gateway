import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, ValidationError, ValidationUtils } from "ferrum-plumbing";
import { Connection, Model, Document, Schema } from "mongoose";
import { unFixSig } from "web3-tools";
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
const FIVE_MIN_MILLIS = 5 * 1000 * 60;
const DEFULALT_BLACK_LIST_ID = 'DEFAULT';

const withdrawItemHashVerificationSchema = new Schema<WithdrawItemHashVerification & Document>({
  signer: String,
  network: String,
  transactionId: String,
  hash: String,
  signature: String,
  signatureCreationTime: Number,
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

interface BlackList {
  listId: string;
  addresses: string[];
}

const blackListSchema = new Schema<BlackList&Document>({
  listId: String,
  addresses: [String],
});

const BlackListModel = (c: Connection) =>
  c.model<BlackList & Document>(
    'bridgeblacklist',
    blackListSchema,
  );

export class BridgeNodesRemoteAccessService
  extends MongooseConnection
  implements Injectable
{

  private con: Connection | undefined;
  private balanceItem?: Model<UserBridgeWithdrawableBalanceItem & Document>;
  private wiHashVerification?: Model<WithdrawItemHashVerification & Document>;
  private blackListModel?: Model<BlackList & Document>;
  private cache = new LocalCache();
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
    this.blackListModel = BlackListModel(con);
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
    const current = await this.balanceItem!.find({
        receiveNetwork: wi.receiveNetwork,
        receiveTransactionId: wi.receiveTransactionId,
    }).exec();
    ValidationUtils.isTrue(!current.length, 'Already registered');

    const blocked = await this.isBlacklist(wi.sendAddress) || await this.isBlacklist(wi.receiveAddress);
    wi.blocked = blocked;
    const upped = await this.balanceItem!.findOneAndUpdate(
      {
        receiveNetwork: wi.receiveNetwork,
        receiveTransactionId: wi.receiveTransactionId,
        v: 0, // Do not overwrite the signed item.
      }, {
        '$set': wi,
      }, {
        upsert: true,
        new: true,
      });
    ValidationUtils.isTrue(!!upped, 'Could not save the document');
    await this.bridgeSvc.updateProcessedSwapTxs(wi.receiveNetwork, wi.receiveTransactionId);
    return upped;
  }

  private async isBlacklist(addr: string): Promise<boolean> {
    this.verifyInit();
    addr = addr.toLowerCase();
    const bl = await this.cache.getAsync<BlackList>('BLACKLIST', async () => {
      const bl = await this.blackListModel.findOne({ listId: DEFULALT_BLACK_LIST_ID }).exec();
      return !!bl ? bl.toJSON() : { addresses: [] } as BlackList;
    }, FIVE_MIN_MILLIS);
    return bl.addresses.indexOf(addr) >= 0;
  }

  async blackListAddress(address: string) {
    ValidationUtils.isTrue(!!address, 'address is required');
    address = address.toLowerCase();
    ValidationUtils.isTrue(!await this.isBlacklist(address), 'Already blacklisted');
    this.verifyInit();
    this.cache.remove('BLACKLIST');
    return await this.blackListModel!.updateOne({
      listId: DEFULALT_BLACK_LIST_ID,
    }, {
      '$push': {
        'addresses': address,
      }
    }, {
      upsert: true,
      new: true,
    });
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
        {version: schemaVersion}, {receiveNetwork: network},
        {signatures: 0}, { blocked: false },
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
      const recovered = Ecdsa.recoverAddress(unFixSig(Utils.trim0x(signature)), hash);
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
        signatureCreationTime: signatrueCreationTime,
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
