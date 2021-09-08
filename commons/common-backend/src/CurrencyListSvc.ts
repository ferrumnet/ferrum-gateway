import { Injectable, LocalCache, Networks, ValidationUtils } from "ferrum-plumbing";
import { TokenDetails } from "types";
import fetch from 'cross-fetch';

const CURRENCY_LISTS = [
	'https://raw.githubusercontent.com/ferrumnet/ferrum-token-list/main/FerrumTokenList.json',
	'https://tokens.coingecko.com/uniswap/all.json',
];
const HOUR = 1 * 3600 * 1000;

export class CurrencyListSvc implements Injectable {
	private cache = new LocalCache();
	constructor() { }
	__name__() { return 'CurrencyListSvc'; }

	async mergedList(): Promise<TokenDetails[]> {
		return this.cache.getAsync('CURRENCY_LIST', async () => {
			const listFs = CURRENCY_LISTS.map(l => this.loadSingleList(l));
			const listsOfLists = await Promise.all(listFs);
			let lists: TokenDetails[] = [];
			listsOfLists.forEach(list => {
				lists = lists.concat(list);
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
