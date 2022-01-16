import React, { useEffect } from 'react';
// @ts-ignore
import { Page, PageLayout } from 'component-library';
import { ConnectBar } from '../connect/ConnectBar';
import { useDispatch, useSelector } from 'react-redux';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { initThunk } from 'common-containers';
import { inject } from 'types';
import { Route, Switch } from 'react-router';
import { GovernanceClient } from '../GovernanceClient';
import { GovernanceAppState } from '../common/GovernanceAppState';
import { ContractList } from './ContractList';
import { GovernanceContractPage } from './GovernanceContractPage';
import { Method, NewMethod } from './Method';

interface DashboardState {
}

export interface DashboardProps {
}

const initializeDashboardThunk = createAsyncThunk('governance/init', async (payload: {connected: boolean}, ctx) => {
	const client = inject<GovernanceClient>(GovernanceClient);
	await client.listContracts(ctx.dispatch);
	// Make sure we have user balance for all the crucibles listed
});

export const dashboardSlice = createSlice({
	name: 'crucible/dashboard',
	initialState: {} as DashboardState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(initThunk.fulfilled, (state, action) => {
		});
	}
});

export function Dashboard(props: DashboardProps) {
	const initError = useSelector<GovernanceAppState, string | undefined>(
		state => state.data.init.initError);
	const initialized = useSelector<GovernanceAppState, boolean>(
		state => state.data.init.initialized);
	const connected = useSelector<GovernanceAppState, boolean>(
		state => !!state.connection.account.user?.userId);
	const dispatch = useDispatch();
	useEffect(() => {
		if (initialized && connected) {
			dispatch(initializeDashboardThunk({connected}));
		}
	}, [initialized, connected]);
    return (
        <>
            {!!initError ? (
                <Page>
                    <h3>Error loading the application</h3><br />
                    <p>{initError}</p>
                </Page>
            ):(
                <PageLayout
                    top={(
                        <ConnectBar />
                    )}
                    left={(
						<></>
                    )}
                    middle={(
											 <>
											 <Switch>
											  <Route path="/newMethod/:network/:contractAddress/:contractId">
                        	<NewMethod />
												</Route>
											  <Route path="/method/:network/:contractAddress/:contractId/:requestId">
                        	<Method />
												</Route>
											  <Route path="/contract/:network/:contractAddress/:contractId">
                        	<GovernanceContractPage />
												</Route>
											  <Route path="/" >
                        	<ContractList />
												</Route>
											 </Switch>
											 </>
                    )}
                    bottom={(
                        <div style={{justifyContent: 'center', display: 'flex', flex: 1}}>
                            <p>(c) Copyright Ironworks ltd.</p></div>
                    )}
                />
            ) }
        </>
    );
}

