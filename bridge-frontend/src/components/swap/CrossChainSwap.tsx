import React from 'react';
import { supportedNetworks, TokenDetails } from 'types';
import {
	SwapComponent,
	// @ts-ignore
} from 'component-library';

export interface CrossChainSwapProps {
	tokenList: TokenDetails[];
	fromNetwork: string;
	fromCurrency: string;
	onFromCurrencyCanged: (cur: string) => void;
	toNetwork: string;
	toCurrency: string;
	onToCurrencyCanged: (cur: string) => void;
	toNetworkOptions: string[];
	onToNetworkChanged: (net: string) => void;
	amountIn: string;
	onAmountInChanged: (amount: string) => void;
	amountOut: string;
	crossFee: string;
	fromSwapFee: string;
	toSwapFee: string;
	totalFee: string;
	fromPath: string[];
	toPath: string[];
	slippage: string;
	onSlippageChanged: (slippage: string) => void;
}

export function CrossChainSwap(props: CrossChainSwapProps) {
	console.log('CrossChainSwap', {...props, tokenList: []})
	return (
		<>
		<div className="cswap-container">
			<SwapComponent
				networks={Object.keys(supportedNetworks)}
				fromNetwork={props.fromNetwork}
				fromToken={props.tokenList.find(t => t.currency === props.fromCurrency)}
				tokenList={props.tokenList}
				onFromCurrencySelected={props.onFromCurrencyCanged}
				toToken={props.tokenList.find(t => t.currency === props.toCurrency)}
				onToCurrencySelected={props.onToCurrencyCanged}
			/>
		</div>
		</>
	);
}