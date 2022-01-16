import React from 'react';
import { useSelector } from 'react-redux';
import { CrucibleInfo } from 'types';
import { CrucibleAppState } from '../common/CrucibleAppState';
import { CrucibleBox } from './CrucibleBox';
import './CrucibleList.css';

function CrucibleHeading(props: {info: CrucibleInfo}) {
	return (
		<>
		<div className="crucible-heading-container">
			<div>{props.info.network}</div>
			<div>{props.info.baseSymbol}</div>
		</div>
		</>
	);
}

function CrucibleListForCurrency(props: {currency: string}) {
	const crucibles = useSelector<CrucibleAppState, CrucibleInfo[]>(
		state => state.data.state.crucibles[props.currency]);
	console.log(crucibles,'crucibles')
	if (!crucibles || !crucibles.length) {
		return (<></>);
	}

	return (
		<>
		<CrucibleHeading info={crucibles[0]} />
		<div className="crucible-list-items-container">
			{crucibles.map((c, i) => <CrucibleBox key={i} info={c} />)}
		</div>
		</>
	);
}

export function CrucibleList() {
	const baseCurrencies = useSelector<CrucibleAppState, string[]>(state =>
		Object.keys(state.data.state.crucibles));
	console.log(baseCurrencies,'baseCurrencies')
	return (
		<div className="crucible-list-container">
			{baseCurrencies.map((c, i) => <CrucibleListForCurrency currency={c} key={i} />)}
		</div>
	);
}