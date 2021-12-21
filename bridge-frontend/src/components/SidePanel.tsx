import React, {useContext, useEffect} from 'react';
import { Network } from 'ferrum-plumbing';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeContractVersions, ChainEventBase, ChainEventStatus, inject, inject3, TokenDetails, Utils } from 'types';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import ButtonLoader from './btnWithLoader';
import { AnyAction, Dispatch } from "redux";
import { BridgeClient } from './../clients/BridgeClient';
import { inject2,UserBridgeWithdrawableBalanceItem } from "types";
import { useToasts } from 'react-toast-notifications';
import { BridgeAppState } from '../common/BridgeAppState';
import { AppAccountState } from 'common-containers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Connect } from 'unifyre-extension-web3-retrofit';
import { CheckCircleTwoTone,PlusOutlined,CloseCircleOutlined } from '@ant-design/icons';
import {
    SyncOutlined,
  } from '@ant-design/icons';
import { Drawer, Button } from 'antd';
import { message, Result } from 'antd';
import { UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { connectSlice } from "common-containers";
import { ChainEventItem } from 'common-containers/dist/chain/ChainEventItem';
import { Actions as MainPageAction } from './../pages/Main/Main';
//@ts-ignore
import { AddTokenToMetamask } from 'component-library';
import { CrossSwapClient } from '../clients/CrossSwapClient';
import './SidePanel.scss';
import { TokenLogo } from './TokenLogo';

interface WithdrawSuccessMessage {
	network: string;
	txId: string;
	currency: string;
}

export interface SidePanelProps {
    Network: string;
	step: number;
    reconnecting?: boolean;
    dataLoaded?: boolean;
    txExecuted?: boolean;
	symbol: string;
	currency: string;
	showWithdrawPopup: boolean;
	slippage: string;
	errorMessage?: string;
	successMessage?: string;
	withdrawSuccessMessage?: WithdrawSuccessMessage;
    withdrawntxId: string,
    withdrawnCurrency: string,
    withdrawnNetwork: string,
}

const executeWithrawItem = createAsyncThunk('sidePanel/executeWithdraw', 
	async (payload: {
        item: UserBridgeWithdrawableBalanceItem,
		slippage: string,
        success?:(v:string, tx:string, currency:string)=>void
	}, ctx) => {
		try {
			const {item, slippage} = payload;
			const [sc, csc] = inject2<BridgeClient, CrossSwapClient>(BridgeClient, CrossSwapClient);
			let res: [string, string] = ['', ''];
			if (item.payBySig.contractVersion === BridgeContractVersions.V1_2) {
				console.log('Running withdrawAndSwap for V12', csc);
				res = await csc.withdrawAndSwap(ctx.dispatch, item, slippage);
			} else {
				res = await sc.withdraw(ctx.dispatch, item, item.sendNetwork as Network);
			}
			if (!!res && !!res[0]) {
				ctx.dispatch(Actions.transactionExecuted({
					message: 'Withdrawal was Successful and is processing...',
				}));
				ctx.dispatch(sidePanelSlice.actions.showWithdrawPopup({
					txId: res[1],
					currency: item.sendCurrency,
					network: item.sendNetwork,
				} as WithdrawSuccessMessage));
				await sc.getUserWithdrawItems(ctx.dispatch, item.sendNetwork as Network);
                payload.success && payload.success("Withdrawal Transaction Processing",res[0],item.sendCurrency)
			}
		} catch (e) {
			console.error('Error when calling executeWithrawItem: ', e as Error);
			throw e;
		}
	}
);

function withdrawItemInitialStatus(item: UserBridgeWithdrawableBalanceItem): ChainEventStatus {
	// Returning fake withdraw item of "none" when there is no use transaction
	// to avoid pinging backend unnecessarily
	return item.used || (!!(item.useTransactions || []).length ? '' : 'none' as any)
}

export const sidePanelSlice = createSlice({
    name: 'sidePanel',
        initialState: {
        userWithdrawalItems: [],
        reconnecting: false,
        Network: '',
		step: 1,
        dataLoaded: false,
        txExecuted: false,
		symbol: '',
		currency: '',
		showWithdrawPopup: false,
		slippage: '0.02',
        withdrawntxId: '',
        withdrawnCurrency: '',
        withdrawnNetwork: '',
    } as SidePanelProps,
    reducers: {
        signFirstPairAddress: (state,action) => {

        },
        onDestinationNetworkChanged:(state,action) => {
        },
		moveToNext: (state, action) => {
			state.step = action.payload.step;
		},
        transactionExecuted:  (state,action) => {
            state.txExecuted = true;
        },
        dataLoaded: (state,action) => {
            state.dataLoaded = true
        },
		hideWithdrawPopup: (state) => {
			state.showWithdrawPopup = false;
			state.withdrawSuccessMessage = undefined;
            state.withdrawnCurrency = '';
            state.withdrawnNetwork = '';
            state.withdrawntxId = ''
		},
		showWithdrawPopup: (state, action) => {
            console.log()
            state.withdrawnCurrency = action.payload.currency;
            state.withdrawnNetwork = action.payload.network;
            state.withdrawntxId = action.payload.txId;
            state.showWithdrawPopup = true;
			state.withdrawSuccessMessage = action.payload;
		}
    },
    extraReducers: builder => {
        builder.addCase('connect/reconnected', (state, action) => {
            state.reconnecting = true;
        });
        builder.addCase('connect/connectionSucceeded', (state, action) => {
            // TODO:
        });
        builder.addCase('mainPage/loadedUserPairs', (state, action) => {
            //@ts-ignore
            state.pairedAddress = action.payload.pairedAddress;
        });
        builder.addCase('USER_AVAILABLE_LIQUIDITY_FOR_TOKEN', (state, action) => {            
            //@ts-ignore
            state.availableLiquidity= action.payload.liquidity;
        });
		builder.addCase(executeWithrawItem.fulfilled, (state, action) => {
			state.successMessage = 'Withdraw item was successfully submitted';
		});
		builder.addCase(executeWithrawItem.rejected, (state, action) => {
			state.errorMessage = (action as any).error?.message || 'Error submitting withdrawal';
		});
    }
});

export function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): SidePanelProps {
    const state = (appState.ui.sidePanel || {}) as SidePanelProps;
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {} as any;
    return {
		...state,
        Network: address.network,
        dataLoaded: state.dataLoaded!,
        txExecuted: state.txExecuted!,
		step: state.step,
		symbol: address.symbol,
		currency: appState.ui.swapPage.currency || address.currency,
    };
}

const Actions = sidePanelSlice.actions;

export interface swapDisptach {
    executeWithrawItem: (item:UserBridgeWithdrawableBalanceItem,
        dis:()=>void,success:(v:string)=>void,error:(v:string)=>void) => void,
}

const getUserWithdrawItems = async (dispatch:Dispatch<AnyAction>) => {
    try {
        const [connect,sc] = inject2<Connect,BridgeClient>(Connect,BridgeClient);
        const network = connect.network() as any;
        await sc.getUserWithdrawItems(dispatch,network); 
    } catch (error) {
		console.error('getUserWithdrawItems', error);
    }
}

const getData= async (dispatch:Dispatch<AnyAction>) => {
    try {
        const [connect,client] = inject2<Connect,UnifyreExtensionWeb3Client>(Connect,UnifyreExtensionWeb3Client);
        const userProfile = await client.getUserProfile();
        const Actions = connectSlice.actions;
        dispatch(Actions.connectionSucceeded({userProfile}))
    } catch (error) {
        
    }
}

async function updateWithdrawItem(item: ChainEventBase, dispatch: Dispatch<AnyAction>): Promise<ChainEventBase> {
    try {
		console.log('Updating item ', item);
        const c = inject<BridgeClient>(BridgeClient);
        let res = await c.updateWithdrawItemPendingTransactions(dispatch, item.id);
        return { ...item, status: res.used, };
    } catch(e) {
        console.error('updateWithdrawItem ', e);
        return item;
    }
}

function WithdrawItemButton(props: {item: UserBridgeWithdrawableBalanceItem, network: string, slippage: string}) {
    const dispatch = useDispatch();
    const hasSig = !!(props.item.payBySig as any)?.signature /* backward compatiblity */ || !!props.item.payBySig?.signatures?.length;
    console.log('PBS', props.item.payBySig, {hasSig});
    switch (props.item.used) {
        case 'failed':
            return (
                <ButtonLoader 
                    onPress={() => dispatch(executeWithrawItem({item: props.item, slippage: props.slippage}))}
                    disabled={false} 
                    completed={false} 
                    text={'Retry Withdrawal'}
                />
            );
        case 'completed':
            return (
                <ButtonLoader 
                    onPress={() => {}}
                    disabled={true} 
                    completed={true} 
                    text={'Processing Sucessful'}
                />
            );
        case 'pending':
            return (
                <ButtonLoader 
                    onPress={() => {}}
                    disabled={true} 
                    completed={false} 
                    text={'Processing Withdrawal'}
                />
            );
        default:
            if (props.item.blocked) {
                return (
                    <ButtonLoader 
                        onPress={() => {}}
                        disabled={true} 
                        completed={false} 
                        text={'Blocked - Contact Support'}
                    />
                );
            }
            if (!hasSig) {
                return (
                    <ButtonLoader 
                        onPress={() => {}}
                        disabled={true} 
                        completed={false} 
                        text={'Waiting for verification'}
                    />
                );
            } else {
                return (
                    <ButtonLoader 
                    onPress={() => dispatch(executeWithrawItem({item: props.item, slippage: props.slippage}))}
                    disabled={false} 
                    completed={false} 
                    text={'Withdrawal Item'}
                    />
                );
            }
    }
}

export function SidePane (props:{isOpen:boolean,dismissPanel:() => void}){
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, SidePanelProps>(state => stateToProps(state,userAccounts));
    const connected = useSelector<BridgeAppState, boolean>(appS => !!appS.connection.account.user.userId);
    const groupId = useSelector<BridgeAppState, boolean>(appS => !!appS.data.state.groupInfo.groupId);
    const assets = useSelector<BridgeAppState, any>(appS => appS.data.state.filteredAssets);
    const tokenList = useSelector<BridgeAppState, {[k: string]: TokenDetails}>(appS => appS.data.tokenList?.lookup) || {};

    // const token = useSelector<BridgeAppState, string>(appS => appS.ui.pairPage.selectedToken);
	const userWithdrawalItems = useSelector<BridgeAppState, UserBridgeWithdrawableBalanceItem[]>(
		appS => appS.data.state.balanceItems);
    const {errorMessage, successMessage, slippage} = pageProps;

    const handleSync = async ()=> {
        await getUserWithdrawItems(dispatch)
    }
    
    useEffect(() => {
        if(connected && groupId){
            handleSync()
        }
    }, [connected, groupId]);

	useEffect(() => {
		if (errorMessage) {
        	addToast(errorMessage, { appearance: 'error',autoDismiss: true })        
		}
	}, [errorMessage]);

	useEffect(() => {
		if (successMessage) {
        	addToast(successMessage, { appearance: 'success',autoDismiss: true })        
		}
	}, [successMessage]);

    pageProps.showWithdrawPopup && message.success({
        icon: <></>,
        content: <Result
            className="cardTheme confirmationModalTheme"
            status="success"
            title="Withdrawal Transaction Processing"
            subTitle={pageProps.withdrawntxId}
            extra={[
                <>
                    <div> View Transaction Status </div>
                    <a onClick={() => window.open(Utils.linkForTransaction(pageProps.Network,pageProps.withdrawntxId), '_blank')}>{pageProps.withdrawntxId}</a>
                </>,
                <p></p>,
                <AddTokenToMetamask tokenData={assets[pageProps.withdrawnCurrency]}/>,
                <p>
                    <Button className={'btnTheme btn-pri clsBtn'} key="buy" onClick={()=>{
                        message.destroy('withdr');
                        getData(dispatch);
                        dispatch(MainPageAction.resetSwap({}));
                        dispatch(sidePanelSlice.actions.hideWithdrawPopup());
                        dispatch(sidePanelSlice.actions.moveToNext({step: 1}));
                        dispatch(MainPageAction.setProgressStatus({status:1}))
                    }}>Close</Button>
                </p>
            ]}
        />,
        className: 'custom-class',
        style: {
            marginTop: '20vh',
        },
        duration: 0,
        key: 'withdr'
    },12);  

    return (
        <Drawer
          title={<div className="text-vary-color">Withdrawal Items</div>}
          width={520}
          closable={false}
          onClose={props.dismissPanel}
          visible={props.isOpen}
        >
          <Accordion>
                { userWithdrawalItems.map(
                        (e, i) => <div key={i}>
                        <ChainEventItem
                            id={e.receiveTransactionId}
                            network={e.receiveNetwork as Network}
                            initialStatus={withdrawItemInitialStatus(e)}
                            eventType={'WITHDRAW_ITEM'}
                            updater={updateWithdrawItem}
                        >
                        <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        <div className="withdraw-item-container" style={styles.tokenInfo}>
                                            <div style={styles.tokenSymbol}>
                                                {/* <img 
                                                style={{"width":'30px'}} src={stakeImg}
                                                alt="token"
                                                /> */}
                                                {e.used === 'completed' && <CheckCircleTwoTone className={'finishThemed'} style={{ fontSize: '20px'}} />}
                                                {e.used === 'pending' && <SyncOutlined spin className={'bodyText'} style={{color: `${theme.get(Theme.Colors.textColor)}` || "#52c41a",fontSize: '20px'}}/>}
                                                {e.used === '' && <PlusOutlined className={'waitThemed text-vary-color'} style={{fontSize: '20px'}}/>}
                                                {e.used === 'failed' && <CloseCircleOutlined style={{color: `red` || "#52c41a",fontSize: '20px'}}/>}

                                            </div>
                                            <div className="withdraw-item-head text-vary-color">
                                                <TokenLogo currency={e.sendCurrency || e.receiveCurrency} />
                                                <span>Swapped</span>
                                                <span>{e.receiveAmount} {tokenList[e.sendCurrency]?.symbol || 'Unknown'}</span>
                                                <span>to</span>
                                                <span>{e.sendNetwork}</span>
                                            </div>
                                        </div> 
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                <p style={{...styles.accInfo}} >
                                    Receiver Currency : {e.sendCurrency}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Sender Currency : {e.receiveCurrency}
                                </p >
                                <p style={{...styles.accInfo}}>
                                    Sender Network : {e.receiveNetwork}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Receiver Network : {e.sendNetwork}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Receiver Address : {e.receiveAddress}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Token Address : {e.payBySig.token}
                                </p>
                                    {
                                        e.sendNetwork === pageProps.Network &&
                                            <WithdrawItemButton item={e} network={pageProps.Network} slippage={pageProps.slippage}/>
                                    }
                                    
                                </AccordionItemPanel>
                            </AccordionItem>
                        </ChainEventItem>
                        </div>
                    )
                }
            </Accordion>   
        </Drawer>
    )
}

//@ts-ignore
const themedStyles = (theme) => ({
    Container: {
        display: 'relative',
        borderRadius: '15px',
        width: '100%',
        padding: '1px',
        marginTop: '5px'
    },
    accInfo: {
        textAlign: "start" as 'start',
        margin: '3% 7%'
    },
    moreInfo: {
        display: 'flex',
        color: 'white',
        justifyContent: 'space-between',
        margin: '10px 30px',
        marginRight: '0px',
        width: '90%',
        letterSpacing: 1.5,
        fontWeight: 500,
        fontSize: '7px'
    },
    btnContainer: {
        display: 'flex',
        color: 'white',
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: '15px',
        paddingBottom: '2px'
    },
    miniText: {
        fontSize: '11px',
    },
    categoryText:{
        letterSpacing: 1,
        fontSize: '13px'
    },
    symb:{
        fontSize: '13px',
        textAlign: 'center' as 'center',
        fontWeight: 'bold' as 'bold',
        letterSpacing: 1
    },
    rewards:{
        backgroundColor: 'white',
        color: '#c1052a',
        textAlign: "center" as "center",
        borderRadius: '5px',
        fontSize: '10px',
        fontWeight: "bold" as "bold",
        margin: '3px 0px',
        padding: '5px 20px'
    },
    tokenInfo: {
        display: 'flex',
        flex: 1,
        color: 'black',
        alignItems: 'center',
        marginBottom: '24px ',
        cursor: 'pointer'
    },
    tokenSymbol: {
        margin: '0px 10px',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '0px'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    listItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: theme.get(Theme.Spaces.line) * 4,
        padding: theme.get(Theme.Spaces.line),
    },
    stakedText:{
        fontFamily: 'Sawarabi Gothic',
        marginTop: 'auto',
        margin: '3px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center" as "center",
        lineHeight: 1
    },
    commonText: {
        fontFamily: 'Sawarabi Gothic',
        fontWeight: 'bold',
        fontSize: '16.5px',
        letterSpacing: '1px'
    },
    unifyreTextColor: {
      color:  '#9a3531'
    },
    stakingInfoHeader: { 
        justifyContent: 'center',  
        fontSize: '14px',
        fontWeight: 'bold',
        letterSpacing: 1.3,
        lineHeight: '1.2'
    },
    stakingAmountStyle: {
        color: '#ffff',
        fontSize: '30px',
        lineHeight: 1,
        fontWeight: '900',
        letterSpacing: '3px'
    },
    stakingSymbol:{
        paddingTop: '3px',
        letterSpacing: 1,
        fontSize:'13px',
        fontWeight: 200
    },
    unifyreMainTextlineHeight: {
        lineHeight: 0.9
    },
    smallerMediumText:{
        fontSize: '14px',
        letterSpacing: '1px',
        lineHeight: '0.8',
        fontWeight: 200
    },
    navHeader: {
        fontSize: '17px',
        lineHeight: 1
    },
    mediumText: {
        fontSize: '25px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        lineHeight: '1.3'
    },
    littleText: {
        fontSize: '12.5px',
        fontWeight: '200'
    },
    percentStake: {
        textAlign: "center" as "center",
        marginTop: '0px',
        marginRight: '0px',
        marginLeft: '20px',
        marginBottom: '2px',
        width:'45%',
        display: 'flex',
        flexDirection: "row" as "row",
    },
    arrows: {
        marginRight: '10px',
        marginLeft: '10px',
        width: '16px'
    },
    divider: {
        height: '3px',
        borderTopStyle: "solid" as "solid",
        borderTopColor: 'rgba(249, 64, 43, 1)',
        width: '5%',
        margin: '0px auto',
    },
    highlight:{
        color: 'rgb(255, 59, 47)'
    },
    DurText: {
        fontSize: '12.5px' 
    },
    btnText: {
        color: '#ffffff',
        letterSpacing: '2px',
        lineHeight: '1.7'
    },
    bottomFix:{
        width: '99%',
        marginBottom: '1rem'
    },
    header: {
        fontSize: '45px',
        width: '80%',
        lineHeight: 0.9,
        marginLeft: '15pt'
    },
    headerStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    textStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    optionColor: {
        backgroundColor: theme.get(Theme.Colors.bkgShade0)
    }
});
