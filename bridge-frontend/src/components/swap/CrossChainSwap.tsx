import React from 'react';
import { Networks } from 'ferrum-plumbing';
import { supportedNetworks, TokenDetails, Utils } from 'types';
import {
	SwapComponent, Row,
	// @ts-ignore
} from 'component-library';
import { SwapButton } from '../SwapButton';

export interface CrossChainSwapProps {
	userAddress: string;
	contractAddress: string;
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
	error?: string;
}

export function CrossChainSwap(props: CrossChainSwapProps) {
	const allNetworks = props.fromNetwork ? Object.keys(supportedNetworks).filter(k => Networks.for(props.fromNetwork).testnet === Networks.for(k).testnet) : [];
	const tokenValid = Utils.isCurrencyValid(props.fromCurrency) && Utils.isCurrencyValid(props.toCurrency);
	const showConfirmModal = () => {};
	return (
		<>
		<div className="cswap-container">
			<SwapComponent
				networks={allNetworks}
				fromNetwork={props.fromNetwork}
				fromToken={props.tokenList.find(t => t.currency === props.fromCurrency)}
				tokenList={props.tokenList}
				onFromCurrencySelected={props.onFromCurrencyCanged}
				onFromAmountChanged={props.onAmountInChanged}
				toToken={props.tokenList.find(t => t.currency === props.toCurrency)}
				onToCurrencySelected={props.onToCurrencyCanged}
			>
				{props.error && (
					<Row centered>
						<span>{props.error}</span>
					</Row>
				)}
				<Row>
                    <SwapButton
                        onSwapClick={() => showConfirmModal()}
                        approveDisabled={!props.fromCurrency}
                        swapDisabled={!props.fromCurrency || (Number(props.amountIn) <= 0) 
                            || !tokenValid || !!props.error}
                        contractAddress={props.contractAddress}
                        amount={props.amountIn || '0'}
                        currency={props.fromCurrency}
                        userAddress={props.userAddress}
                        pendingSwap={false}
                    />
				</Row>
			</SwapComponent>
		</div>
		</>
	);
}