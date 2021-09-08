import React, { useEffect } from 'react';
// @ts-ignore
import { Page, PageLayout } from 'component-library';
import { ConnectBar } from '../connect/ConnectBar';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../common/CrucibleAppState';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addressForUser, connectSlice, initThunk } from 'common-containers';
import { inject3 } from 'types';
import { CrucibleClient } from '../CrucibleClient';
import { CurrencyList, UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { CrucibleList } from './CrucibleList';
import { Route, Switch } from 'react-router';
import { Deploy } from './Deploy';
import { Crucible } from './Crucible';

interface DashboardState {
}

export interface DashboardProps {
}

const initializeDashboardThunk = createAsyncThunk('crucible/init', async (payload: {connected: boolean}, ctx) => {
	const [client, curList, web3Client] = inject3<CrucibleClient, CurrencyList, UnifyreExtensionWeb3Client>(CrucibleClient, CurrencyList, UnifyreExtensionWeb3Client);
	const state = ctx.getState() as CrucibleAppState;
	const connectedAddr = addressForUser(state.connection.account?.user);
	const network = connectedAddr?.network;
	const allCrucibles = await client.getAllCruciblesFromDb(ctx.dispatch, network || ''); // If not connected will return result for all networks
	// Make sure we have user balance for all the crucibles listed
	const curs = curList.get();
	curList.set([...curs, ...allCrucibles.map(c => c.currency).filter(cur => curs.indexOf(cur) < 0)]);

	if (payload.connected) { // Connection is already completed
		const userProfile = await web3Client.getUserProfile();
		ctx.dispatch(connectSlice.actions.connectionSucceeded({userProfile}));
	}
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
    const initError = useSelector<CrucibleAppState, string | undefined>(state => state.data.init.initError);
	const initialized = useSelector<CrucibleAppState, boolean>(state => state.data.init.initialized);
	const connected = useSelector<CrucibleAppState, boolean>(state => !!state.connection.account.user?.userId);
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
											 <Switch>
											  <Route path="/deploy">
                        	<Deploy />
												</Route>
											  <Route path="/crucible/:network/:contractAddress">
                        	<Crucible />
												</Route>
											  <Route>
                        	<CrucibleList />
												</Route>
											 </Switch>
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

