import React, { useState } from 'react';
import { FLayout, FContainer,FCard, FInputText, FButton,FInputCheckbox,FInputTextField } from "ferrum-design-system";
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

const doDeposit = createAsyncThunk('crucibleBox/doDeposit',
    async (payload: {
		network: string,
		crucible: string,
		currency: string,
		amount: string,
		isPublic: boolean,
        balance:string,
        type: string,
        stake?:string,
        resetAmount: () => void
	}, ctx) => {
    try {
        ctx.dispatch(addAction(CrucibleClientActions.PROCESSING_REQUEST, {}));
        const {network, crucible, currency, amount, isPublic,stake } = payload;
        console.log('PL":', payload,)
        const client = inject<CrucibleClient>(CrucibleClient);
        const api = inject<ApiClient>(ApiClient);
        ValidationUtils.isTrue(!((Number(payload.balance)-Number(amount)) < 0),'Not Enough Balance Available in Base Token for this transaction');
        let staking = payload.type === "mintAndStake"
        let transactionId
        if(staking && stake){
            transactionId = await client.depositAndStake(ctx.dispatch, currency, crucible,stake, amount, isPublic);
        }else{
            transactionId = await client.deposit(ctx.dispatch, currency, crucible, amount, isPublic);
        }
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
                transactionType: 'Mint',
                userAddress: api.getAddress(),
            } as ChainEventBase;
            ctx.dispatch(transactionListSlice.actions.addTransaction(event));
            payload.resetAmount()
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
    let [selectedStaking,setSelectedStaking] = useState('');

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
                            {stake ? 'Mint and Stake Crucible Token' : 'Deposit and Mint Crucible Token'}
                        </span>
                    </div>
                    <div>
                        <FInputTextField
                            className={'crucible-input'}
                            placeholder={'Amount to Mint'}
                            onChange={ (v:any) => setAmount(v.target.value)}
                            value={amount}
                            type={'number'}
                            //setMax={() => setAmount((userCrucible.allocation && BigUtils.safeParse(crucible.allocation).lt(BigUtils.safeParse(userCrucible.balance))) ? userCrucible.allocation : userCrucible.balance)}
                        />
                    </div>
                    <div className='subtxt'>
                        You have {Number(userCrucible?.baseBalance||'0').toFixed(3)} available in Base Token {userCrucible?.baseSymbol}.
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
                                Amount you will {stake ? 'stake' : 'receive'}
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
                            {
                                //@ts-ignore
                                crucible?.staking?.length > 0 &&
                                    <div className='subtxt'>
                                        <FInputCheckbox label={'I want to Stake Minted Crucible directly.'} onClick={(e:any) => setStake(e.target.checked)}/>  
                                    </div>
                            }
                           
                            {
                                stake && 
                                    //@ts-ignore
                                    crucible?.staking?.length > 0 &&
                                    <>
                                        <div className='subtxt'>Select A Staking Pool :</div>
                                        {
                                            //@ts-ignore
                                            crucible?.staking.map( (e,idx) => (
                                                <div className={`staking-option cr-footer ${selectedStaking===e.address ? 'selected': ''}`} onClick={() => (setSelectedStaking(e.address))}>
                                                    <div className='heading'>
                                                        Staking Contract : {' '}<span className='label label2'>{' '} {Utils.shorten(e.address)} </span>
                                                    </div>
                                                    <div className='heading heading2'>
                                                        Staked Volume : {' '}<span className='label label2'>{' '} {e.totalStake} {userCrucible?.symbol}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                            }
                        </>
                    }
                   
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
                            disabled={!depositOpen||Number(amount)<=0||transactionStatus==='waiting'||(stake&&!selectedStaking)}
                            text={`${transactionStatus==='waiting' ? 'Processing' : (stake ? `Mint And Stake Crucible🍯` : 'Mint Crucible🍯')}`}
                            contractAddress={CRUCIBLE_CONTRACTS_V_0_1[crucible?.network||''].router}
                            amount={'1'}
                            onClick={()=> dispatch(doDeposit({
                                network: crucible?.network||'',
                                crucible: crucible?.currency||'',
                                currency: crucible?.baseCurrency||'',
                                amount:amount,
                                type: stake ? "mintAndStake" : "mint",
                                isPublic: !!crucible?.openCap && !userDirectAllocation,
                                balance: userCrucible?.baseBalance || '0',
                                stake: selectedStaking||'',
                                resetAmount: () => setAmount('')
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