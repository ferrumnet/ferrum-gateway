import React, { useState } from 'react';
import { FLayout, FContainer,FCard, FInputText, FButton,FInputTextField } from "ferrum-design-system";
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../../../common/CrucibleAppState';
import { CrucibleBox } from './../../CrucibleBox';
import { CrucibleLoader } from './../../CrucibleLoader';
import { CrucibleInfo, Utils,UserCrucibleInfo,BigUtils,inject,ChainEventBase,CrucibleAllocationMethods } from 'types';
import { useParams } from 'react-router';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CrucibleClient } from '../../../CrucibleClient';
import { ApiClient } from 'common-containers';
import {crucibleBoxSlice} from './../../CrucibleBox';
import { APPLICATION_NAME } from '../../../common/CommonActions';
import { transactionListSlice } from 'common-containers/dist/chain/TransactionList';

const doWithdraw = createAsyncThunk('crucibleBox/doWithdraw',
    async (payload: {
		network: string,
		currency: string,
		crucible: string,
		amount: string,
	}, ctx) => {
	const {network, currency, crucible, amount} = payload;
	const client = inject<CrucibleClient>(CrucibleClient);
	const transactionId = await client.withdraw(ctx.dispatch,
		currency, crucible, amount);
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
			transactionType: 'withdraw',
		} as ChainEventBase;
		ctx.dispatch(transactionListSlice.actions.addTransaction(event));
	}
});

export function WithdrawCrucible(){
    let {network, contractAddress} = useParams() as any;
    const [amount, setAmount] = useState('');
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state =>
		state.data.state.crucible);
	const dispatch = useDispatch();
    let userCrucible = useSelector<CrucibleAppState, UserCrucibleInfo|undefined>(state =>
		crucible?.currency ?
			state.connection.userState.userCrucibleInfo[crucible!.currency] : undefined);
    const depositOpen = crucible ? crucible?.activeAllocationCount > 0 || BigUtils.truthy(BigUtils.safeParse(crucible.openCap)) : false;
    const enableWithdraw = userCrucible ? userCrucible!.balance !== '' && userCrucible!.balance !== '0' : false;
	const userDirectAllocation = (userCrucible?.allocations || []
		).find(a => a.method === CrucibleAllocationMethods.DEPOSIT)?.allocation || '';
	if (!Utils.addressEqual(crucible?.contractAddress!, contractAddress)) {
		crucible = undefined;
	}
    return (
        <>
            <CrucibleLoader network={network} contractAddress={contractAddress} />
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
                        <span className="back-btn">
                            ←
                        </span>
                        <span className="title">
                            Withdraw Crucible Token
                        </span>
                    </div>
                    <div>
                        <FInputText
                            className={'crucible-input'}
                            placeholder={'Amount to Withdraw'}
                            onChange={ (v:any) => setAmount(v.target.value)}
                            value={amount}
                        />
                    </div>
                    <div className='subtxt'>
                        You have {userCrucible?.balance} {userCrucible?.symbol} Crucible Token(s) Available.
                    </div>
                    <div className="down-btn">
                        <span >
                            ↓
                        </span>
                    </div>
                    <div>
                        <FInputTextField
                            className={'crucible-text-input'}
                            placeholder={'Amount you will receive'}
                            postfix={<div className='input-label'>{userCrucible?.baseSymbol}</div>}
                            label={'Equivalent in Base Token'}
                            value={amount}
                            disabled={true}
                        />
                    </div>
                    <div className='cr-footer'>
                        <div className='heading'>
                            Withdraw Price and Fee
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
                                <span>{crucible?.baseSymbol}</span>
                               <span className='label'>Base Token</span>
                            </span>
                        </div>
                    </div>
                    <FButton 
                        title={'Withdraw'}
                        disabled={!enableWithdraw||Number(amount)<=0}
                        className={'cr-large-btn'}
                        onClick={()=> dispatch(doWithdraw({
                            network: network,
                            crucible: crucible!.currency,
                            currency: crucible!.baseCurrency,
                            amount:amount
                        }))}
                        //disabled={!crucible?.enableWithdraw}
                        //onClick={()=>onWithdraw()}
                    />
                </FCard>
            </>

        </>
    )
}