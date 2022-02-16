import React, { useState } from 'react';
import { FLayout, FContainer,FCard, FInputText, FButton,FInputTextField } from "ferrum-design-system";
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../../../common/CrucibleAppState';
import { CrucibleBox } from './../../crucibleLgcy/CrucibleBox';
import { CrucibleInfo, Utils,UserCrucibleInfo,BigUtils,inject,ChainEventBase,CrucibleAllocationMethods,CRUCIBLE_CONTRACTS_V_0_1 } from 'types';
import { useHistory, useParams } from 'react-router';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CrucibleClient, CrucibleClientActions } from '../../../common/CrucibleClient';
import { ApiClient } from 'common-containers';
import {crucibleBoxSlice} from './../../crucibleLgcy/CrucibleBox';
import { APPLICATION_NAME,addAction,CommonActions } from '../../../common/CommonActions';
import { transactionListSlice } from 'common-containers/dist/chain/TransactionList';
import { Actions as TxModal,TxModalState } from '../../../common/transactionModal';
import { ConnectButtonWapper } from 'common-containers';
import {
    ValidationUtils
  } from "ferrum-plumbing";
  import {ApprovableButton} from './../../../common/ApprovableBtn';
import {changeNetwork} from 'common-containers';
import { CardFooter } from './../../../common/CardFooter';

const doWithdraw = createAsyncThunk('crucibleBox/doWithdraw',
    async (payload: {
		network: string,
		currency: string,
		crucible: string,
		amount: string,
        balance:string
	}, ctx) => {
    try {
        const {network, currency, crucible, amount} = payload;
        const client = inject<CrucibleClient>(CrucibleClient);
        ValidationUtils.isTrue(((Number(payload.balance)-Number(amount)) > 0.1),'Not Enough Crucible Token Balance Available for this transaction');
        const transactionId = await client.withdraw(ctx.dispatch,currency, crucible, amount);
        if (!!transactionId) {
            ctx.dispatch(TxModal.toggleModal({mode:'submitted',show: true}))
            ctx.dispatch(crucibleBoxSlice.actions.registerTx({transactionId,network }));
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
    } catch (e) {
        console.log(e)
        ctx.dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    } finally{
        ctx.dispatch(addAction(CrucibleClientActions.PROCESSING_REQUEST, {}));
    }
});

export function WithdrawCrucible(){
    let {network, contractAddress} = useParams() as any;
    const [amount, setAmount] = useState('');
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state =>
		state.data.state.crucible);
	const dispatch = useDispatch();
    const history = useHistory()
    let transactionStatus = useSelector<CrucibleAppState, string|undefined>(state => state.ui.transactionModal.status);
    let userCrucible = useSelector<CrucibleAppState, UserCrucibleInfo|undefined>(state =>crucible?.currency ? state.connection.userState.userCrucibleInfo[crucible!.currency] : undefined);
    let connected = useSelector<CrucibleAppState, string|undefined>(state =>crucible?.currency ? state.connection.account.user.accountGroups[0].addresses[0]?.address : undefined);

    const depositOpen = crucible ? crucible?.activeAllocationCount > 0 || BigUtils.truthy(BigUtils.safeParse(crucible.openCap)) : false;
    const enableWithdraw = userCrucible ? userCrucible!.balance !== '' && userCrucible!.balance !== '0' : false;
	const userDirectAllocation = (userCrucible?.allocations || []
		).find(a => a.method === CrucibleAllocationMethods.DEPOSIT)?.allocation || '';
	// if (!Utils.addressEqual(crucible?.contractAddress!, contractAddress)) {
	// 	crucible = undefined;
	// }
    let netowrk = useSelector<CrucibleAppState, string|undefined>(state =>crucible?.currency ? state.connection.account.user.accountGroups[0].addresses[0]?.network : undefined);

    return (
        <>
		    <div className='fr-flex-container'>
                <FCard className='mini-card'>
                    <span className='header'>
                        {userCrucible?.symbol  || 'Base Token'} Balance
                    </span>
                    <span className='content '>{userCrucible?.balance|| 0}</span>
                </FCard>
                
                <FCard className='mini-card'>
                    <span className='header'>{crucible?.symbol || 'Crucible Token'} Price (USD)</span>
                    <span className='content'>${crucible?.priceUsdt || 0}</span>
                </FCard>
            </div>
            <>
                <FCard className='crucible-filled-card'>
                    <div className='header'>
                        <span className="back-btn" onClick={()=>history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}`)}>
                            ←
                        </span>
                        <span className="title underline">
                            Withdraw Crucible Token
                        </span>
                        <span role="img" aria-label="wizard-icon" style={{"margin": "2px",'fontSize': '15px'}}>&#127855;</span>
                    </div>
                    <div>
                        <FInputText
                            className={'crucible-input'}
                            placeholder={'Amount to Withdraw'}
                            onChange={ (v:any) => setAmount(v.target.value)}
                            value={amount}
                            type={'Number'}
                        />
                    </div>
                    <div className='subtxt'>
                        You have {Number(userCrucible?.balance||'0').toFixed(3)} available in Crucible {userCrucible?.symbol}.
                    </div>
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
                            postfix={<div className='input-label'>{userCrucible?.baseSymbol}</div>}
                            label={''}
                            value={(Number(amount) - (Number(amount)*((Number(BigUtils.safeParse(crucible?.feeOnWithdrawRate || '0').times(100))/100))))}
                            disabled={true}                        
                        />
                    </div>
                    <CardFooter crucible={crucible}/>
                    { (!connected || (netowrk!=crucible!.network)) ?
                        <ConnectButtonWapper View={(props)=>(
                            <FButton 
                                title={(netowrk!=crucible?.network) ? 'Switch to Crucible Network' : 'Connect to Wallet'}
                                disabled={!!connected && (netowrk==crucible?.network)}
                                {...props}
                                onClick={()=>changeNetwork(crucible!.network)}
                            />)}
                        />
                    :
                        <ApprovableButton
                            disabled={!enableWithdraw||Number(amount)<=0||transactionStatus==='waiting'||!connected}
                            text={`${transactionStatus==='waiting' ? 'Processing' : 'Withdraw'}`}
                            contractAddress={CRUCIBLE_CONTRACTS_V_0_1[crucible?.network||''].router}
                            amount={'1'}
                            onClick={()=> dispatch(doWithdraw({
                                network: network,
                                crucible: crucible?.currency||'',
                                currency: crucible?.baseCurrency||'',
                                amount:amount,
                                balance: userCrucible?.balance|| '0'
                            }))}
                            currency={crucible!.baseCurrency}
                            userAddress={connected}
                        />          
                    }
                    <FCard className='center' style={{"paddingTop":"6px","fontSize":"12px"}}>
                        <span role="img" aria-label="wizard-icon" style={{"marginRight": "0px","lineHeight": 2}}>&#127855;</span> Crucible withdrawal depoists equivalent base token in your wallet.
                    </FCard>	
                </FCard>
            </>

        </>
    )
}