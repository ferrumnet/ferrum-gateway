import React, { useState } from 'react';
import { Row } from '../PageLayout';
import { InputField  } from '../TextField';

export function TokenSelector({
	tokenList, selectedToken, onCurrencySelected,
}) {
	const [searchOpen, setSearchOpen] = useState(false);
	const [search, setSearch] = useState('');
	if (searchOpen) {
		// TODO: Search more efficiently
		const list = (tokenList || []).filter(tl => 
			(tl?.name || '').toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
			(tl?.symbol || '').toLowerCase().indexOf(search.toLowerCase()) >= 0)
			.slice(0, 10);
		return (
			<>
			<Row>
				<InputField
					type="text" value={search} onChange={e => setSearch(e.target.value)} />
			</Row>
			{list.map((l, i) => (
				<Row key={i}>
				<a onClick={() => { setSearchOpen(false); onCurrencySelected(l.currency)}}>
					<img width="30" heighy="30" src={l.logoURI} /> {l.symbol} - {l.name} 
				</a>
				</Row>
			))}
			</>
		);
	} else {
		return (
			<>
			<Row>
				<img width="30" height="30" src={selectedToken?.logoURI} />
				<a onClick={() => setSearchOpen(true)}> {selectedToken?.symbol} - 
					{selectedToken?.name || 'Select a token...'} </a>
			</Row>
			</>
		);
	}
}