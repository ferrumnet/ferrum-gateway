import React, { useEffect } from 'react';
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
import {WithdrawCrucible} from './../pages/crucibleItem/transaction/withdraw';
import {MintCrucible} from './../pages/crucibleItem/transaction/mint';
import {CrucibleHome} from './../pages/crucibleItem/home/index';
import {
    Page, Header, CnctButton,
    AppContainer,
    ContentContainer,
    // @ts-ignore
} from 'component-library';
import { ConnectButtonWapper } from 'common-containers';
import { WaitingComponent } from '../common/WebWaiting';
import '../app.scss'
import { GlobalStyles } from "../common/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { DefaultTheme } from '../common/DefaultTheme';
import { TransactionSummary } from 'common-containers/dist/chain/TransactionList';
import { TransactionSummaryButton } from '../transactions/TransactionSummaryButton';
import { FLayout, FContainer, FMain, ThemeBuilder } from "ferrum-design-system";

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
	const ConBot = <ConnectButtonWapper View={CnctButton} />

	const header = (<Header
                ConnectButton={ConBot}
                WithdrawlsButton={<TransactionSummaryButton />}
                SwitchNetworkButton={<></>}
                ThemeSelector={() => <></>}
                //     () => <ThemeSelector setter={props.setter}
                //         newTheme={props.newTheme}
                //         setIsLight={() => setIsLight(!isLight)}
                //         group={groupInfo.groupId}
                //         isLight={isLight} />
                // }
                logo={'https://ferrum.network/wp-content/uploads/2021/05/image-1.png'}
                altText={'Ferrum Crucible Labs'}
            />);
    return (
        <>
            {!!initError ? (
                <Page>
                    <h3>Error loading the application</h3><br />
                    <p>{initError}</p>
                </Page>
            ):(
			<>
				<ThemeProvider theme={DefaultTheme}>
					<>
						<GlobalStyles />
						<FLayout>
							<FMain>
								{header}
								<FContainer>
									<div className="landing-page">
										<Switch>
										<Route path="/deploy">
											<Deploy />
										</Route>
										<Route path="/crucible/:network/:contractAddress">
											<Crucible />
										</Route>
										<Route path="/home/:network/:contractAddress/home">
											<CrucibleHome />
										</Route>
										<Route path="/withdraw/:network/:contractAddress">
											<WithdrawCrucible />
										</Route>
										<Route path="/mint/:network/:contractAddress">
											<MintCrucible />
										</Route>
										<Route>
											<CrucibleList />
										</Route>
										</Switch>
										<WaitingComponent />
									</div>
								</FContainer>
							</FMain>
						</FLayout>
					</>	
				</ThemeProvider>
			</>
            )}
        </>
    );
}
