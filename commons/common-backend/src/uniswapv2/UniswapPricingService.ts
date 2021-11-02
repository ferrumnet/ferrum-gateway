import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { Injectable, LocalCache } from 'ferrum-plumbing';
import { WETH, USD_PAIR, SwapProtocol } from 'types';
import { UniswapV2Router } from './UniswapV2Router';
import { Big } from 'big.js';

const PRICE_CACHE_TIME = 1 * 60 * 1000;

export class UniswapPricingService implements Injectable {
	private cache = new LocalCache();
	constructor(
		// private uni: UniswapV2Client
		private helper: EthereumSmartContractHelper,
		private router: UniswapV2Router,
	) { }

	__name__() { return 'UniswapPricingService'; }

	async price(protocol: SwapProtocol, route: string[]): Promise<string> {
		const key = route.join('-');
		return this.cache.getAsync(key, async () => {
			return await this.priceNoCache(protocol, route);
		}, PRICE_CACHE_TIME);
	}

	async priceNoCache(protocol: SwapProtocol, routes: string[]): Promise<string> {
		const amountIn = '1000'
		const amountsOut = await this.router.getAmountsOut(protocol, amountIn, routes);
		const price = new Big(amountIn).div(new Big(amountsOut[amountsOut.length-1].value));
		return price.toFixed();
	}

	async ethPrice(protocol: SwapProtocol, currency: string): Promise<string> {
		try {
			const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
			const pairs: string[] = [currency, WETH[network]];
			return this.price(protocol, pairs);
		} catch (e) {
			console.error('ethPrice', e as Error);
			return '';
		}
	}

	async usdPrice(protocol: SwapProtocol, currency: string, direct: boolean = false): Promise<string> {
		try {
			const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
			const pairs: string[] = direct ?
				[currency, USD_PAIR[network]] :
				[currency, WETH[network], USD_PAIR[network]];
			return this.price(protocol, pairs);
		} catch (e) {
			console.error('usdPrice', e as Error);
			return '';
		}
	}
}