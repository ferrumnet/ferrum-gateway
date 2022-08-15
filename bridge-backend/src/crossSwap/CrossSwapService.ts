import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { AppConfig, CurrencyListSvc } from "common-backend";
import { Injectable, Networks, ValidationUtils } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import { BigUtils, CrossChainBridgeQuote,
	FRM, NetworkedConfig,
	SwapProtocol, SwapProtocolInfo, SwapQuote,
	BridgeV12Contracts, 
	SwapProtocolConfigs,
	CrossSwapRequest,
	UserBridgeWithdrawableBalanceItem,
	SwapQuoteProtocol,
	CrossSwapStatus} from "types";
import { BridgeConfigStorage } from "../BridgeConfigStorage";
import { BridgeSwapEvent, BridgeTransaction, CrossSwapRequestModel } from "../common/TokenBridgeTypes";
import { BridgePoolV12, BridgePoolV12__factory, BridgeRouterV12, BridgeRouterV12__factory } from "../resources/typechain";
import { TokenBridgeService } from "../TokenBridgeService";
import { OneInchClient } from "./OneInchClient";
import { UniswapV2Client } from 'common-backend/dist/uniswapv2/UniswapV2Client';
import { Big } from 'big.js';
import { TypedEvent } from "../resources/typechain/commons";
import { BigNumber, providers } from "ethers";
import { ChainUtils } from "ferrum-chain-clients";
import { multiSigToBytes } from "web3-tools";

const DEAFULT_DEADLINE_SECONDS = 20 * 60;
const DEFAULT_BLOCK_LOOP_BACK = 2000;

type BridgeSwapEventFilter = TypedEvent<
      [string, string, string, BigNumber, string, string, string, BigNumber] &
      {
        from: string;
        token: string;
        originToken: string;
        targetNetwork: BigNumber;
        targetToken: string;
        swapTargetTokenTo: string;
        targetAddrdess: string;
        amount: BigNumber;
      }>;


export class CrossSwapService extends MongooseConnection implements Injectable {
	private crossSwapRequestsModel: Model<CrossSwapRequest & Document> | undefined;
    private con: Connection|undefined;
	constructor(
		private oneInchClient: OneInchClient,
		private curList: CurrencyListSvc,
		private uniV2: UniswapV2Client,
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
		this.crossSwapRequestsModel = CrossSwapRequestModel(con);
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
		ValidationUtils.isTrue(
			(AppConfig.instance().constants()?.bridgeNetworks || []).indexOf(fromNetwork) >= 0, `Unsupported network ${fromNetwork}`);
		throuhCurrencies = !!throuhCurrencies.length ? throuhCurrencies : [FRM[fromNetwork][0]];

		ValidationUtils.isTrue(throuhCurrencies.length === 1, 'Only one through currency supported at this time');
		ValidationUtils.isTrue(fromProtocols.length === 1, 'Only one from protocol supported at this time');
		ValidationUtils.isTrue(toProtocols.length === 1, 'Only one to protocol supported at this time');
		if (Networks.for(fromNetwork).testnet) {
			return this.testnetCrossChainQuote(fromCurrency, toCurrency,
				throuhCurrencies, amountIn, fromProtocols, toProtocols);
		}

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
		for(let net of AppConfig.instance().constants()?.bridgeNetworks || []) {
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
		console.log('Got quote...', quote);
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
			const protocolRouter = SwapProtocolConfigs[fromProtocols[0]]?.router;
			const amountCrossMin = this.calculateAmountCrossMin(slippage, quote.bridge.amountIn);
			console.log('GOT amountCrossMin', amountCrossMin)
			const path = this.protocolToPath(quote.fromNetwork, quote.protocols);
			const deadline = this.deadline();
			const isETH = Networks.for(quote.fromNetwork).baseCurrency === fromCurrency;
			console.log('Now swap and cross')
			const crossSwap = isETH ?
				await router.populateTransaction.swapAndCrossETH(
					protocolRouter,
					await this.helper.amountToMachine(quote.bridge.from.currency, amountCrossMin),
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
					await this.helper.amountToMachine(quote.bridge.from.currency, amountCrossMin),
					path,
					deadline,
					quote.bridge.to.chainId,
					quote.bridge.to.address,
					quote.toToken.address,
					userAddress,
					{ from: userAddress });
			return await this.helper.fromTypechainTransactionWithGas(
				quote.fromNetwork, crossSwap, userAddress);
		}
	}

	async registerSwapCross(
		userAddress: string,
		targetAddress: string,
		network: string,
		transactionId: string,
		fromCurrency: string,
		toCurrency: string,
		amountIn: string,
		throughCurrency: string,
		targetThroughCurrency: string,
		fromProtocol: SwapProtocol,
		toProtocol: SwapProtocol,) {
		ValidationUtils.isTrue(!!network, 'network must be provided');
		ValidationUtils.isTrue(!!userAddress, 'userAddress is required');
		ValidationUtils.isTrue(!!transactionId, 'transactionId is required');
		const request = {
			creationTime: Date.now(),
			userAddress,
			targetAddress,
			network,
			transactionId,
			fromCurrency,
			toCurrency,
			amountIn,
			throughCurrency,
			targetThroughCurrency,
			fromProtocol,
			toProtocol,
			status: { status: 'none' },
		} as CrossSwapRequest;
		console.log('About to save the request ', request, {targetThroughCurrency})
		this.verifyInit();
		return new this.crossSwapRequestsModel!(request).save();
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
				withdrawItem.payBySig.toToken,
				withdrawItem.payBySig.sourceChainId,
				withdrawItem.payBySig.swapTxId,
				multiSigToBytes(withdrawItem.payBySig.signatures.map(s => s.signature)),
				{from: userAddress});
			return this.helper.fromTypechainTransactionWithGas(swapNetwork, tx, userAddress);
		}
	}

	private async withdrawAndSwapTransaction(userAddress: string, item: UserBridgeWithdrawableBalanceItem, slippage: string) {
		ValidationUtils.isTrue(!!item, 'withdrawAndSwap is required');
		const registered = await this.getRegisteredSwapCross(item.receiveTransactionId);
		const router = this.router(item.sendNetwork);
		const isETH = Networks.for(item.sendNetwork).baseCurrency === item.sendToCurrency;
		const protocol = registered?.toProtocol || this.defaultProtocols[item.sendNetwork][0];
		const swapRouter = SwapProtocolConfigs[protocol]?.router;
		ValidationUtils.isTrue(!!swapRouter,
			`No swap router found in item, and there was no default protocol configured : ${JSON.stringify(item)}`);
		// to token amount
		const quote = await this.oneInchClient.quote(
			item.sendCurrency, item.sendToCurrency, item.sendAmount, [protocol]);
		const tx = isETH ?
			await router.populateTransaction.withdrawSignedAndSwapETH(
				item.payBySig.payee,
				swapRouter,
				item.payBySig.amount,
				item.payBySig.toToken,
				item.payBySig.swapTxId,
				this.calculateAmountCrossMin(slippage, quote.toTokenAmount),
				this.protocolToPath(item.sendNetwork, quote.protocols),
				this.deadline(),
				multiSigToBytes(item.payBySig.signatures.map(s => s.signature)),
				{from: userAddress}
			): await router.populateTransaction.withdrawSignedAndSwap(
				item.payBySig.payee,
				swapRouter,
				item.payBySig.amount,
				item.payBySig.sourceChainId,
				item.payBySig.swapTxId,
				this.calculateAmountCrossMin(slippage, quote.toTokenAmount),
				this.protocolToPath(item.sendNetwork, quote.protocols),
				this.deadline(),
				multiSigToBytes(item.payBySig.signatures.map(s => s.signature)),
				{from: userAddress}
			);
		return this.helper.fromTypechainTransactionWithGas(item.sendNetwork, tx, userAddress);
	}

	async getRegisteredSwapCross(transactionId: string) {
		this.verifyInit();
		const rv = await this.crossSwapRequestsModel!.findOne({ transactionId: transactionId }).exec();
		return !!rv ? rv.toJSON() : undefined;
	}

	async listRegisteredSwapCrossForStatus(
			network: string,
			lookBackSeconds: number,
			status: CrossSwapStatus,): Promise<CrossSwapRequest[]> {
		this.verifyInit();
		const rv = await this.crossSwapRequestsModel!.find({
			'$and': [
				{ 'network': network },
				{ 'status.status': status},
				{ '$lte': {creationTime: Date.now() - (lookBackSeconds * 1000)} }]}).exec();
		return rv.map(r => r.toJSON() as any);
	}

	async listRegisteredSwapCross(
			network: string,
			lookBackSeconds: number): Promise<CrossSwapRequest[]> {
		this.verifyInit();
		const rv = await this.crossSwapRequestsModel!.find({
			'$and': [
				{ 'network': network },
				{ '$lte': {creationTime: Date.now() - (lookBackSeconds * 1000)} }]}).exec();
		return rv.map(r => r.toJSON() as any);
	}

	async processedRegisteredSwapTxIds(
			network: string,
			lookBackSeconds: number): Promise<string[]> {
		this.verifyInit();
		const rv = await this.crossSwapRequestsModel!.find({
			'$and': [
				{ 'network': network },
				{ '$ne': {'status.status': 'none' } },
				{ '$lte': {creationTime: Date.now() - (lookBackSeconds * 1000)} }]})
			.projection(['transactionId'])
			.exec();
		return rv.map(r => r.toJSON() as any).map(r => r.transactionId);
	}

	async getSwapEventsV12(network: string, lookBackBlocks: number = DEFAULT_BLOCK_LOOP_BACK): Promise<BridgeSwapEvent[]> {
		const web3 = await this.helper.web3(network);
		const block = await web3.getBlockNumber();
		const filter = this.bridgePool(network).filters.BridgeSwap();
		const events = await this.bridgePool(network).queryFilter(filter, block - lookBackBlocks, block);
		const logs: BridgeSwapEvent[] = [];
		for (const e of events) {
			try {
				const event = await this.parseSwapEvent(network, e);
				logs.push(event);
			} catch (er) {
				console.error('Error decoding log event: ', e, '-', er);
			}
		}
		return logs;
	}

	async getSwapEventsV12ForTransactionId(network: string, transactionId: string): Promise<BridgeSwapEvent> {
		const provider = (await this.helper.ethersProvider(network)) as providers.JsonRpcProvider;
		const tx = (await provider.getTransactionReceipt(transactionId));
		const pool = await this.bridgePool(network);
		const address = this.contracts[network]!.bridge;
		const router = this.contracts[network]!.router;
		ValidationUtils.isTrue(
			ChainUtils.addressesAreEqual(network as any, router, tx.to),
			'Transaction is not against the router contract');
		const swapLog = tx.logs.find(l =>
			ChainUtils.addressesAreEqual(network as any, address, l.address)); // Index for the swap event
		ValidationUtils.isTrue(!!swapLog, 'No swap log found on tx ' + transactionId);
		const decoded = pool.interface.decodeEventLog(
			'BridgeSwap',
			swapLog.data,
			swapLog.topics);
		return this.parseSwapEvent(network, { args: decoded, transactionHash: transactionId } as any);
	}

	contract(network: string): BridgeV12Contracts {
		const rv = this.contracts[network];
		ValidationUtils.isTrue(!!rv, 'No contract is configured for ' + network);
		return rv!;
	}


	private async parseSwapEvent(network: string, e: BridgeSwapEventFilter): Promise<BridgeSwapEvent> {
		const decoded = e.args;
		const currency = `${network}:${decoded.token.toLowerCase()}`;
		const targetNetworkName = Networks.forChainId(decoded.targetNetwork.toNumber());
		ValidationUtils.isTrue(network !==
			targetNetworkName.id, 'to and from network are same!');
		return {
			network,
			transactionId: e.transactionHash,
			from: decoded.from?.toLowerCase(),
			amount: await this.helper.amountToHuman(currency, decoded.amount.toString()),
			targetAddress: (decoded.targetAddrdess || '').toLowerCase(), // I know, but typo is correct
			senderAddress: (decoded.from),
			targetNetwork: targetNetworkName.id,
			targetToken: (decoded.targetToken || '').toLowerCase(),
			swapTargetTokenTo: (decoded.swapTargetTokenTo.toString()),
			token: (decoded.token || '').toLowerCase(),
			originToken: (decoded.originToken || '').toLowerCase(),
		} as BridgeSwapEvent;
	}

	private async testnetCrossChainQuote(
		fromCurrency: string,
		toCurrency: string,
		throuhCurrencies: string[],
		amountIn: string,
		fromProtocols: SwapProtocol[],
		toProtocols: SwapProtocol[],
		): Promise<SwapQuote> {
		// We only support direct exchange with FRM, and through FRM...
		const [fromNetwork,] = EthereumSmartContractHelper.parseCurrency(fromCurrency);
		const [toNetwork,] = EthereumSmartContractHelper.parseCurrency(toCurrency);
		const amountOut = await this.uniV2.amountOut(fromCurrency, throuhCurrencies[0], 
			await this.helper.amountToMachine(fromCurrency, amountIn));
		console.log('Result of amount out is ', amountOut)
		const bridge = await this.bridgeQuote(throuhCurrencies[0], toNetwork, amountOut);
		ValidationUtils.isTrue(bridge.to.currency === toCurrency, 'No cross on the to side for testnet');
		return {
			fromNetwork,
			fromToken: await this.curList.token(fromCurrency),
			fromTokenAmount: amountIn,
			toNetwork,
			toToken: await this.curList.token(toCurrency),
			toTokenAmount: bridge.amountOut,
			protocols: [
				{fromCurrency, network: fromNetwork, toCurrency: throuhCurrencies[0] },
			],
			bridge,
		} as SwapQuote;
	}

	private calculateAmountCrossMin(slippage: string, toTokenAmount: string) {
		console.log('Calcing ', 'calculateAmountCrossMin', slippage, toTokenAmount);
		const slippageBig = BigUtils.parseOrThrow(slippage, 'slippage');
		console.log('Got slippage', slippageBig.toString())
		const toTokenAmountBig = BigUtils.parseOrThrow(toTokenAmount, 'toTokenAmount');
		console.log('Got toTokenAmountBig', toTokenAmountBig.toString())
		ValidationUtils.isTrue(slippageBig.lte(new Big(1)) && slippageBig.gte(new Big(0)), 'Slippage must be between 0 and 1');
		console.log('Got toTokenAmountBig 2', toTokenAmountBig.toString())
		return toTokenAmountBig.minus(toTokenAmountBig.mul(slippageBig)).toFixed();
	}

	private protocolToPath(network: string, protocols: SwapQuoteProtocol[]): string[] {
		return protocols.filter(p => p.network === network)
			.reduce((pth, p) => pth.length === 0 ? [p.fromCurrency, p.toCurrency] : pth.concat([p.toCurrency]), [])
			.map(c => EthereumSmartContractHelper.parseCurrency(c)[1]);
	}

	private router(network: string): BridgeRouterV12 {
		const contract = this.contracts[network]?.router;
		ValidationUtils.isTrue(!!contract, 'No contract config found for network ' + network);
		return BridgeRouterV12__factory.connect(contract, this.helper.ethersProvider(network));
	}

	private bridgePool(network: string): BridgePoolV12 {
        const contract = this.contracts[network]?.bridge;
        ValidationUtils.isTrue(!!contract, `No bridge address for network ${network}`);
		return BridgePoolV12__factory.connect(contract, this.helper.ethersProvider(network));
	}

	private deadline() {
		return Math.round(new Date().valueOf() / 1000) + DEAFULT_DEADLINE_SECONDS;
	}

    async close() {
        if (this.con) {
            await this.con!.close();
        }
    }
}