import React,{Dispatch, useEffect} from 'react';
import { Connect } from 'unifyre-extension-web3-retrofit/dist/contract/Connect';
import { ValidationUtils } from 'ferrum-plumbing';
import { CurrencyList, UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { AnyAction, createSlice } from '@reduxjs/toolkit';
import { addressForUser, AppAccountState, AppState, dummyAppUserProfile } from '../store/AppState';
import { useDispatch, useSelector } from 'react-redux';
import { inject, inject3, inject4, inject5, } from 'types';
import { AddressDetails } from 'unifyre-extension-sdk/dist/client/model/AppUserProfile';
import { ApiClient } from '../clients/ApiClient';
import { Web3ModalProvider } from 'unifyre-extension-web3-retrofit/dist/contract/Web3ModalProvider';

export const DEFAULT_TOKEN_FOR_WEB3_MODE = {
    4: 'RINKEBY:0x93698a057cec27508a9157a946e03e277b46fe56',
    1: 'ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c',
    97: 'BSC_TESTNET:0xae13d989dac2f0debff460ac112a837c89baa7cd',
    56: 'BSC:0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
};

export const connectSlice = createSlice({
    name: 'connect',
    initialState: {
        user: dummyAppUserProfile,
    } as AppAccountState,
    reducers: {
        connectionSucceeded: (state, action) => {
            const {userProfile} = action.payload;
            state.user = userProfile;
            state.connectionError = undefined;
        },
        reconnected: (state, action) => {
            const {userProfile} = action.payload;
            state.user = userProfile;
            state.connectionError = undefined;
        },
        connectionFailed: (state, action) => {
            state.connectionError = action.payload.message || action.payload.toString();
        },
        disconnect: state => {
            state.connectionError = undefined;
            state.user = dummyAppUserProfile;
        },
        clearError: state => {
            state.connectionError = undefined;
        }
    }});

const Actions = connectSlice.actions;

export interface IConnectOwnProps {
    onConnect: () => Promise<boolean>;
    View: (props: IConnectViewProps) => any;
}

export interface IConnectViewProps {
    connected: boolean;
    network: string;
    address: string;
    error?: string;
    onClick: () => void;
}

const onDisconnect = async (dispatch: Dispatch<AnyAction>) => {
    const connect = inject<Connect>(Connect);
    console.log('Disconnecting...');
    await connect.getProvider()!.disconnect();
    dispatch(Actions.disconnect());
}

async function reConnect(dispatch: Dispatch<AnyAction>) {
    const [client, connect, api] = inject3<UnifyreExtensionWeb3Client, Connect, ApiClient>(
        UnifyreExtensionWeb3Client, Connect, ApiClient);
    await connect.reset();
    console.log('CON RES ISO ', connect.netId(), connect.account());
    const userProfile = await client.getUserProfile();
    const res = await api.signInToServer(userProfile);
    if (res) {
        dispatch(Actions.reconnected({userProfile}));
    } else {
        onDisconnect(dispatch);
    }
}

async function doConnect(dispatch: Dispatch<AnyAction>,
    isAutoConnect: boolean,
    ) {
        console.log('Using web3')
    const [client, connect, currencyList, api, provider] = 
        inject5<UnifyreExtensionWeb3Client, Connect, CurrencyList, ApiClient, Web3ModalProvider>(
            UnifyreExtensionWeb3Client, Connect, CurrencyList, ApiClient, 'Web3ModalProvider');
    try {
        if (isAutoConnect && !provider.isCached()) {
            return; // Dont try to connect if we are not cached.
        }
        connect.setProvider(provider);
        await client.signInWithToken('');
        const net = await connect.getProvider()!.netId();
        const network = await connect.network();
        const newNetworkCurrencies = (currencyList.get() || []).filter(c => c.startsWith(network || 'NA'));
        if (net && newNetworkCurrencies.length == 0) {
            const defaultCur = (DEFAULT_TOKEN_FOR_WEB3_MODE as any)[net as any];
            console.log(`= Connected to net id ${net} with no defined currency: ${defaultCur}`);
            currencyList.set(Object.values(DEFAULT_TOKEN_FOR_WEB3_MODE));
        }
        
        // Subscribe to session disconnection
        console.log('Provider is...', connect.getProvider())
        connect.getProvider()!.addEventListener('disconnect', (reason: string) => {
            console.log('DISCONNECTED FROM WALLET CONNECT', reason);
            dispatch(Actions.disconnect());
        });
        connect.getProvider()!.addEventListener('change', () => {
            console.log('RECONNECTING');
            reConnect(dispatch);
        });
        const userProfile = await client.getUserProfile();
        const res = await api.signInToServer(userProfile);
        if (res) {
            dispatch(Actions.connectionSucceeded({userProfile}));
        } else {
            connect.getProvider()?.disconnect();
        }
    } catch (e) {
        console.error('wsConnect', e);
        if (e) {
            try {
                console.log('Disconnecting failed connection !!', e);
                if (provider) {
                    await provider.disconnect();
                }
            } catch (de) {
                console.error('Error disconnecting provider ', de);
            }
            dispatch(Actions.connectionFailed({ message: `Connection failed ${e.message}` }));
        }
    }
}

const AUTO_CON = { tried: false };

export function ConnectButtonWapper(props: IConnectOwnProps) {
    const dispatch = useDispatch();
    const appInitialized = useSelector<AppState<any, any, any>, boolean>(state => 
        state.data.init.initialized);
    const connected = useSelector<AppState<any, any, any>, boolean>(state => 
        !!state.connection.account?.user?.userId);
    const address = useSelector<AppState<any, any, any>, AddressDetails | undefined>(state => 
        addressForUser(state.connection.account?.user));
    const error = useSelector<AppState<any, any, any>, string | undefined>(state => 
        state.connection.account.connectionError);
    const connector = async () => {
        await doConnect(
            dispatch,
            true);
    }
    useEffect(() => {
        if (AUTO_CON.tried) return;
        if (appInitialized && !connected) {
            AUTO_CON.tried = true;
            connector();
        }
    },[connector, appInitialized, connected])
    ValidationUtils.isTrue(!!props.View, '"View" must be set');

    if (!appInitialized) {
        return (<div>...</div>)
    }

    return (
        <>
            <props.View
                connected={connected}
                address={address?.address || ''}
                network={address?.network || ''}
                error={error}
                onClick={() => {
                    if (connected) {
                        onDisconnect(dispatch);
                    } else {
                        doConnect(
                            dispatch,
                            false);
                    }
                }}
            />
        </>
    );
}