import React, { useState } from 'react';

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
			<input type="text" value={search} onchange={e => setSearch(e.target.value)} />
			{list.map(l => (
				<>
				<a onClick={() => { setSearchOpen(false); onCurrencySelected(l.currency)}}>
					<img width="30" heighy="30" src={l.logoURI} /> {l.symbol} - {l.name} 
				</a> <br />
				</>
			))}
			</>
		);
	} else {
		return (
			<>
			<img width="30" height="30" src={selectedToken?.logoURI} />
			<a onClick={() => setSearchOpen(true)}> {selectedToken?.symbol} - 
				{selectedToken?.name} </a>
			</>
		);
	}
}