import React from 'react';
import { Row } from '../PageLayout';
import "./SwapComponent.css";
import {TokenSelector} from './TokenSelector';
import { Dropdown } from '@fluentui/react/lib/Dropdown';


export function SwapComponent({
	networks,
	fromNetwork,
	tokenList,
	fromToken,
	onFromCurrencySelected,
	toToken,
	onToCurrencySelected,
}) {
	const toNetworks = (networks || []).filter(network => network !== fromNetwork);
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
			<TokenSelector
				tokenList={tokenList}
				selectedToken={fromToken}
				onCurrencySelected={onFromCurrencySelected}
			/>
			<Row>
				<b>To: </b>
				<Dropdown
					placeholder="Select target network"
					label="To Network"
					options={toNetworks.map(network => ({key: network, text: network}))}
					// styles={dropdownStyles}
				/>
			</Row>
			<TokenSelector
				tokenList={tokenList}
				selectedToken={toToken}
				onCurrencySelected={onToCurrencySelected}
			/>
		</div>
	)
}