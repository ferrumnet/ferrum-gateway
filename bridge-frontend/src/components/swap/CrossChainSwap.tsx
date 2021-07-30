import React from 'react';
import { TokenDetails } from 'types';
import {
	SwapComponent,
	// @ts-ignore
} from 'component-library';

export interface CrossChainSwapProps {
	tokenList: TokenDetails[];
	fromNetwork: string;
	fromCurrency: string;
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
	return (
		<>
		<div className="cswap-container">
			<SwapComponent
				fromNetwork={props.fromNetwork}
			/>
		</div>
		</>
	);
}