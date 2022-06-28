import React,{ useEffect } from 'react'
import { Route, useParams} from 'react-router';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { addressForUser } from 'common-containers';
import { CrucibleInfo, inject } from 'types';
import {WithdrawCrucible} from '../crucibleItem/transaction/withdraw';
import {MintCrucible} from '../crucibleItem/transaction/mint';
import {CrucibleHome} from '../crucibleItem/home/index';
import { StakeCrucible } from '../crucibleItem/staking/stake';
import { UnStakeCrucible } from '../crucibleItem/staking/unstake';
import { WithdrawStakeCrucible } from '../crucibleItem/staking/withdraw-rewards';
import { StakingList } from '../crucibleItem/staking/stakingList';
import { CrucibleAppState } from '../../common/CrucibleAppState';
import { CrucibleClient } from '../../common/CrucibleClient';
import { addAction,CommonActions } from '../../common/CommonActions';

export const loadCrucible = createAsyncThunk('crucible/load',
	async (payload: { crucibleCurrency: string }, ctx) => {
        ctx.dispatch(addAction(CommonActions.WAITING, {}));
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getCrucible(ctx.dispatch, payload.crucibleCurrency);
});

export const loadCrucibleUserInfo = createAsyncThunk('crucible/loadUserInfo',
	async (payload: { crucibleCurrency: string }, ctx) => {
        ctx.dispatch(addAction(CommonActions.WAITING, {}));
		const client = inject<CrucibleClient>(CrucibleClient);
		await client.getUserCrucibleInfo(ctx.dispatch, payload.crucibleCurrency);
});

export const loadCruciblePriceInfo = createAsyncThunk('crucible/loadCruciblePriceInfo',
	async (payload: { crucibleData: CrucibleInfo }, ctx) => {
		const client = inject<CrucibleClient>(CrucibleClient);
        //@ts-ignore
        //await client.getPairPrice(ctx.dispatch, payload.crucibleData?.currency, payload.crucibleData?.baseCurrency);
        await client.getPairPrice(ctx.dispatch, payload.crucibleData?.currency, payload.crucibleData?.baseCurrency);
        console.log("FINAL")
        ctx.dispatch(addAction(CommonActions.WAITING_DONE, {}));

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
            <Route path={`${props.url}/staking`}>
                <StakingList/>
            </Route>
            <Route
                path={`${props.url}/:stakingId/stake`}
            >
                <StakeCrucible/>								
            </Route>
            <Route
                path={`${props.url}/:stakingId/unstake`}
            >
                <UnStakeCrucible/>								
            </Route>
            <Route
                path={`${props.url}/:stakingId/withdraw-rewards`}
            >
                <WithdrawStakeCrucible/>								
            </Route>
          
        </>
    )
}