import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
//@ts-ignore
import {Page,OutlinedBtn,Divider,CustomSelect,WideTextField,InputField,RegularBtn} from 'component-library';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from '../../common/BridgeAppState';
import { PairedAddress,SignedPairAddress, supportedNetworks } from 'types';
import { AppAccountState } from 'common-containers';
import { ConnectButtonWapper, IConnectViewProps } from 'common-containers';
import { Steps } from 'antd';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { AnimatedSwapBtn } from './../../components/swapBtn';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {SwapModal} from './../../components/swapModal';
import { useBoolean } from '@fluentui/react-hooks';
import { useToasts } from 'react-toast-notifications';
import {
    reconnect,fetchSourceCurrencies,connect,checkTxStatus,checkifItemIsCreated,
    onSwap, executeWithdraw
} from './handler';
import { Alert } from 'antd';
import { ConfirmationModal } from '../../components/confirmationModal';
import { WithdrawNoti } from '../../components/withdrawalNoti';
import { LoadingOutlined } from '@ant-design/icons';
import { openPanelHandler } from './../Swap';
import { message, Result } from 'antd';
import { Utils } from 'types';
import {SidePanelProps} from './../../components/SidePanel';

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
    isNetworkReverse: boolean
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
        swapWithdrawNetwork: ''
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
            state.destNetwork = action.payload.value
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
            state.destNetwork= action.payload.pairedAddress.pair?.network2 || state.destNetwork;
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
            state.destNetwork = action.payload.currencies[0].targetNetwork
        },
        dataLoaded: (state,action) => {
            state.dataLoaded = true;
            state.destNetwork = state.currenciesDetails.Network
        },
        destNetworkChanged: (state,action) => {
            state.destNetwork = action.payload.value
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
            state.destNetwork = state.currenciesDetails.targetNetwork;
        },
        changeIsNetworkReverse:(state,action) => {
            state.isNetworkReverse = !state.isNetworkReverse;
        },
        setMax:(state,action) => {
            state.amount = action.payload.balance
        },
        resetSwap: (state,action) => {
            state.swapId = '';
            state.itemId = ''
        }
    },
    extraReducers: builder => {
        builder.addCase('connect/reconnected', (state, action) => {
            state.reconnecting = true;
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
        isNetworkReverse: state.isNetworkReverse
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

export function MainPage() {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, MainPageProps>(state => stateToProps(state,userAccounts));
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isConfirmModalOpen, { setTrue: showConfirmModal, setFalse: hideConfirmModal }] = useBoolean(false);
    const [modalStatus,setModalStatus] = useState(1)
    const [isNotiShown, setIsNotiShown] = useState(false);
    const [isNotiModalVisible, setIsNotiModalVisible] = useState(false);
    const swapping = ((pageProps.swapId!='') && modalStatus < 3);
    const swapSuccess = ((pageProps.swapId!='') && modalStatus >= 3);
    const swapFailure = ((pageProps.swapId!='') && modalStatus === -1);
    const withdrawalsProps =  useSelector<BridgeAppState, SidePanelProps>(state => state.ui.sidePanel);
    let unUsedItems = withdrawalsProps.userWithdrawalItems.filter(e=>e.used === '').length;
    const validateStep3 = ((Number(pageProps.amount) > 0)||((pageProps.swapId!='') && modalStatus < 3));
    const allowedAndNotProcessing = (!pageProps.allowanceRequired && !swapSuccess && !swapFailure)
    
    useEffect(()=>{
        if(pageProps.reconnecting){
            reconnect(dispatch,pageProps.selectedToken,pageProps.addresses,setIsNotiModalVisible)
        }
    })
    
    useEffect(()=>{
        if(connected && !pageProps.dataLoaded){
            connect(dispatch,setIsNotiModalVisible)
            fetchSourceCurrencies(dispatch,pageProps.selectedToken,pageProps.addresses)
            dispatch(Actions.dataLoaded({}))
        }
        if(unUsedItems > 0 && pageProps.dataLoaded && !isNotiShown){
            setTimeout(
                () => {
                    setIsNotiShown(true);
                    setIsNotiModalVisible(true)
                },3500
            )
            
        }
    })

    const menu = (
        <Menu >
            {
                [...Object.keys(supportedNetworks).map((e)=>e)].map(e=>{
                    //@ts-ignore
                    const active = ((supportedNetworks[`${e as any}`] === ('inactive')) || (e === pageProps.network)) ? true : false;
                    return (
                        <Menu.Item key={e} disabled={active} >
                            <a onClick={()=>dispatch(Actions.destNetworkChanged({value: e}))}>
                                {e}
                            </a>
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    );

    const NotConnected = () => {
        const ConBot = <ConnectButtonWapper View={ConnectBtn} />

        return (
        <div style={styles.notConnectedContainer}>
            <div style={styles.formatLongText}>
                You can use this token bridge to send <span style={styles.emphasize}>Bondly</span> tokens from Ethereum to BSC and Vice Versa.
                <Divider
                    style={styles.dividerStyle}
                />
            </div>
            <div style={{...styles.formatLongText,...styles.emphasize}}>
                {'Follow the Step by Step guide to send your tokens across the bridge.'}
            
            </div>
            <div style={styles.notConnectedBtnContainer}>
                {ConBot}
            </div>

        </div>
        )
    }

    const onWithdrawSuccessMessage = async (v:string,tx:string) => {  
        message.success({
            content: <Result
                status="success"
                title="Your Withdrawal Transaction Processing"
                subTitle={v}
                extra={[
                    <>
                        <div> View Transaction Status </div>
                        <a onClick={() => window.open(Utils.linkForTransaction(pageProps.network,tx), '_blank')}>{tx}</a>
                    </>
                ]}
            />,
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
        }, 20);  
    };


    
    const onMessage = async (v:string) => {    
        addToast(v, { appearance: 'error',autoDismiss: true })        
    };

    const onSuccessMessage = async (v:string) => {    
        addToast(v, { appearance: 'success',autoDismiss: true })        
    };

    
    const ContentContainer = () => {
        return (
            <div style={styles.mainContent}>

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
                    fee={'0'}
                    total={`${Number(pageProps.amount) - 0}`}
                    setIsModalClose={()=>hideConfirmModal()}
                    processSwap={()=>onSwap(dispatch,pageProps.amount,pageProps.addresses[0].balance,pageProps.currenciesDetails.sourceCurrency!,pageProps.currenciesDetails.targetCurrency,
                        onMessage,onSuccessMessage,pageProps.allowanceRequired,showModal,pageProps.network,pageProps.destNetwork)}

                />
                {
                    (!connected && !pageProps.swapId) ?
                        <NotConnected/>
                    :   <Connected/>
                }
            </div>
               
        )
    }

    const SideContentContainer = () => {
        return (
            <div style={styles.sideInfo}>
                <>
                    <>
                        Progress Outline
                        <Divider
                            style={styles.dividerStyle}
                        />
                    </>
                    <div style={styles.stepsContainer}>
                        <Steps 
                            direction="vertical" 
                            current={0}
                        >
                            <Step 
                                status={connected ? "finish":"wait"} 
                                title={<div style={styles.stepStyle}>
                                    Connect Your Wallet
                                </div>}
                            />
                            <Step 
                                status={!pageProps.allowanceRequired ? "finish":"wait"} 
                                title={<div style={styles.stepStyle}>{pageProps.allowanceRequired ? 'Approve Your Wallet to Swap Now':'Wallet Approved'}</div>}
                            />
                            <Step status={((!pageProps.allowanceRequired) && validateStep3) ? 
                                "finish":"wait"
                            } 
                                title={<div style={styles.stepStyle}>Enter Swap Amount</div>}
                            />
                            <Step 
                                status={((pageProps.swapId!='') && (modalStatus === 3)) ? "finish" : ((pageProps.swapId!='') && (modalStatus < 3)) ? "process" : "wait"} 
                                title={<div style={swapping ? styles.stepStyle2 : styles.stepStyle}>{((pageProps.swapId!='') && (modalStatus < 3)) ? 
                                <div onClick={()=>showModal()}>Swap Processing</div> : 'Swap Token' }</div>}
                                icon={((pageProps.swapId!='') && modalStatus < 3) && <LoadingOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`}}/>}  
                                description={swapping && (
                                    <div>
                                        <SwapModal
                                            isModalOpen={swapping}
                                            showModal={showModal}
                                            hideModal={hideModal}
                                            status={modalStatus}
                                            txId={pageProps.swapId}
                                            sendNetwork={pageProps.network}
                                            timestamp={Date.now()}
                                            callback={checkTxStatus}
                                            itemCallback={checkifItemIsCreated}
                                            itemId={pageProps.itemId}
                                            claim={openPanelHandler}
                                            setStatus={(v)=>setModalStatus(v)}
                                        />
                                    </div> )
                                }
                            />
                            <Step 
                                status={(pageProps.swapId && modalStatus === 3) ? (pageProps.network != pageProps.swapWithdrawNetwork) ? "process" : "finish" : "wait"}  
                                title={<div style={ ((pageProps.swapId && modalStatus === 3) && (pageProps.network != pageProps.swapWithdrawNetwork)) ? styles.stepStyle2 : styles.stepStyle}>
                                    {(pageProps.swapId && modalStatus === 3) ? (pageProps.network != pageProps.swapWithdrawNetwork) ? 'Switch Network to Withdraw' : 'Withdraw Now' : 'Switch Network & Withdraw'}</div>}
                                description={
                                    ((pageProps.swapId && modalStatus === 3) && (pageProps.network != pageProps.swapWithdrawNetwork)) &&
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

    const Connected  = () => (
        <div style={styles.connectedContainer}>
            <div style={styles.centered}>
                Swap Across chains
                <Divider
                    style={styles.dividerStyle}
                />
            </div>
            <div>
                <div style={styles.tabbedBtnContainers}>
                    <div style={styles.tabbedBtnItem}>
                        <p>From</p>
                        <div style={styles.tabbedBtn}>
                            {pageProps.network} <br/> Network
                        </div>   
                    </div>
                    <div style={styles.tabbedBtnItem}>
                        <p></p>
                        <div style={styles.arrow}>
                            <AnimatedSwapBtn setIsNetworkReverse={()=>dispatch(Actions.changeIsNetworkReverse({}))} isNetworkReverse={pageProps.isNetworkReverse}/>
                        </div>
                    </div>
                    <div style={styles.tabbedBtnItem}>
                        <p>To</p>
                        <div style={styles.tabbedBtn}>
                            <div>    
                                {pageProps.destNetwork}  <br/> Network
                            </div>
                            <div style={styles.destinationNetContainer}>
                                <Dropdown overlay={menu}>
                                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                    <DownOutlined/>
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                pageProps.isNetworkReverse &&  
                <p style={styles.subtextError}>
                    <Alert
                        message=""
                        description={`Switch your current Network to ${pageProps.destNetwork} to execute swap this way`}
                        type="error"
                    />
                </p>
                
            }
            <div style={styles.inputContainer}>
                <p style={styles.labelParagraph}>Asset</p>
                <CustomSelect
                    items={{...pageProps.addresses.map(e=>e.symbol)}}
                    defaultValue={pageProps.selectedToken} 
                    onChange={(v:any)=> fetchSourceCurrencies(dispatch,v,pageProps.addresses)}
                />
            </div>
            {!pageProps.tokenValid && <p style={{...styles.subtext,...styles.error}}> Invalid token Selected.</p> }

            <div style={styles.inputContainer}>
                <p>Amount</p>
                <div style={styles.groupAddon}>
                    <WideTextField
                        placeholder={0.0}
                        type={'Number'}
                        value={pageProps.amount}
                        onChange={ (v:any) => dispatch(Actions.amountChanged({value: v.target.value}))}
                        disabled={ pageProps.allowanceRequired || (pageProps.swapId!='' && (swapFailure || swapSuccess || swapping))}
                    />
                    <span style={styles.addon} onClick={()=>dispatch(Actions.setMax({balance: pageProps.addresses[0].balance,fee: 0}))}>
                        Max
                    </span>
                </div>
                
            </div>
            <p style={styles.subtext}><p>{pageProps.addresses[0]?.balance || 0} {pageProps.selectedToken} Balance Available.</p> <p>Min 5 {pageProps.selectedToken}</p></p>
            <div style={styles.inputContainer}>
                <p>Destination Address</p>
                <InputField
                    disabled={true}
                    defaultValue={pageProps.addresses[0]?.address}
                    placeholder={'Address on destination Network'}
                />
            </div>
            {
                (!pageProps.allowanceRequired && swapSuccess && swapFailure) &&
                (
                    <div style={styles.swapBtnContainer}>
                        <RegularBtn
                            onClick={()=>executeWithdraw(dispatch,pageProps.itemId,onWithdrawSuccessMessage,onMessage)}
                            text={ 'Withdraw'}
                            propStyle={{
                                "padding":"25px 45px",
                                "borderRadius": '5px',
                            }}
                            disabled={swapping || (pageProps.network != pageProps.swapWithdrawNetwork)}                              
                        />
                    </div>
                )
            }
                
            {
                allowedAndNotProcessing &&
                    <div style={styles.swapBtnContainer}>
                        
                        <RegularBtn
                            onClick={()=>showConfirmModal()}
                            text={ swapping ? 'Swap Processing' : 'Swap'}
                            propStyle={{
                                "padding":"25px 45px",
                                "borderRadius": '5px',
                            }}
                            disabled={!pageProps.selectedToken || (Number(pageProps.amount) <= 0) 
                                || pageProps.allowanceRequired || !pageProps.tokenValid || swapping
                            }                              
                        />
                    </div>
            }

            {
                pageProps.allowanceRequired &&
                <div style={styles.swapBtnContainer}>
                        <RegularBtn
                            text={'APPROVE'}
                            onClick={
                                ()=>onSwap(dispatch,'0.5',pageProps.addresses[0].balance,pageProps.currenciesDetails.sourceCurrency!,pageProps.currenciesDetails.targetCurrency,
                                    onMessage,onSuccessMessage,pageProps.allowanceRequired,showModal,pageProps.network,pageProps.destNetwork)
                            }
                            propStyle={{
                                "padding":"25px 45px",
                                "borderRadius": '5px',
                            }}
                            disabled={!pageProps.selectedToken || !pageProps.allowanceRequired}
                        />
                    </div>
            }
        </div>
    )

    return (
        <Page>
            <div className="page_cont">
                <div style={styles.container }>
                    <div style={styles.innerContainer }>
                        <div style={styles.left}>
                            <SideContentContainer/>
                        </div>
                        <div style={styles.center}>
                            <ContentContainer/>
                        </div>

                        <div style={styles.left}>

                        </div>
                    </div>
                </div>
            </div>
        </Page>
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
        height: "100%",
        alignItems: "center" as "center",
        cursor: "pointer"
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
    subtext: {
        marginTop: '0.2rem',
        fontWeight: 600,
        fontSize: '12px',
        display: "flex",
        justifyContent: "space-between"
    },
    subtextError: {
        marginTop: '0.8rem',
        fontWeight: 500,
        fontSize: '12px'
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
        justifyContent: "space-between"
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
        "color": "black",
        fontSize: '12px ',
        marginBottom: '50px',
        textAlign: 'center' as 'center'

    },
    stepStyle2: {
        "color": "black",
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
        width: '90%',
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
        marginTop: '1.5rem',
        fontWeight: 600
    },
    swapBtnContainer: {
        width: '100%',
        textAlign: 'center' as 'center',
        margin: '1.5rem auto',
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
        backgroundColor: 'white',
        padding: '3rem 1.5rem',
        width: '65%',
        margin: '0px 0px 0px auto',
        left: '10%',
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