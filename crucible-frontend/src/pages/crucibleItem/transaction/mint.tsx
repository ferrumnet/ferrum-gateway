import React, { useState } from 'react';
import { FLayout, FContainer,FCard, FInputText, FButton,FInputTextField } from "ferrum-design-system";
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

const doDeposit = createAsyncThunk('crucibleBox/doDeposit',
    async (payload: {
		network: string,
		crucible: string,
		currency: string,
		amount: string,
		isPublic: boolean,
        balance:string
	}, ctx) => {
    try {
        ctx.dispatch(addAction(CrucibleClientActions.PROCESSING_REQUEST, {}));
        const {network, crucible, currency, amount, isPublic} = payload;
        console.log('PL":', payload,)
        const client = inject<CrucibleClient>(CrucibleClient);
        const api = inject<ApiClient>(ApiClient);
        ValidationUtils.isTrue(((Number(payload.balance)-Number(amount)) < 0),'Not Enough Balance Available in Base Token for this transaction');
        const transactionId = await client.deposit(ctx.dispatch, currency, crucible, amount, isPublic);
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
                transactionType: 'deposit',
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

export function MintCrucible(){
    let {network, contractAddress} = useParams() as any;
    const [amount, setAmount] = useState('');
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
                            Deposit and Mint Crucible Token
                        </span>
                    </div>
                    <div>
                        <FInputText
                            className={'crucible-input'}
                            placeholder={'Amount to Mint'}
                            onChange={ (v:any) => setAmount(v.target.value)}
                            value={amount}
                            type={Number}
                            //setMax={() => setAmount((userCrucible.allocation && BigUtils.safeParse(crucible.allocation).lt(BigUtils.safeParse(userCrucible.balance))) ? userCrucible.allocation : userCrucible.balance)}
                        />
                    </div>
                    <div className='subtxt'>
                        You have {userCrucible?.baseBalance} available in Base Token {userCrucible?.baseSymbol}.
                    </div>
                    {
                        Number(amount) > 0 && 
                        <>
                            <div className="down-btn">
                                <span >
                                    ↓
                                </span>
                            </div>
                            <div className='subtxt'>
                                Amount you will receive
                            </div>
                            <div>
                                <FInputTextField
                                    className={'crucible-text-input'}
                                    placeholder={'Amount you will receive'}
                                    postfix={<div className='input-label'>{userCrucible?.symbol}</div>}
                                    value={amount}
                                    disabled={true}
                                />
                            </div>
                        </>
                    }
                   
                    <div className='cr-footer'>
                        <div className='heading'>
                            Crucible Token Info
                        </div>
                        <div className='content'>
                            <span>
                               <span>{`${BigUtils.safeParse(crucible?.feeOnTransferRate || '0').times(100).toString()}%`}</span>
                               <span className='label'> Withdraw Fee</span>
                            </span>
                            <span>
                                <span>{`${BigUtils.safeParse(crucible?.feeOnWithdrawRate || '0').times(100).toString()}%`}</span>
                               <span className='label'> Transfer Fee</span>
                            </span>
                            <span>
                                <span>{crucible?.symbol}</span>
                               <span className='label'>Crucible Token</span>
                            </span>
                        </div>
                    </div>
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
                            text={`${transactionStatus==='waiting' ? 'Processing' : 'Mint Crucible🍯'}`}
                            contractAddress={CRUCIBLE_CONTRACTS_V_0_1[crucible?.network||''].router}
                            amount={'1'}
                            onClick={()=> dispatch(doDeposit({
                                network: network,
                                crucible: crucible?.currency||'',
                                currency: crucible?.baseCurrency||'',
                                amount:amount,
                                isPublic: !!crucible?.openCap && !userDirectAllocation,
                                balance: userCrucible?.baseBalance || '0'
                            }))}
                            currency={crucible!.baseCurrency}
                            userAddress={connected}
                        />                                
                    }
                </FCard>
            </>

        </>
    )
}