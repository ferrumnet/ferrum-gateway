import React, { useEffect } from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addressForUser } from 'common-containers';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../common/CrucibleAppState';
import { CrucibleClient } from '../CrucibleClient';
import { inject } from 'types';

const loadCrucible = createAsyncThunk('crucible/load',
	async (payload: { crucibleCurrency: string }, ctx) => {
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getCrucible(ctx.dispatch, payload.crucibleCurrency);
});

const loadCrucibleUserInfo = createAsyncThunk('crucible/loadUserInfo',
	async (payload: { crucibleCurrency: string }, ctx) => {
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getUserCrucibleInfo(ctx.dispatch, payload.crucibleCurrency);
});

export function CrucibleLoader(params:
		{ network: string, contractAddress: string}) {

	const { network, contractAddress } = params;
	const crucibleCurrency = `${network.toUpperCase()}:${(contractAddress || '').toLowerCase()}`;
	const initialized = useSelector<CrucibleAppState, boolean>(
		state => state.data.init.initialized);
	const userAddress = useSelector<CrucibleAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const dispatch = useDispatch();

	useEffect(() => {
		if (initialized && !!network && !!contractAddress) {
			dispatch(loadCrucible({crucibleCurrency}));
		}
	}, [initialized, crucibleCurrency]);

	useEffect(() => {
		if (initialized && !!contractAddress && !!network && !!userAddress) {
			dispatch(loadCrucibleUserInfo({crucibleCurrency}));
		}
	}, [initialized, crucibleCurrency, userAddress]);

	return (<> </>);
}
