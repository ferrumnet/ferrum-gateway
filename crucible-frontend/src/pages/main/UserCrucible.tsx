import React,{ useEffect } from 'react'
import { Redirect, Route, Switch, useParams,useHistory} from 'react-router';
import {WithdrawCrucible} from '../crucibleItem/transaction/withdraw';
import {MintCrucible} from '../crucibleItem/transaction/mint';
import {CrucibleHome} from '../crucibleItem/home/index';
import { addressForUser } from 'common-containers';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../../common/CrucibleAppState';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CrucibleClient } from '../../common/CrucibleClient';
import { inject } from 'types';

export const loadCrucible = createAsyncThunk('crucible/load',
	async (payload: { crucibleCurrency: string }, ctx) => {
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getCrucible(ctx.dispatch, payload.crucibleCurrency);
});

export const loadCrucibleUserInfo = createAsyncThunk('crucible/loadUserInfo',
	async (payload: { crucibleCurrency: string }, ctx) => {
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getUserCrucibleInfo(ctx.dispatch, payload.crucibleCurrency);
});

export function UserCrucible (props: {url:string})  {
    let {network, contractAddress} = useParams() as any;
    const crucibleCurrency = `${network.toUpperCase()}:${(contractAddress || '').toLowerCase()}`;
    const initialized = useSelector<CrucibleAppState, boolean>(state => state.data.init.initialized);
    const userAddress = useSelector<CrucibleAppState, string|undefined>( state => addressForUser(state.connection.account.user)?.address);
    const dispatch = useDispatch();
    
    useEffect(() => {
        
        if (initialized && !!network && !!contractAddress) {
            dispatch(loadCrucible({crucibleCurrency}));
        }
        if (initialized && !!contractAddress && !!network && !!userAddress) {
            dispatch(loadCrucibleUserInfo({crucibleCurrency}));
        }
    },[network,contractAddress,initialized,crucibleCurrency,userAddress])

    return(
        <>
            <Route path={`${props.url}/`} exact>
                <CrucibleHome />
            </Route>
            <Route  path={`${props.url}/withdraw`}>
                <WithdrawCrucible />
            </Route>
            <Route path={`${props.url}/mint`}>
                <MintCrucible />
            </Route>
        </>
    )
}