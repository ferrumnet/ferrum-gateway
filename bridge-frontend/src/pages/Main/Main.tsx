import React, {useContext, useEffect, useState} from 'react';
import {Theme, ThemeConstantProvider, ThemeContext} from 'unifyre-react-helper';
//@ts-ignore
import { OutlinedBtn,networkImages,AssetsSelector, NetworkSwitch,AmountInput,supportedIcons} from 'component-library';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from '../../common/BridgeAppState';
import { supportedNetworks, NetworkDropdown, UserBridgeWithdrawableBalanceItem,
	BridgeTokenConfig, BRIDGE_CONTRACT, inject } from 'types';
import {IConnectViewProps } from 'common-containers';
import { Steps } from 'antd';
import {SwapModal} from './../../components/swapModal';
import { useBoolean } from '@fluentui/react-hooks';
import { useToasts } from 'react-toast-notifications';
import { onSwap, executeWithdraw,changeNetwork,} from './handler';
import { Alert } from 'antd';
import { ConfirmationModal } from '../../components/confirmationModal';
import { WithdrawNoti } from '../../components/withdrawalNoti';
import { LoadingOutlined } from '@ant-design/icons';
import { openPanelHandler } from './../Swap';
import { message, Result } from 'antd';
import { Utils } from 'types';
import { Card, Button } from "react-bootstrap";
import { InputGroup, FormControl, Form } from "react-bootstrap";
import {SidePanelSlice} from './../../components/SidePanel';
import { SwapButton } from '../../components/SwapButton';
import { AddressDetails } from 'unifyre-extension-sdk/dist/client/model/AppUserProfile';
import { approvalKey } from 'common-containers/dist/chain/ApprovableButtonWrapper';
import { Big } from 'big.js';
import { BridgeClient } from '../../clients/BridgeClient';
//@ts-ignore
import { AddTokenToMetamask } from 'component-library';
import { addAction, CommonActions } from '../../common/Actions';

const { Step } = Steps;

export interface MainPageState {
    destNetwork: string,
    currency?: string,
    amount:string,
    reconnecting?: boolean,
    availableLiquidity: string,
    swapId: string,
    tokenValid: boolean,
    itemId: string,
    swapWithdrawNetwork: string,
    isNetworkReverse: boolean,
    progressStatus: number,
    withdrawSuccess: boolean
}

export const MainPageSlice = createSlice({
    name: 'mainPage',
    initialState: {
        destNetwork: '',
        tokenValid: true,
        connected: false,
        reconnecting: false,
        availableLiquidity: '',
        amount:'',
        swapId: '',
        itemId: '',
        isNetworkReverse: false,
        swapWithdrawNetwork: '',
        progressStatus: 1,
        withdrawSuccess: false
    } as MainPageState,
    reducers: {
		currencyChanged: (state, action) => {
			state.currency = action.payload.currency;
		},
        reconnected: (state,action) => {
            state.reconnecting = false;
        },
        validateToken: (state,action) => {
            state.tokenValid= action.payload.value;
        },
        swapSuccess: (state,action) => {
            state.amount= '';
            state.swapId= action.payload.swapId;
            state.itemId= action.payload.itemId;
            state.swapWithdrawNetwork= state.destNetwork;
        },
        destNetworkChanged: (state,action) => {
            state.destNetwork = action.payload.value;
        },
        amountChanged: (state,action) => {
            state.amount= action.payload.value
        },
        resetDestNetwork: (state,action) => {
            state.destNetwork = action.payload.value;
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
    },
});

export const loadLiquidity = createAsyncThunk('connect/changeNetwork',
	async (payload: {destNetwork: string}, ctx) => {
	try {
		const client = inject<BridgeClient>(BridgeClient);
		const targetCurrency = ((ctx.getState() as BridgeAppState).data.state.currencyPairs || [] as any)
			.find(c => c.targetNetwork === payload.destNetwork)?.targetCurrency;
		if (targetCurrency) {
			await client.getAvailableLiquidity(ctx.dispatch, payload.destNetwork, targetCurrency);
		} else {
			ctx.dispatch(addAction(CommonActions.ERROR_OCCURED,
				{message: 'No target token available for the selected network'}));
		}
	} catch (e) {
		console.error('Load liquidity', e);
		// ctx.dispatch(addAction(CommonActions.ERROR_OCCURED, {message:'Switch Network unavaialable on Browser, manually switch network on metamask' }));
    } finally {
    }
});

interface MainPageProps extends MainPageState {
	network: string;
	userAddress: string;
	currency: string;
	symbol: string;
	balance: string;
	networkOptions: NetworkDropdown[];
	targetNetworks: NetworkDropdown[];
	currentPair: BridgeTokenConfig;
	allAddresses: AddressDetails[];
	allowanceRequired: boolean;
	contractAddress: string;
}

export const Actions = MainPageSlice.actions;

function stateToProps(appState: BridgeAppState): MainPageProps {
    const state = appState.ui.pairPage;
	const bridgeCurrencies = appState.data.state.groupInfo?.bridgeCurrencies || [] as any;
	const allNetworks = bridgeCurrencies.map(c => c.split(':')[0]);
    const addr = appState.connection.account.user.accountGroups[0]?.addresses || {};
    const address = addr[0] || {} as any;
	const currentIdx = allNetworks.indexOf(address.network || 'N/A');
	// Select the first currency groupInfo for the selected network
	const currency = state.currency || (currentIdx >= 0 ? bridgeCurrencies[currentIdx] : '');
	const currentNetwork = supportedNetworks[address.network] || {};

    const networkOptions = Object.values(supportedNetworks)
		.filter(n => allNetworks.indexOf(n.key) >= 0 && n.mainnet === currentNetwork.mainnet);
	const targetNetworks = networkOptions
		.filter(n => n.key !== (address.network || networkOptions[0]));
	const destNetwork = state.destNetwork || (targetNetworks[0] || {}).key;
	const currentPair = appState.data.state.currencyPairs.find(p =>
		p.sourceCurrency === currency && p.targetNetwork === destNetwork);
	const contractAddress = BRIDGE_CONTRACT[address.network];
	const allocation = appState.data.approval.approvals[approvalKey(address.address, contractAddress, currency)];
	const availableLiquidity = appState.data.state
		.bridgeLiquidity[currentPair?.targetCurrency || 'N/A'] || '0';
    return {
        ...state,
        userAddress: address.address,
        network: address.network,
        currency: currency,
		networkOptions,
		targetNetworks,
		destNetwork,
		currentPair,
		balance: address.balance,
		allAddresses: addr,
		allowanceRequired: new Big(allocation || '0').lte(new Big('0')),
		contractAddress,
		symbol: address.symbol,
		availableLiquidity,
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
    // const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    // const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const propsGroupInfo =  useSelector<BridgeAppState, any>(state => state.data.state.groupInfo);
    const pageProps =  useSelector<BridgeAppState, MainPageProps>(state => stateToProps(state));
    const [isConfirmModalOpen, { setTrue: showConfirmModal, setFalse: hideConfirmModal }] = useBoolean(false);
    const [isNotiModalVisible, setIsNotiModalVisible] = useState(false);
    const swapping = ((pageProps.swapId!='') && pageProps.progressStatus < 3);
    const swapSuccess = ((pageProps.swapId!='') && pageProps.progressStatus >= 3);
    const withdrawals =  useSelector<BridgeAppState, UserBridgeWithdrawableBalanceItem[]>(
		state => state.data.state.balanceItems);
    let unUsedItems = withdrawals.filter(e=>((e.used === '') && (e.sendNetwork === pageProps.network))).length;
    
    useEffect(()=>{
        if((unUsedItems > 0 && !pageProps.withdrawSuccess)){
            setIsNotiModalVisible(true)
        }
    }, [unUsedItems, pageProps.withdrawSuccess]);

	const {destNetwork} = pageProps;
	//TODO: Initialize this without useEffect
	useEffect(()=>{
		if (destNetwork) {
			dispatch(loadLiquidity({destNetwork}));
		}
	}, [destNetwork])
 
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
					<AddTokenToMetamask currency={pageProps.currency} />,
                    <Button key="buy" onClick={()=>{
                        message.destroy('withdr');
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

	console.log('PROPOP TULO', pageProps)

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
            token={pageProps.symbol}
            destination={pageProps.userAddress}
            fee={`${Number(pageProps.currentPair?.fee)*100}` || '0'}
            total={`${Number(pageProps.amount)}`}
            setIsModalClose={()=>hideConfirmModal()}
            processSwap={()=>onSwap(
                dispatch,
				pageProps.amount,
				pageProps.balance,
				pageProps.currency,
				pageProps.currentPair?.targetCurrency,
                onMessage,
				onSuccessMessage,
				pageProps.network,
				pageProps.destNetwork,
                (v)=> dispatch(Actions.setProgressStatus({status:v})),
				pageProps.availableLiquidity,
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
                    // assets={[pageProps.allAddresses]}
                    icons={supportedIcons}
                    // onChange={(v:any)=> dispatch(Actions.currencyChanged({currency: v.currency}))}
                    selectedToken={pageProps.symbol}
                />
                <NetworkSwitch 
                    availableNetworks={pageProps.targetNetworks}
                    suspendedNetworks={[]}
                    currentNetwork={supportedNetworks[pageProps.network] || {}}
                    currentDestNetwork={supportedNetworks[pageProps.destNetwork]}
                    onNetworkChanged={(e:NetworkDropdown)=> {
						dispatch(Actions.resetDestNetwork({value: e.key}))
					}}
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
                    symbol={pageProps.symbol}
                    amount={pageProps.amount}
                    value={pageProps.amount}
                    fee={0}
                    icons={supportedIcons}
                    addonStyle={styles.addon}
                    groupAddonStyle={styles.groupAddon}
                    balance={pageProps.balance}
                    setMax={()=>dispatch(Actions.setMax({balance: pageProps.balance,fee: 0}))}
                    onChange={ (v:any) => dispatch(Actions.amountChanged({value: v.target.value}))}
                />
                <div style={styles.inputContainer} >
                    <Form.Label className="text-sec" htmlFor="basic-url">
                        Destination Address
                    </Form.Label>
                    <InputGroup className="mb-3 transparent text-sec disabled" placeholder={'Address on destination Network'}>
                        <FormControl className={"transparent text-sec disabled"}
							disabled={true}
							defaultValue={pageProps.userAddress}
							value={pageProps.userAddress}/>
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
                                () => changeNetwork(dispatch,pageProps.swapWithdrawNetwork) :
                                ()=> executeWithdraw(dispatch,
									pageProps.itemId,
									onWithdrawSuccessMessage,
									onMessage,(v)=> dispatch(Actions.setProgressStatus({status:v})))}
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
			<SwapButton
				onSwapClick={() => showConfirmModal()}                            
					// ()=>
					// onSwap(
					// 	dispatch,'0.5',pageProps.addresses[0].balance,pageProps.currenciesDetails.sourceCurrency!,pageProps.destCurrency,
					// 	onMessage,onSuccessMessage,pageProps.allowanceRequired,showModal,pageProps.network,pageProps.destNetwork,
					// 	(v) => dispatch(Actions.setProgressStatus({status:v})),pageProps.availableLiquidity,pageProps.selectedToken,(propsGroupInfo.fee??0)
					// )
				approveDisabled={!pageProps.currency}
				swapDisabled={!pageProps.currency || (Number(pageProps.amount) <= 0) 
					|| !pageProps.tokenValid || swapping}
				contractAddress={pageProps.contractAddress}
				amount={pageProps.amount}
				currency={pageProps.currency!}
				userAddress={pageProps.userAddress}
				pendingSwap={swapping}
			/>
        </Card>
        </>
    );
};

export const SideBarContainer = () => {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const dispatch = useDispatch();
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const pageProps =  useSelector<BridgeAppState, MainPageProps>(state => stateToProps(state));
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
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

const themedStyles = (theme: ThemeConstantProvider) => ({
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