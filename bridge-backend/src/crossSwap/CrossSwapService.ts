import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { CurrencyListSvc } from "common-backend";
import { Injectable, Networks, ValidationUtils } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import { BigUtils, BRIDGE_NETWORKS, CrossChainBridgeQuote,
	FRM, NetworkedConfig,
	SwapProtocol, SwapProtocolInfo, SwapQuote,
	BridgeV12Contracts, 
	SWAP_PROTOCOL_ROUTERS,
	CrossSwapRequest,
	UserBridgeWithdrawableBalanceItem,
	SwapQuoteProtocol} from "types";
import { BridgeConfigStorage } from "../BridgeConfigStorage";
import { CrossSwapRequestModel } from "../common/TokenBridgeTypes";
import { BridgeRouterV12, BridgeRouterV12__factory } from "../resources/typechain";
import { TokenBridgeService } from "../TokenBridgeService";
import { OneInchClient } from "./OneInchClient";

const DEAFULT_DEADLINE_SECONDS = 20 * 60;

export class CrossSwapService extends MongooseConnection implements Injectable {
	private crossSwapQuotes: Model<CrossSwapRequest & Document> | undefined;
    private con: Connection|undefined;
	constructor(
		private oneInchClient: OneInchClient,
		private curList: CurrencyListSvc,
		private helper: EthereumSmartContractHelper,
		private bridgeConfig: BridgeConfigStorage,
		private tbs: TokenBridgeService,
		private defaultProtocols: NetworkedConfig<SwapProtocol[]>,
		private contracts: NetworkedConfig<BridgeV12Contracts>,
	) {
		super();
	}

	__name__() { return 'CrossSwapService'; }

	initModels(con: Connection) {
		this.crossSwapQuotes = CrossSwapRequestModel(con);
        this.con = con;
	}

	async crossChainQuote(
		fromCurrency: string,
		toCurrency: string,
		throuhCurrencies: string[],
		amountIn: string,
		fromProtocols: SwapProtocol[],
		toProtocols: SwapProtocol[],
		): Promise<SwapQuote> {
		ValidationUtils.allRequired(['fromCurrency', 'toCurrency', 'throuchCurrencies', 'amountIn'], {
			fromCurrency, toCurrency, throuhCurrencies, amountIn });
		const [fromNetwork,] = EthereumSmartContractHelper.parseCurrency(fromCurrency);
		const [toNetwork,] = EthereumSmartContractHelper.parseCurrency(toCurrency);
		ValidationUtils.isTrue(BRIDGE_NETWORKS.indexOf(fromNetwork) >= 0, `Unsupported network ${fromNetwork}`);
		throuhCurrencies = !!throuhCurrencies.length ? throuhCurrencies : [FRM[fromNetwork][0]];

		ValidationUtils.isTrue(throuhCurrencies.length === 1, 'Only one through currency supported at this time');
		ValidationUtils.isTrue(fromProtocols.length === 1, 'Only one from protocol supported at this time');
		ValidationUtils.isTrue(toProtocols.length === 1, 'Only one to protocol supported at this time');

		const fromQuote = fromCurrency !== throuhCurrencies[0] ? await this.oneInchClient.quote(
			fromCurrency, throuhCurrencies[0], amountIn, fromProtocols) : undefined;
		const crossQuote = await this.bridgeQuote(throuhCurrencies[0], toNetwork,
			fromQuote.toTokenAmount || amountIn);
		const toQuote = crossQuote.to?.currency && (crossQuote.to?.currency !== toCurrency) ? await this.oneInchClient.quote(
			crossQuote.to.currency, toCurrency, crossQuote.amountOut, toProtocols) : undefined;

		return {
			fromNetwork,
			fromToken: fromQuote?.fromToken || await this.curList.token(fromCurrency),
			fromTokenAmount: fromQuote?.fromTokenAmount || amountIn,
			toNetwork,
			toToken: toQuote?.toToken || await this.curList.token(toCurrency),
			toTokenAmount: toQuote?.toTokenAmount || crossQuote.amountOut,
			protocols: [...fromQuote?.protocols || [] , ...toQuote?.protocols || []],
			bridge: crossQuote,
		} as SwapQuote;
	}

	async allProtocols(): Promise<SwapProtocolInfo[]> {
		const rv: SwapProtocolInfo[] = [];
		for(let net of BRIDGE_NETWORKS) {
			const protocols = await this.oneInchClient.protocols(net);
			protocols.forEach(p => rv.push(p));
		}
		return rv;
	}

	private async bridgeQuote(fromCurrency: string, toNetwork: string, amountIn: string): Promise<CrossChainBridgeQuote> {
		const [sourceNetwork, sourceTok] = EthereumSmartContractHelper.parseCurrency(fromCurrency);
		const conf = await this.bridgeConfig.tokenConfig(sourceNetwork, toNetwork, fromCurrency);
		ValidationUtils.isTrue(!!conf, `No bridge config for ${fromCurrency} to ${toNetwork}`);
		const fromBig = BigUtils.safeParse(amountIn);
		ValidationUtils.isTrue(BigUtils.truthy(fromBig), 'amountIn must be a positive number');
		const feeRatioBig = BigUtils.safeParse(conf.fee);
		const feeBig = fromBig.times(feeRatioBig);
		return {
			from: await this.curList.token(fromCurrency),
			to: await this.curList.token(conf.targetCurrency),
			amountIn,
			amountOut: fromBig.sub(feeBig).toFixed(),
			fee: feeBig.toFixed(),
		} as CrossChainBridgeQuote;
	}

	async swapCross(
		userAddress: string,
		fromCurrency: string,
		toCurrency: string,
		throuhCurrencies: string[],
		amountIn: string,
		slippage: string,
		fromProtocols: SwapProtocol[],
		toProtocols: SwapProtocol[],) {
		const quote = await this.crossChainQuote(fromCurrency, toCurrency,
			throuhCurrencies, amountIn, fromProtocols, toProtocols);
		const router = this.router(quote.fromNetwork);
		if (fromCurrency === throuhCurrencies[0]) {
			// No need for a cross.
			const swap = await router.populateTransaction.swap(
				quote.fromToken.address,
				await this.helper.amountToMachine(quote.fromToken.currency, quote.fromTokenAmount),
				quote.bridge.to.chainId,
				quote.bridge.to.address,
				quote.toToken.address,
				userAddress, {from: userAddress});
			return EthereumSmartContractHelper.fromTypechainTransaction(swap);
		} else {
			const protocolRouter = SWAP_PROTOCOL_ROUTERS[fromProtocols[0]];
			const amountCrossMin = this.calculateAmountCrossMin(slippage, quote.bridge.amountIn);
			const path = this.protocolToPath(quote.fromNetwork, quote.protocols);
			const deadline = this.deadline();
			const isETH = Networks.for(quote.fromNetwork).baseCurrency === fromCurrency;
			const crossSwap = isETH ?
				await router.populateTransaction.swapAndCrossETH(
					protocolRouter,
					amountCrossMin,
					path,
					deadline,
					quote.bridge.to.chainId,
					quote.bridge.to.address,
					quote.toToken.address,
					userAddress,
					{
						from: userAddress,
						value: BigUtils.parseOrThrow(quote.fromTokenAmount, 'fromTokenAmount')
							.times(10 ** 18).toFixed() }) // TODO: Consider non-ETH chains.
				: await router.populateTransaction.swapAndCross(
					protocolRouter,
					await this.helper.amountToMachine(quote.fromToken.currency, quote.fromTokenAmount),
					amountCrossMin,
					path,
					deadline,
					quote.bridge.to.chainId,
					quote.bridge.to.address,
					quote.toToken.address,
					userAddress,
					{ from: userAddress });
			return EthereumSmartContractHelper.fromTypechainTransaction(crossSwap);
		}
	}

	async registerSwapCross(
		userAddress: string,
		network: string,
		transactionId: string,
		fromCurrency: string,
		toCurrency: string,
		amountIn: string,
		throughCurrency: string,
		fromProtocol: SwapProtocol,
		toProtocol: SwapProtocol,) {
		ValidationUtils.isTrue(!!network, 'network must be provided');
		ValidationUtils.isTrue(!!userAddress, 'userAddress is required');
		ValidationUtils.isTrue(!!transactionId, 'transactionId is required');
		const request = {
			userAddress,
			network,
			transactionId,
			fromCurrency,
			toCurrency,
			amountIn,
			throughCurrency,
			fromProtocol,
			toProtocol,
		} as CrossSwapRequest;
		this.verifyInit();
		return new this.crossSwapQuotes!(request).save();
	}

	async withdrawAndSwap(
		userAddress: string,
		swapNetwork: string,
		swapTransactionId: string,
		slippage: string,
		){
		ValidationUtils.isTrue(!!userAddress, 'userAddress is required');
		ValidationUtils.isTrue(!!swapNetwork, 'swapNetwork is required');
		ValidationUtils.isTrue(!!swapTransactionId, 'swapTransactionId is required');
		const withdrawItem = await this.tbs.getWithdrawItem(swapTransactionId);
		if (!!withdrawItem.sendToCurrency && withdrawItem.sendToCurrency !== withdrawItem.sendCurrency) {
			// Withdraw and swap
			return this.withdrawAndSwapTransaction(userAddress, withdrawItem!, slippage);
		} else {
			const router = this.router(withdrawItem.sendNetwork!);
			const tx = await router.populateTransaction.withdrawSigned(
				withdrawItem.payBySig.token,
				withdrawItem.payBySig.payee,
				withdrawItem.payBySig.amount,
				withdrawItem.payBySig.salt,
				withdrawItem.payBySig.signature);
			return EthereumSmartContractHelper.fromTypechainTransaction(tx);
		}
	}

	private async withdrawAndSwapTransaction(userAddress: string, item: UserBridgeWithdrawableBalanceItem, slippage: string) {
		ValidationUtils.isTrue(!!item, 'withdrawAndSwap is required');
		const registered = await this.getRegisteredSwapCross(item.receiveTransactionId);
		const router = this.router(item.sendNetwork);
		const isETH = Networks.for(item.sendNetwork).baseCurrency === item.sendToCurrency;
		const protocol = registered?.toProtocol || this.defaultProtocols[item.sendNetwork][0];
		const swapRouter = SWAP_PROTOCOL_ROUTERS[protocol];
		ValidationUtils.isTrue(!!swapRouter,
			`No swap router found in item, and there was no default protocol configured : ${JSON.stringify(item)}`);
		// to token amount
		const quote = await this.oneInchClient.quote(
			item.sendCurrency, item.sendToCurrency, item.sendAmount, [protocol]);
		const tx = isETH ?
			router.populateTransaction.withdrawSignedAndSwapETH(
				item.payBySig.payee,
				swapRouter,
				item.payBySig.amount,
				item.payBySig.salt,
				this.calculateAmountCrossMin(slippage, quote.toTokenAmount),
				this.protocolToPath(item.sendNetwork, quote.protocols),
				this.deadline(),
				item.payBySig.signature,
				{from: userAddress}
			): router.populateTransaction.withdrawSignedAndSwap(
				item.payBySig.payee,
				swapRouter,
				item.payBySig.amount,
				item.payBySig.salt,
				this.calculateAmountCrossMin(slippage, quote.toTokenAmount),
				this.protocolToPath(item.sendNetwork, quote.protocols),
				this.deadline(),
				item.payBySig.signature,
				{from: userAddress}
			);
	}

	async getRegisteredSwapCross(transactionId: string) {
		this.verifyInit();
		const rv = await this.crossSwapQuotes.findOne({ swapTransactionId: transactionId }).exec();
		return !!rv ? rv.toJSON() : undefined;
	}

	calculateAmountCrossMin(slippage: string, toTokenAmount: string) {
		const slippageBig = BigUtils.parseOrThrow(slippage, 'slippage');
		const toTokenAmountBig = BigUtils.parseOrThrow(toTokenAmount, 'toTokenAmount');
		ValidationUtils.isTrue(slippageBig.lte(new Big(1)) && slippageBig.gte(new Big(0)), 'Slippage must be between 0 and 1');
		return toTokenAmountBig.minus(toTokenAmountBig.mul(slippageBig)).toFixed();
	}

	protocolToPath(network: string, protocols: SwapQuoteProtocol[]): string[] {
		return protocols.filter(p => p.network === network)
			.reduce((pth, p) => pth.length === 0 ? [p.fromCurrency, p.toCurrency] : pth.concat([p.toCurrency]), [])
			.map(c => EthereumSmartContractHelper.parseCurrency(c)[1]);
	}

	router(network: string): BridgeRouterV12 {
		const contract = this.contracts[network]?.router;
		ValidationUtils.isTrue(!!contract, 'No contract config found for network ' + network);
		return BridgeRouterV12__factory.connect(contract, this.helper.ethersProvider(network));
	}

	deadline() {
		return Math.round(new Date().valueOf() / 1000) + DEAFULT_DEADLINE_SECONDS;
	}

    async close() {
        if (this.con) {
            await this.con!.close();
        }
    }
}