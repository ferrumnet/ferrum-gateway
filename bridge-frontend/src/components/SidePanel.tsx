import React, {useContext, useEffect} from 'react';
import { connect,useDispatch, useSelector } from 'react-redux';
import { Utils } from '../common/Utils';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import stakeImg from "../images/next.png"
import {ThemeContext, Theme} from 'unifyre-react-helper';
import ButtonLoader from './btnWithLoader';
import { AnyAction, Dispatch } from "redux";
import { addAction, CommonActions } from "../common/Actions";
import { BridgeClient } from './../clients/BridgeClient';
import { inject,UserBridgeWithdrawableBalanceItem } from "types";
import { useToasts } from 'react-toast-notifications';
import { BridgeAppState } from '../common/BridgeAppState';
import { AppAccountState } from 'common-containers';
import { createSlice } from '@reduxjs/toolkit';
import { Connect } from 'unifyre-extension-web3-retrofit';
import { CheckCircleTwoTone,PlusOutlined } from '@ant-design/icons';
import {
    SyncOutlined,
  } from '@ant-design/icons';
export interface SidePanelProps {
    userWithdrawalItems: UserBridgeWithdrawableBalanceItem[],
    Network: string,
    reconnecting?: boolean,
    dataLoaded?: boolean,
    txExecuted?: boolean
}

export const SidePanelSlice = createSlice({
    name: 'sidePanel',
        initialState: {
        userWithdrawalItems: [],
        reconnecting: false,
        Network: '',
        dataLoaded: false,
        txExecuted: false
    } as SidePanelProps,
    reducers: {
        signFirstPairAddress: (state,action) => {

        },
        onDestinationNetworkChanged:(state,action) => {
        },
        widthdrawalItemsFetched: (state,action) => {
            state.userWithdrawalItems = action.payload.items;
            state.dataLoaded = true
        },
        transactionExecuted:  (state,action) => {
            state.txExecuted = true;
        },
    },
    extraReducers: builder => {
        builder.addCase('connect/reconnected', (state, action) => {
            state.reconnecting = true;
        });
        builder.addCase('mainPage/loadedUserPairs', (state, action) => {
            console.log('pairdedpaired')
            //@ts-ignore
            state.pairedAddress = action.payload.pairedAddress;
        });
        builder.addCase('USER_AVAILABLE_LIQUIDITY_FOR_TOKEN', (state, action) => {            
            //@ts-ignore
            state.availableLiquidity= action.payload.liquidity;
        });
    }
});

export function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): SidePanelProps {
    const state = (appState.ui.sidePanel || {}) as SidePanelProps;
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {};
    return {
        userWithdrawalItems: state.userWithdrawalItems || [],
        Network: address.network,
        dataLoaded: state.dataLoaded,
        txExecuted: state.txExecuted
    };
}

const Actions = SidePanelSlice.actions;

export interface swapDisptach {
    executeWithrawItem: (item:UserBridgeWithdrawableBalanceItem,dis:()=>void,success:(v:string)=>void,error:(v:string)=>void) => void,
}

const getUserWithdrawItems = async (dispatch:Dispatch<AnyAction>) => {
    try {
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const sc = inject<BridgeClient>(BridgeClient);
        const res = await sc.getUserWithdrawItems(dispatch,network); 
        if(res.withdrawableBalanceItems.length > 0){
            dispatch(Actions.widthdrawalItemsFetched({items: res.withdrawableBalanceItems}));
        } 
    } catch (error) {
        
    }
}

const executeWithrawItem = async (
        dispatch: Dispatch<AnyAction>,
        item:UserBridgeWithdrawableBalanceItem,
        dis:()=>void,
        success:(v:string)=>void,
        error:(v:string)=>void
    ) => {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
        dis();
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const res = await sc.withdraw(dispatch,item)
        if(!!res){
            success('Withdrawal was Successful and is processing...') 
            const items = await sc.getUserWithdrawItems(dispatch,network);
            if(items && items.withdrawableBalanceItems.length > 0){
                dispatch(Actions.widthdrawalItemsFetched({items: items.withdrawableBalanceItems}));
            }
            dispatch(Actions.transactionExecuted({}));       
            return;
        }
        error('Withdrawal failed');
    }catch(e) {
        if(!!e.message){
            console.log('hellow',e.message);
            //dispatch(addAction(TokenBridgeActions.AUTHENTICATION_FAILED, {message: e.message }));
        }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

const updatePendingWithrawItems = async (dispatch: Dispatch<AnyAction>) =>{
    try {
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const items = await sc.getUserWithdrawItems(dispatch,network);
        if(items.withdrawableBalanceItems.length > 0){
            if(items.withdrawableBalanceItems){
                const pendingItems = items.withdrawableBalanceItems.filter((e:any) => e.used === 'pending');
                if(pendingItems.length > 0){
                    pendingItems.forEach(
                        async (item:UserBridgeWithdrawableBalanceItem) => {
                            if(item.used === 'pending'){
                                await sc.withdrawableBalanceItemUpdateTransaction(dispatch,item.receiveTransactionId,item.useTransactions[0].id)
                            }
                        }
                    );
                    const items = await sc.getUserWithdrawItems(dispatch,network);
                    if(items && items.withdrawableBalanceItems.length > 0){
                        dispatch(Actions.widthdrawalItemsFetched({items: items.withdrawableBalanceItems}));
                    }
    
                }
            }
        }
     
    }catch(e) {
        if(!!e.message){
           console.log(e.message)
        }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

export function SidePane (props:{isOpen:boolean,dismissPanel:() => void}){
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, SidePanelProps>(state => stateToProps(state,userAccounts));
    const appInitialized = useSelector<BridgeAppState, any>(appS => appS.data.init.initialized);
    const connected = useSelector<BridgeAppState, any>(appS => !!appS.connection.account.user.userId);
    const groupId = useSelector<BridgeAppState, any>(appS => !!appS.data.state.groupInfo.groupId);

    useEffect(() => {
        if(pageProps.txExecuted){
            const interval = setInterval(async () => {
                await updatePendingWithrawItems(dispatch);
            }, 
            20000 );
            return () => clearInterval(interval);
        }
     
    }, [])
    
    const handleSync = async ()=> {
        await getUserWithdrawItems(dispatch)
    }
    
    useEffect(() => {
        if(connected && groupId){
            if(appInitialized && !pageProps.dataLoaded){
               handleSync()
            }
        }
      });

    const onMessage = async (v:string) => {    
        addToast(v, { appearance: 'error',autoDismiss: true })        
    };

    const onSuccessMessage = async (v:string) => {    
        addToast(v, { appearance: 'success',autoDismiss: true })        
    };

    return (
        <Panel
            isOpen={props.isOpen}
            onDismiss={props.dismissPanel}
            type={PanelType.medium}
            closeButtonAriaLabel="Close"
            isLightDismiss={true}
            headerText= {"Withdrawal Items"}
        >
            <Accordion>
                { pageProps.userWithdrawalItems.map(
                        e => <div>
                        <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        <div style={styles.tokenInfo}>
                                            <div style={styles.tokenSymbol}>
                                                {/* <img 
                                                style={{"width":'30px'}} src={stakeImg}
                                                alt="token"
                                                /> */}
                                                {e.used === 'completed' && <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '20px'}} />}
                                                {e.used === 'pending' && <SyncOutlined spin style={{color: `${theme.get(Theme.Colors.textColor)}` || "#52c41a",fontSize: '20px'}}/>}
                                                {e.used === '' && <PlusOutlined style={{color: `${theme.get(Theme.Colors.textColor)}` || "#52c41a",fontSize: '20px'}}/>}

                                            </div>
                                            <div style={styles.textStyles}>
                                                Swap {e.receiveAmount} to {Utils.shorten(e.receiveCurrency)}
                                            </div>
                                        </div> 
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                <p style={{...styles.accInfo}} >
                                    Receiver Currency : {e.receiveCurrency}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Sender Currency : {e.receiveCurrency}
                                </p >
                                <p style={{...styles.accInfo}}>
                                    Sender Network : {e.receiveNetwork}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Reciever Network : {e.sendNetwork}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Reciever Address : {e.receiveAddress}
                                </p>
                                <p style={{...styles.accInfo}}>
                                    Token Address : {e.payBySig.token}
                                </p>
                                    {
                                        e.sendNetwork === pageProps.Network &&
                                        <>
                                            {
                                                (!e.used  || e.used === 'failed') && <ButtonLoader completed={false} onPress={()=>{executeWithrawItem(dispatch,e,props.dismissPanel,onSuccessMessage,onMessage);props.dismissPanel()}} disabled={false}/>
                                            }
                                            {
                                                (e.used === 'pending') && <ButtonLoader onPress={()=>{}} disabled={true} completed={false}/>
                                            }
                                            {
                                                (e.used === 'completed') && <ButtonLoader onPress={()=>{}} disabled={true} completed={true}/>
                                            }
                                        </>      
                                    }
                                    
                                </AccordionItemPanel>
                            </AccordionItem>
                        </div>
                    )
                }
            </Accordion>            
        </Panel>
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
