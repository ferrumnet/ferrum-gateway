import React, { useEffect, useState } from 'react';
import { FLayout, FContainer,FCard, FInputText, FButton,FInputTextField,FInputCheckbox } from "ferrum-design-system";
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../../../common/CrucibleAppState';
import { CrucibleInfo,UserCrucibleInfo, Utils,BigUtils,inject,ChainEventBase,CrucibleAllocationMethods,CRUCIBLE_CONTRACTS_V_0_1 } from 'types';
import { useHistory, useParams } from 'react-router';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CrucibleClient, CrucibleClientActions } from '../../../common/CrucibleClient';
import { ApiClient } from 'common-containers';
import {crucibleBoxSlice} from './../../crucibleLgcy/CrucibleBox';
import { addAction, APPLICATION_NAME,CommonActions } from '../../../common/CommonActions';
import { transactionListSlice } from 'common-containers/dist/chain/TransactionList';
import { ConnectButtonWapper,approvalKey } from 'common-containers';
import {
  ValidationUtils
} from "ferrum-plumbing";
import {ApprovableButton} from './../../../common/ApprovableBtn';
import {changeNetwork} from 'common-containers';
import { CardFooter } from './../../../common/CardFooter';

const doStake = createAsyncThunk('crucibleBox/doStake',
    async (payload: {
		network: string,
		crucible: string,
		currency: string,
		amount: string,
		isPublic: boolean,
        balance:string,
        stakingAddress: string,
        type: string
	}, ctx) => {
    try {
        ctx.dispatch(addAction(CrucibleClientActions.PROCESSING_REQUEST, {}));
        const {network, crucible, currency, amount, stakingAddress } = payload;
        console.log('PL":', payload,)
        const client = inject<CrucibleClient>(CrucibleClient);
        const api = inject<ApiClient>(ApiClient);
        ValidationUtils.isTrue(!((Number(payload.balance)-Number(amount)) < 0),'Not Enough Balance Available in Crucible Token for this transaction');
        let transactionId = await client.stakeCrucible(ctx.dispatch, currency, crucible, amount, stakingAddress);
        if (!!transactionId) {
            ctx.dispatch(crucibleBoxSlice.actions.registerTx({
                transactionId,
                network }));
            const event = {
                createdAt: 0,
                id: transactionId,
                network,
                eventType: 'transaction',
                application: APPLICATION_NAME,
                status: 'pending',
                transactionType: 'Stake',
                userAddress: api.getAddress(),
            } as ChainEventBase;
            ctx.dispatch(transactionListSlice.actions.addTransaction(event));
        }
    } catch (e) {
        console.log(e)
        ctx.dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally{
        ctx.dispatch(addAction(CrucibleClientActions.PROCESSING_REQUEST, {}));
    }

    
});

export function StakeCrucible(){
    let {network, contractAddress,stakingId} = useParams() as any;
    const [amount, setAmount] = useState('');
    const [stake, setStake] = useState(false)
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state =>
		state.data.state.crucible);
	const dispatch = useDispatch();
    const history = useHistory()
    let transactionStatus = useSelector<CrucibleAppState, string|undefined>(state => state.ui.transactionModal.status);
	// if (!Utils.addressEqual(crucible?.contractAddress!, contractAddress)) {
	// 	crucible = undefined;
	// }
    let userCrucible = useSelector<CrucibleAppState, UserCrucibleInfo|undefined>(state =>
		crucible?.currency ?
			state.connection.userState.userCrucibleInfo[crucible!.currency] : undefined);
    const depositOpen = crucible ? crucible?.activeAllocationCount > 0 || BigUtils.truthy(BigUtils.safeParse(crucible.openCap)) : false;
    const enableWithdraw = userCrucible ? userCrucible!.balance !== '' && userCrucible!.balance !== '0' : false;
	const userDirectAllocation = (userCrucible?.allocations || []
		).find(a => a.method === CrucibleAllocationMethods.DEPOSIT)?.allocation || '';
    let connected = useSelector<CrucibleAppState, string|undefined>(state =>crucible?.currency ? state.connection.account.user.accountGroups[0].addresses[0]?.address : undefined);
    let netowrk = useSelector<CrucibleAppState, string|undefined>(state =>crucible?.currency ? state.connection.account.user.accountGroups[0].addresses[0]?.network : undefined);
    let active_crucible = crucible?.staking![stakingId as any] || {};
    
    useEffect(()=>{
        if(crucible && !active_crucible){
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: 'There is no staking configured for this crucible' }));
        }
    },[crucible?.contractAddress])

    return (
        <>
		    <div className='fr-flex-container'>
                <FCard className='mini-card'>
                    <span className='header'>
                        {crucible?.baseSymbol || 'Base Token'} Price (USD)
                    </span>
                    <span className='content '>${crucible?.basePriceUsdt|| 0}</span>
                </FCard>
                
                <FCard className='mini-card'>
                    <span className='header'>{crucible?.symbol || 'Crucible Token'} Price (USD)</span>
                    <span className='content'>${crucible?.priceUsdt || 0}</span>
                </FCard>
            </div>
            <>
                <FCard className='crucible-filled-card'>
                    <div className='header'>
                        <span className="back-btn" onClick={()=> crucible && history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}`)}>
                            ←
                        </span>
                        <span className="title underline">
                            Stake Crucible Token
                        </span>
                    </div>
                    <div>
                        <FInputText
                            className={'crucible-input'}
                            placeholder={'Amount to Stake'}
                            onChange={ (v:any) => setAmount(v.target.value)}
                            value={amount}
                            type={Number}
                            //setMax={() => setAmount((userCrucible.allocation && BigUtils.safeParse(crucible.allocation).lt(BigUtils.safeParse(userCrucible.balance))) ? userCrucible.allocation : userCrucible.balance)}
                        />
                    </div>
                    <div className='subtxt'>
                        You have {Number(userCrucible?.balance||'0').toFixed(3)} {userCrucible?.symbol} available to Stake.
                    </div>
                    <CardFooter crucible={crucible}/>
                    { (!connected || (netowrk!=crucible?.network)) ?
                        <ConnectButtonWapper View={(props)=>(
                            <FButton 
                                title={(netowrk!=crucible?.network) ? 'Switch to Crucible Network' : 'Connect to Wallet'}
                                disabled={!!connected && (netowrk==crucible?.network)}
                                {...props}
                                onClick={(netowrk!=crucible?.network) ? ()=>changeNetwork(crucible!.network):()=>{}}
                            />)}
                        />

                    :
                        <ApprovableButton
                            disabled={!depositOpen||Number(amount)<=0||transactionStatus==='waiting'}
                            text={`${transactionStatus==='waiting' ? 'Processing' : 'Stake Crucible🍯'}`}
                            contractAddress={CRUCIBLE_CONTRACTS_V_0_1[crucible?.network||''].router}
                            amount={'1'}
                            onClick={()=> dispatch(doStake({
                                network: network,
                                crucible: crucible?.contractAddress||'',
                                currency: crucible?.baseCurrency||'',
                                amount:amount,
                                type: stake ? "mintAndStake" : "mint",
                                stakingAddress: active_crucible?.address || '0x',
                                isPublic: !!crucible?.openCap && !userDirectAllocation,
                                balance: userCrucible?.balance || '0'
                            }))}
                            currency={crucible!.currency}
                            userAddress={connected}
                        />                                
                    }
                </FCard>
            </>

        </>
    )
}