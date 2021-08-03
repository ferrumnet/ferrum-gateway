import { ApiClient } from 'common-containers';
import { Injectable, ValidationUtils } from 'ferrum-plumbing';
import { AnyAction, Dispatch } from 'redux';
import { FRM, DEFAULT_SWAP_PROTOCOLS, Utils, SwapQuote } from 'types';
import { addAction, CommonActions } from '../common/Actions';

export const CrossSwapActions = {
	SWAP_PROTOCOLS_LOADED: 'SWAP_PROTOCOLS_LOADED',
}

export class CrossSwapClient implements Injectable {
	constructor(private api: ApiClient) {}

	__name__() { return 'CrossSwapClient'; }

	/**
	 * Errot handling should happen at the thunk level.
	 */
	async crossChainQuote(
		dispatch: Dispatch<AnyAction>,
		fromCurrency: string,
		toCurrency: string,
		amountIn: string): Promise<SwapQuote> {
		ValidationUtils.isTrue(!!fromCurrency, 'fromCurrency must be provided');
		ValidationUtils.isTrue(!!toCurrency, 'toCurrency must be provided');
		ValidationUtils.isTrue(!!amountIn, 'amountIn must be provided');
		const [fromNetwork,] = Utils.parseCurrency(fromCurrency);
		const [toNetwork,] = Utils.parseCurrency(toCurrency);

		const throughCurrencies = [FRM[fromNetwork]];
		const fromProtocols = DEFAULT_SWAP_PROTOCOLS[fromNetwork];
		const toProtocols = DEFAULT_SWAP_PROTOCOLS[toNetwork];
		return await this.api.api({
			command: 'crossChainQuote',
			data: {
				fromCurrency,
				toCurrency,
				throughCurrencies,
				amountIn,
				fromProtocols,
				toProtocols,
			}, params: [] });
	}

	async allProtocols(dispatch: Dispatch<AnyAction>) {
		try {
			const protocols = await this.api.api({ command: 'allProtocols', data: { }, params: [] });
			if (!!protocols) {
				dispatch(addAction(CrossSwapActions.SWAP_PROTOCOLS_LOADED, { protocols }))
			}
		} catch(e) {
			dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message}));
			throw e;
		}
	}
}