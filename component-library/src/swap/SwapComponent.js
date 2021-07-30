import React from 'react';
import { Row } from '../PageLayout';
import "./SwapComponent.css";
import {TokenSelector} from './TokenSelector';

export function SwapComponent({
	fromNetwork,
	tokenList,
	fromToken,
}) {
	return (
		<div className="swap-component-container">
			<Row centered>
				<h3>Cross-Chain Swap</h3>
			</Row>
			<Row>
				<span>Network </span>
			</Row>
			<Row>
				<span>{fromNetwork}</span>
			</Row>
			<Row>
				<TokenSelector
					tokenList={tokenList}
					selectedToken={fromToken}
				/>
			</Row>
		</div>
	)
}