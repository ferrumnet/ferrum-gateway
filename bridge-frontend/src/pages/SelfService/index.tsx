import React, { useState,useContext, useEffect } from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from '../../common/BridgeAppState';
import { AppAccountState } from 'common-containers';
import { SignedPairAddress,inject, PairedAddress,BRIDGE_CONTRACT,BridgeTokenConfig, inject3 } from 'types';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { Big } from 'big.js';
//@ts-ignore
import { AssetsSelector,supportedIcons,networkImages,AmountInput,TextInput } from 'component-library';
import { AnyAction, Dispatch } from "redux";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    Gap
    // @ts-ignore
} from 'desktop-components-library';
import { Utils,supportedNetworks,NetworkDropdown,ChainEventBase, ChainEventStatus } from 'types';
import 'antd/dist/antd.css';
import { BridgeClient } from "../../clients/BridgeClient";
import { addAction, CommonActions } from "../../common/Actions";
import { Card } from "react-bootstrap";
import { approvalKey } from 'common-containers/dist/chain/ApprovableButtonWrapper';
import { SearchButton } from './liquidityActionButton';
import { UnifyreExtensionWeb3Client,Connect } from 'unifyre-extension-web3-retrofit';
import { Dropdown } from "react-bootstrap";
import { changeNetwork } from "../Main/handler";
import { useBoolean } from '@fluentui/react-hooks';
import { Timeline } from 'antd';

export interface selfServiceProps{
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
    txId: string,
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
		await sc.getUserLiquidity(ctx.dispatch, addr, payload.currency);

		// Get available liquidity for all pairs of the selected currency
		const allCurrencies = new Set<string>();
		const pairs = state.data.state.currencyPairs.filter(cp =>
			cp.sourceCurrency === payload.currency ||
			cp.targetCurrency === payload.currency).forEach(cp => {
				allCurrencies.add(cp.sourceCurrency);
				allCurrencies.add(cp.targetCurrency);
			});
		for(const c of Array.from(allCurrencies)) {
			await sc.getAvailableLiquidity(ctx.dispatch, addr, c);
		}
        ctx.dispatch(Actions.tokenSelected({value: payload.currency}));
    } catch(e) {
		ctx.dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally {
        ctx.dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }      
});


async function logSwapTransaction(dispatch: Dispatch<AnyAction>,txId:string,network:string,success:(v:string)=>void) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
        const client = inject<BridgeClient>(BridgeClient);
        await client.logSwapTransaction(txId,network)
        dispatch(Actions.txIdChanged({tx: ''}))
        success('Transaction successfully added to queue, will be processed shortly')
    } catch(e){
        dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally{
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

async function getTransactionStatus(dispatch: Dispatch<AnyAction>,txId:string,network:string,onErrorMessage:(v:string)=>void) {
    try{
        dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
        const [connect2,connect,client] = inject3<Connect,UnifyreExtensionWeb3Client,BridgeClient>(Connect,UnifyreExtensionWeb3Client,BridgeClient);
        const t = await connect.getTransaction(txId);
        const receipt = await connect2.getProvider()!.web3()?.eth.getTransactionReceipt(txId);
        if(!t){
            onErrorMessage('Error fetching transaction,txId might be invalid')
            dispatch(Actions.txIdChanged({tx: ''}))
            return
        }
        const status = await client.checkTxStatus(dispatch,txId,network);
        if(status){
            if (status === 'successful'){
                const block = await connect2.getProvider()!.web3()?.eth.getBlock(t.blockHash);
                if(!!receipt?.status){
                    const items = await client.getWithdrawItems(dispatch,network);
                    const item = items.withdrawableBalanceItems.find(e=> e.receiveTransactionId ===  txId);
                    console.log(status,'status',item)
                    dispatch(Actions.updateTxStatus({"field":"swap","value":status,"time": block!.timestamp||t.timestamp}))

                    if(item && item?.id){
                        dispatch(Actions.updateTxStatus({"field":"withdrawalItem","value":item.id,"time":(new Date(item.sendTimestamp)).toString(),"withdrawn":(item.used === 'completed')}))
                        return
                    }
                    dispatch(Actions.updateTxStatus({"field":"withdrawalItem","value":'',"time":'',"withdrawn":''}))
                    return;
                }
                dispatch(Actions.updateTxStatus({"field":"swap","value":'failed',"time": block!.timestamp||t.timestamp}))
            }
            dispatch(Actions.updateTxStatus({"field":"swap","value":'pending',"time": t.timestamp}))
            return
        }else{
            dispatch(Actions.updateTxStatus({"field":"swap","value":'pending',"time": t.timestamp}))
        }
    }catch(e){
        dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    }finally{
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

function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): selfServiceProps {
    const state = (appState.ui.selfServicePage|| {}) as selfServiceProps;
	const bridgeCurrencies = appState.data.state.groupInfo?.bridgeCurrencies || [] as any;
	const allNetworks = bridgeCurrencies.map(c => c.split(':')[0]);
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    let address = addr[0] || {};
    const currentIdx = allNetworks.indexOf(address.network || 'N/A');
    const currNet = address.network;
    let currency = state.currency || (currentIdx >= 0 ? bridgeCurrencies[currentIdx] : '');
    address = (addr.filter(e=> e.currency === (currency) || e.currency === (`${currNet}:${currency.split(':')[1]}`)) || [])[0] || address as any;
    currency = address ? address.currency : addr[0].currency;
    const contractAddress = BRIDGE_CONTRACT[address.network];
    const allocation = appState.data.approval.approvals[approvalKey(address.address, contractAddress, currency)];
	const currentNetwork = supportedNetworks[address.network] || {};
    const Pairs = (appState.data.state.currencyPairs.filter(p => p.sourceCurrency === currency || p.targetCurrency === currency)||[])
    .map(e => e.targetNetwork);
    const AllowedNetworks = Array.from(new Set(Pairs));
    const networkOptions = Object.values(supportedNetworks)
    .filter(n => allNetworks.indexOf(n.key) >= 0 && n.mainnet === currentNetwork.mainnet && n.active === true && AllowedNetworks.includes(n.key));
    const liqArr = Object.entries(appState.data.state.bridgeLiquidity);
    const liquidityData = ( liqArr.length > 0 && liqArr.filter((e:any) => e[0]?.split(':')[1] === currency?.split(':')[1])  || []);
    const TotalAvailableLiquidity = appState.data.state
		.bridgeLiquidity[currency || 'N/A'] || '0';
    return {

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
        currency: address.currency,
        userAddress: address.address,
        pairedAddress: state.pairedAddress,
        destNetwork: state.destNetwork,
        baseNetwork: state.baseNetwork,
        availableLiquidity: state.availableLiquidity,
        liquidityData,
        txId:state.txId,
        txStatus: state.txStatus,
        TotalAvailableLiquidity: TotalAvailableLiquidity,
        allowanceRequired: new Big(allocation || '0').lte(new Big('0')),
        reconnecting: state.reconnecting
    } as selfServiceProps;
};

export const selfServicePageSlice = createSlice({
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
        contractAddress: '',
        userAddress: '',
        transactionId: '',
        txId:'',
        TotalAvailableLiquidity: '0',
        AllowedNetworks: [],
        liquidityData: [],
        txStatus: {
            swapStatus: '',
            swapTimeStamp: '',
            withdrawalItemStatus: '',
            withdrawalItemTimeStamp: '',
            withdrawn: false
        },
        reconnecting: false
    } as selfServiceProps,
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

const Actions = selfServicePageSlice.actions;

export function SelfServicePage() {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);   
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const Pairs =  useSelector<BridgeAppState, BridgeTokenConfig[]>(state => state.data.state.currencyPairs);
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, selfServiceProps>(state => stateToProps(state,userAccounts));
    const [refreshing,setRefreshing] = useState(false)
    const [isConfirmModalOpen, { setTrue: showConfirmModal, setFalse: hideConfirmModal }] = useBoolean(false);
    const action = window.location.pathname.split('/')[3] === 'add';

    useEffect(()=>{
		if (pageProps.currency) {
			dispatch(tokenSelectedThunk({currency: pageProps.currency}));
		}
	}, [pageProps.currency])

    console.log('LIQPRP',pageProps);

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
                            <div className="text-sec text-left">Enter Swap Transaction ID</div>
                            <TextInput
                                onChange={(v:any)=>dispatch(Actions.txIdChanged({tx: v.target.value}))}
                                style={{"fontSize": "22px"}}
                            />

                            <div className="text-sec text-left">Transaction Network</div>
                            <div className="content">
                                <div>
                                    <Dropdown className="assets-dropdown liquidity-dropdown">
                                        <Dropdown.Toggle variant="pri" id="dropdown-basic" className={''}>
                                            <span className={'bodyText'}>
                                                {pageProps.network}
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {pageProps.networkOptions?.map((asset, index) => (
                                                <Dropdown.Item eventKey={index} active={asset.key === pageProps.network} disabled={asset.key === pageProps.network} key={index} onClick={()=>{switchNetwork(dispatch,asset.key)}}>
                                                    <span>
                                                        <strong>{asset.key}</strong>
                                                    </span>
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            </div>                              
                        </div>
                        <Gap size="small"/>
                        <div>
                            {
                                (pageProps.txStatus.swapStatus === 'successful' && (pageProps.txId != '')) &&
                                <Timeline mode={'left'}>
                                    <Timeline.Item 
                                        color={pageProps.txStatus.swapStatus === 'successful' ? "green" : '#caa561'}
                                        label={(pageProps.txStatus.swapStatus === 'successful' && pageProps.txStatus.swapTimeStamp) && (new Date(Number(pageProps.txStatus.swapTimeStamp)*1000)).toLocaleString()}>
                                        {
                                            pageProps.txStatus.swapStatus === 'successful' ? 'Transaction (Swap) Processed' :
                                            pageProps.txStatus.swapStatus === 'pending' ? 'Swap Processing' : 
                                            pageProps.txStatus.swapStatus === 'failed' ? 'Swap Failed' :
                                            ''
                                        }
                                    </Timeline.Item>
                                    {
                                            <Timeline.Item 
                                                color={(pageProps.txStatus.swapStatus === 'successful' && pageProps.txStatus.withdrawalItemStatus) ? "green" : '#caa561'}
                                                label={
                                                    pageProps.txStatus.withdrawalItemTimeStamp && (new Date(pageProps.txStatus.withdrawalItemTimeStamp)).toLocaleString()
                                                }
                                            >
                                                {(pageProps.txStatus.swapStatus === 'successful' && pageProps.txStatus.withdrawalItemStatus) && 'Withdrawal Item Generated'}
                                                {
                                                    (pageProps.txStatus.swapStatus === 'successful' && !pageProps.txStatus.withdrawalItemStatus) && 
                                                    <div>
                                                        <p>Withdrawal Item Not Generated</p>
                                                        <SearchButton
                                                            onclick = {()=>logSwapTransaction(dispatch,pageProps.txId,pageProps.network,onSuccessMessage)}                                        
                                                            disabled={(pageProps.txId === '')}
                                                            service={'logTx'}
                                                            style={
                                                                {
                                                                    "padding": "5px !important",
                                                                    "marginTop": "1px !important",
                                                                    "width": "50%",
                                                                    "margin": "0px"
                                                                }
                                                            }                    
                                                        />
                                                    </div>
                                                }
                                            </Timeline.Item>
                                    }
                                    {
                                        (pageProps.txStatus.swapStatus === 'successful' && pageProps.txStatus.withdrawalItemStatus) &&
                                        <Timeline.Item
                                            color={(pageProps.txStatus.withdrawn) ? "green" : '#caa561'}

                                        >
                                            {
                                                    pageProps.txStatus.withdrawn ? 'Swap Withdrawn' : 'Withdrawal generated and not withdrawn'
                                            }
                                        </Timeline.Item>
                                    }  
                                </Timeline>
                            }   
                        </div>
                        <div className="liqu-details">
                            {
                                !(pageProps.txStatus.swapStatus === 'successful' && (pageProps.txId != '')) &&
                                <SearchButton
                                    onclick = {()=>getTransactionStatus(dispatch,pageProps.txId,pageProps.network,onErrorMessage)}       
                                    disabled={(pageProps.txId === '')}
                                    service={'search'}
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