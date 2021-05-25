import React, {useContext, useEffect} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
//@ts-ignore
import {Page,OutlinedBtn} from 'component-library';
import { AnyAction, Dispatch } from "redux";
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from '../../common/BridgeAppState';
import { PairedAddress,SignedPairAddress,CHAIN_ID_FOR_NETWORK,inject,IocModule } from 'types';
import { Divider } from '@fluentui/react-northstar'
import { TextField} from 'office-ui-fabric-react';
import greenTick from '../../images/green-tick.png'
import { useHistory } from 'react-router';
import { AppAccountState } from 'common-containers';
import { BridgeClient } from "./../../clients/BridgeClient";
import { ValidationUtils } from "ferrum-plumbing";
import { PairAddressService } from './../../pairUtils/PairAddressService';
import {PairAddressSignatureVerifyre} from './../../pairUtils/PairAddressSignatureVerifyer';
import { Connect, CurrencyList } from 'unifyre-extension-web3-retrofit';
import { ConnectButtonWapper, IConnectViewProps } from 'common-containers';

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
    reconnecting?: boolean
}

const unPairAddresses = async (dispatch: Dispatch<AnyAction>,pair: SignedPairAddress) => {
    try {
        const tb = inject<BridgeClient>(BridgeClient);
        const res = await tb.unpairUserPairedAddress(dispatch,pair)
        if(!!res){
            dispatch(Actions.resetPair({}));
            const resp = await tb.signInToServer(dispatch);
            if (resp) {
                const connect = inject<Connect>(Connect);
                const network = connect.network() as any;
                const addr = connect.account()!;
                dispatch(Actions.bridgeInitSuccess({data: res,address1: addr,network1: network}));
                // ownProps.con()
            } else {
               // dispatch(addAction(Actions.BRIDGE_INIT_FAILED, { message: intl('fatal-error-details') }));
            }
            
        }
    } catch(e) {
        if(!!e.message){
            //dispatch(addAction(TokenBridgeActions.AUTHENTICATION_FAILED, {message: e.message }));
        }
    }finally {
       // dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

const onAddressChanged = (dispatch: Dispatch<AnyAction>,v:string) => {
    dispatch(Actions.onAddressChanged({value:v}))
}

const signFirstPairAddress = async (dispatch: Dispatch<AnyAction>,
    pairedAddress: PairedAddress,
    ) => {
    try {
        const vrf = inject<BridgeClient>(BridgeClient);
        const sc = inject<PairAddressService>(PairAddressService);
        ValidationUtils.isTrue(!(pairedAddress.network1 === pairedAddress.network2),'base and destination network cannot be the same');
        const res = await sc.signPairAddress1(pairedAddress);
        let SignedPair = {
            pair: pairedAddress,
            signature1: res.split('|')[0],
        } as  SignedPairAddress
        const response = await vrf.updateUserPairedAddress(SignedPair);
        if(!!response){
            dispatch(Actions.addBaseAddressSignature({sign: res,pair: pairedAddress}))
        }
    } catch(e) {
            if(!!e.message){
       }
    }finally {
    }
}

const onDestinationNetworkChanged = (
    dispatch: Dispatch<AnyAction>,v:string) => {
    dispatch(Actions.onDestinationNetworkChanged({value:v}))
}

const pairAddresses = (dispatch: Dispatch<AnyAction>,
    network:string,address: string
    ) => {
    dispatch(Actions.pairAddresses({network,address}))
}

const signSecondPairAddress = async (dispatch: Dispatch<AnyAction>,
    pairedAddress: PairedAddress,baseSign: string
    ) => {
    try {
        const vrf = inject<BridgeClient>(BridgeClient);
        const sc = inject<PairAddressService>(PairAddressService);
        const vrfy = inject<PairAddressSignatureVerifyre>(PairAddressSignatureVerifyre);
        ValidationUtils.isTrue(!(pairedAddress.network1 === pairedAddress.network2),'base and destination network cannot be the same');
        const res = await sc.signPairAddress2(pairedAddress);
        let SignedPair = {
            pair: pairedAddress,
            signature2: res.split('|')[0],
            signature1: baseSign.split('|')[0],
        } as  SignedPairAddress
        const response = await vrfy.verify(SignedPair);
        const rs = await vrf.updateUserPairedAddress(SignedPair);
        if(!!response && !!rs){
            dispatch(Actions.addDestAddressSignature({sign: res}))

        }
    } catch(e) {
            if(!!e.message){
            }
    }finally {
    }
}

const startSwap = (dispatch: Dispatch<AnyAction>,
    history:any,groupId:String) => {
    history.push((groupId ? `/${groupId}` : '') + '/swap');
}

const manageLiquidity = (dispatch: Dispatch<AnyAction>,
    history:any,groupId:String) => {
    history.push((groupId ? `/${groupId}` : '') + '/liquidity');
}

const resetPair = (dispatch: Dispatch<AnyAction>) => {
    dispatch(Actions.resetPair({}));
}

const reconnect = async (dispatch: Dispatch<AnyAction>)  => {
    const client = inject<BridgeClient>(BridgeClient);
    //@ts-ignore
    await client.signInToServer(dispatch);
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
        destNetwork: 'ETHEREUM',
        network: 'ETHEREUM',
        isPaired: false,
        pairedAddress: {
            address1: '',
            address2: '',
            network1: '',
            network2: ''
        },
        connected: false,
        groupId: '',
        reconnecting: false,
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
        signFirstPairAddress: (state,action) => {

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
        bridgeInitSuccess: (state,action) => {
            state.pairedAddress = {...state.pairedAddress,address1: action.payload.address1,network1:action.payload.network1}
        },
        swapSuccess: (state,action) => {

        }
    },
    extraReducers: builder => {
        builder.addCase('connect/reconnected', (state, action) => {
            state.reconnecting = true;
        })
    },
});

export const Actions = MainPageSlice.actions;

function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): MainPageProps {
    const state = (appState.ui.pairPage || {}) as MainPageProps;
    const accounts = userAccounts.user.accountGroups;
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {};

    return {
        ...state,
        baseConnected: state.baseConnected,
        destConnected: state.destConnected,
        baseSigned: state.baseSigned,
        destSigned: state.destSigned,
        pairVerified: state.pairVerified,
        baseAddress: address.address,
        destAddress: state.destAddress,
        destSignature: state.destSignature,
        baseSignature: state.baseSignature,
        destNetwork: state.destNetwork,
        network: address.network,
        isPaired: state.isPaired,
        groupId: appState.data.state.groupInfo.groupId
    } as MainPageProps;
}


export function ConnectBtn(props: IConnectViewProps) {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    return (
        <OutlinedBtn
            text={'Connect'}
            {...props}
            propStyle={
                styles.btn
            }
        />
    )
}

export function MainPage() {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const dispatch = useDispatch();
    const history = useHistory();
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const pageProps =  useSelector<BridgeAppState, MainPageProps>(state => stateToProps(state,userAccounts));

    useEffect(()=>{
        if(pageProps.reconnecting){
            reconnect(dispatch)
        }
    })

    const NotConnected = () => {
        const ConBot = <ConnectButtonWapper View={ConnectBtn} />

        return (
        <div style={styles.btnContainer}>
            <div style={styles.text}>Connect your Wallet.</div>
            <div>
                {ConBot}
            </div>
        </div>
        )
    }

    const Connected  = () => (
        <div>
             <div>
                <>
                    <div className="body-not-centered">
                        <div className="header title" style={styles.headerStyles}>  
                            Your Paired Addresses
                            <Divider/>
                        </div>
                        <div className="pad-main-body">
                            <div className="header" style={styles.headerStyles}>First Network</div>
                            <div className="content">
                                <div>
                                    <TextField
                                        placeholder={'Enter Network'}
                                        value={
                                            pageProps.isPaired ?
                                            pageProps.signedPairedAddress?.pair?.network1 || pageProps.pairedAddress?.network1
                                            :   pageProps.network
                                        }
                                        disabled={true}
                                        styles={styles.inputStyle}
                                    />
                                </div>
                            </div>
                            <div className="header">Address</div>
                            <div className="content">
                                <div>
                                    <TextField
                                        placeholder={'Enter Address'}
                                        value={
                                           pageProps.isPaired ?
                                           pageProps.signedPairedAddress?.pair?.address1 || pageProps.pairedAddress?.address1
                                            :   pageProps.baseAddress || pageProps.pairedAddress?.address1
                                        }
                                        disabled={true}
                                        styles={styles.inputStyle}
                                    />
                                </div>
                            </div>
                            { 
                              (!pageProps.signedPairedAddress?.pair?.address1 && !pageProps.pairedAddress?.address1 && !pageProps.baseAddress) && <div className="header centered" style={styles.textStyles}>Kindly refresh this page to reset the pair connection.</div>
                            }
                            {
                                (pageProps.isPaired && !pageProps.baseSignature) &&
                                <div>
                                    <OutlinedBtn
                                        text={'Sign to Prove OwnerShip'}
                                        onClick={()=> signFirstPairAddress(dispatch,pageProps.pairedAddress)}
                                    /> 
                                </div>
                            }
                            {
                                (pageProps.baseSigned || pageProps.baseSignature) && 
                                    <div>
                                        <div className="successful-cont">
                                            <img style={{"width":'30px'}} src={greenTick}/>
                                            <div className="header" style={styles.textStyles}> Signed Successfully</div>
                                        </div>
                                    </div>
                            }
                            
                        </div>
                        
                        
                        <div className="pad-main-body">
                            {
                                !pageProps.destConnected &&
                                <>
                                    <div className="header">Second Network</div>
                                    {
                                        pageProps.destConnected ?
                                        pageProps.destNetwork
                                            :   <div className="content">
                                                    <select name="networks" id="networks" onChange={(v)=>onDestinationNetworkChanged(
                                                        dispatch,v.target.value)}  disabled={pageProps.isPaired ? true : false} style={styles.textStyles}>
                                                        {
                                                            pageProps.isPaired ? 
                                                                <option key={pageProps.destNetwork} value={pageProps.destNetwork} style={{...styles.textStyles,...styles.optionColor}} >{pageProps.destNetwork}</option>
                                                            :
                                                            Object.keys(CHAIN_ID_FOR_NETWORK).map(n => (
                                                                <option style={{...styles.textStyles,...styles.optionColor}} key={n} value={n}>{n}</option> 
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                    }
                                    <div className="header">Address</div>
                                    {
                                        pageProps.destConnected ?
                                        pageProps.destNetwork :
                                            <div className="content">
                                                <TextField
                                                    placeholder={'Enter Your Second Network Address'}
                                                    onChange={(e,v)=>onAddressChanged(dispatch,v||'')}
                                                    defaultValue={pageProps.destAddress}
                                                    disabled={pageProps.isPaired ? true : false}
                                                    styles={styles.inputStyle}
                                                    value={pageProps.destAddress}
                                                />
                                            </div>
                                    }
                                    {
                                        !pageProps.isPaired &&
                                        (!pageProps.destSigned && pageProps.destAddress) && 
                                            <div className="centered">
                                                <OutlinedBtn
                                                    text={'Pair Addresses'}
                                                    onClick={()=>pairAddresses(dispatch,pageProps.network,pageProps.baseAddress)}
                                                    disbabled={!!pageProps.destAddress}
                                                />  
                                            </div>
                                    }
                                    {
                                        (!pageProps.destSignature) ?
                                            (pageProps.isPaired) &&
                                            <>
                                                {
                                                    (connected) ? 
                                                        (pageProps.network === pageProps.destNetwork) ?
                                                        <OutlinedBtn
                                                            text={'Sign to Prove OwnerShip'}
                                                            onClick={()=>signSecondPairAddress(
                                                                dispatch,
                                                                pageProps.pairedAddress,
                                                                pageProps.baseSignature
                                                            )}
                                                            disbabled={!!pageProps.destAddress}
                                                        /> :  <div className="header centered" style={styles.textStyles}>Connect your MetaMask to {pageProps.destNetwork} in order to Sign this Address.</div>
                                                    :   <div></div>
                                                    
                                                } 
                                            </>
                                        :   <div>
                                                <div className="successful-cont">
                                                    <img style={{"width":'30px'}} src={greenTick}/>
                                                    <div className="header" style={styles.textStyles}> Signed Successfully</div>
                                                </div>
                                            </div>
                                    }
                                </>
                            }
                        </div>      
                        {
                            pageProps.network ?
                            <div className="pad-main-body verify">
                                <div>
                                {
                                    (pageProps.isPaired) &&
                                        <OutlinedBtn
                                            text={'UnPair and Reset'}
                                            onClick={pageProps.signedPairedAddress?.signature1 ? () => unPairAddresses(dispatch,pageProps.signedPairedAddress!) : ()=> resetPair(dispatch)}
                                        />
                                }
                                </div>
                                <div>
                                {
                                    (pageProps.destSignature && pageProps.baseSignature) &&
                                        <OutlinedBtn
                                            text={'Swap Token'}
                                            onClick={()=>startSwap(dispatch,history,pageProps.groupId)}
                                        />
                                }
                                </div>
                                <div>
                                {
                                    (pageProps.destSignature && pageProps.baseSignature) &&
                                        <OutlinedBtn
                                            text={'Manage Liquidity'}
                                            onClick={()=>manageLiquidity(dispatch,history,pageProps.groupId)}
                                        />
                                }   
                                </div>                     
                            </div>
                            : <div className="content notif centered"> Kindly Reconnect to network</div>
                        }                  
                    </div>
                </>
            </div>
        </div>
    )

    return (
        <Page>
            <div className="page_cont">
                <div style={connected ? styles.notConnectedContainer : styles.container }>
                    {
                        connected ? 
                          Connected()
                        : NotConnected()
                    }
                </div>
            </div>
        </Page>
    )
}


//@ts-ignore
const themedStyles = (theme) => ({
    container: {
        marginTop: '5%',
        width: '100%',
        justifyContent: 'center',
        display: 'flex'
    },
    notConnectedContainer: {
        width: '70%',
        justifyContent: 'center'
    },
    text:{
        color: theme.get(Theme.Colors.textColor),
        marginBottom: '1rem',
        textAlign: "center" as "center"
    },
    btnContainer: {
        width: '13%'
    },
    btn:{
        padding: '5px',
        height: '40px'
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