import React, { useEffect } from 'react';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addressForUser } from 'common-containers';
import { useDispatch, useSelector } from 'react-redux';
import { inject, SwapQuote, TokenDetails } from 'types';
import { BridgeAppState } from '../../common/BridgeAppState';
import { CrossChainSwap } from '../../components/swap/CrossChainSwap';
import { CrossSwapClient } from '../../clients/CrossSwapClient';

const ROUTER_CONTRACT_ADDRESS = '0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877';

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

const quote = createAsyncThunk('crossSwap/type',
	async (payload: {
			fromNetwork: string, fromCurrency: string,
			toNetwork: string, amountIn: string, }, ctx) => {
	const state = ctx.getState() as BridgeAppState;
	const client = inject<CrossSwapClient>(CrossSwapClient);
	const quote = await client.crossChainQuote(ctx.dispatch,
		payload.fromCurrency, payload.toNetwork, payload.amountIn);
	crossSwapSlice.actions.quoteReceived({value: quote});
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
		},
		toCurrencyChanged: (state, action) => {
			state.toCurrency = action.payload.value;
		},
		slippageChanged: (state, action) => {
			state.slippage = action.payload.value;
		},
		quoteReceived: (state, action) => {
			state.quote = action.payload.value;
		}
	},
	extraReducers: {
		[quote.pending.name]: (state) => {
			state.calculatingQuote = true;
		},
		[quote.rejected.name]: (state, action) => {
			state.calculatingError = action.error.message;
		},
	},
});

export function CrossSwap() {
	const dispatch = useDispatch();
	const props = useSelector<BridgeAppState, CrossSwapProps>(mapStateToProps);
	const { fromNetwork, fromCurrency, toNetwork, amountIn } = props;
	useEffect(() => {
		if (!!fromNetwork && !!toNetwork && !!fromCurrency  &&amountIn) {
			dispatch(quote({fromNetwork, toNetwork, fromCurrency, amountIn}));
		}
	}, [fromNetwork, fromCurrency, toNetwork, amountIn]);
	return (
		<>
		<h1>Swap cross chain</h1>
		<CrossChainSwap
			userAddress={props.userAddress}
			contractAddress={ROUTER_CONTRACT_ADDRESS}
			amountIn={props.amountIn}
			onAmountInChanged={value => dispatch(crossSwapSlice.actions.amountInChanged({value}))}
			amountOut={'0'}
			fromNetwork={props.fromNetwork}
			fromCurrency={props.fromCurrency}
			onFromCurrencyCanged={value =>
				dispatch(crossSwapSlice.actions.fromCurrencyChanged({value}))}
			fromPath={[]}
			fromSwapFee={'0'}
			onToNetworkChanged={value => 
				dispatch(crossSwapSlice.actions.toNetworkChanged({value}))}
			toNetwork={props.toNetwork}
			toNetworkOptions={[]}
			toCurrency={props.toCurrency}
			onToCurrencyCanged={value =>
				dispatch(crossSwapSlice.actions.toCurrencyChanged({value}))}
			toPath={[]}
			tokenList={props.tokenList}

			crossFee={'0'}
			toSwapFee={'0'}
			totalFee={'0'}

			slippage={props.slippage}
			onSlippageChanged={value =>
				dispatch(crossSwapSlice.actions.slippageChanged({value}))}
		/>
		</>
	);
}