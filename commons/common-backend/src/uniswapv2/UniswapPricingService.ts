import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { Injectable, LocalCache, ValidationUtils } from 'ferrum-plumbing';
import { SwapProtocol, DefaultTokenPriceConfig, SwapProtocolConfigs } from 'types';
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

	async price(protocol: SwapProtocol, route: string[], minimalInAmount: string): Promise<string> {
		const key = route.join('-');
		return this.cache.getAsync(key, async () => {
			return await this.priceNoCache(protocol, route, minimalInAmount);
		}, PRICE_CACHE_TIME);
	}

	async priceNoCache(protocol: SwapProtocol, routes: string[], amountIn: string): Promise<string> {
		const amountsOut = await this.router.getAmountsOut(protocol, amountIn, routes);
		const denom = new Big(amountIn);
		if (denom.eq(new Big(0))) {
			console.error(`priceNoCache: Divided by zero for `, routes, ':', amountsOut);
			return '0';
		}
		const nom = new Big(amountsOut[amountsOut.length-1].value);
		const price = nom.div(denom);
		return price.toFixed();
	}

	private async protocolConfigForCur(protocol: string, currency: string) {
		// TODO Try to get from database
		const config = DefaultTokenPriceConfig[currency] || {};
		return config[protocol] || config['DEFAULT'] || {};
	}

	async ethPrice(protocol: SwapProtocol, currency: string): Promise<string> {
		try {
			const curProtocolConfig = await this.protocolConfigForCur(protocol, currency);
			const protocolWeth = (SwapProtocolConfigs[protocol] ||
				SwapProtocolConfigs['DEFAULT'])?.weth;
			ValidationUtils.isTrue(!!curProtocolConfig.ethRoute || !!protocolWeth,
				`Protocol ${protocol} is not configured and currency deos not customize the weth route`);
			const pairs = !!curProtocolConfig.ethRoute ?
				curProtocolConfig.ethRoute : [currency, protocolWeth];
			return this.price(protocol, pairs, curProtocolConfig?.minInputAmount || '1');
		} catch (e) {
			console.error('ethPrice', e as Error);
			return '';
		}
	}

	async usdPrice(protocol: SwapProtocol, currency: string): Promise<string> {
		try {
			const curProtocolConfig = await this.protocolConfigForCur(protocol, currency);
			const protocolUsd = (SwapProtocolConfigs[protocol] ||
				SwapProtocolConfigs['DEFAULT'])?.usd;
			ValidationUtils.isTrue(!!curProtocolConfig.usdtRoute || !!protocolUsd,
				`Protocol ${protocol} is not configured and currency deos not customize the usd route`);
			const pairs = !!curProtocolConfig.usdtRoute ?
				curProtocolConfig.usdtRoute : [currency, protocolUsd];
			return this.price(protocol, pairs, curProtocolConfig?.minInputAmount || '1');
		} catch (e) {
			console.error('usdPrice', e as Error);
			return '';
		}
	}
}