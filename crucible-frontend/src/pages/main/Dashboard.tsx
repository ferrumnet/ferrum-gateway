import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../../common/CrucibleAppState';
import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addressForUser, connectSlice, initThunk } from 'common-containers';
import { CrucibleInfo, inject, inject3, Utils } from 'types';
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
import { TransactionSummary,transactionListSlice } from 'common-containers/dist/chain/TransactionList';
import { TransactionSummaryButton } from '../../transactions/TransactionSummaryButton';
import { FLayout, FContainer, FMain, ThemeBuilder } from "ferrum-design-system";
import { TransactionModal } from '../../common/transactionModal';
import {UserCrucible} from './UserCrucible';
import Modal from 'office-ui-fabric-react/lib/Modal';
import {Alert} from 'react-bootstrap';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { addAction, CommonActions } from '../../common/CommonActions';
import { notification } from 'antd';
import { TransactionList } from 'common-containers/dist/chain/TransactionList';
import { APPLICATION_NAME } from '../../common/CommonActions';
import {loadCrucibleUserInfo} from './UserCrucible';
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

const updateUserBalance = async (dispatch: Dispatch<AnyAction>) => {
	const web3Client = inject<UnifyreExtensionWeb3Client>(UnifyreExtensionWeb3Client);
	const userProfile = await web3Client.getUserProfile();
	dispatch(connectSlice.actions.connectionSucceeded({userProfile}));
}

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

const TransactionStatus = (props:{status:any}) => {
	const events = useSelector<CrucibleAppState,any>(state=>state?.data?.transactions) || [];
	const pendingCount = events.filter((e:any) => e.status === 'pending').length;
	const dispatch = useDispatch()
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state =>state.data.state.crucible);
	useEffect(()=>{
		if(props.status?.status === 'success' || props.status?.status === 'failed'){
			notification['success']({
				message: `Crucible Transaction ${props.status?.status}`,
				onClose: async () => {
					dispatch(addAction(CommonActions.RESET_ERROR, {}))
					await updateUserBalance(dispatch)
					crucible && dispatch(loadCrucibleUserInfo({crucibleCurrency: `${crucible.network}:${crucible.contractAddress}`}))
				},
				description: props.status.status === 'success' ? 
				`${props.status.type} Transaction Successful ${ Utils.shorten(props.status.id)}` : 
				`${props.status.type} Transaction Failed ${Utils.shorten(props.status.id)}`,
				
			})
		}
	},[props.status?.status])

	return<>
		{
			Number(pendingCount||'0') > 0 &&
			<TransactionList
				eventIsRelevant={e => e.application === APPLICATION_NAME}
				eventView={()=><></>}
			/>
		}
	</>
}

const TransactionTracker = () => {
	return<>
		<TransactionList
			eventIsRelevant={e => e.application === APPLICATION_NAME}
			eventView={()=><></>}
		/>
	</>
}

export function Dashboard(props: DashboardProps) {
    const initError = useSelector<CrucibleAppState, string | undefined>(state => state.data.init.initError);
	const appError = useSelector<CrucibleAppState, string | undefined>(state => state.data.state.initError);
	const txUpdate = useSelector<CrucibleAppState, any | undefined>(state => state.data.state.txUpdate);
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
							<TransactionStatus status={txUpdate}/>
							
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
									<TransactionTracker/>
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
