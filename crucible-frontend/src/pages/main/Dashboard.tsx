import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../../common/CrucibleAppState';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addressForUser, connectSlice, initThunk } from 'common-containers';
import { inject3 } from 'types';
import { CrucibleClient } from '../../common/CrucibleClient';
import { CurrencyList, UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { CrucibleList } from '../crucibleLgcy/CrucibleList';
import { Redirect, Route, Switch, useParams } from 'react-router';
import { Deploy } from '../deploy/Deploy';
import { DeployNamed } from '../deploy/deployNamed';
import {WithdrawCrucible} from '../crucibleItem/transaction/withdraw';
import {MintCrucible} from '../crucibleItem/transaction/mint';
import {CrucibleHome} from '../crucibleItem/home/index';
import {
    Page, Header, CnctButton,
    AppContainer,
    ContentContainer,
    // @ts-ignore
} from 'component-library';
import { ConnectButtonWapper } from 'common-containers';
import { WaitingComponent } from '../../common/WebWaiting';
import '../../app.scss'
import { GlobalStyles } from "../../common/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { DefaultTheme } from '../../common/DefaultTheme';
import { TransactionSummary } from 'common-containers/dist/chain/TransactionList';
import { TransactionSummaryButton } from '../../transactions/TransactionSummaryButton';
import { FLayout, FContainer, FMain, ThemeBuilder } from "ferrum-design-system";
import { TransactionModal } from '../../common/transactionModal';
import {UserCrucible} from './UserCrucible';
import Modal from 'office-ui-fabric-react/lib/Modal';
import {Alert} from 'react-bootstrap';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { addAction, CommonActions } from '../../common/CommonActions';

interface DashboardState {
}

export interface DashboardProps {
}

const initializeDashboardThunk = createAsyncThunk('crucible/init', async (payload: {connected: boolean,network:string}, ctx) => {
	const [client, curList, web3Client] = inject3<CrucibleClient, CurrencyList, UnifyreExtensionWeb3Client>(CrucibleClient, CurrencyList, UnifyreExtensionWeb3Client);
	const state = ctx.getState() as CrucibleAppState;
	const connectedAddr = addressForUser(state.connection.account?.user);
	const network = connectedAddr?.network;
	
	const allCrucibles = await client.getAllCruciblesFromDb(ctx.dispatch, network || ''); // If not connected will return result for all networks
	// Make sure we have user balance for all the crucibles listed
	const curs = curList.get();
	curList.set([...curs, ...allCrucibles!?.map(c => c.currency).filter(cur => curs.indexOf(cur) < 0)]);

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

const Error = (props:{error:string}) => {
	const { addToast } = useToasts();
	const dispatch = useDispatch()
	useEffect(()=>{
		if(props.error){
			addToast(props.error,{appearance: 'error',onDismiss:()=>dispatch(addAction(CommonActions.RESET_ERROR, {}))})
		}
	},[props.error])
	return<></>
}

export function Dashboard(props: DashboardProps) {
    const initError = useSelector<CrucibleAppState, string | undefined>(state => state.data.init.initError);
	const appError = useSelector<CrucibleAppState, string | undefined>(state => state.data.state.initError);
	const dataError = useSelector<CrucibleAppState, string | undefined>(state => state.data.state.error);

	const initialized = useSelector<CrucibleAppState, boolean>(state => state.data.init.initialized);
	const connected = useSelector<CrucibleAppState, boolean>(state => !!state.connection.account.user?.userId);
	const network = useSelector<CrucibleAppState, string>(state => state.connection.account.user?.accountGroups[0]?.addresses[0]?.network);

	const dispatch = useDispatch();

	useEffect(() => {
		if (initialized && connected) {
			dispatch(initializeDashboardThunk({connected,network:network}));
		}
	}, [initialized, connected]);

	const ConBot = <ConnectButtonWapper View={CnctButton} />

	const header = (
		<Header
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
		/>
	);


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
					<GlobalStyles />
					<FLayout>
						<FMain>
							
							{header}
							{
								appError &&  <Error error={appError}/>
							}
							<TransactionModal/>
							<FContainer>
								
								<div className="landing-page">
								
									<Switch>
										<Route path="/deploy">
											<Deploy />
										</Route>
										<Route 
											path="/crucible/:network/:contractAddress"
											render={({ match: { url } }) =>  (
												<UserCrucible url={url}/>
											)}
										/>
										<Route
											path="/deployNamed"
										>
											<DeployNamed/>
										</Route>
										<Route>
											<Redirect to="/deploy"/>
											{/**<CrucibleList />**/}
										</Route>
									</Switch>
									<WaitingComponent />
								</div>
							</FContainer>
						</FMain>
					</FLayout>
				</ThemeProvider>
			</>
            )}
        </>
    );
}
