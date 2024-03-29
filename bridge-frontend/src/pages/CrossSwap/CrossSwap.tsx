import React, { useEffect } from 'react';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addressForUser } from 'common-containers';
import { useDispatch, useSelector } from 'react-redux';
import { inject, NetworkedConfig, SwapQuote, TokenDetails, Utils } from 'types';
import { BridgeAppState } from '../../common/BridgeAppState';
import { CrossChainSwap } from '../../components/swap/CrossChainSwap';
import { CrossSwapClient } from '../../clients/CrossSwapClient';

const ROUTER_CONTRACT_ADDRESS: NetworkedConfig<string> = {
	'RINKEBY': '0x13000855b0277a2a01e6b6f6a25920b5bd454b79',
}

export interface CrossSwapState {
	fromCurrency: string;
	amountIn: string;
	toNetwork: string;
	toCurrency: string;
	slippage: string;
	quote: SwapQuote;
	calculatingQuote: boolean;
	calculatingError?: string;
}

export interface CrossSwapProps extends CrossSwapState {
	fromNetwork: string;
	tokenList: TokenDetails[];
	userAddress: string;
}

function mapStateToProps(appState: BridgeAppState): CrossSwapProps {
	const state = appState.ui.crossSwap;
	const addr = addressForUser(appState.connection.account.user);
	return {
		...state,
		userAddress: appState.connection.account.user?.userId,
		tokenList: appState.data.tokenList.list,
		fromNetwork: addr?.network,
		fromCurrency: state.fromCurrency.startsWith(addr?.network || '') ? state.fromCurrency : '',
	} as CrossSwapProps;
}

const swap = createAsyncThunk('crossSwap/swap',
	async (payload: {
		fromCurrency: string,
		toCurrency: string,
		amountIn: string,
		slippage: string,
		quote: SwapQuote,
	}, ctx) => {
		const client = inject<CrossSwapClient>(CrossSwapClient);
		await client.swapCross(ctx.dispatch,
			payload.fromCurrency,
			payload.toCurrency,
			payload.quote.bridge?.from?.currency!,
			payload.quote.bridge?.to?.currency!,
			payload.amountIn,
			payload.slippage);
		// TODO: Monitor the tx.
	}
);

const quote = createAsyncThunk('crossSwap/quote',
	async (payload: {
			fromNetwork: string, fromCurrency: string,
			toCurrency: string, amountIn: string, }, ctx) => {
		if (!Utils.isCurrencyValid(payload.fromCurrency) ||
			!Utils.isCurrencyValid(payload.toCurrency)) {
			return;
		}
		const state = ctx.getState() as BridgeAppState;
		const client = inject<CrossSwapClient>(CrossSwapClient);
		const quote = await client.crossChainQuote(ctx.dispatch,
			payload.fromCurrency, payload.toCurrency, payload.amountIn);
		ctx.dispatch(crossSwapSlice.actions.quoteReceived({value: quote}))
});

export const crossSwapSlice = createSlice({
	name: 'crossSwap',
	initialState: {
		amountIn: '',
		fromNetwork: '',
		fromCurrency: '',
		toNetwork: '',
		toCurrency: '',
		slippage: '0.2',
		quote: {
			fromNetwork: '', fromToken: {} as any, fromTokenAmount: '', toNetwork: '',
			toToken: {} as any, toTokenAmount: '', protocols:[],
		} as SwapQuote,
		calculatingQuote: false,
		calculationError: '',
	} as CrossSwapState,
	reducers: {
		amountInChanged: (state, action) => {
			state.amountIn = action.payload.value;
			state.calculatingError = undefined;
		},
		toNetworkChanged: (state, action) => {
			const network = action.payload.value;
			if (state.toNetwork !== network) {
				state.toNetwork = network;
				state.toCurrency = '';
			}
		},
		fromCurrencyChanged: (state, action) => {
			state.fromCurrency = action.payload.value;
			state.calculatingError = undefined;
		},
		toCurrencyChanged: (state, action) => {
			state.toCurrency = action.payload.value;
			[state.toNetwork,] = Utils.parseCurrency(action.payload.value);
			state.calculatingError = undefined;
		},
		slippageChanged: (state, action) => {
			state.slippage = action.payload.value;
		},
		quoteReceived: (state, action) => {
			state.calculatingError = undefined;
			state.quote = action.payload.value;
		}
	},
	extraReducers: {
		[quote.pending.name]: (state) => {
			state.calculatingQuote = true;
		},
		[quote.rejected as any]: (state, action) => {
			state.calculatingError = action.error.message;
		},
	},
});

export function CrossSwap() {
	const dispatch = useDispatch();
	const props = useSelector<BridgeAppState, CrossSwapProps>(mapStateToProps);
	const { fromNetwork, fromCurrency, toCurrency, amountIn } = props;
	console.log('Propso sisi', props)
	useEffect(() => {
		if (!!fromNetwork && !!toCurrency && !!fromCurrency  &&amountIn) {
			dispatch(quote({fromNetwork, toCurrency, fromCurrency, amountIn}));
		}
	}, [fromNetwork, fromCurrency, toCurrency, amountIn]);
	return (
		<>
		<h1>Swap cross chain</h1>
		<CrossChainSwap
			userAddress={props.userAddress}
			contractAddress={ROUTER_CONTRACT_ADDRESS[fromNetwork]}
			amountIn={props.amountIn}
			onAmountInChanged={value => dispatch(crossSwapSlice.actions.amountInChanged({value}))}
			toAmount={props.quote?.toTokenAmount}
			fromNetwork={props.fromNetwork}
			fromCurrency={props.fromCurrency}
			onFromCurrencyCanged={value =>
				dispatch(crossSwapSlice.actions.fromCurrencyChanged({value}))}
			fromPath={(props.quote.protocols || [] as any)
				.filter(p => p.network === fromNetwork).map(p => p.toCurrency)}
			fromSwapFee={props.quote?.bridge?.fee || '0'}
			onToNetworkChanged={value => 
				dispatch(crossSwapSlice.actions.toNetworkChanged({value}))}
			toNetwork={props.toNetwork}
			toCurrency={props.toCurrency}
			toSymbol={props.quote?.toToken?.symbol}
			onToCurrencyCanged={value =>
				dispatch(crossSwapSlice.actions.toCurrencyChanged({value}))}
			toPath={(props.quote.protocols || [] as any)
				.filter(p => p.network === props.toNetwork).map(p => p.toCurrency)}
			tokenList={props.tokenList}

			crossFee={props.quote?.bridge?.fee || '0'}
			toSwapFee={'0'}
			totalFee={props.quote?.bridge?.fee || '0'}
			crossFeeSymbol={props.quote.bridge?.to?.symbol || ''}

			slippage={props.slippage}
			onSlippageChanged={value =>
				dispatch(crossSwapSlice.actions.slippageChanged({value}))}
			onSwapClicked={() => dispatch(swap({
				fromCurrency, toCurrency, amountIn, slippage: props.slippage,
				quote: props.quote}))}
			error={props.calculatingError}
		/>
		</>
	);
}