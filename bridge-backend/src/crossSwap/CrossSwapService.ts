import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { BigUtils, BRIDGE_NETWORKS, CrossChainBridgeQuote, FRM, NetworkedConfig, NetworkRelatedConfig, SwapProtocol, SwapProtocolInfo, SwapQuote } from "types";
import { BridgeConfigStorage } from "../BridgeConfigStorage";
import { OneInchClient } from "./OneInchClient";

export class CrossSwapService implements Injectable {
	constructor(
		private oneInchClient: OneInchClient,
		private helper: EthereumSmartContractHelper,
		private bridgeConfig: BridgeConfigStorage,
		private defaultProtocols: NetworkedConfig<SwapProtocol[]>,
	) { }
	__name__() { return 'CrossSwapService'; }

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
		const [fromNetwork, ft] = EthereumSmartContractHelper.parseCurrency(fromCurrency);
		ValidationUtils.isTrue(BRIDGE_NETWORKS.indexOf(fromNetwork) >= 0, `Unsupported network ${fromNetwork}`);
		throuhCurrencies = !!throuhCurrencies.length ? throuhCurrencies : [FRM[fromNetwork][0]];

		ValidationUtils.isTrue(throuhCurrencies.length === 1, 'Only one through currency supported at this time');
		ValidationUtils.isTrue(fromProtocols.length === 1, 'Only one from protocol supported at this time');
		ValidationUtils.isTrue(toProtocols.length === 1, 'Only one to protocol supported at this time');

		const fromQuote = await this.oneInchClient.quote(
			fromCurrency, throuhCurrencies[0], amountIn, fromProtocols);
		const [toNetwork, _] = EthereumSmartContractHelper.parseCurrency(toCurrency);
		const crossQuote = await this.bridgeQuote(fromCurrency, toNetwork, amountIn);
		const toQuote = await this.oneInchClient.quote(
			crossQuote.toCurrency, toCurrency, crossQuote.amountOut, toProtocols);

		return {
			fromNetwork,
			fromToken: fromQuote.fromToken,
			fromTokenAmount: fromQuote.fromTokenAmount,
			toNetwork,
			toToken: toQuote.toToken,
			toTokenAmount: toQuote.toTokenAmount,
			protocols: [...fromQuote.protocols, ...toQuote.protocols],
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

	async bridgeQuote(fromCurrency: string, toNetwork: string, amountIn: string): Promise<CrossChainBridgeQuote> {
		const [sourceNetwork, sourceTok] = EthereumSmartContractHelper.parseCurrency(fromCurrency);
		const conf = await this.bridgeConfig.tokenConfig(sourceNetwork, toNetwork, fromCurrency);
		const fromBig = BigUtils.safeParse(amountIn);
		ValidationUtils.isTrue(BigUtils.truthy(fromBig), 'amountIn must be a positive number');
		const feeRatioBig = BigUtils.safeParse(conf.fee);
		const feeBig = fromBig.times(feeRatioBig);
		return {
			fromCurrency,
			toCurrency: conf.targetCurrency,
			amountIn,
			amountOut: fromBig.sub(feeBig).toFixed(),
			fee: feeBig.toFixed(),
		} as CrossChainBridgeQuote;
	}
}