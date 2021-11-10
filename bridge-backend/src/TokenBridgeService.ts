import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { ChainUtils } from "ferrum-chain-clients";
import { Injectable, Network, ValidationUtils } from "ferrum-plumbing";
import { Connection, Document, Model } from "mongoose";
import {
  transactionModel,
  Transactions,
} from "bridge-cron/src/models/transaction";
import { TokenBridgeContractClinet } from "./TokenBridgeContractClient";
import {
  RequestMayNeedApprove,
  SignedPairAddress,
  SignedPairAddressSchemaModel,
  UserBridgeWithdrawableBalanceItem,
  UserBridgeWithdrawableBalanceItemModel,
  GroupInfo,
  SwapTxModel,
  SwapTx,
  liquidityNotificationConfigModel,
  liquidityNotificationConfig,
} from "types";
import { Big } from "big.js";
import { GroupInfoModel } from "./common/TokenBridgeTypes";
import { BridgeNotificationSvc } from "./BridgeNotificationService";

const QUICK_TIMEOUT_MILLIS = 300 * 60 * 1000;

export class TokenBridgeService
  extends MongooseConnection
  implements Injectable
{
  private signedPairAddressModel?: Model<SignedPairAddress & Document>;
  private groupInfoModel: Model<GroupInfo & Document> | undefined;
  private balanceItem?: Model<UserBridgeWithdrawableBalanceItem & Document>;
  private transactionModel: Model<Transactions & Document>;
  private liquidityNotificationConfigModel: Model<
    liquidityNotificationConfig & Document
  >;
  private swapTxModel?: Model<SwapTx & Document>;
  private con: Connection | undefined;
  constructor(
    private helper: EthereumSmartContractHelper,
    private contract: TokenBridgeContractClinet,
    private notificationSvc: BridgeNotificationSvc
  ) {
    super();
  }

  initModels(con: Connection): void {
    this.signedPairAddressModel = SignedPairAddressSchemaModel(con);
    this.groupInfoModel = GroupInfoModel(con);
    this.balanceItem = UserBridgeWithdrawableBalanceItemModel(con);
    this.swapTxModel = SwapTxModel(con);
    this.transactionModel = transactionModel(con);
    this.liquidityNotificationConfigModel =
      liquidityNotificationConfigModel(con);
    this.con = con;
  }

  __name__() {
    return "TokenBridgeService";
  }

  async getPendingSwapTxIds(network: string) {
    const rv = await this.swapTxModel.find({ network, status: "pending" });
    return rv.map((r) => r.toJSON());
  }

  async failSwapTx(network: string, txId: string, reason: string) {
    this.verifyInit();
    await this.swapTxModel.findOneAndUpdate(
      { id: txId },
      { status: "failed", reason }
    );
  }

  async updateProcessedSwapTxs(network: string, id: string) {
    this.verifyInit();
    const tx = await this.swapTxModel.findOne({ network, id });
    if (!!tx) {
      let processed = await this.getWithdrawItem(tx.id);
      if (processed)
        await this.swapTxModel.findOneAndUpdate(
          { id: tx.id },
          { status: "processed" }
        );
    }
  }

  async logSwapTx(network: string, txId: string) {
    ValidationUtils.isTrue(!!network, "network value is required");
    ValidationUtils.isTrue(!!txId, "transactionId value is required");
    this.verifyInit();
    let data = {
      network,
      id: txId,
      status: "pending",
    };
    const logged = await this.swapTxModel.find({ id: txId });
    ValidationUtils.isTrue(!(logged.length > 0), "transaction already logged.");
    //check that transaction is processed
    const Item = await this.getWithdrawItem(txId);
    if (!!Item) {
      data = { ...data, status: "processed" };
    }
    //check if transaction is swap
    //const swap = await this.contract.getSwapEventByTxId(network,txId);
    //ValidationUtils.isTrue(!!swap.transactionId, "transaction is not a swap transaction.");
    return await new this.swapTxModel(data).save();
  }

  async withdrawSignedGetTransaction(
    receiveTransactionId: string,
    userAddress: string
  ) {
    const w = await this.getWithdrawItem(receiveTransactionId);
    const liquidity = await this.getAvailableLiquidity(w.sendCurrency);
    ValidationUtils.isTrue(
      !(Number(w.sendAmount) >= Number(liquidity.liquidity)),
      `Not enough liquidity on destination network ${w.sendNetwork}`
    );
    ValidationUtils.isTrue(
      !!w,
      `Withdraw item with receiveTransactionId ${receiveTransactionId} was not found`
    );
    ValidationUtils.isTrue(
      ChainUtils.addressesAreEqual(
        w.sendNetwork as Network,
        userAddress,
        w.sendAddress
      ),
      "Provided address is not the receiver of withdraw"
    );
    return this.contract.withdrawSigned(w, userAddress);
  }

  async addLiquidityGetTransaction(
    userAddress: string,
    currency: string,
    amount: string
  ): Promise<RequestMayNeedApprove> {
    const requests = await this.contract.approveIfRequired(
      userAddress,
      currency,
      amount
    );
    if (requests.length) {
      return { isApprove: true, requests };
    }
    const req = await this.contract.addLiquidity(userAddress, currency, amount);
    return { isApprove: false, requests: [req] };
  }

  async removeLiquidityIfPossibleGetTransaction(
    userAddress: string,
    currency: string,
    amount: string
  ) {
    return await this.contract.removeLiquidityIfPossible(
      userAddress,
      currency,
      amount
    );
  }

  async saveTokenNotificationDetails(data: liquidityNotificationConfig) {
    return await new this.liquidityNotificationConfigModel({
      ...data,
      lastNotifiedTime: Date.now(),
    }).save();
  }

  async updateTokenNotificationDetails(
    data: liquidityNotificationConfig,
    id: string
  ) {
    const { currency } = data;
    return await this.liquidityNotificationConfigModel.findOneAndUpdate(
      { currency },
      { $set: { ...data, lastNotifiedTime: Date.now() } }
    );
  }

  async getTokenNotificationDetails(targetCurrency: string) {
    const rv = await this.liquidityNotificationConfigModel.findOne({
      currency: targetCurrency,
    });
    return rv ? rv.toJSON() : rv;
  }

  async getNetworkTransactions(req) {
    const txs = await this.transactionModel!.find().where(
      "logs.decodeFor === BridgeSwapdecodeLog || logs.decodeFor === withdrawSignedVerify"
    );
    return txs;
  }

  async runLiquidityCheckScript(targetCurrency: string) {
    const item = await this.liquidityNotificationConfigModel!.findOne({
      currency: targetCurrency,
    });
    const HOUR = 1000 * 60 * 60 * 6;
    if (!!item) {
      const configItem = item.toJSON();
      const destinationLiquidity = await this.contract.getAvaialableLiquidity(
        targetCurrency
      );
      const pastAnHour =
        Date.now() - new Date(configItem.lastNotifiedTime || 0).getTime() >=
        HOUR / 2;
      console.log("notified past an hour?", pastAnHour);
      if (Number(destinationLiquidity) > Number(configItem.upperthreshold)) {
        await this.notificationSvc.sendLiquidityNotificationMail(
          configItem.projectAdminEmail,
          destinationLiquidity,
          false
        );
        await this.liquidityNotificationConfigModel.findOneAndUpdate(
          { currency: configItem.currency },
          { $set: { lastNotifiedTime: Date.now() } }
        );
        await this.notificationSvc.sendToListener(
          configItem.listenerUrl,
          destinationLiquidity,
          false
        );
      } else if (
        Number(destinationLiquidity) <= Number(configItem.lowerthreshold)
      ) {
        await this.notificationSvc.sendLiquidityNotificationMail(
          configItem.projectAdminEmail,
          destinationLiquidity,
          true
        );
        await this.liquidityNotificationConfigModel.findOneAndUpdate(
          { currency: configItem.currency },
          { $set: { lastNotifiedTime: Date.now() } }
        );
        await this.notificationSvc.sendToListener(
          configItem.listenerUrl,
          destinationLiquidity,
          true
        );
      }
    }
    return;
  }

  async swapGetTransaction(
    userAddress: string,
    currency: string,
    amount: string,
    targetCurrency: string
  ) {
    const requests = await this.contract.approveIfRequired(
      userAddress,
      currency,
      amount
    );
    if (requests.length) {
      return { isApprove: true, requests };
    }
    const [network, token] =
      EthereumSmartContractHelper.parseCurrency(currency);
    const userBalance = await this.helper
      .erc20(network, token)
      .methods.balanceOf(userAddress)
      .call();
    const balance = await this.helper.amountToHuman(currency, userBalance);
    ValidationUtils.isTrue(
      new Big(balance).gte(new Big(amount)),
      `Not enough balance. ${amount} is required but there is only ${balance} available`
    );
    const req = await this.contract.swap(
      userAddress,
      currency,
      amount,
      targetCurrency
    );
    try {
      await this.runLiquidityCheckScript(targetCurrency);
    } catch (e) {
      console.error('Error running runLiquidityCheckScript', e as Error);
    }
    return { isApprove: false, requests: [req] };
  }

  async withdrawSignedVerify(
    targetCurrency: string,
    payee: string,
    amount: string,
    hash: string,
    salt: string,
    signature: string,
    expectedAddress: string
  ) {
    console.log("About to call withdrawSignedVerify");
    await this.runLiquidityCheckScript(targetCurrency);
    return await this.contract.withdrawSignedVerify(
      targetCurrency,
      payee,
      amount,
      hash,
      salt,
      signature,
      expectedAddress
    );
  }

  async getWithdrawItemByReceiveTransaction(
    receiveTransactionId: string
  ): Promise<UserBridgeWithdrawableBalanceItem> {
    this.verifyInit();
    const rv = await this.balanceItem!.findOne({ receiveTransactionId });
    //@ts-ignore
    return rv ? rv.toJSON() : rv;
  }

  async getWithdrawItem(
    receiveTransactionId: string
  ): Promise<UserBridgeWithdrawableBalanceItem> {
    this.verifyInit();
    const rv = await this.balanceItem!.findOne({ receiveTransactionId });
    //@ts-ignore
    return rv ? rv.toJSON() : rv;
  }

  async newWithdrawItem(
    item: UserBridgeWithdrawableBalanceItem
  ): Promise<void> {
    this.verifyInit();
    await new this.balanceItem!(item).save();
  }

  async getLiquidity(address: string, currency: string) {
    return { liquidity: await this.contract.getLiquidity(address, currency) };
  }

  async getTokenAllowance(address: string, currency: string) {
    return {
      liquidity: await this.contract.getTokenAllowance(address, currency),
    };
  }

  async getAvailableLiquidity(address: string) {
    return { liquidity: await this.contract.getAvaialableLiquidity(address) };
  }

  async getUserWithdrawItems(
    network: string,
    address: string
  ): Promise<UserBridgeWithdrawableBalanceItem[]> {
    this.verifyInit();
    const items = await this.balanceItem!.find({
      $or: [
        {
          sendAddress: ChainUtils.canonicalAddress(network as any, address),
        },
        {
          receiveAddress: ChainUtils.canonicalAddress(network as any, address),
        },
      ],
    });
    console.log({
      receiveNetwork: network,
      address: ChainUtils.canonicalAddress(network as any, address),
    });
    return items.map((i) => i.toJSON());
  }

  private async updateWithdrawItem(item: UserBridgeWithdrawableBalanceItem) {
    this.verifyInit();
    const res = await this.balanceItem!.findOneAndUpdate(
      { id: item.id },
      { $set: { ...item } }
    );
    ValidationUtils.isTrue(!!res, "Could not update the balance item");
    return item;
  }

  async updateWithdrawItemPendingTransactions(id: string) {
    let item = await this.getWithdrawItem(id);
    item = { ...item };
    ValidationUtils.isTrue(
      !!item,
      "Withdraw item with the provided id not found."
    );
    const pendingTxs = (item.useTransactions || []).filter(
      (t) => t.status === "pending" || t.status === "failed"
    );
    if (!pendingTxs.length && item.used === "pending") {
      item.used = "pending";
    }
    for (const tx of pendingTxs) {
      const txStatus = await this.helper.getTransactionStatus(
        item.sendNetwork,
        tx.id,
        tx.timestamp || Date.now()
      );
      tx.status = txStatus;
      console.log(
        `Updating status for withdraw item ${id}: ${item.sendNetwork} ${txStatus}-${tx.id}`
      );
      if (txStatus === ("failed")) {
        item.used = "failed";
      } else if (txStatus === "successful") {
        item.used = "completed";
      } else {
        if (tx.timestamp < Date.now() - QUICK_TIMEOUT_MILLIS) {
          item.used = "failed";
        } else {
          item.used = "pending";
        }
      }
    }
    return await this.updateWithdrawItem(item);
  }

  async updateWithdrawItemAddTransaction(id: string, tid: string) {
    let item = await this.getWithdrawItem(id);
    item = { ...item };
    ValidationUtils.isTrue(
      !!item,
      "Withdraw item with the provided id not found."
    );
    const txItem = (item.useTransactions || []).find((t) => t.id === tid);
    if (!!txItem) {
      const txStatus = await this.helper.getTransactionStatus(
        item!.sendNetwork,
        tid,
        txItem.timestamp || Date.now()
      );
      txItem.status = txStatus;
      // console.log(`Updating status for withdraw item ${id}: ${txStatus}-${tid}`);
      if (txStatus === ("timedout" || "failed")) {
        item.used = "failed";
      } else if (txStatus === "successful") {
        item.used = "completed";
      } else {
        item.used = "pending";
      }
    } else {
      const txTime = Date.now();
      let txStatus = await this.helper.getTransactionStatus(
        item!.sendNetwork,
        tid,
        txTime
      );
      if (txStatus === "timedout") {
        console.error("New transaction cannot be timed out: ", tid);
        txStatus = "pending";
      }
      item.useTransactions = item.useTransactions || [];
      item.useTransactions.push({
        id: tid,
        status: txStatus,
        timestamp: txTime,
      });
      if (txStatus === "failed") {
        item.used = "failed";
      } else if (txStatus === "successful") {
        item.used = "completed";
      } else {
        item.used = "pending";
      }
    }
    return await this.updateWithdrawItem(item);
  }

  async getSwapTransactionStatus(
    tid: string,
    sendNetwork: string,
    timestamp: number
  ) {
    ValidationUtils.isTrue(!!tid, "tid not found.");
    ValidationUtils.isTrue(!!sendNetwork, "sendNetwork not found.");
    ValidationUtils.isTrue(!!timestamp, "timestamp not found.");
    const txStatus = await this.helper.getTransactionStatus(
      sendNetwork,
      tid,
      timestamp || Date.now()
    );
    if (!!txStatus) {
      return txStatus;
    }
  }

  async getUserPairedAddress(
    network: string,
    address: string
  ): Promise<SignedPairAddress | undefined> {
    this.verifyInit();
    ValidationUtils.isTrue(!!address, '"address" must be provided');
    address = ChainUtils.canonicalAddress(
      network as Network,
      address.toLocaleLowerCase()
    );
    const rv = await this.signedPairAddressModel!.findOne({
      $or: [
        {
          $and: [{ "pair.address1": address }, { "pair.network1": network }],
        },
        {
          $and: [{ "pair.address2": address }, { "pair.network2": network }],
        },
      ],
    });
    //@ts-ignore
    return !!rv ? rv.toJSON() : rv;
  }

  async unpairUserPairedAddress(pair: SignedPairAddress) {
    this.verifyInit();
    ValidationUtils.isTrue(!!pair.pair, "Invalid pair (empty)");
    ValidationUtils.isTrue(!!pair.pair.address1, "address 1 is required");
    const res = await this.signedPairAddressModel!.remove({
      "pair.address1": pair.pair.address1,
    });
    ValidationUtils.isTrue(!!res, "Could not update the balance item");
    return res;
  }

  async getGroupInfo(groupId: string): Promise<GroupInfo | undefined> {
    this.verifyInit();
    ValidationUtils.isTrue(!!groupId, '"groupId" must be provided');
    const r = await this.groupInfoModel!.findOne({ groupId }).exec();
    if (r) {
      console.log(r.toJSON());
      return r.toJSON();
    }
    return;
  }

  async close() {
    if (this.con) {
      await this.con!.close();
    }
  }
}
