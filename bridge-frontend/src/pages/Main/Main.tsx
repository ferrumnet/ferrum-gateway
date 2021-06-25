import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
//@ts-ignore
import { OutlinedBtn,networkImages,AssetsSelector, NetworkSwitch,AmountInput,supportedIcons} from 'component-library';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from '../../common/BridgeAppState';
import { PairedAddress,SignedPairAddress, supportedNetworks, NetworkDropdown,FRM, getEnv } from 'types';
import { AppAccountState } from 'common-containers';
import {IConnectViewProps,addressesForUser, AppState } from 'common-containers';
import { Steps } from 'antd';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import {SwapModal} from './../../components/swapModal';
import { useBoolean } from '@fluentui/react-hooks';
import { useToasts } from 'react-toast-notifications';
import {
    reconnect,fetchSourceCurrencies,connect,checkTxStatus,checkifItemIsCreated,
    onSwap, executeWithdraw,changeNetwork,updateData,resetNetworks,addToken,onDestinationNetworkChanged
} from './handler';
import { Alert } from 'antd';
import { ConfirmationModal } from '../../components/confirmationModal';
import { WithdrawNoti } from '../../components/withdrawalNoti';
import { LoadingOutlined } from '@ant-design/icons';
import { openPanelHandler } from './../Swap';
import { message, Result } from 'antd';
import { Utils } from 'types';
import {SidePanelProps} from './../../components/SidePanel';
import { Card, Button } from "react-bootstrap";
import { InputGroup, FormControl, Form } from "react-bootstrap";
import { PlusOutlined } from '@ant-design/icons';
import {SidePanelSlice} from './../../components/SidePanel';
import { Networks } from '../../common/Utils';

const IS_TEST = true;

const { Step } = Steps;

export interface MainPageProps {
    baseConnected: boolean,
    destConnected: boolean,
    baseSigned: boolean,
    baseSignature: string,
    destSignature: string,
    destSigned: boolean,
    baseAddress: string,
    destAddress: string,
    destNetwork: string,
    pairVerified: boolean,
    symbol?: string,
    currency?: string,
    network: string,
    destCurrency: string,
    currentNetwork?: string,
    baseNetwork?: string,
    isPaired: boolean,
    pairedAddress: PairedAddress,
    signedPairedAddress?: SignedPairAddress,
    pairedAddresses?: SignedPairAddress,
    groupId: string,
    amount:string,
    reconnecting?: boolean,
    dataLoaded: boolean,
    addresses: AddressDetails[],
    selectedToken: string,
    availableLiquidity: string,
    currencyList: [],
    allowanceRequired: boolean,
    swapId: string,
    tokenValid: boolean,
    currenciesDetails: any,
    itemId: string,
    swapWithdrawNetwork: string,
    isNetworkReverse: boolean,
    progressStatus: number,
    withdrawSuccess: boolean
}



export const MainPageSlice = createSlice({
    name: 'mainPage',
    initialState: {
        baseConnected: false,
        destConnected: false,
        baseSigned:false,
        destSigned:false,
        pairVerified: false,
        baseAddress: '',
        destAddress: '',
        destSignature: '',
        destCurrency: '',
        baseSignature: '',
        destNetwork: '',
        network: 'ETHEREUM',
        isPaired: false,
        addresses: [],
        pairedAddress: {
            address1: '',
            address2: '',
            network1: '',
            network2: ''
        },
        tokenValid: true,
        connected: false,
        groupId: '',
        reconnecting: false,
        dataLoaded: false,
        selectedToken: '',
        currencyList: [],
        allowanceRequired:true,
        availableLiquidity: '',
        amount:'',
        swapId: '',
        itemId: '',
        isNetworkReverse: false,
        currenciesDetails: {},
        swapWithdrawNetwork: '',
        progressStatus: 1,
        withdrawSuccess: false
    } as MainPageProps,
    reducers: {
        pairAddresses: (state,action) => {
            if(state.pairedAddress){
                state.pairedAddress.address1 = action.payload.address;
                state.pairedAddress.network1 = action.payload.network || '';
                state.pairedAddress.address2 = state.destAddress;
                state.pairedAddress.network2 = state.destNetwork;
                state.isPaired = true;
            }
        },
        onDestinationNetworkChanged:(state,action) => {
            state.destNetwork = action.payload.value;
            state.destCurrency = action.payload.currency
        },
        onAddressChanged: (state,action) => {
            state.destAddress = action.payload.value
        },
        addBaseAddressSignature: (state,action) => {
            state.baseSignature = action.payload.sign;
            state.baseSigned = true;
            state.pairedAddresses = {signature2: state.pairedAddresses?.signature2||'',signature1: action.payload.sign,pair:action.payload.pair}
        },
        addDestAddressSignature: (state,action) => {
            state.destSignature = action.payload.sign;
            state.destSigned = true
        },
        reconnected: (state,action) => {
            state.reconnecting = false;
        },
        loadedUserPairs: (state,action) => {
            state.signedPairedAddress = action.payload.pairedAddress;
            state.pairedAddress = action.payload.pairedAddress;
            state.baseAddress = action.payload.pairedAddress.pair?.address1 || state.pairedAddress?.address1;
            state.destAddress = action.payload.pairedAddress.pair?.address2;
            state.baseSignature=action.payload.pairedAddress.signature1;
            state.destSignature=action.payload.pairedAddress.signature2;
            state.isPaired=action.payload.pairedAddress.pair?.address2 ?  true : false;
            state.baseSigned=action.payload.pairedAddress.signature1 ? true: false;
            state.network= action.payload.pairedAddress.pair?.network1;
            state.baseNetwork=  action.payload.pairedAddress.pair?.network2 ?
                                action.payload.pairedAddress.pair?.network2 : state.baseNetwork || (state.pairedAddress?.network1); 
            state.reconnecting = false;         
        },
        resetPair: (state,action) => {
            state.isPaired= false;
        },
        validateToken: (state,action) => {
            state.tokenValid= action.payload.value;
        },
        bridgeInitSuccess: (state,action) => {
            state.pairedAddress = {...state.pairedAddress,address1: action.payload.address1,network1:action.payload.network1}
        },
        swapSuccess: (state,action) => {
            state.amount= '';
            state.swapId= action.payload.swapId;
            state.itemId= action.payload.itemId;
            state.swapWithdrawNetwork= state.destNetwork;
        },
        fetchedSourceCurrencies: (state,action) => {
            state.currencyList = action.payload.currencies;
            state.currenciesDetails = action.payload?.currencies;
        },
        dataLoaded: (state,action) => {
            state.dataLoaded = true;
            state.destNetwork = state.currenciesDetails?.targetNetwork
        },
        destNetworkChanged: (state,action) => {
            state.destNetwork = action.payload.value;
            state.destCurrency = action.payload.currency
        },
        tokenSelected: (state,action) => {            
            state.selectedToken= action.payload.value != '' ? action.payload.value : state.addresses[0].symbol;
            state.currenciesDetails = action.payload.details;
        },
        checkAllowance: (state,action) => {
            state.allowanceRequired = action.payload.value
        },
        amountChanged: (state,action) => {
            state.amount= action.payload.value
        },
        resetDestNetwork: (state,action) => {
            state.destNetwork = action.payload.value;
            state.destCurrency = (FRM[action.payload.value] || [] as any[])[0]
        },
        changeIsNetworkReverse:(state,action) => {
            state.isNetworkReverse = !state.isNetworkReverse;
        },
        setMax:(state,action) => {
            state.amount = action.payload?.balance || '0';
        },
        resetSwap: (state,action) => {
            state.swapId = '';
            state.itemId = ''
        },
        setProgressStatus: (state,action) => {
            state.progressStatus = action.payload.status
        },
        activeWithdrawSuccess: (state,action) => {
            state.withdrawSuccess = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase('connect/reconnected', (state, action) => {
            state.reconnecting = true;
            state.isNetworkReverse = false;
        });
        builder.addCase('connect/connectionSucceeded', (state, action) => {
            state.isNetworkReverse = false;
        });
        builder.addCase('BRIDGE_AVAILABLE_LIQUIDITY_FOR_TOKEN', (state, action) => {
            //@ts-ignore
            state.availableLiquidity= action.payload.liquidity;
        });
    },
    
});

export const Actions = MainPageSlice.actions;

function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): MainPageProps {
    const state = (appState.ui.pairPage || {}) as MainPageProps;
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {};

    return {
        ...state,
        baseConnected: state.baseConnected,
        destConnected: state.destConnected,
        baseSigned: state.baseSigned,
        destSigned: state.destSigned,
        addresses: addr,
        pairVerified: state.pairVerified,
        baseAddress: address.address,
        destAddress: state.destAddress,
        destSignature: state.destSignature,
        baseSignature: state.baseSignature,
        destNetwork: state.destNetwork,
        network: address.network,
        isPaired: state.isPaired,
        groupId: appState.data.state.groupInfo.groupId,
        dataLoaded: state.dataLoaded,
        currencyList: state.currencyList,
        allowanceRequired: state.allowanceRequired,
        availableLiquidity: state.availableLiquidity,
        selectedToken: state.selectedToken || address.symbol,
        amount: state.amount,
        swapId: state.swapId,
        itemId: state.itemId,
        tokenValid: state.tokenValid,
        isNetworkReverse: state.isNetworkReverse,
        withdrawSuccess: state.withdrawSuccess
    } as MainPageProps;
}

export function ConnectBtn(props: IConnectViewProps) {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    return (
        <OutlinedBtn
            text={'Connect'}
            {...props}
            propStyle={{
                ...styles.btn,
            }}
        />
    )
}

export const ConnectBridge = () => {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const propsGroupInfo =  useSelector<BridgeAppState, any>(state => state.data.state.groupInfo);
    const pageProps =  useSelector<BridgeAppState, MainPageProps>(state => stateToProps(state,userAccounts));
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isConfirmModalOpen, { setTrue: showConfirmModal, setFalse: hideConfirmModal }] = useBoolean(false);
    const [isNotiShown, setIsNotiShown] = useState(false);
    const [isNotiModalVisible, setIsNotiModalVisible] = useState(false);
    const swapping = ((pageProps.swapId!='') && pageProps.progressStatus < 3);
    const swapSuccess = ((pageProps.swapId!='') && pageProps.progressStatus >= 3);
    const swapFailure = ((pageProps.swapId!='') && pageProps.progressStatus === -1);
    const withdrawalsProps =  useSelector<BridgeAppState, SidePanelProps>(state => state.ui.sidePanel);
    let unUsedItems = withdrawalsProps.userWithdrawalItems.filter(e=>((e.used === '') && (e.sendNetwork === pageProps.network))).length;
    const validateStep3 = ((Number(pageProps.amount) > 0)||((pageProps.swapId!='') && pageProps.progressStatus < 3));
    const allowedAndNotProcessing = (!pageProps.allowanceRequired && !swapSuccess && !swapFailure)
    const balances = useSelector<AppState<any, any, any>, AddressDetails[]>(state => 
        addressesForUser(state.connection.account?.user));

    const {dataLoaded, reconnecting} = pageProps;

    const networkOptions = Object.values(supportedNetworks)
		.filter(n => n.key !== pageProps.network && n.mainnet === !!process.env.REACT_APP_USE_MAINNET );

    useEffect(()=>{
        if(reconnecting){
            let network = networkOptions.filter(n => n.active && n.key !== pageProps.network);
            reconnect(dispatch,pageProps.selectedToken,pageProps.addresses,setIsNotiModalVisible,propsGroupInfo.defaultCurrency,network);
        }
    },[reconnecting]);

    useEffect(()=>{
        if(!connected && !reconnecting){
            connect(dispatch,setIsNotiModalVisible)
        }
    },[connected]);
    
    useEffect(()=>{
        if(!dataLoaded){
            fetchSourceCurrencies(dispatch,pageProps.selectedToken,pageProps.addresses,false,propsGroupInfo.defaultCurrency,networkOptions[0].key)
            dispatch(Actions.dataLoaded({}))
            onDestinationNetworkChanged(dispatch,networkOptions[0])
            // if(pageProps.destNetwork != resetNetworks(active,pageProps.network)){
            //     dispatch(Actions.resetDestNetwork({value:resetNetworks(active,pageProps.network)}))
            // }
        }
    }, [dataLoaded]);

    useEffect(()=>{
        if((unUsedItems > 0 && !pageProps.withdrawSuccess)){
            setIsNotiModalVisible(true)
        }
    }, [unUsedItems, pageProps.withdrawSuccess]);
 
    const inactive =   Object.keys(supportedNetworks)
		.filter(k => !supportedNetworks[k].active);
    const active =   Object.keys(supportedNetworks)
		.filter(k => supportedNetworks[k].active);

    const onWithdrawSuccessMessage = async (v:string,tx:string) => {  
        message.success({
            content: <Result
                status="success"
                title="Withdrawal Transaction Processing"
                subTitle={v}
                extra={[
                    <>
                        <div> View Transaction Status </div>
                        <a onClick={() => window.open(Utils.linkForTransaction(pageProps.network,tx), '_blank')}>{tx}</a>
                    </>,
                    <p></p>,
                    <p style={styles.point} onClick={()=>addToken(dispatch,pageProps.selectedToken,onMessage)}>
                        <PlusOutlined className="btn btn-pri" style={{color: `${theme.get(Theme.Colors.textColor)}` || "#52c41a",fontSize: '12px',padding:'5px'}}/>
                        <div>Add Token to MetaMask</div>
                    </p>,
                    <p></p>,
                    <Button key="buy" onClick={()=>{
                        message.destroy('withdr');
                        updateData(dispatch);
                        dispatch(Actions.resetSwap({}));
                        dispatch(SidePanelSlice.actions.moveToNext({step: 1}));
                        dispatch(Actions.setProgressStatus({status:1}))
                        dispatch(Actions.activeWithdrawSuccess({value: false}))
                    }}>Close</Button>
                ]}
            />,
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
            duration: 0,
            key: 'withdr'
        }, 0);  
    };


    
    const onMessage = async (v:string) => {    
        addToast(v, { appearance: 'error',autoDismiss: true })        
    };

    const onSuccessMessage = async (v:string) => {    
        addToast(v, { appearance: 'success',autoDismiss: true })        
    };

    return (
        <>
         <WithdrawNoti
            isModalVisible={isNotiModalVisible}
            setIsModalVisible={setIsNotiModalVisible}
            network={pageProps.network}
            numberOfWithdrawals={unUsedItems}
            sideCtrl={()=>openPanelHandler(dispatch)}
        />
         <ConfirmationModal
            isModalOpen={isConfirmModalOpen}
            amount={pageProps.amount}
            sourceNetwork={pageProps.network}
            destinationNatwork={pageProps.destNetwork}
            token={pageProps.selectedToken}
            destination={pageProps.addresses[0]?.address || ''}
            fee={`${Number(pageProps.currenciesDetails?.fee)*100}` || '0'}
            total={`${Number(pageProps.amount)}`}
            setIsModalClose={()=>hideConfirmModal()}
            processSwap={()=>onSwap(
                dispatch,pageProps.amount,pageProps.addresses[0].balance,pageProps.currenciesDetails?.sourceCurrency!,pageProps.destCurrency,
                onMessage,onSuccessMessage,pageProps.allowanceRequired,showModal,pageProps.network,pageProps.destNetwork,
                (v)=> dispatch(Actions.setProgressStatus({status:v})),pageProps.availableLiquidity,pageProps.selectedToken,(propsGroupInfo.fee??0)
            )}

        />
        <Card className="text-center">
            <small className="text-vary-color mb-5 head">
                    Swap Token Across chains
                    <hr className="mini-underline"></hr>
            </small>
            <div className="text-left">
             
                <label className="text-sec">Assets</label>
                <AssetsSelector 
                    assets={[pageProps.addresses.find(e=> e.currency === propsGroupInfo.defaultCurrency)]}
                    icons={supportedIcons}
                    onChange={(v:any)=> fetchSourceCurrencies(dispatch,v,pageProps.addresses,false,propsGroupInfo.defaultCurrency,pageProps.destCurrency)}
                    selectedToken={pageProps.selectedToken}
                />
                <NetworkSwitch 
                    availableNetworks={networkOptions.filter( n => n.active)}
                    suspendedNetworks={networkOptions.filter( n => !n.active)}
                    currentNetwork={supportedNetworks[pageProps.network] || {}}
                    currentDestNetwork={supportedNetworks[pageProps.destNetwork] || networkOptions[0]}
                    onNetworkChanged={(e:NetworkDropdown)=>onDestinationNetworkChanged(dispatch,e)}
                    setIsNetworkReverse={()=>dispatch(Actions.changeIsNetworkReverse({}))}
                    IsNetworkReverse={pageProps.isNetworkReverse}
                    swapping={swapping}
                />
                {
                    pageProps.isNetworkReverse &&  
                    <p style={styles.subtextError} className="text-pri">
                        <Alert
                            style={{"padding":"4.5px","fontSize":"8px"}}
                            message=""
                            description={`Switch your current Network to ${pageProps.destNetwork} \n to execute swap this way`}
                            type="error"
                        />
                    </p>
                }
                <AmountInput
                    symbol={pageProps.selectedToken}
                    amount={pageProps.amount}
                    value={pageProps.amount}
                    fee={0}
                    icons={supportedIcons}
                    addonStyle={styles.addon}
                    groupAddonStyle={styles.groupAddon}
                    balance={pageProps.addresses[0]?.balance}
                    setMax={()=>dispatch(Actions.setMax({balance: pageProps.addresses[0]?.balance,fee: 0}))}
                    onChange={ (v:any) => dispatch(Actions.amountChanged({value: v.target.value}))}
                />
                <div style={styles.inputContainer} >
                    <Form.Label className="text-sec" htmlFor="basic-url">
                        Destination Address
                    </Form.Label>
                    <InputGroup className="mb-3 transparent text-sec disabled" placeholder={'Address on destination Network'}>
                        <FormControl className={"transparent text-sec disabled"} disabled={true} defaultValue={pageProps.addresses[0]?.address} value={pageProps.addresses[0]?.address}/>
                    </InputGroup>
                    <div className="amount-rec-text">
                        <small className="text-pri d-flex align-items-center">
                            Available Liquidity On {pageProps.destNetwork} ≈ {pageProps.availableLiquidity}
                            <span className="icon-network icon-sm mx-2">
                                <img src={networkImages[pageProps.destNetwork]} alt="loading"></img>
                            </span>
                        </small>
                    </div>
                </div>
                   
            </div>
            {
                ((swapSuccess)) &&
                (
                    <div style={styles.swapBtnContainer}>
                         <Button
                            onClick={
                                (pageProps.network != pageProps.swapWithdrawNetwork) ?
                                () => changeNetwork(dispatch,pageProps.swapWithdrawNetwork,pageProps.selectedToken,pageProps.addresses) :
                                ()=>executeWithdraw(dispatch,pageProps.itemId,onWithdrawSuccessMessage,onMessage,(v)=> dispatch(Actions.setProgressStatus({status:v})))}
                            disabled={swapping || ((pageProps.network != pageProps.swapWithdrawNetwork) && pageProps.destNetwork === ('RINKEBY'||'ETHEREUM')) } 
                            className="btn-pri action btn-icon btn-connect mt-4"
                        >
                        <i className="mdi mdi-arrow-collapse"></i>{(pageProps.network != pageProps.swapWithdrawNetwork) ? 'Switch Network' : 'Withdraw'}
                        </Button>
                        {
                            ((pageProps.network != pageProps.swapWithdrawNetwork) && pageProps.destNetwork === ('RINKEBY'||'ETHEREUM')) &&
                            <p style={{...styles.manualNote}}>
                                <Alert message={`Manually Switch your Network to ${pageProps.destNetwork} from Metamask`} type="warning" showIcon />
                            </p>
                        }
                    </div>
                )
            }
            {
               allowedAndNotProcessing &&
                (
                    <div style={styles.swapBtnContainer}>
                         <Button
                             onClick={()=>showConfirmModal()}                            
                             disabled={!pageProps.selectedToken || (Number(pageProps.amount) <= 0) 
                                 || pageProps.allowanceRequired || !pageProps.tokenValid || swapping
                             } 
                            className="btn-pri action btn-icon btn-connect mt-4"
                        >
                        <i className="mdi mdi-swap-horizontal-bold"></i>{ swapping ? 'Swap Processing' : 'Swap'}
                        </Button>
                    </div>
                )
            }
            {
                (pageProps.allowanceRequired && !swapSuccess) &&
                <div style={styles.swapBtnContainer}>
                        <Button
                            onClick={
                                ()=>onSwap(
                                    dispatch,'0.5',pageProps.addresses[0].balance,pageProps.currenciesDetails.sourceCurrency!,pageProps.destCurrency,
                                    onMessage,onSuccessMessage,pageProps.allowanceRequired,showModal,pageProps.network,pageProps.destNetwork,
                                    (v) => dispatch(Actions.setProgressStatus({status:v})),pageProps.availableLiquidity,pageProps.selectedToken,(propsGroupInfo.fee??0)
                                )
                            }
                            className="btn-pri action btn-icon btn-connect mt-4"
                            disabled={!pageProps.selectedToken || !pageProps.allowanceRequired}
                        >
                            <i className="mdi mdi-lock-open-outline"></i>{'APPROVE'}
                        </Button>
                    </div>
            }
            
        </Card>
        </>
    );
};

export const SideBarContainer = () => {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const dispatch = useDispatch();
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, MainPageProps>(state => stateToProps(state,userAccounts));
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const propsGroupInfo =  useSelector<BridgeAppState, any>(state => state.data.state.groupInfo);
    const [isNotiModalVisible, setIsNotiModalVisible] = useState(false);
    const swapping = ((pageProps.swapId!='') && pageProps.progressStatus < 3);
    const validateStep3 = ((Number(pageProps.amount) > 0)||((pageProps.swapId!='') && pageProps.progressStatus < 3));
    
    return (
            <div style={styles.sideInfo} className="card">
                <>
                    <small className="text-vary-color mb-3">
                        Progress Outline
                        <hr className="mini-underline"></hr>
                    </small>
                    <div style={styles.stepsContainer}>
                        <Steps 
                            direction="vertical" 
                            current={0}
                        >
                            <Step 
                                status={connected ? "finish":"wait"} 
                                title={<div style={{...styles.stepStyle}} className="text-vary-color">
                                    {connected ? 'Wallet Connected' : 'Connect Your Wallet'}
                                </div>}
                            />
                            <Step 
                                status={!pageProps.allowanceRequired ? "finish":"wait"} 
                                title={<div style={styles.stepStyle} className="text-vary-color">{pageProps.allowanceRequired ? 'Approve Your Wallet to Swap Now':'Wallet Approved'}</div>}
                            />
                            <Step status={((!pageProps.allowanceRequired) && validateStep3) ? 
                                "finish":"wait"
                            } 
                                title={<div style={styles.stepStyle} className="text-vary-color">{((!pageProps.allowanceRequired) && validateStep3) ? 'Amount Entered' : 'Enter Swap Amount'}</div>}
                            />
                            <Step 
                                status={((pageProps.swapId!='') && (pageProps.progressStatus === 3)) ? "finish" : ((pageProps.swapId!='') && (pageProps.progressStatus < 3)) ? "process" : "wait"} 
                                title={
                                <div style={swapping ? styles.stepStyle2 : styles.stepStyle} className="text-vary-color">
                                {((pageProps.swapId!='') && (pageProps.progressStatus < 3)) ? <div onClick={()=>showModal()}>Swap Processing</div> 
                                : ((pageProps.swapId!='') && (pageProps.progressStatus === 3)) ? 'Swap Successful'
                                : 'Swap Token' }</div>}
                                icon={((pageProps.swapId!='') && pageProps.progressStatus < 3) && <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/>}  
                                description={swapping && (
                                    <div>
                                        <SwapModal
                                            swapping={swapping}
                                            status={pageProps.progressStatus}
                                            txId={pageProps.swapId}
                                            sendNetwork={pageProps.network}
                                            timestamp={Date.now()}
                                            itemId={pageProps.itemId}
                                            claim={openPanelHandler}
                                            setStatus={(v)=> dispatch(Actions.setProgressStatus({status:v}))}
                                        />
                                    </div> )
                                }
                            />
                            <Step 
                                status={(pageProps.swapId && pageProps.progressStatus === 3) ? (pageProps.network != pageProps.swapWithdrawNetwork) ? "process" : "finish" : "wait"}  
                                title={<div style={ ((pageProps.swapId && pageProps.progressStatus === 3) && (pageProps.network != pageProps.swapWithdrawNetwork)) ? styles.stepStyle2 : styles.stepStyle}>
                                    {(pageProps.swapId && pageProps.progressStatus === 3) ? (pageProps.network != pageProps.swapWithdrawNetwork) ? 'Switch Network to Withdraw' : 'Withdraw Now' : 'Switch Network & Withdraw'}</div>}
                                description={
                                    ((pageProps.swapId && pageProps.progressStatus === 3) && (pageProps.network != pageProps.swapWithdrawNetwork)) &&
                                        <p style={styles.subtextError2}>
                                            <Alert
                                                message=""
                                                description={`Switch your current Network to ${pageProps.destNetwork} to withdraw your swap`}
                                                type="error"
                                            />
                                        </p>
                                }
                            />
                        </Steps>
                    </div>
                </>
            </div>
        )
}



//@ts-ignore
const themedStyles = (theme) => ({
    container: {
        marginTop: '0%',
        width: '100%',
        justifyContent: 'center',
        display: 'flex'
    },
    centered: {
        textAlign: 'center' as 'center'
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
    point:{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center" as "center",
        alignItems: "center" as "center"
    },
    left:{
        width: '30%'
    },
    center:{
        width: '40%'
    },
    right:{
        width: '25%'
    },
    manualNote:{
        marginTop: '0.8rem',
        fontWeight: 600,
        fontSize: '12px',
        display: "flex",
        justifyContent: "center"
    },
    subtext: {
        marginTop: '0.2rem',
        fontWeight: 600,
        fontSize: '12px',
        display: "flex",
        justifyContent: "space-between"
    },
    subtextError: {
        marginTop: '0rem',
        marginBottom: '1rem',
        fontWeight: 500,
        fontSize: '12px',
        textAlign: 'center' as 'center'
    },
    subtextError2: {
        marginTop: '0.1rem',
        fontWeight: 500,
        fontSize: '10px'
    },
    error: {
        color: 'red'
    },
    tabbedBtnContainers: {
        display: "flex",
        marginTop: "2rem"
    },
    tabbedBtn: {
        minHeight: '100px',
        boxShadow: 'black -1px 3px 11px -6px',
        padding: '10px',
        borderRadius: '6px',
        alignItems: 'center',
        aligncontent: 'center',
        display: 'flex',
        width: '100%',
        justifyContent: "space-evenly"
    },
    innerContainer: {
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    labelParagraph: {
        "marginBottom":"0.5rem",
        "paddingLeft": "0.2rem"
    },
    stepStyle: {
        fontSize: '12px ',
        marginBottom: '30px',
        textAlign: 'center' as 'center'
    },
    stepStyle2: {
        fontSize: '12px ',
        marginBottom: '10px',
        textAlign: 'center' as 'center'
    },
    arrow: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabbedBtnItem: {
        width: '33%'
    },
    stepsContainer: {
        marginTop: '30px',
        width: '105%',
        margin: '30px auto'
    },
    mainContent: {
        width: '90%',
        boxShadow: '-1px 4px 6px -6px black',
        backgroundColor: 'white',
        padding: '3rem 2rem',
        borderRadius: '12px',
        margin: '0px auto',
        height: '100%'

    },
    inputContainer: {
        marginTop: '2rem',
        fontWeight: 400
    },
    swapBtnContainer: {
        width: '100%',
        textAlign: 'center' as 'center',
        margin: '0.5rem auto',
        marginBottom: '0rem'
    },
    dividerStyle: {
        margin: '5px auto',
        width: '10%',
        borderRadius: '20%',
        minWidth: '20%',
        borderTop: '7px solid rgba(0, 0, 0, 0.06)'
    },
    sideInfo: {
        boxShadow: '-1px 4px 6px -6px black',
        borderRadius: '12px',
        padding: '3rem 1.5rem',
        margin: '0px 0px 0px auto',
        textAlign: "center" as "center",
        height: "100%"
    },
    notConnectedContainer: {
        width: '80%',
        justifyContent: 'center',
        textAlign: "center" as "center",
        margin: '0px auto',
        fontSize: '18px'
    },
    connectedContainer: {
        width: '80%',
        margin: '0px auto',
    },
    formatLongText: {
        fontSize: '18px',
        lineHeight: 1.5,
        marginBottom: '5%'
    },
    notConnectedBtnContainer: {
        margin: '0px auto',
        width: '40%',
        height: '93px',
        marginTop: '2rem'
    },
    emphasize: {
        fontWeight: 600
    },
    text:{
        color: theme.get(Theme.Colors.textColor),
        marginBottom: '1rem',
        textAlign: "center" as "center"
    },
    btnContainer: {
        width: '13%'
    },
    destinationNetContainer: {
        textAlign: 'center' as 'center',
        borderRadius: '50%',
        boxShadow: '1px 1px 7px #0000007a',
        padding: '2px 8px'
    },
    btn:{
        padding: '5px',
        height: '100px'
    },
    inputStyle:  {
        root: [
          {
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
    }
})