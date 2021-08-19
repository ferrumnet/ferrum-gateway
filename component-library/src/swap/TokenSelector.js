import React, { useState } from 'react';
import { Row } from '../PageLayout';
import { InputField  } from '../TextField';
import './TokenSelector.css';

export function TokenSelector({
	tokenList, selectedToken, onCurrencySelected, onAddressEntered,
}) {
	const [searchOpen, setSearchOpen] = useState(false);
	const [search, setSearch] = useState('');
	if (searchOpen) {
		const topList = (tokenList || []).filter(tl => 
			(tl?.name || '').toLowerCase() === search.toLowerCase() ||
			(tl?.symbol || '').toLowerCase() === search.toLowerCase() ||
			(tl?.address || '').toLowerCase() === search.toLowerCase())
			.slice(0, 3);
		const bottomList = (tokenList || []).filter(tl => 
			(tl?.name || '').toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
			(tl?.symbol || '').toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
			(tl?.address || '').toLowerCase().indexOf(search.toLowerCase()) >= 0)
			.slice(0, 10);
		const list = topList.concat(
			bottomList.filter(t =>
				!topList.find(tl => tl.address === t.address)));
		return (
			<>
			<div className="token-selector-drop-down">
				<InputField
					type="text" value={search} onChange={e => {
						onAddressEntered(e.target.value);
						setSearch(e.target.value);
					}} />
				{list.map((l, i) => (
					<div key={i} className="token-selector-drop-down-item">
					<a onClick={() => { setSearchOpen(false); onCurrencySelected(l.currency)}}>
						<img width="30" heighy="30" src={l.logoURI} /> {l.symbol} - {l.name} 
					</a>
					</div>
				))}
			</div>
			</>
		);
	} else {
		return (
			<>
			<div className="token-selector-main-line">
				<img width="30" height="30" src={selectedToken?.logoURI} />
				<a onClick={() => setSearchOpen(true)}> {selectedToken?.symbol} - 
					{selectedToken?.name || 'Select a token...'} </a>
			</div>
			</>
		);
	}
}