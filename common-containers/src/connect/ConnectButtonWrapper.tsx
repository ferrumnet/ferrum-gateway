import React,{useEffect} from 'react';
import { Connect } from 'unifyre-extension-web3-retrofit/dist/contract/Connect';
import { ValidationUtils } from 'ferrum-plumbing';
import { CurrencyList, UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addressesForUser, addressForUser, AppAccountState, AppState, dummyAppUserProfile } from '../store/AppState';
import { useDispatch, useSelector } from 'react-redux';
import { ETH, FRM, FRMX, inject, inject3, inject5, } from 'types';
import { AddressDetails } from 'unifyre-extension-sdk/dist/client/model/AppUserProfile';
import { ApiClient } from '../clients/ApiClient';
import { Web3ModalProvider } from 'unifyre-extension-web3-retrofit/dist/contract/Web3ModalProvider';

export const DEFAULT_TOKENS_FOR_WEB3_MODE = [
    FRM['RINKEBY'][0],
    FRM['ETHEREUM'][0],
    FRM['POLYGON'][0],
    FRMX['ETHEREUM'][0],
    FRM['BSC_TESTNET'][0],
    FRM['MUMBAI_TESTNET'][0],
    ETH['ETHEREUM'][0],
    ETH['RINKEBY'][0],
    ETH['BSC_TESTNET'][0],
    ETH['BSC'][0],
    ETH['POLYGON'][0],
    ETH['MUMBAI_TESTNET'][0],
    ETH['AVAX_TESTNET'][0],

];

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
        userProfileUpdated: (state, action) => {
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
    View: (props: IConnectViewProps) => any;
}

export interface IConnectViewProps {
    connected: boolean;
    network: string;
    address: string;
    balances: AddressDetails[];
    error?: string;
    onClick: () => void;
}

export const onDisconnect = createAsyncThunk('connect/onDisconnect',
    async (payload: {}, ctx) => {
    const connect = inject<Connect>(Connect);
    console.log('Disconnecting...');
    await connect.getProvider()!.disconnect();
    ctx.dispatch(Actions.disconnect());
});

export const reConnect = createAsyncThunk('connect/reConnect', async (payload: {}, ctx) => {
    const [client, connect, api] = inject3<UnifyreExtensionWeb3Client, Connect, ApiClient>(
        UnifyreExtensionWeb3Client, Connect, ApiClient);
    await connect.reset();
    const userProfile = await client.getUserProfile();
    const res = await api.signInToServer(userProfile);
    if (res) {
        ctx.dispatch(Actions.reconnected({userProfile}));
    } else {
        ctx.dispatch(onDisconnect({}));
    }
});

export const onConnect = createAsyncThunk('connect/onConnect',
    async (payload: {isAutoConnect: boolean}, ctx) => {
    const [client, connect, currencyList, api, provider] = 
        inject5<UnifyreExtensionWeb3Client, Connect, CurrencyList, ApiClient, Web3ModalProvider>(
            UnifyreExtensionWeb3Client, Connect, CurrencyList, ApiClient, 'Web3ModalProvider');
    try {
        if (payload.isAutoConnect && !provider.isCached()) {
            return; // Dont try to connect if we are not cached.
        }
        connect.setProvider(provider);
        await client.signInWithToken('');
        const net = await connect.getProvider()!.netId();
        const network = await connect.network();
        const newNetworkCurrencies = (currencyList.get() || []).filter(c => c.startsWith(network || 'NA'));
        if (net && newNetworkCurrencies.length == 0) {
            currencyList.set(DEFAULT_TOKENS_FOR_WEB3_MODE);
        }
        
        // Subscribe to session disconnection
        // console.log('Provider is...', connect.getProvider())
        connect.getProvider()!.addEventListener('disconnect', (reason: string) => {
            console.log('DISCONNECTED FROM WALLET CONNECT', reason);
            ctx.dispatch(Actions.disconnect());
        });
        connect.getProvider()!.addEventListener('change', () => {
            console.log('RECONNECTING');
            ctx.dispatch(reConnect({}));
        });
        const userProfile = await client.getUserProfile();
        const res = await api.signInToServer(userProfile);
        if (res) {
            ctx.dispatch(Actions.connectionSucceeded({userProfile}));
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
            ctx.dispatch(Actions.connectionFailed({ message: `Connection failed ${(e as any).message}` }));
        }
    }
});

const AUTO_CON = { tried: false };

export function ConnectButtonWapper(props: IConnectOwnProps) {
    const dispatch = useDispatch();
    const appInitialized = useSelector<AppState<any, any, any>, boolean>(state => 
        state.data.init.initialized);
    const connected = useSelector<AppState<any, any, any>, boolean>(state => 
        !!state.connection.account?.user?.userId);
    const address = useSelector<AppState<any, any, any>, AddressDetails | undefined>(state => 
        addressForUser(state.connection.account?.user));
    const balances = useSelector<AppState<any, any, any>, AddressDetails[]>(state => 
        addressesForUser(state.connection.account?.user));
    const error = useSelector<AppState<any, any, any>, string | undefined>(state => 
        state.connection.account.connectionError);
    
    const connector = async () => {
        dispatch(onConnect({isAutoConnect: true}));
    }
    useEffect(() => {
        if (AUTO_CON.tried) return;
        if (appInitialized && !connected) {
            AUTO_CON.tried = true;
            connector();
        }
    },[connector, appInitialized, connected]);
    ValidationUtils.isTrue(!!props.View, '"View" must be set');

    if (!appInitialized) {
        return (<div>...</div>)
    }

    return (
        <>
            <props.View
                connected={connected}
                address={address?.address || ''}
                balances={balances}
                network={address?.network || ''}
                error={error}
                onClick={() => {
                    if (connected) {
                        dispatch(onDisconnect({isAutoConnect: false}));
                    } else {
                        dispatch(onConnect({isAutoConnect: false}));
                    }
                }}
            />
        </>
    );
}