import React, { useState,useContext, useEffect } from 'react';
import {ThemeContext, Theme, ThemeConstantProvider} from 'unifyre-react-helper';
//@ts-ignore
import {Page,OutlinedBtn} from 'component-library';
import { AnyAction, Dispatch } from "redux";
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from './../../common/BridgeAppState';
import { SignedPairAddress,inject, PairedAddress, UserBridgeWithdrawableBalanceItem } from 'types';
import { Divider } from '@fluentui/react-northstar'
import { TextField} from 'office-ui-fabric-react';
import { useHistory } from 'react-router';
import { AppAccountState } from 'common-containers';
import {
    Gap
    // @ts-ignore
} from 'desktop-components-library';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { BridgeClient } from "./../../clients/BridgeClient";
import { ValidationUtils } from "ferrum-plumbing";
import { Connect } from 'unifyre-extension-web3-retrofit';
import { useBoolean } from '@fluentui/react-hooks';
import { useToasts } from 'react-toast-notifications';
import { formatter } from './../../common/Utils';
import { ReloadOutlined } from '@ant-design/icons';
import { CommonActions,addAction } from './../../common/Actions';
import 'antd/dist/antd.css';

export interface swapPageProps{
    network: string,
    symbol: string,
    baseAddress: string,
    baseSignature: string,
    destAddress: string,
    destNetwork: string,
    baseNetwork: string,
    destSignature: string,
    pairedAddress?: SignedPairAddress,
    amount: string,
    balance: string,
    selectedToken: string,
    addresses: AddressDetails[],
    swapDetails?: AddressDetails,
    message: string,
    currency: string,
    availableLiquidity: string,
    currenciesDetails: any,
    signedPairedAddress?: SignedPairAddress,
    allowanceRequired: boolean,
    userWithdrawalItems: any[],
    groupId: string,
    baseSigned: boolean,
    swapId: string,
    itemId: string,
    panelOpen: boolean,
    reconnecting: boolean
}

export const swapageSlice = createSlice({
    name: 'swapPage',
        initialState: {
        network: '',
        symbol: '',
        baseAddress: '',
        amount: '',
        balance: '0',
        addresses: [],
        selectedToken: '',
        message: '',
        baseSigned: false,
        allowanceRequired: false,
        availableLiquidity: '0',
        currenciesDetails: {},
        panelOpen: false,
        destAddress: '',
        destSignature: '',
        baseSignature: '',
        destNetwork: '',
        baseNetwork: '',
        currency: '',
        userWithdrawalItems: [],
        groupId: '',
        swapId: '',
        itemId: '',
        reconnecting: false
    } as swapPageProps,
    reducers: {
        swapDetails: (state,action) => {
            state.currenciesDetails= action.payload.value[0];
            state.selectedToken = ''
        },
        tokenSelected: (state,action) => {
            state.currency = action.payload.value;
            state.swapDetails = action.payload.details
        },
        amountChanged: (state,action) => {
            state.amount= action.payload.value
        },
        swapSuccess: (state,action) => {
            state.amount= '';
            state.swapId= action.payload.swapId;
            state.itemId= action.payload.itemId
        },
        triggerPanel: (state,action) => {
            state.panelOpen = !state.panelOpen;
        }
    },
    extraReducers: builder => {
        builder.addCase('connect/reconnected', (state, action) => {
            state.reconnecting = true; // TODO: remove
        });
        builder.addCase('BRIDGE_AVAILABLE_LIQUIDITY_FOR_TOKEN', (state, action) => {
            //@ts-ignore
            state.availableLiquidity = action.payload.liquidity;
        });
    }
});

const Actions = swapageSlice.actions;

// const onConnect = async (dispatch: Dispatch<AnyAction>) => {
//     try {
//         dispatch(addAction(CommonActions.WAITING, { source: 'swapGetTransaction' }));
//         const sc = inject<BridgeClient>(BridgeClient);
//         const connect = inject<Connect>(Connect);
//         // const network = connect.network() as any;
//         // const currenciesList = await sc.getSourceCurrencies(dispatch,network);
//         // const allowance = await sc.checkAllowance(dispatch,currency,'5', currenciesList[0].targetCurrency);
//         // dispatch(Actions.checkAllowance({value: allowance}));     
//         return await sc.signInToServer(dispatch);
//     } catch(e) {
// 		console.error('onConnect', e);
//         dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
//     }finally {
//         dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
//     }
// };

const amountChanged = (dispatch:Dispatch<AnyAction>,v?: string) => {
    dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
    dispatch(Actions.amountChanged({value: v}));
};

const tokenSelected = async (dispatch:Dispatch<AnyAction>,targetNet: string,v?: any,addr?: AddressDetails[],pair?: PairedAddress,history?: any) => {
    try{
        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        dispatch(addAction(CommonActions.WAITING, { source: 'swap' }));
        let details = addr?.find(e=>e.symbol === v);
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        // const currenciesList = await sc.getSourceCurrencies(dispatch,network);
        // if(!pair){
        //     history.push(0);
        // }
        // if(currenciesList.length > 0){
        //     dispatch(Actions.swapDetails({value: currenciesList}))                
        // }
        if(details){
            dispatch(Actions.tokenSelected({value: v || {},details}));
            await sc.getAvailableLiquidity(dispatch,details?.address, details?.currency)
            // const allowance = await sc.checkAllowance(dispatch,details.currency,'5', currenciesList[0].targetCurrency);
            // dispatch(Actions.checkAllowance({value: allowance}))
        }
    }catch(e) {
        if(!!(e as Error).message){
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }      
};

// TODO: Why there are two different onSwap s?
const onSwap = async (
    dispatch:Dispatch<AnyAction>,
    amount:string,balance:string,currency:string,targetNet: string,
    v: (v:string)=>void,y: (v:string)=>void,
    allowanceRequired:boolean,showModal: () => void
    ) => {
    try {
		// TODO: Get rid of 
		allowanceRequired = false;

        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        dispatch(addAction(CommonActions.WAITING, { source: 'swap' }));
        const client = inject<BridgeClient>(BridgeClient);        
        ValidationUtils.isTrue(!(Number(balance) < Number(amount) ),'Not anough balance for this transaction');
        const res = await client.swap(dispatch,currency, amount, targetNet,'0');
       
        if( res?.status === 'success'){
            if(allowanceRequired){ // Should not happen
                // dispatch(Actions.approvalSuccess({ }));
                // const allowance = await client.checkAllowance(dispatch,currency,'5', targetNet);
                // if(allowance){
                //     y('Approval Successful, You can now go on to swap your transaction.');
                //     dispatch(Actions.checkAllowance({value: false}))
                // }
            }else{
                y('Swap Successful, Kindly View Withdrawal Items for item checkout.');
                dispatch(Actions.swapSuccess({message: res.status,swapId: res.txId, itemId: res.itemId }));
                setTimeout(
                   () => showModal()
                ,1000)
                return
            }
        }
        v('error occured')
    }catch(e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    }finally {
        const sc = inject<BridgeClient>(BridgeClient);
        await sc.getUserWithdrawItems(dispatch,currency);  
       dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

// const checkTxStatus = async (dispatch: Dispatch<AnyAction>,txId:string,sendNetwork:string,timestamp:number) => {
//     try {
//         const sc = inject<BridgeClient>(BridgeClient);
//         const res = await sc.checkTxStatus(dispatch,txId,sendNetwork,timestamp);
//         if(res){
//             return res;
//         }
//         return '';
//     }catch(e) {
// 		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
//     }finally {
//         dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
//     }
// };


// const checkifItemIsCreated = async (dispatch: Dispatch<AnyAction>,itemId:string) => {
//     try {
//         const sc = inject<BridgeClient>(BridgeClient);
//         const connect = inject<Connect>(Connect);
//         const network = connect.network() as any;
//         const items = await sc.getUserWithdrawItems(dispatch,network);
//         if(items && items.withdrawableBalanceItems.length > 0){
//             const findMatch = items.withdrawableBalanceItems.filter((e:any)=>e.receiveTransactionId === itemId);
//             if(findMatch.length > 0){
//                 dispatch(Actions.widthdrawalItemsFetched({items: items.withdrawableBalanceItems}));
//                 return 'created'
//             }
//         }
//         return '';
//     }catch(e) {
// 		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
//     }finally {
//         dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
//     }
// };

export const openPanelHandler = (dispatch: Dispatch<AnyAction>) => {
    dispatch(Actions.triggerPanel({}));
};

function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): swapPageProps {
    const state = (appState.ui.swapPage || {}) as swapPageProps;
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {};

    return {
        symbol: address.symbol,
        network: address.network,
        baseAddress: state.baseAddress,
        baseSignature: state.baseSignature,
        destAddress: state.destAddress,
        destSignature: state.destSignature,
        balance: address.balance,
        amount: state.amount,
        addresses: addr,
        selectedToken: state.selectedToken,
        swapDetails: state.swapDetails,
        pairedAddress: state.pairedAddress,
        destNetwork: state.destNetwork,
        baseNetwork: state.baseNetwork,
        currenciesDetails: state.currenciesDetails,
        currency: address.currency,
        message: state.message,
        availableLiquidity: state.availableLiquidity,
        userWithdrawalItems: state.userWithdrawalItems || [],
        allowanceRequired: state.allowanceRequired,
        groupId: appState.data.state.groupInfo.groupId,
        swapId: state.swapId,
        itemId: state.itemId,
        baseSigned: state.baseSigned,
        reconnecting: state.reconnecting,
        panelOpen: state.panelOpen
    } as swapPageProps;
};

export function SwapPage () {
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [refreshing,setRefreshing] = useState(false);
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);   
    const histroy = useHistory();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, swapPageProps>(state => stateToProps(state,userAccounts));
    const withdrawals =  useSelector<BridgeAppState, UserBridgeWithdrawableBalanceItem[]>(
		state => state.data.state.balanceItems);

    // useEffect( () => {
    //     if(!pageProps.pairedAddress?.pair){
    //         histroy.goBack()
    //     }else{
    //         onConnect(dispatch);
    //     }
    // },[]);

    const onMessage = async (v:string) => {    
        addToast(v, { appearance: 'error',autoDismiss: true })        
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await tokenSelected(dispatch,pageProps.currenciesDetails.targetCurrency,pageProps.selectedToken,pageProps.addresses,pageProps.pairedAddress?.pair!,histroy);
        setRefreshing(false);
    }

    const onSuccessMessage = async (v:string) => {    
        addToast(v, { appearance: 'success',autoDismiss: true })        
    };
    let unUsedItems = withdrawals.filter(e=>e.used === '').length;
    let unUsedTotal = withdrawals.filter(e=>e.used === '').reduce((a, b) => Number(a) + Number(b.receiveAmount), 0);
    return (
        <div className="page_cont" >
            <div className="centered-body" style={styles.container}>

            <>
                <div className="body-not-centered swap swap-page">
                    <div className="header title ">  
                        <div style={styles.headerStyles}>
                            Swap Accross Chains
                            <Divider/>
                        </div>
                        <div>
                            <div className="space-out">
                                { pageProps.selectedToken && <div style={styles.textStyles} onClick={()=>handleRefresh()}> Refresh Balance Data <ReloadOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`,width: '20px'}} spin={refreshing}/> </div> }
                            </div>
                        </div>
                    </div>
                    {
                        unUsedItems > 0 ? <div className="content notif centered itemlist" style={styles.headerStyles}>You have {unUsedItems} Item(s) with {unUsedTotal} tokens ready for <span  style={styles.pointerStyle}>Withdrawal.</span></div>
                        : <>
                            <Gap size={"small"}/>
                          </>
                    }
                    <div className="pad-main-body">
                        <div className="space-out sel" >
                            <div className="header" style={styles.headerStyles}>{pageProps.network} Network to {pageProps.destNetwork === pageProps.network ? pageProps.baseNetwork : pageProps.destNetwork} </div>
                            <>
                                <select name="token" id="token" 
                                    className="content token-select" disabled={pageProps.addresses.length === 0}
                                    onChange={(e)=>tokenSelected(dispatch,pageProps.currenciesDetails.targetCurrency,e.target.value,pageProps.addresses,pageProps.pairedAddress!.pair,histroy)}
                                    value={pageProps.selectedToken}
                                    style={{...styles.textStyles,...styles.optionColor}}
                                >
                                    {!pageProps.selectedToken && <option style={{...styles.textStyles,...styles.optionColor}} value={''}>Select Token</option>}
                                    {
                                        pageProps.addresses.length > 0 ?
                                        pageProps.addresses.map(e=>
                                                <option style={{...styles.textStyles,...styles.optionColor}} value={e.symbol}>{e.symbol}</option>
                                            )
                                        : <option style={{...styles.textStyles,...styles.optionColor}} value={'Not Available'}>Not Available</option>
                                    }
                                </select>
                            </>
                        </div>
                        <div className="swap-main">
                            <div className="swap-from">
                                   <div className="sub-tit">FROM {pageProps.symbol} {pageProps.network}</div>
                                   <TextField
                                        placeholder={'0.0'}
                                        value={pageProps.amount}
                                        disabled={false}
                                        onChange={(e,v)=>amountChanged(dispatch,v)}
                                        type={'Number'}
                                    />
                            </div>

                            <div className="icon">
                                <div className="arrow"></div>
                            </div>

                            <div className="swap-from">
                                <div className="sub-tit">TO {pageProps.symbol} {pageProps.destNetwork === pageProps.network ? pageProps.baseNetwork : (pageProps.destNetwork ||  pageProps.pairedAddress?.pair.network2)}</div>
                                <TextField
                                    placeholder={'0.0'}
                                    value={(Number(pageProps.amount) - (Number(pageProps.currenciesDetails.fee)|| 0)).toString()}
                                    disabled={true}
                                    onChange={(e,v)=>amountChanged(dispatch,v)}
                                    type={'Number'}
                                />
                            </div>
                        </div>
                        {
                            !pageProps.network && <div className="content notif">{ !pageProps.network ? 'Reconnect to MetaMask' : undefined}</div>
                        }
                        {
                              pageProps.network && (!pageProps.selectedToken ? <div className="content notif">Select a Token to swap from the options above</div>
                              :  <div className="content" style={styles.headerStyles}>You currently have {formatter.format(pageProps.balance,true)} amount of {pageProps.symbol} available for swap.</div>)  
                        }
                        <div>
                            <div className="space-out swap-entry swap-buttons">
                                <div style={styles.btnCont}>
                                    <OutlinedBtn
                                        text={'SWAP'}
                                        onClick={
                                            () => onSwap(dispatch,pageProps.amount,pageProps.balance,pageProps.swapDetails?.currency!,pageProps.currenciesDetails.targetCurrency,onMessage,onSuccessMessage,pageProps.allowanceRequired,showModal)
                                        }
                                        disabled={!pageProps.selectedToken || (Number(pageProps.amount) <= 0) || pageProps.allowanceRequired}
                                        propStyle={
                                            {color: 'white'}
                                        }
                                    />
                                </div>
                                
                                {
                                    pageProps.allowanceRequired &&
                                        <div style={styles.btnCont}>
                                            <OutlinedBtn
                                                text={'APPROVE'}
                                                onClick={
                                                    () => onSwap(dispatch,pageProps.amount,pageProps.balance,pageProps.swapDetails?.currency!,pageProps.currenciesDetails.targetCurrency,onMessage,onSuccessMessage,pageProps.allowanceRequired,showModal)
                                                }pageProps
                                                disabled={!pageProps.selectedToken || (Number(pageProps.amount) <= 0) || !pageProps.allowanceRequired}
                                            />
                                        </div>
                                }
                                
                            </div>
                        </div>
                        <Gap size="small"/>
                    </div>
                    <div className="pad-main-body second">
                        <div>
                            <div className="space-out" style={styles.headerStyles}>
                                <span>Available {pageProps.selectedToken} Liquidity in {pageProps.network} </span>
                                <span className="bold">{formatter.format(pageProps.availableLiquidity,true)}</span>
                            </div>
                        </div>

                        <div> 
                            <div className="space-out" style={styles.headerStyles}>
                                <span>Fee</span>
                                <span className="bold">{pageProps.currenciesDetails.fee || 0}</span>
                            </div>
                        </div> 
                    </div>
                </div>
                <div className="bottom-stick">
                    <div>Note:  Claim your balance from your withdrawal items</div>
                </div>
            </>
        </div>
        </div>
    )
}

const themedStyles = (theme: any) => ({
    container: {
        width: '85%'
    },
    btnCont: {
        width: '40%'
    },
    btnStyle:  {
        root: [
          {
            padding: "1.3rem 2.5rem",
            backgroundColor: theme.get(Theme.Button.btnPrimary),
            borderColor: theme.get(Theme.Button.btnPrimary) || '#ceaa69',
            color: theme.get(Theme.Button.btnPrimaryTextColor),
            height: '40px',
          }
        ]
    },
    headerStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    textStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    optionColor: {
        backgroundColor: theme.get(Theme.Colors.bkgShade0)
    },
    pointerStyle: {
        cursor: "pointer",
        color:  theme.get(Theme.Button.btnPrimary) || '#ceaa69',
    }
});