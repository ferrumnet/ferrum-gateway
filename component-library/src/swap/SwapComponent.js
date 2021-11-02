import React, { useState } from 'react';
import { Networks } from 'ferrum-plumbing';
import { Row } from '../PageLayout';
import "./SwapComponent.css";
import {TokenSelector} from './TokenSelector';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react';

export function SwapComponent({
	networks,
	fromNetwork,
	tokenList,
	fromToken,
	fromAmount,
	onFromAmountChanged,
	onFromCurrencySelected,
	toToken,
	onToCurrencySelected,
	children,
}) {
	const toNetworks = (networks || []).filter(network => network !== fromNetwork);
	const [toNetwork, setToNetwork] = useState(toNetworks[0] || '');
	const fromNetworkId = fromNetwork ? Networks.for(fromNetwork).chainId : 0;
	const toNetworkId = toNetwork ? Networks.for(toNetwork).chainId : 0;
	console.log('TO NETWORK ISO ', toNetworkId)
	const fromNetworkName = !!fromNetworkId ?
		Networks.forChainId(fromNetworkId).displayName : '';
	return (
		<div className="swap-component-container">
			<Row centered>
				<h3>Cross-Chain Swap</h3>
			</Row>
			<Row>
				<span>Network </span>
			</Row>
			<Row withPadding>
				<Dropdown
					placeholder="Select source network"
					label="From Network"
					options={([{key: fromNetworkId, text: fromNetworkName}])}
					selectedKey={fromNetworkId}
					disabled={true}
				/>
			</Row>
			<Row withPadding>
			<TokenSelector
				tokenList={(tokenList || []).filter(tl => tl.chainId === fromNetworkId)}
				selectedToken={fromToken}
				onCurrencySelected={onFromCurrencySelected}
				onAddressEntered={addr => onFromCurrencySelected(`${fromNetwork}:${addr}`)}
			/>
			</Row>
			<Row withPadding>
			<TextField
				label="Amount"
				value={fromAmount}
				onChange={(e, v) => onFromAmountChanged(v)}
			/>
			</Row>
			<Row withPadding>
				<Dropdown
					placeholder="Select target network"
					label="To Network"
					options={toNetworks.map(network => ({key: network, text: Networks.for(network).displayName}))}
					onChange={(e, net) => setToNetwork(net.key)}
					// styles={dropdownStyles}
				/>
			</Row>
			<Row withPadding>
			<TokenSelector
				tokenList={(tokenList || []).filter(tl => tl.chainId === toNetworkId)}
				selectedToken={toToken}
				onCurrencySelected={onToCurrencySelected}
				onAddressEntered={addr => onToCurrencySelected(`${toNetwork}:${addr}`)}
			/>
			</Row>
			{children}
		</div>
	)
}