import React, { useState,useContext, useEffect } from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState, FilteredTokenDetails } from './../../common/BridgeAppState';
import { AppAccountState } from 'common-containers';
import { SignedPairAddress,inject, PairedAddress,BRIDGE_CONTRACT,BridgeTokenConfig, TokenDetails } from 'types';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { Big } from 'big.js';
//@ts-ignore
import { AssetsSelector,supportedIcons,networkImages,AmountInput } from 'component-library';
import { AnyAction, Dispatch } from "redux";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    Gap
    // @ts-ignore
} from 'desktop-components-library';
import { ValidationUtils } from "ferrum-plumbing";
import { Utils,supportedNetworks,NetworkDropdown,ChainEventBase, ChainEventStatus } from 'types';
import { message, Result } from 'antd';
import { formatter } from './../../common/Utils';
import { ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { BridgeClient } from "./../../clients/BridgeClient";
import { addAction, CommonActions } from "./../../common/Actions";
import { Card } from "react-bootstrap";
import { approvalKey } from 'common-containers/dist/chain/ApprovableButtonWrapper';
import { LiquidityActionButton } from './liquidityActionButton';
import { updateData } from './../../components/swapModal';
import { Button } from "react-bootstrap";
import { ChainEventItem, } from 'common-containers';
import { UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { UnifyreExtensionKitClient } from 'unifyre-extension-sdk';
import { Dropdown } from "react-bootstrap";
import { changeNetwork } from "./../Main/handler";
import { LiquidityConfirmationModal } from './../../components/confirmationModal';
import { useBoolean } from '@fluentui/react-hooks';
import { Networks } from 'ferrum-plumbing';

export interface liquidityPageProps{
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
    contractAddress: string
}

const addLiquidity = async (dispatch:Dispatch<AnyAction>,amount: string,balance:string,targetCurrency: string,success: (v:string,tx:string)=>void,allowanceRequired:boolean) => {
    try {
        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        const client = inject<BridgeClient>(BridgeClient);
        ValidationUtils.isTrue(!(Number(balance)<Number(amount)),'You do Not have Enough Liquidity Available')
        ValidationUtils.isTrue(!!targetCurrency,'targetCurrency is required')
        const res = await client.addLiquidity(dispatch, targetCurrency, amount);
        if(res){
            success('Liquidity Added Successfully and processing',res.txId);
            dispatch(Actions.addLiquiditySuccess({txId: res.txId}))
            return
        }
    } catch(e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
};

const removeLiquidity = async (dispatch:Dispatch<AnyAction>,amount: string,balance:string,targetCurrency: string,success: (v:string,tx:string)=>void) => {
    try {
        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        const client = inject<BridgeClient>(BridgeClient);
        ValidationUtils.isTrue(!(Number(balance)<Number(amount)),'You do Not have Enough Liquidity Available')
        ValidationUtils.isTrue(!!targetCurrency,'targetCurrency is required')
        const res = await client.removeLiquidity(dispatch, targetCurrency, amount);
        if(res?.status){
            dispatch(Actions.removeLiquiditySuccess({txId: res.txId}))
            success('Liquidity Removal Successfully processing',res?.txId)
        }
    } catch(e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

const amountChanged = (dispatch:Dispatch<AnyAction>,v?: string) => {
    dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
    dispatch(Actions.amountChanged({value: v})
    );
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

async function updateEvent(dispatch: Dispatch<AnyAction>, e: ChainEventBase, callback:() => void): Promise<ChainEventBase> {
	try {
		const connect = inject<UnifyreExtensionWeb3Client>(UnifyreExtensionKitClient);
		const t = await connect.getTransaction(e.id);
		console.log('Checking the transloota ', t)
		if (t &&t.blockNumber) {
			console.log('Translo iso componte ', t)
            updateData(dispatch);
            callback();
			return {...e, status: 'completed'}; // TODO: Check for failed
		}
		console.log('Noting inderezding ', e)
		return {...e, status: 'pending'};
	} catch(ex) {
		console.error('Button.updateEvent', ex, e);
		return {...e, status: 'failed'};
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

function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): liquidityPageProps {
    const state = (appState.ui.liquidityPage || {}) as liquidityPageProps;
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

	// TODO: Move this to a reducer to speed up rendering
	const assets: { [k: string]: TokenDetails } = {};
	const gid = new Set<string>(appState.data.state?.groupInfo?.bridgeCurrencies || []);
	appState.data.tokenList.list.forEach(tl => {
		if (gid.has(tl.currency) &&
			tl.chainId === Networks.for(currNet || 'ETHEREUM').chainId) {
			assets[tl.currency] = tl;
		}
	});

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
        TotalAvailableLiquidity: TotalAvailableLiquidity,
        allowanceRequired: new Big(allocation || '0').lte(new Big('0')),
        reconnecting: state.reconnecting,
    } as liquidityPageProps;
};

export const liquidityPageSlice = createSlice({
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
        TotalAvailableLiquidity: '0',
        AllowedNetworks: [],
        liquidityData: [],
        reconnecting: false,
		assets: {} as any,
    } as liquidityPageProps,
    reducers: {
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

const Actions = liquidityPageSlice.actions;

export function LiquidityPage() {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);   
    const dispatch = useDispatch();
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, liquidityPageProps>(state => stateToProps(state,userAccounts));
    const assets =  useSelector<BridgeAppState, FilteredTokenDetails>(state => state.data.state.filteredAssets);
    const [refreshing,setRefreshing] = useState(false)
    const [isConfirmModalOpen, { setTrue: showConfirmModal, setFalse: hideConfirmModal }] = useBoolean(false);
    const action = window.location.pathname.split('/')[3] === 'add';
	const { currency } = pageProps;

    useEffect(()=>{
		if (currency) {
			dispatch(tokenSelectedThunk({currency: currency}));
		}
	}, [currency])
    
    // console.log('LIQPRP',pageProps, {assets});

    const onSuccessMessage = async (v:string,tx:string) => {  
        message.success({
            icon: <></>,
            content: <Result
                status="success"
                title="Your Transaction is Processing"
                subTitle={v}
                extra={[
                    <>
                        <div> View Transaction Status </div>
                        <a onClick={() => window.open(Utils.linkForTransaction(pageProps.network,tx), '_blank')}>{tx}</a>
                        <p>
                            <Button className={'btn-pri'} key="buy" onClick={()=>{
                                    message.destroy('withdraw');
                            }}>Close</Button>
                        </p>
                       
                    </>
                ]}
            />,
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
            duration: 0,
            key: 'withdraw'
        }, 20);  
    };

    const handleRefresh = async (v:string) => {
        setRefreshing(true);
		dispatch(tokenSelectedThunk({currency: pageProps.currency}));
        setRefreshing(false);
    }
    
    return (
        <div className="centered-body liquidity1" style={styles.maincontainer} >
            <LiquidityConfirmationModal
                isModalOpen={isConfirmModalOpen}
                amount={pageProps.amount}
                sourceNetwork={pageProps.network}
                token={pageProps.symbol}
                total={pageProps.amount}
                liquidity={pageProps.availableLiquidity}
                availableLiquidity={pageProps.TotalAvailableLiquidity}
                processLiqAction={action ?
                    () => addLiquidity(dispatch,pageProps.amount,pageProps.balance,pageProps.currency,onSuccessMessage,pageProps.allowanceRequired)
                    : () => removeLiquidity(dispatch,pageProps.amount,pageProps.availableLiquidity,pageProps.currency,onSuccessMessage)
                }
                setIsModalClose={hideConfirmModal}
                action={action?'Added':'Removed'}
            />
            <Card className="text-center">
                <div>
                    <div className="body-not-centered swap liquidity">
                        <small className="text-vary-color mb-5 head">
                                Manage Liquidity
                                <hr className="mini-underline"></hr>
                        </small>
                    </div>
                    <div  style={styles.container}>
                    <div className="pad-main-body">
                            <div>
                                <div className="text-sec text-left">Asset</div>
                                    <div>
                                        <AssetsSelector 
											assets={assets}
											network={pageProps.network}
											defaultLogo={networkImages[pageProps.network]}
                                            onChange={(v:any)=> {dispatch(Actions.currencyChanged({currency: v.currency})); handleRefresh(v.symbol)}}
                                            selectedCurrency={pageProps.currency}
                                        />
                                    </div>
                                </div>
                                <Gap size={"small"}/>
                                <div>
                                    <div className="text-sec text-left">Current Network</div>
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
                            <Gap size={"small"}/>
                            <div>
                                <div className="content text-left">
                                    <div>
                                        <AmountInput
                                            symbol={pageProps.symbol}
                                            amount={pageProps.amount}
                                            value={pageProps.amount}
                                            fee={0}
                                            icons={supportedIcons}
                                            addonStyle={styles.addon}
                                            groupAddonStyle={styles.groupAddon}
                                            balance={pageProps.balance}
                                            setMax={()=>dispatch(Actions.setMax({balance: action?pageProps.balance:pageProps.availableLiquidity,fee: 0}))}
                                            onChange={ (v:any) => amountChanged(dispatch,v.target.value)}
                                            onWheel={ (event:any) => event.currentTarget.blur() }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="content notif">{ !pageProps.network ? 'Kindly Reconnect' : undefined}</div>
                    </div>
                    <div className="liqu-details">
                        <div className="my-liqu-details">
                            <p className="value">
                                {formatter.format(pageProps.availableLiquidity,false)}
                                <span>{pageProps.symbol}</span>
                            </p>
                            
                            <p>
                                Your Liquidity Balance <ReloadOutlined onClick={()=>handleRefresh(pageProps.symbol)} style={{width: '20px'}} spin={refreshing}/>
                            </p>
                        </div>
                        <div className="my-liqu-details">
                            <p className="value">
                                {formatter.format(pageProps.TotalAvailableLiquidity,true)}
                                <span>{pageProps.symbol}</span>
                            </p>
                            
                            <p>
                                Total {pageProps.symbol} Liquidity on {pageProps.network}
                            </p>
                        </div>                  
                    </div> 
                    <div className="liqu-details">
                        <div style={styles.btnCont}>
                            <ChainEventItem
                                id={pageProps.transactionId}
                                network={pageProps.network as any}
                                initialStatus={'pending'}
                                eventType={'transaction'}
                                updater={e => updateEvent(
                                    dispatch, 
                                    e,
                                    () => dispatch(tokenSelectedThunk({currency: pageProps.currency}))
                                )}>
                                    <LiquidityActionButton
                                        addLiquidity = {action}
                                        onManageLiquidityClick = {showConfirmModal}
                                        contractAddress={pageProps.contractAddress}
                                        amount={pageProps.amount}
                                        currency={pageProps.currency!}
                                        userAddress={pageProps.userAddress}
                                        isAmountEntered= {(Number(pageProps.amount) <= 0)}
                                        isTokenSelected= {!pageProps.selectedToken }
                                        allowanceRequired={pageProps.allowanceRequired}
                                        totalLiquidty={Number(pageProps.TotalAvailableLiquidity) > 0 ? (Number(pageProps.TotalAvailableLiquidity) - 1) : Number(pageProps.TotalAvailableLiquidity)}
                                    />
                            </ChainEventItem>
                        </div>                      
                    </div>
                    <div style={{"paddingLeft": "1.5rem"}}>
                        <div>
                            <div className="amount-rec-text text-left">
                                {
                                    pageProps.liquidityData.length > 0 && 
                                    pageProps.liquidityData.map(
                                        e => 
                                        <small className="text-pri d-flex align-items-center">
                                                Available Liquidity On {e[0].split(':')[0]} ≈ {formatter.format(e[1],true)}
                                                <span className="icon-network icon-sm mx-2">
                                                    <img src={networkImages[e[0].split(':')[0]]} alt="img"></img>
                                                </span>
                                        </small>
                                    )
                                }
                            
                            </div>
                        </div>
                    </div>   
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
