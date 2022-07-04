import React, { useState,useContext, useEffect } from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from './../../common/BridgeAppState';
import { AppAccountState } from 'common-containers';
import { SignedPairAddress,inject, PairedAddress, BRIDGE_V1_CONTRACTS, } from 'types';
import { Big } from 'big.js';
//@ts-ignore
import { AssetsSelector, TextInput } from 'component-library';
import { AnyAction, Dispatch } from "redux";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    Gap
    // @ts-ignore
} from 'desktop-components-library';
import { Utils,supportedNetworks,NetworkDropdown,ChainEventBase, ChainEventStatus } from 'types';
import 'antd/dist/antd.css';
import { BridgeClient } from "./../../clients/BridgeClient";
import { addAction, CommonActions } from "./../../common/Actions";
import { Card } from "react-bootstrap";
import { approvalKey } from 'common-containers/dist/chain/ApprovableButtonWrapper';
import { SearchButton,NotificationActionButton } from './liquidityActionButton';
import { UnifyreExtensionWeb3Client,Connect } from 'unifyre-extension-web3-retrofit';
import { Dropdown } from "react-bootstrap";
import { changeNetwork } from "./../Main/handler";
import { useBoolean } from '@fluentui/react-hooks';
import { Timeline } from 'antd';
import { AddressDetails } from 'unifyre-extension-sdk/dist/client/model/AppUserProfile';
import { useHistory } from 'react-router';

export interface notificationServiceProps{
    network: string,
    symbol: string,
    baseAddress: string,
    pairAddres?: PairedAddress,
    currency: string,
    pairedAddress?: SignedPairAddress,
    amount: string,
    baseSignature: string,
    destAddress: string,
    destNetwork: string,
    baseNetwork: string,
    balance:string,
    transactionId: string,
    networkOptions?: NetworkDropdown[];
    destSignature: string,
    selectedToken: string,
    userAddress: string,
    addresses: AddressDetails[],
    availableLiquidity: string,
    TotalAvailableLiquidity: string,
    allowanceRequired: boolean,
    reconnecting: boolean,
    liquidityData: [string, string][],
    AllowedNetworks:string[],
    contractAddress: string,
    allAddresses: AddressDetails[];
    txId: string,
    lowThreshold: string,
    highThreshold: string,
    listenerUrl: string,
    projectAdminEmail:string,
    loadedInfo:any,
    txStatus: {
        swapStatus: string,
        swapTimeStamp: string,
        withdrawalItemStatus: string,
        withdrawalItemTimeStamp: string,
        withdrawn: boolean
    },
}

const tokenSelectedThunk = createAsyncThunk('liquidity/tokenSelected', async (payload: { currency: string }, ctx) => {
	const state = ctx.getState() as BridgeAppState;
    try {
        ctx.dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
		const addr = state.connection.account.user?.userId;
		if (!addr) {
			return;
		}
        const sc = inject<BridgeClient>(BridgeClient);
		await sc.getUserLiquidity(ctx.dispatch, addr, payload?.currency);
      
		// Get available liquidity for all pairs of the selected currency
		const allCurrencies = new Set<string>();
		state.data.state.currencyPairs.filter(cp =>
			cp.sourceCurrency === payload?.currency ||
			cp.targetCurrency === payload?.currency).forEach(cp => {
				allCurrencies.add(cp.sourceCurrency);
				allCurrencies.add(cp.targetCurrency);
			});

        // Use routing table to identify pairs
        (state.data.state.routingTable[payload.currency]?.items || []).forEach(gc => {
            allCurrencies.add(gc.currency);
        });
        
		for(const c of Array.from(allCurrencies)) {
			await sc.getAvailableLiquidity(ctx.dispatch, addr, c);
		}
        await getNotificationDetails(ctx.dispatch,payload?.currency)
        ctx.dispatch(Actions.tokenSelected({value: payload?.currency}));
    } catch(e) {
		ctx.dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally {
        ctx.dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }      
});

async function saveDetails(dispatch: Dispatch<AnyAction>,
    lowThreshold:string,highThreshold:string,
    listenerUrl:string,projectAdminEmail:string,currency:string,success:(v:string)=>void,error:(v:string)=>void
    ) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
        const client = inject<BridgeClient>(BridgeClient);
        const res = await client.saveTokenNotificationDetails(
            dispatch,projectAdminEmail,currency,highThreshold,lowThreshold,listenerUrl
        )
        if(!!res?.currency){
            dispatch(Actions.lowThresholdChanged({value: res.lowerthreshold}))
            dispatch(Actions.highThresholdChanged({value: res.upperthreshold}))
            dispatch(Actions.projectAdminEmailChanged({value: res.projectAdminEmail}))
            dispatch(Actions.listenerUrlChanged({value: res.listenerUrl}))
        }
        success('notification details saved successfully')
        await getNotificationDetails(dispatch,currency)
        return res;   
    } catch (e) {
        dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        success('An error occured processing.')
    } finally{
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }    
}

async function updateDetails(dispatch: Dispatch<AnyAction>,
    lowThreshold:string,highThreshold:string,
    listenerUrl:string,projectAdminEmail:string,currency:string,success:(v:string)=>void,error:(v:string)=>void
    ) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
        const client = inject<BridgeClient>(BridgeClient);
        const res = await client.updateTokenNotificationDetails(
            dispatch,projectAdminEmail,currency,highThreshold,lowThreshold,listenerUrl
        )
        if(!!res?.currency){
            dispatch(Actions.lowThresholdChanged({value: res.lowerthreshold}))
            dispatch(Actions.highThresholdChanged({value: res.upperthreshold}))
            dispatch(Actions.projectAdminEmailChanged({value: res.projectAdminEmail}))
            dispatch(Actions.listenerUrlChanged({value: res.listenerUrl}))
        }
        success('update successful')
        await getNotificationDetails(dispatch,currency)
        return res;   
    } catch (e) {
        success('An error occured processing.')
        dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally{
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }    
}

async function getNotificationDetails(dispatch: Dispatch<AnyAction>,currency:string) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
        const client = inject<BridgeClient>(BridgeClient);
        const res = await client.getTokenNotificationDetails(dispatch,currency)
        console.log(res,'result')
        if(!!res?.currency){
            dispatch(Actions.loadedInfo({value: res}))
            dispatch(Actions.lowThresholdChanged({value: res.lowerthreshold}))
            dispatch(Actions.highThresholdChanged({value: res.upperthreshold}))
            dispatch(Actions.projectAdminEmailChanged({value: res.projectAdminEmail}))
            dispatch(Actions.listenerUrlChanged({value: res.listenerUrl}))
        }else{
            dispatch(Actions.loadedInfo({value: res}))
            dispatch(Actions.lowThresholdChanged({value: ''}))
            dispatch(Actions.highThresholdChanged({value: ''}))
            dispatch(Actions.projectAdminEmailChanged({value: ''}))
            dispatch(Actions.listenerUrlChanged({value: ''}))
        }
        return res;
    } catch(e){
        dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally{
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

async function switchNetwork(dispatch: Dispatch<AnyAction>, e: string) {
	try {
        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
        await changeNetwork(dispatch,e);
	} catch(e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}  

function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): notificationServiceProps {
    const state = (appState.ui.notificationServicePage|| {}) as notificationServiceProps;
	const bridgeCurrencies = appState.data.state.groupInfo?.bridgeCurrencies || [] as any;
	const allNetworks = bridgeCurrencies.map(c => c.split(':')[0]);
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    let address = addr[0] || {};
    const currentIdx = allNetworks.indexOf(address.network || 'N/A');
    const currNet = address.network;
    let currency = state.currency || (currentIdx >= 0 ? bridgeCurrencies[currentIdx] : '');
    address = (addr.filter(e=> e.currency === (currency) || e.currency === (`${currNet}:${currency.split(':')[1]}`)) || [])[0] || address as any;
    currency = address ? address.currency : addr[0].currency;
    const contractAddress = BRIDGE_V1_CONTRACTS[address.network]; // TODO: Get from appconfig
    const allocation = appState.data.approval.approvals[approvalKey(address.address, contractAddress, currency)];
	const currentNetwork = supportedNetworks()[address.network] || {};
    const Pairs = (appState.data.state.currencyPairs.filter(p => p.sourceCurrency === currency || p.targetCurrency === currency)||[])
    .map(e => e.targetNetwork);
    (appState.data.state.routingTable[currency]?.items || []).forEach(c => Pairs.push(c.network));
    const AllowedNetworks = Array.from(new Set(Pairs));
    const networkOptions = Object.values(supportedNetworks())
    .filter(n => allNetworks.indexOf(n.key) >= 0 && n.mainnet === currentNetwork.mainnet && n.active === true && AllowedNetworks.includes(n.key));
    const liqArr = Object.entries(appState.data.state.bridgeLiquidity);
    const liquidityData = ( liqArr.length > 0 && liqArr.filter((e:any) => e[0]?.split(':')[1] === currency?.split(':')[1])  || []);
    const TotalAvailableLiquidity = appState.data.state
		.bridgeLiquidity[currency || 'N/A'] || '0';
    return {
        ...state,
        symbol: address.symbol,
        network: address.network,
        baseAddress: state.baseAddress,
        baseSignature: state.baseSignature,
        destAddress: state.destAddress,
        destSignature: state.destSignature,
        balance: address.balance,
        amount: state.amount,
        networkOptions: networkOptions,
        addresses: addr,
        AllowedNetworks,
        transactionId: state.transactionId,
        contractAddress: contractAddress,
        selectedToken: address.symbol,
        currency: address?.currency,
        userAddress: address.address,
        pairedAddress: state.pairedAddress,
        destNetwork: state.destNetwork,
        baseNetwork: state.baseNetwork,
        availableLiquidity: state.availableLiquidity,
        liquidityData,
        txId:state.txId,
        lowThreshold: state.lowThreshold,
        highThreshold: state.highThreshold,
        listenerUrl: state.listenerUrl,
        projectAdminEmail:state.projectAdminEmail,
        txStatus: state.txStatus,
        TotalAvailableLiquidity: TotalAvailableLiquidity,
        allowanceRequired: new Big(allocation || '0').lte(new Big('0')),
        reconnecting: state.reconnecting
    } as notificationServiceProps;
};

export const notificationServicePageSlice = createSlice({
    name: 'notificationServicePage',
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
        contractAddress: '',
        userAddress: '',
        transactionId: '',
        txId:'',
        TotalAvailableLiquidity: '0',
        AllowedNetworks: [],
        liquidityData: [],
        allAddresses: [],
        txStatus: {
            swapStatus: '',
            swapTimeStamp: '',
            withdrawalItemStatus: '',
            withdrawalItemTimeStamp: '',
            withdrawn: false
        },
        lowThreshold: '',
        highThreshold: '',
        listenerUrl: '',
        projectAdminEmail: '',
        loadedInfo: {},
        reconnecting: false
    } as notificationServiceProps,
    reducers: {
        txIdChanged: (state, action) => {
            state.txId = action.payload.tx;
            state.txStatus = {
                swapStatus: '',
                swapTimeStamp: '',
                withdrawalItemStatus: '',
                withdrawalItemTimeStamp: '',
                withdrawn: false
            }
        },
        loadedInfo:(state, action) => {
            state.loadedInfo = action.payload.value;
        },
        lowThresholdChanged: (state, action) => {
            state.lowThreshold = action.payload.value;
        },
        highThresholdChanged: (state, action) => {
            state.highThreshold = action.payload.value;
        },
        listenerUrlChanged: (state, action) => {
            state.listenerUrl = action.payload.value;
        },
        projectAdminEmailChanged: (state, action) => {
            state.projectAdminEmail = action.payload.value;
        },
        updateTxStatus: (state, action) => {
            switch (action.payload.field){
                case 'swap':
                    state.txStatus.swapStatus = action.payload.value;
                    state.txStatus.swapTimeStamp = action.payload.time
                    return
                case 'withdrawalItem':
                    state.txStatus.withdrawalItemStatus = action.payload.value;
                    state.txStatus.withdrawalItemTimeStamp = action.payload.time;
                    state.txStatus.withdrawn = action.payload.withdrawn;
                    return
                default: return
            }
        },
        currencyChanged: (state, action) => {
			state.currency = action.payload.currency;
		},
        signFirstPairAddress: (state,action) => {

        },
        onDestinationNetworkChanged:(state,action) => {
            state.destNetwork = action.payload.value
        },
        onAddressChanged: (state,action) => {
            state.destAddress = action.payload.value
        },
        loadedUserPairs: (state,action) => {
            state.pairedAddress = action.payload.pairedAddress;
            state.baseAddress = action.payload.pairedAddress.pair?.address1;
            state.destAddress = action.payload.pairedAddress.pair?.address2;
            state.baseSignature=action.payload.pairedAddress.signature1;
            state.destSignature=action.payload.pairedAddress.signature2;
            state.network= action.payload.pairedAddress.pair?.network1;
            // state.destNetwork= action.payload.pairedAddress.pair?.network2 || state.destNetwork;
            state.baseNetwork= action.payload.pairedAddress.pair?.network1;
            state.reconnecting = false;         
        },
        checkAllowance: (state,action) => {
            state.allowanceRequired = action.payload.value
        },
        widthdrawalItemsFetched: (state,action) => {
            state.allowanceRequired = action.payload.value
        },
        swapDetails: (state,action) => {

        },
        tokenSelected: (state,action) => {
            state.selectedToken = action.payload.value;
        },
        amountChanged: (state,action) => {
            state.amount= action.payload.value
        },
        approvalSuccess: (state,action) => {
            state.allowanceRequired=false
        },
        swapSuccess: (state,action) => {

        },
        addLiquiditySuccess: (state,action) => {
            state.amount= '0';
            state.transactionId= action.payload.txId
        },
        removeLiquiditySuccess: (state,action) => {
            state.amount= '0';
            state.transactionId= action.payload.txId
        },
        setMax: (state,action) => {
            state.amount = action.payload.balance
        }
    },
    extraReducers: builder => {
        builder.addCase('connect/reconnected', (state, action) => {
            state.reconnecting = true;
        });
        builder.addCase('mainPage/loadedUserPairs', (state, action) => {
            //@ts-ignore
            state.pairedAddress = action.payload.pairedAddress;
        });
        builder.addCase('USER_AVAILABLE_LIQUIDITY_FOR_TOKEN', (state, action) => {            
            //@ts-ignore
            state.availableLiquidity= action.payload.liquidity;
        });
    }
});

const Actions = notificationServicePageSlice.actions;

export function NotificationServicePage() {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);   
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, notificationServiceProps>(state => stateToProps(state,userAccounts));
    const loadedProps =  useSelector<BridgeAppState, notificationServiceProps>(state => state.ui.notificationServicePage.loadedInfo);
    const history = useHistory();
    const reqdentrd = pageProps.lowThreshold && pageProps.highThreshold && pageProps.projectAdminEmail
    const edited = loadedProps?.projectAdminEmail && (pageProps.lowThreshold != loadedProps.lowThreshold || pageProps.highThreshold != loadedProps.highThreshold)
    const assets = useSelector<BridgeAppState, any>(appS => appS.data.state.filteredAssets);

    useEffect(()=>{
		if (pageProps.currency) {
			dispatch(tokenSelectedThunk({currency: pageProps.currency}));
		}
	}, [pageProps.currency])
    
    console.log('NOTMGTPRPS',pageProps);

    const onErrorMessage = async (v:string) => {    
        addToast(v, { appearance: 'error',autoDismiss: true })        
    };

    const onSuccessMessage = async (v:string) => {    
        addToast(v, { appearance: 'success',autoDismiss: true })        
    };
    
    return (
        <div className="centered-body liquidity1" style={styles.maincontainer} >
            <Card className="text-center">
                <div>
                    <div className="body-not-centered swap liquidity">
                        <small className="text-vary-color mb-5 head">
                                Manage Swap Transaction
                                <hr className="mini-underline"></hr>
                        </small>
                    </div>
                    <div  style={styles.container}>
                        <div className="pad-main-body">
                            <div className="text-sec text-left">Select Bridge Token</div>
                            <AssetsSelector 
                                assets={assets || []}
                                network={pageProps.network}
							    defaultLogo={Utils.networkLogo(pageProps.network)}
                                onChange={(v:any)=> dispatch(Actions.currencyChanged({currency: v.currency,history}))}
                                selectedCurrency={pageProps.currency}
                            />
                                
                            <div className="text-sec text-left">Network</div>
                            <div className="content">
                                <div>
                                    <Dropdown className="assets-dropdown liquidity-dropdown">
                                        <Dropdown.Toggle variant="pri" id="dropdown-basic" className={''}>
                                            <span className={'bodyText'}>
                                                {pageProps.network}
                                            </span>
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="text-sec text-left">Enter Low Threshold</div>
                            <TextInput
                                onChange={(v:any)=>dispatch(Actions.lowThresholdChanged({value: v.target.value}))}
                                style={{"fontSize": "22px"}}
                                type={"number"}
                                value={pageProps.lowThreshold}
                            />
                            <div className="text-sec text-left">Enter High Threshold</div>
                            <TextInput
                                onChange={(v:any)=>dispatch(Actions.highThresholdChanged({value: v.target.value}))}
                                style={{"fontSize": "22px"}}
                                type={"number"}
                                value={pageProps.highThreshold}
                            />
                            <div className="text-sec text-left">Enter Listener(Zapier) Url</div>
                            <TextInput
                                onChange={(v:any)=>dispatch(Actions.listenerUrlChanged({value: v.target.value}))}
                                style={{"fontSize": "22px"}}
                                value={pageProps.listenerUrl}
                            />
                            <div className="text-sec text-left">Enter projectAdminEmail to Notify</div>
                            <TextInput
                                onChange={(v:any)=>dispatch(Actions.projectAdminEmailChanged({value: v.target.value}))}
                                style={{"fontSize": "22px"}}
                                value={pageProps.projectAdminEmail}
                            />
                            </div>                              
                        </div>
                        <Gap size="small"/>
                        <div className="liqu-details">
                            {
                                <NotificationActionButton
                                    onclick = {()=>edited?
                                        updateDetails(
                                        dispatch,pageProps.lowThreshold,pageProps.highThreshold,
                                        pageProps.listenerUrl,pageProps.projectAdminEmail,pageProps.currency,onSuccessMessage,onErrorMessage
                                    ) : saveDetails(
                                        dispatch,pageProps.lowThreshold,pageProps.highThreshold,
                                        pageProps.listenerUrl,pageProps.projectAdminEmail,pageProps.currency,onSuccessMessage,onErrorMessage)
                                    }       
                                    disabled={edited ? false : !reqdentrd }
                                    service={edited?'UPDATE':'SAVE'}
                                />
                            }                   
                        </div>
                </div>  
            </Card>
        </div>
    )
}


//@ts-ignore
const themedStyles = (theme) => ({
    container: {
        width: '100%',
        margin: '0px auto'
    },
    maincontainer: {
        width: '70%',
        margin: '0px auto'
    },
    btnCont: {
        width: '40%'
    },
    groupAddon: {
        display: "flex",
        position: "relative" as "relative"
    },
    addon: {
        position: "absolute" as "absolute",
        right: '5%',
        display: "flex",
        height: "40%",
        alignItems: "center" as "center",
        cursor: "pointer",
        top: "15px",
        padding: "10px"
    },
    btnStyle:  {
        root: [
          {
            padding: "1.3rem 2.5rem",
            backgroundColor: theme.get(Theme.Button.btnPrimary),
            borderColor: theme.get(Theme.Button.btnPrimary) || '#ceaa69',
            color: theme.get(Theme.Button.btnPrimary),
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
    }
});
