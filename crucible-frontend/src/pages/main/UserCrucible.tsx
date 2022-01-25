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
import { CrucibleInfo, inject } from 'types';
import { addAction,CommonActions } from '../../common/CommonActions';

export const loadCrucible = createAsyncThunk('crucible/load',
	async (payload: { crucibleCurrency: string }, ctx) => {
        ctx.dispatch(addAction(CommonActions.WAITING, {}));
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getCrucible(ctx.dispatch, payload.crucibleCurrency);
});

export const loadCrucibleUserInfo = createAsyncThunk('crucible/loadUserInfo',
	async (payload: { crucibleCurrency: string }, ctx) => {
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getUserCrucibleInfo(ctx.dispatch, payload.crucibleCurrency);
        ctx.dispatch(addAction(CommonActions.WAITING_DONE, {}));
});

export const loadCruciblePriceInfo = createAsyncThunk('crucible/loadCruciblePriceInfo',
	async (payload: { crucibleData: CrucibleInfo }, ctx) => {
        ctx.dispatch(addAction(CommonActions.WAITING_DONE, {}));
		const client = inject<CrucibleClient>(CrucibleClient);
        //@ts-ignore
        //await client.getPairPrice(ctx.dispatch, payload.crucibleData?.currency, payload.crucibleData?.baseCurrency);
        await client.getPairPrice(ctx.dispatch, 'ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c', 'ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c');
        console.log("FINAL")

});

export function UserCrucible (props: {url:string})  {
    let {network, contractAddress} = useParams() as any;
    const crucibleCurrency = `${network.toUpperCase()}:${(contractAddress || '').toLowerCase()}`;
    const initialized = useSelector<CrucibleAppState, boolean>(state => state.data.init.initialized);
    const userAddress = useSelector<CrucibleAppState, string|undefined>( state => addressForUser(state.connection.account.user)?.address);
    const crucibleData = useSelector<CrucibleAppState, CrucibleInfo>( state => state.data.state.crucible||'');
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (initialized && !!network && !!contractAddress) {
            dispatch(loadCrucible({crucibleCurrency}));
        }
        if (initialized && !!contractAddress && !!network && !!userAddress) {
            dispatch(loadCrucibleUserInfo({crucibleCurrency}));
        }

        if (!!crucibleData.currency) {
            dispatch(loadCruciblePriceInfo({crucibleData}));
        }

    },[network,contractAddress,initialized,crucibleCurrency,userAddress,crucibleData.currency])

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