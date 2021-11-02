import { Injectable, LocalCache, Networks, ValidationUtils } from "ferrum-plumbing";
import { TokenDetails } from "types";
import fetch from 'cross-fetch';
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";

const CURRENCY_LISTS = [
	'https://raw.githubusercontent.com/ferrumnet/ferrum-token-list/main/FerrumTokenList.json',
	'https://tokens.coingecko.com/uniswap/all.json',
	'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
	'https://unpkg.com/quickswap-default-token-list@1.0.82/build/quickswap-default.tokenlist.json',
];
const HOUR = 1 * 3600 * 1000;

export class CurrencyListSvc implements Injectable {
	private cache = new LocalCache();
	constructor(
		private helper: EthereumSmartContractHelper,) { }

	__name__() { return 'CurrencyListSvc'; }

	async mergedList(): Promise<TokenDetails[]> {
		return this.cache.getAsync('CURRENCY_LIST', async () => {
			const listFs = CURRENCY_LISTS.map(l => this.loadSingleList(l));
			const listsOfLists = await Promise.all(listFs);
			let lists: TokenDetails[] = [];
			const curSet = new Set<string>();
			listsOfLists.forEach(list => {
				const filteredList = list.filter(l => {
					const k = `${l.chainId.toString()}:${l.address}`;
					if (curSet.has(k)) { return false; }
					curSet.add(k);
					return true;
				});
				lists = lists.concat(filteredList);
			});
			lists.forEach(l => {
				try {
					const network = Networks.forChainId(l.chainId).id;
					l.currency = `${network}:${(l.address || '').toLowerCase()}`;
				} catch(e) { } 
			});
			ValidationUtils.isTrue(!!lists.length, 'Error getting currency list. No data was downloaded');
			return lists;
		}, HOUR);
	}

	async token(currency: string): Promise<TokenDetails> {
		ValidationUtils.isTrue(!!currency, 'currency is required');
		const list = await this.mergedList();
		const rv = list.find(t => t.currency === currency);
		if (rv) {
			return rv;
		}

		const [network, address] = EthereumSmartContractHelper.parseCurrency(currency);
		const isETH = Networks.for(network).baseCurrency === currency;
		const token = isETH ? {
			address,
			chainId: Networks.for(network).chainId,
			currency,
			decimals: 18, // TODO: Some networks might have different decimals
			name: address,
			symbol: address,
			logoURI: '', // TODO: Get tokens for base currencies
		} as TokenDetails : {
			address,
			chainId: Networks.for(network).chainId,
			currency,
			decimals: Number(await this.helper.decimals(currency)),
			name: await this.helper.name(currency),
			symbol: await this.helper.symbol(currency),
			logoURI: '',
		} as TokenDetails;
		// Check again to reduce the chance of duplication (race condition)
		if (!list.find(t => t.currency === currency)) {
			list.push(token);
		}
		return token;
	}

	private async loadSingleList(url: string): Promise<TokenDetails[]> {
		try {
			const res = await fetch(url);
			const resJ = await res.json();
			return resJ.tokens;
		} catch (e) {
			console.error(`Error getting currency list ${url}`, e);
			return [];
		}
	}
}
