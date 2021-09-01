import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { Injectable, LocalCache } from 'ferrum-plumbing';
import { WETH, USD_PAIR } from 'types';
import { UniswapV2Client } from './UniswapV2Client';

const FIVE_MIN = 5 * 60 * 1000;

export class UniswapPricingService implements Injectable {
	private cache = new LocalCache();
	constructor(
		private uni: UniswapV2Client
	) { }

	__name__() { return 'UniswapPricingService'; }

	async price(pairs: [string, string][]): Promise<string> {
		const key = pairs.map(p => `${p[0]}:${p[1]}`).join('-');
		return this.cache.getAsync(key, async () => {
			return await (await this.uni.price(pairs)).toFixed();
		}, FIVE_MIN);
	}

	async ethPrice(currency: string): Promise<string> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
		const pairs: [string, string][] = [[currency, WETH[network]]];
		return this.price(pairs);
	}

	async usdPrice(currency: string, direct: boolean = false): Promise<string> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
		const pairs: [string, string][] = direct ?
			[[currency, USD_PAIR[network]]] :
			[[currency, WETH[network]], [WETH[network], USD_PAIR[network]]];
		return this.price(pairs);
	}
}