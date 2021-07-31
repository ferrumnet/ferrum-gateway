import { createSlice } from '@reduxjs/toolkit';
import { addressForUser } from 'common-containers';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TokenDetails } from 'types';
import { BridgeAppState } from '../../common/BridgeAppState';
import { CrossChainSwap } from '../../components/swap/CrossChainSwap';

export interface CrossSwapState {
	fromCurrency: string;
	amountIn: string;
	toNetwork: string;
	toCurrency: string;
	slippage: string;
}

export interface CrossSwapProps extends CrossSwapState {
	fromNetwork: string;
	tokenList: TokenDetails[];
}

function mapStateToProps(appState: BridgeAppState): CrossSwapProps {
	const state = appState.ui.crossSwap;
	const addr = addressForUser(appState.connection.account.user);
	return {
		...state,
		tokenList: appState.data.tokenList.list,
		fromNetwork: addr?.network,
		fromCurrency: state.fromCurrency.startsWith(addr?.network || '') ? state.fromCurrency : '',
	} as CrossSwapProps;
}

export const crossSwapSlice = createSlice({
	name: 'crossSwap',
	initialState: {
		amountIn: '',
		fromNetwork: '',
		fromCurrency: '',
		toNetwork: '',
		toCurrency: '',
		slippage: '0.2',
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
		}
	}
})

export function CrossSwap() {
	const dispatch = useDispatch();
	const props = useSelector<BridgeAppState, CrossSwapProps>(mapStateToProps);
	return (
		<>
		<h1>Swap cross chain</h1>
		<CrossChainSwap
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