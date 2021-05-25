import React, { useState,useContext, useEffect } from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { useHistory } from 'react-router';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@fluentui/react-northstar'
import { BridgeAppState } from './../../common/BridgeAppState';
import { AppAccountState } from 'common-containers';
import { SignedPairAddress,inject, PairedAddress } from 'types';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { TextField} from 'office-ui-fabric-react';
//@ts-ignore
import {Page,OutlinedBtn} from 'component-library';
import { AnyAction, Dispatch } from "redux";
import { createSlice } from '@reduxjs/toolkit';
import {
    Gap
    // @ts-ignore
} from 'desktop-components-library';
import { ValidationUtils } from "ferrum-plumbing";
import { Utils } from './../../common/Utils';
import { message, Result } from 'antd';
import { formatter } from './../../common/Utils';
import { ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { BridgeClient } from "./../../clients/BridgeClient";

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
    destSignature: string,
    selectedToken: string,
    addresses: AddressDetails[],
    availableLiquidity: string,
    allowanceRequired: boolean,
    reconnecting: boolean
}

const onConnect = async (dispatch:Dispatch<AnyAction>,network: string,targetCur: string) => {
    try {

        const sc = inject<BridgeClient>(BridgeClient);
        const currenciesList = await sc.getSourceCurrencies(dispatch,network);
        if(currenciesList.length > 0){
            const allowance = await sc.checkAllowance(dispatch,targetCur,'5', targetCur);
            dispatch(Actions.checkAllowance({value: allowance}));       
        }
        const res  = await sc.signInToServer(dispatch);
        return res;
    } catch(e) {
        if(!!e.message){
        }
    }finally {
    }
};

const addLiquidity = async (dispatch:Dispatch<AnyAction>,amount: string,targetCurrency: string,success: (v:string,tx:string)=>void,allowanceRequired:boolean) => {
    try {
        const client = inject<BridgeClient>(BridgeClient);
        ValidationUtils.isTrue(!!targetCurrency,'targetCurrency is required')
        const res = await client.addLiquidity(dispatch, targetCurrency, amount);
        if(res){
            if(allowanceRequired){
                dispatch(Actions.approvalSuccess({ }));
                const allowance = await client.checkAllowance(dispatch,targetCurrency,'5', targetCurrency);
                if(allowance){
                    success('Approval Successful, You can now go on to add you liquidity.','');
                    dispatch(Actions.checkAllowance({value: false}))
                }
                
            }else{
                success('Liquidity Added Successfully and processing',res.txId);
                dispatch(Actions.addLiquiditySuccess({}))
                return
            }
        }
    } catch(e) {
        if(!!e.message){
        }
    }finally {
    }
};

const removeLiquidity = async (dispatch:Dispatch<AnyAction>,amount: string,targetCurrency: string,success: (v:string,tx:string)=>void) => {
    try {
        const client = inject<BridgeClient>(BridgeClient);
        ValidationUtils.isTrue(!!targetCurrency,'targetCurrency is required')
        const res = await client.removeLiquidity(dispatch, targetCurrency, amount);
        if(res?.status){
            dispatch(Actions.removeLiquiditySuccess({}))
            success('Liquidity Removal Successfully processing',res?.txId)
        }
    } catch(e) {
        if(!!e.message){
            console.log(e.message)
        }
    }finally {
    }
}

const amountChanged = (dispatch:Dispatch<AnyAction>,v?: string) => dispatch(Actions.amountChanged({value: v}));

const tokenSelected = async (dispatch:Dispatch<AnyAction>,v?: any,addr?: AddressDetails[]) => {
    try{
        let details = addr?.find(e=>e.symbol === v);
        const sc = inject<BridgeClient>(BridgeClient);
        if(details){
            await sc.getUserLiquidity(dispatch,details?.address, details?.currency);
        }
        dispatch(Actions.tokenSelected({value: v || {},details}))
    }catch(e) {
        if(!!e.message){
            console.log(e.message);
        }
    }finally {
    }      
}

function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): liquidityPageProps {
    const state = (appState.ui.liquidityPage || {}) as liquidityPageProps;
    const accounts = userAccounts.user.accountGroups;
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
        currency: address.currency,
        pairedAddress: state.pairedAddress,
        destNetwork: state.destNetwork,
        baseNetwork: state.baseNetwork,
        availableLiquidity: state.availableLiquidity,
        allowanceRequired: state.allowanceRequired,
        reconnecting: state.reconnecting
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
        destNetwork: 'ETHEREUM',
        baseNetwork: '',
        currency: '',
        userWithdrawalItems: [],
        groupId: '',
        swapId: '',
        itemId: '',
        reconnecting: false
    } as liquidityPageProps,
    reducers: {
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
            state.destNetwork= action.payload.pairedAddress.pair?.network2 || state.destNetwork;
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
            state.amount= '0'
        },
        removeLiquiditySuccess: (state,action) => {
            state.amount= '0'
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
            console.log(action,'oiyyiiy');
            
            //@ts-ignore
            state.availableLiquidity= action.payload.liquidity;
        });
    }
});

const Actions = liquidityPageSlice.actions;

export function LiquidityPage() {
    const [action,setAction] = useState(true)
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);   
    const histroy = useHistory();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, liquidityPageProps>(state => stateToProps(state,userAccounts));
    const [refreshing,setRefreshing] = useState(false)

    const onSuccessMessage = async (v:string,tx:string) => {  
        message.success({
            content: <Result
                status="success"
                title="Your Transaction was successful"
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

    const handleRefresh = async () => {
        setRefreshing(true);
        await tokenSelected(dispatch,pageProps.selectedToken,pageProps.addresses);
        setRefreshing(false);
    }
    
    return (
        <div className="page_cont">
            <div className="centered-body liquidity1" style={styles.maincontainer} >
            <div>
                    <div className="body-not-centered swap liquidity">
                        <div className="header title">  
                            <div style={{...styles.textStyles}}>
                                Manage Liquidity
                                <Divider/>
                            </div>
                            <div>
                                <div className="space-out">
                                    <>
                                        <select style={{...styles.textStyles,...styles.optionColor}} name="token" id="token" className="content token-select" disabled={pageProps.addresses.length === 0} onChange={(e)=>tokenSelected(dispatch,e.target.value,pageProps.addresses)}>
                                            <option style={{...styles.textStyles,...styles.optionColor}} value={''}>Select Token</option>
                                            
                                            {
                                                pageProps.addresses.length > 0 ?
                                                pageProps.addresses.map((e:any)=>
                                                        <option style={{...styles.textStyles,...styles.optionColor}} value={e.symbol}>{e.symbol}</option>
                                                    )
                                                : <option style={{...styles.textStyles,...styles.optionColor}} value={'Not Available'}>Not Available</option>
                                            }
                                        </select>
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div  style={styles.container}>
                    <div className="pad-main-body" >
                        <div className="space-out liquidity-tabs">
                            <span className={action ? 'emphasize' : undefined }  style={{...styles.textStyles}} onClick={()=>setAction(!action)}>Add Liquidity</span>
                            <div className="vert-divider"></div>
                            <span className={action ? undefined : 'emphasize' } style={{...styles.textStyles}} onClick={()=>setAction(!action)}>Remove Liquidity</span>
                        </div>
                    </div>
                    {
                        action &&
                            <div className="pad-main-body">
                                    <div>
                                        <div className="header">Current Network</div>
                                        <div className="content">
                                            <div>
                                                <TextField
                                                    placeholder={'Current Network'}
                                                    value={pageProps.network}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Gap size={"small"}/>
                                    <div>
                                        <div className="header">Amount of Liquidity to Add</div>
                                        <div className="content">
                                            <div>
                                                <TextField
                                                    placeholder={'Amount'}
                                                    value={pageProps.amount}
                                                    onChange={(e,v)=>amountChanged(dispatch,v)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content notif">{ !pageProps.network ? 'Kindly Reconnect' : undefined}</div>
                                    <div className="content notif">{ (pageProps.network && !pageProps.selectedToken) ? 'Kindly Select a netwrok token' : undefined}</div>
                                    { pageProps.selectedToken && <div style={{...styles.textStyles}} onClick={()=>handleRefresh()}> Refresh Balance Data <ReloadOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`,width: '20px'}} spin={refreshing}/> </div> }
                                    <Gap size={"small"}/>                                 
                            </div>
                    }
                    {
                        !action &&
                            <div className="pad-main-body">
                                    <div>
                                        <div className="header">Current Network</div>
                                        <div className="content">
                                            <div>
                                                <TextField
                                                    placeholder={'Current Network'}
                                                    value={pageProps.network}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Gap size={"small"}/>
                                    <div>
                                        <div className="header">Amount of Liquidity to Remove</div>
                                        <div className="content">
                                            <div>
                                                <TextField
                                                    placeholder={'Enter Amount'}
                                                    value={pageProps.amount}
                                                    onChange={(e,v)=>amountChanged(dispatch,v)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content">{ !pageProps.network ? 'Kindly Reconnect' : undefined}</div>
                                    <div className="content">{ (pageProps.network && !pageProps.selectedToken) ? 'Kindly Select a netwrok token' : undefined}</div>
                                    { pageProps.selectedToken && <div style={{...styles.textStyles}} onClick={()=>handleRefresh()}> Refresh Balance Data <ReloadOutlined style={{color: `${theme.get(Theme.Colors.textColor)}`,width: '20px'}} spin={refreshing}/> </div> }
                                    <Gap size={"small"}/>
                            </div>
                    }
                    <div className="liqu-details">
                        <div className="my-liqu-details">
                            <p className="value">
                                {formatter.format(pageProps.availableLiquidity,false)}
                                <span>{pageProps.symbol}</span>
                            </p>
                            
                            <p>
                                Your Liquidity Balance
                            </p>
                        </div>
                        <div style={styles.btnCont}>
                            <OutlinedBtn
                                text= {action ? (pageProps.allowanceRequired ? 'Approve' : 'Add Liquidity') : 'Remove Liquidity'}
                                onClick={
                                    () => action ? 
                                    addLiquidity(dispatch,pageProps.amount,pageProps.currency,onSuccessMessage,pageProps.allowanceRequired)
                                    : removeLiquidity(dispatch,pageProps.amount,pageProps.currency,onSuccessMessage)
                                }
                                disabled={!pageProps.selectedToken || (Number(pageProps.amount) <= 0) || pageProps.allowanceRequired}
                            /> 
                        </div>                      
                    </div>   
                    </div>
                  
            </div>
        </div>
        </div>
    )
}


//@ts-ignore
const themedStyles = (theme) => ({
    container: {
        width: '75%',
        margin: '0px auto'
    },
    maincontainer: {
        width: '90%'
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
