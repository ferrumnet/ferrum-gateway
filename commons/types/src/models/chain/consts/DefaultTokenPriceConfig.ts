
/*
These constants define the amount of each currency to be used by uniswap without
causing much slippage.
We can get rid of these configs once we improve the price discovery.
 */

import { USD_PAIR, WETH } from "../Consts"

export interface TokenPriceConfigItem {
	minInputAmount: string;
	ethRoute?: string[];
	usdtRoute?: string[];
}

export type TokenPriceConfig = {[k: string]: TokenPriceConfigItem}

export const DefaultTokenPriceConfig: { [k: string]: TokenPriceConfig } = {
	'ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c': {
		'DEFAULT': {
			minInputAmount: '1',
			usdtRoute: ['ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c',
			WETH['ETHEREUM'], USD_PAIR['ETHEREUM']],
		},
	},
	'ETHEREUM:0xf6832ea221ebfdc2363729721a146e6745354b14': {
		'DEFAULT': {
			minInputAmount: '0.0001', // FRMX
		}
	}
}