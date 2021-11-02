import React from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../common/CrucibleAppState';
import { CrucibleBox } from './CrucibleBox';
import { useParams } from 'react-router';
import { CrucibleLoader } from './CrucibleLoader';
import { CrucibleInfo, Utils } from 'types';

export function Crucible() {
	let {network, contractAddress} = useParams() as any;
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state =>
		state.data.state.crucible);
	const dispatch = useDispatch();
	if (!Utils.addressEqual(crucible?.contractAddress!, contractAddress)) {
		crucible = undefined;
	}
	return (
		<>
		<CrucibleLoader network={network} contractAddress={contractAddress} />
		<div className="crucible-list-container">
			<div className="crucible-list-items-container">
				<CrucibleBox
					info={crucible || {} as any}
				/>
			</div>
		</div>
		</>
	);
}
