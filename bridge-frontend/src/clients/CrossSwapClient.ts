import { ApiClient } from 'common-containers';
import { Injectable, ValidationUtils, Network } from 'ferrum-plumbing';
import { AnyAction, Dispatch } from 'redux';
import { FRM, DEFAULT_SWAP_PROTOCOLS, Utils, SwapQuote, UserBridgeWithdrawableBalanceItem } from 'types';
import { addAction, CommonActions } from '../common/Actions';
import { UnifyreExtensionKitClient } from "unifyre-extension-sdk";
import { BridgeClient } from './BridgeClient';

export const CrossSwapActions = {
	SWAP_PROTOCOLS_LOADED: 'SWAP_PROTOCOLS_LOADED',
}

export class CrossSwapClient implements Injectable {
	constructor(
		private api: ApiClient,
		private bridgeClient: BridgeClient,
        protected client: UnifyreExtensionKitClient
		) {}

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

		const throughCurrencies = [FRM[fromNetwork][0]];
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

	async swapCross(
		dispatch: Dispatch<AnyAction>,
		fromCurrency: string,
		toCurrency: string,
		amountIn: string,
		slippage: string,
		) {
		ValidationUtils.allRequired(['fromCurrency', 'toCurrency', 'amountIn', 'slippage'], {fromCurrency, toCurrency, amountIn, slippage});
		const network = this.api.getNetwork();
		const fromProtocol = DEFAULT_SWAP_PROTOCOLS[network][0];
		const toProtocol = DEFAULT_SWAP_PROTOCOLS[network][0];
		const throughCurrency = FRM[network][0];
		const req = await this.api.api({ command: 'swapCrossGetTransaction', data: {
			fromCurrency,
			toCurrency,
			throughCurrencies: [throughCurrency],
			amountIn,
			slippage,
			fromProtocols: [fromProtocol],
			toProtocols: [toProtocol],
		}, params: []});
		// If tx, submit to wallet, then register the result.
		ValidationUtils.isTrue(!!req, 'Error calling swapCross. No requests');
		console.log('About to submit request', {req});
		const requestId = await this.client.sendTransactionAsync(network as Network, [req],
			{});
		ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
		const response = await this.client.getSendTransactionResponse(requestId);
		if (response.rejected) {
			throw new Error((response as any).reason || 'Request was rejected');
		}
		const txIds = (response.response || []).map(r => r.transactionId);
		await this.api.api({ command: 'registerSwapCross', data: {
			network,
			transactionId: txIds[0],
			fromCurrency,
			toCurrency,
			amountIn,
			throughCurrency,
			fromProtocol,
			toProtocol,
			}, params: []});
		return txIds[0];
	}

	async withdrawAndSwap(
		dispatch: Dispatch<AnyAction>,
		w: UserBridgeWithdrawableBalanceItem,
		slippage: string,
	): Promise<[string, string]> {
		ValidationUtils.isTrue(!!w, '"w" must be provided');
		ValidationUtils.isTrue(!!slippage, '"slippage" must be provided');
		const swapNetwork = w.receiveNetwork;
		const swapTransactionId = w.receiveTransactionId;
		const network = this.api.getNetwork();
		ValidationUtils.isTrue(network === w.receiveNetwork,
			`Invalid network. Expected ${w.receiveNetwork}, but got ${network}`);
		const res = await this.api.api({ command: 'withdrawAndSwapGetTransaction', data: {
			swapNetwork, swapTransactionId, slippage, }, params: []});
		ValidationUtils.isTrue(!!res, 'Error calling withdraw. No requests');
		const requestId = await this.client.sendTransactionAsync(this.api.getNetwork() as Network, [res],
			{});
		ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
		const response = await this.client.getSendTransactionResponse(requestId);
		if (response.rejected) {
			throw new Error((response as any).reason || 'Request was rejected');
		}
		const txIds = (response.response || []).map(r => r.transactionId);
		await this.bridgeClient.withdrawableBalanceItemAddTransaction(
			dispatch, w.receiveTransactionId, txIds[0]);
		return ['success',txIds[0]];
	}
}