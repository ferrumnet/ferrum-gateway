import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { TokenBridgeService } from "./TokenBridgeService";
import { BridgeConfigStorage } from "./BridgeConfigStorage";
import { CrossSwapService } from "./crossSwap/CrossSwapService";
import { HttpRequestData, HttpRequestProcessor } from "aws-lambda-helper";
import { RoutingTableService } from "./RoutingTableService";

export class BridgeRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
  constructor(
    private svc: TokenBridgeService,
    private bgs: BridgeConfigStorage,
    private rouitingTable: RoutingTableService,
		private crossSwap: CrossSwapService,
  ) {
    super();

    this.registerProcessor("getRoutingTable", (req,) => this.rouitingTable.getRoutingTable());

    this.registerProcessor("withdrawSignedGetTransaction", (req, userId) =>
      this.withdrawSignedGetTransaction(req, userId!)
    );

    this.registerProcessor("addLiquidityGetTransaction", (req, userId) =>
      this.addLiquidityGetTransaction(req, userId!)
    );

    this.registerProcessor(
      "removeLiquidityIfPossibleGetTransaction",
      (req, userId) =>
        this.removeLiquidityIfPossibleGetTransaction(req, userId!)
    );

    this.registerProcessor("getAvaialableLiquidity", (req) =>
      this.getAvailableLiquidity(req)
    );

    this.registerProcessor("getTokenAllowance", (req) =>
      this.getLiquidity(req)
    );

    this.registerProcessor("getUserWithdrawItems", (req, userId) =>
      this.getUserWithdrawItems(req, userId!)
    );

    this.registerProcessor("updateWithdrawItemAddTransaction", (req) =>
      this.updateWithdrawItemAddTransaction(req)
    );

    this.registerProcessor("updateWithdrawItemPendingTransactions", (req) =>
      this.updateWithdrawItemPendingTransactions(req)
    );

    this.registerProcessor("swapGetTransaction", (req, userId) =>
      this.swapGetTransaction(req, userId!)
    );

    this.registerProcessor("getSourceCurrencies", (req) =>
      this.bgs.getSourceCurrencies(req.data.network)
    );

    this.registerProcessor("getTokenConfig", (req) =>
      this.bgs.tokenConfig(
        req.data.network,
        req.data.destNetwork,
        req.data.sourceCurrency
      )
    );

    this.registerProcessor("tokenConfigForCurrencies", (req) =>
      this.bgs.tokenConfigForCurrencies(req.data.currencies)
    );

    this.registerProcessor("getGroupInfo", (req) =>
      this.getGroupInfo(req.data.groupId)
    );

    this.registerProcessor("GetSwapTransactionStatus", (req) =>
      this.getSwapTransactionStatus(req)
    );

    this.registerProcessor("getLiquidity", (req) => this.getLiquidity(req));

    this.registerProcessor("logSwapTransaction", (req) =>
      this.logSwapTransaction(req)
    );

    this.registerProcessor("getWithdrawItem", (req, userId) =>
      this.getWithdrawItem(req)
    );

    this.registerProcessor("saveTokenNotificationDetails", (req) =>
      this.saveTokenNotificationDetails(req)
    );

    this.registerProcessor("updateTokenNotificationDetails", (req) =>
      this.updateTokenNotificationDetails(req)
    );

    this.registerProcessor("getTokenNotificationDetails", (req) =>
      this.svc.getTokenNotificationDetails(req.data.currency)
    );
    this.registerProcessor("getNetworkTransactions", (req) =>
      this.svc.getNetworkTransactions(req)
    );
		this.registerProcessor('allProtocols',
			req => this.allProtocols(req));

		this.registerProcessor('crossChainQuote',
			req => this.crossChainQuote(req));

		this.registerProcessor('swapCrossGetTransaction',
			(req, userId) => this.swapCrossGetTransaction(req, userId));

		this.registerProcessor('registerSwapCross',
			(req, userId) => this.registerSwapCross(req, userId));

		this.registerProcessor('withdrawAndSwapGetTransaction',
			(req, userId) => this.withdrawAndSwapGetTransaction(req, userId));
  }

  __name__() {
    return "BridgeRequestProcessor";
  }

  async getWithdrawItem(req: HttpRequestData) {
    const { network, receiveTransactionId } = req.data;
    ValidationUtils.allRequired(["network", "receiveTransactionId"], req.data);
    return await this.svc.getWithdrawItem(receiveTransactionId);
  }

  async removeLiquidityIfPossibleGetTransaction(
    req: HttpRequestData,
    userId: string
  ) {
    const { currency, amount } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    ValidationUtils.isTrue(!!currency, "'currency' must be provided");
    ValidationUtils.isTrue(!!amount, "'amount must be provided");
    return this.svc.removeLiquidityIfPossibleGetTransaction(
      userId,
      currency,
      amount
    );
  }

  async logSwapTransaction(req: HttpRequestData) {
    const { network, txId } = req.data;
    ValidationUtils.isTrue(!!network, "'network' must be provided");
    ValidationUtils.isTrue(!!txId, "'txId' must be provided");
    await this.svc.logSwapTx(network, txId);
  }

  async getLiquidity(req: HttpRequestData) {
    const { currency, userAddress } = req.data;
    ValidationUtils.isTrue(!!currency, "'currency' must be provided");
    ValidationUtils.isTrue(!!userAddress, "'addres' must be provided");
    return this.svc.getLiquidity(userAddress, currency);
  }

  async saveTokenNotificationDetails(req: HttpRequestData) {
    return this.svc.saveTokenNotificationDetails(req.data);
  }

  async updateTokenNotificationDetails(req: HttpRequestData) {
    return this.svc.updateTokenNotificationDetails(req.data, req.data.id);
  }

  async getGroupInfo(groupId: string) {
    return this.svc.getGroupInfo(groupId);
  }

  async getTokenAllowance(req: HttpRequestData) {
    const { currency, userAddress } = req.data;
    ValidationUtils.isTrue(!!currency, "'currency' must be provided");
    ValidationUtils.isTrue(!!userAddress, "'addres' must be provided");
    return this.svc.getTokenAllowance(userAddress, currency);
  }

  async getAvailableLiquidity(req: HttpRequestData) {
    const { currency } = req.data;
    ValidationUtils.isTrue(!!currency, "'currency' must be provided");
    return this.svc.getAvailableLiquidity(currency);
  }

  async getUserWithdrawItems(req: HttpRequestData, userId: string) {
    const { network } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    ValidationUtils.isTrue(!!network, "'network' must be provided");
    const items = await this.svc.getUserWithdrawItems(
      network,
      userId.toLowerCase()
    );
    return { withdrawableBalanceItems: items };
  }

  async updateWithdrawItemPendingTransactions(req: HttpRequestData) {
    const { id } = req.data;
    ValidationUtils.isTrue(!!id, "'id' must be provided");
    return this.svc.updateWithdrawItemPendingTransactions(id);
  }

  async updateWithdrawItemAddTransaction(req: HttpRequestData) {
    const { id, transactionId } = req.data;
    ValidationUtils.isTrue(!!id, "'id' must be provided");
    ValidationUtils.isTrue(!!transactionId, "'transactionId' must be provided");
    return this.svc.updateWithdrawItemAddTransaction(id, transactionId);
  }

  async getSwapTransactionStatus(req: HttpRequestData) {
    const { tid, sendNetwork, timestamp } = req.data;
    ValidationUtils.isTrue(!!tid, "tid not found.");
    ValidationUtils.isTrue(!!sendNetwork, "sendNetwork not found.");
    ValidationUtils.isTrue(!!timestamp, "timestamp not found.");
    return this.svc.getSwapTransactionStatus(tid, sendNetwork, timestamp);
  }

  async addLiquidityGetTransaction(req: HttpRequestData, userId: string) {
    const { currency, amount } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    ValidationUtils.isTrue(!!currency, "'currency' must be provided");
    ValidationUtils.isTrue(!!amount, "'amount must be provided");
    return this.svc.addLiquidityGetTransaction(userId, currency, amount);
  }

  async withdrawSignedGetTransaction(req: HttpRequestData, userId: string) {
    const { id } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    return this.svc.withdrawSignedGetTransaction(id, userId);
  }

  async swapGetTransaction(req: HttpRequestData, userId: string) {
    const { currency, amount, targetCurrency } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    return this.svc.swapGetTransaction(
      userId,
      currency,
      amount,
      targetCurrency
    );
  }

	async crossChainQuote(req: HttpRequestData) {
		const {
			fromCurrency,
			toCurrency,
			throughCurrencies,
			amountIn,
			fromProtocols,
			toProtocols,
		} = req.data;
		return this.crossSwap.crossChainQuote(fromCurrency, toCurrency,
			throughCurrencies, amountIn, fromProtocols, toProtocols);
	}

	async allProtocols(req: HttpRequestData) {
		return this.crossSwap.allProtocols();
	}

	async swapCrossGetTransaction(req: HttpRequestData, userId: string) {
		const {
			fromCurrency,
			toCurrency,
			throughCurrencies,
			amountIn,
			slippage,
			fromProtocols,
			toProtocols,
		} = req.data;
		return this.crossSwap.swapCross(
			userId,
			fromCurrency,
			toCurrency,
			throughCurrencies,
			amountIn,
			slippage,
			fromProtocols,
			toProtocols,);
	}

	async registerSwapCross(req: HttpRequestData, userId: string) {
		const {
			network,
			transactionId,
			fromCurrency,
			toCurrency,
			amountIn,
			throughCurrency,
			targetThroughCurrency,
			fromProtocol,
			toProtocol,
		} = req.data;
		return this.crossSwap.registerSwapCross(
			userId,
			userId,
			network,
			transactionId,
			fromCurrency,
			toCurrency,
			amountIn,
			throughCurrency,
			targetThroughCurrency,
			fromProtocol,
			toProtocol,);
	}

	async withdrawAndSwapGetTransaction(req: HttpRequestData, userId: string) {
		const {
			swapNetwork,
			swapTransactionId,
			slippage,
		} = req.data;
		return this.crossSwap.withdrawAndSwap(
			userId,
			swapNetwork,
			swapTransactionId,
			slippage,
		);
	}
}
