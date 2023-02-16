import React, { Dispatch, useEffect, useReducer } from "react";
import { Networks, ValidationUtils } from 'ferrum-plumbing';
import { AnyAction } from "@reduxjs/toolkit";
import { FButton, FCard, FContainer, FInputText, FLabel } from "ferrum-design-system";
import { useParams } from "react-router";
import { inject, Utils } from "types";
import { addAction, QpExplorerClient } from "../../../QpExplorerClient";
import { useSelector } from 'react-redux';
import { QpAppState } from '../../../common/QpAppState';
import { Pair } from '../../Pair';
import { ApprovableButtonWrapper, IApprovableButtonWrapperViewProps } from 'common-containers';
import { QpMinerClient, QpMinerStakeInfo, QpMinerUserStakeInfo } from './QpMinerClient';

interface QpMinerStakeState {
    init: boolean;
    masterNetwork: string;
    masterContract: string;
    stakeInfo: QpMinerStakeInfo;
    stake: QpMinerUserStakeInfo;

    stakeAmount: string;
    withdrawAmount: string;
    delegateAddress: string;

    error?: string;
}

const initialState = {
    init: false,
    clients: [] as any,
    stake: {} as any,
} as any as QpMinerStakeState;

const reducer = (state: QpMinerStakeState, action: AnyAction) => {
    switch (action.type) {
        case 'INIT':
            return {
                ...state, 
                init: true,
                masterNetwork: action.payload.network,
                masterContract: action.payload.address,
            };
        case 'UPDATE_ALL':
            return {
                ...state,
                ...action.payload,
                error: undefined,
            }
        case 'UPDATE_STAKE':
            return {
                ...state,
                stakeAmount: action.payload.value,
            }
        case 'UPDATE_DELEGATE':
            return {
                ...state,
                delegateAddress: action.payload.value,
            }
        case 'UPDATE_WITHDRAW':
            return {
                ...state,
                stake: {
                    ...stake,
                    withdrawQueue: [
                        { amount: '10', opensAt: Math.round(Date.now() / 1000) + 10000  },
                        { amount: '20', opensAt: Math.round(Date.now() / 1000) + 10000  },
                    ]
                }
            }
            // return {
            //     ...state,
            //     withdrawAmount: action.payload.value,
            // }
        case 'ERROR':
            console.error("Error happend", action.payload);
            const error = action.payload?.error ? action.payload.error.toString() : action.payload.toString(); 
            return {
                ...state,
                error,
            }
        default:
            return state;
    }
}

async function load(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>, userAddress: string) {
    // Get the backend config (explorer client, etc.)
    const client = inject<QpMinerClient>(QpMinerClient);
    const stakeInfo = await client.getMinerStake();
    dispatch(addAction('UPDATE_ALL', { stakeInfo }))
    const stake = await client.getUserStake();
    dispatch(addAction('UPDATE_ALL', { stake }))
}

async function stake(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.stake(state.stakeAmount);
    // TODO: Handle tx ID
}

async function withdraw(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.withdraw(state.withdrawAmount);
    // TODO: Handle tx ID
}

async function delegate(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.delegate(state.delegateAddress);
    // TODO: Handle tx ID
}

async function collectWithdrawItems(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.releaseWithdrawItems();
    // TODO: Handle tx ID
}

export function StakeButton(props: {state: QpMinerStakeState, connectedNet: string, userAddress: string,
        view: (p: IApprovableButtonWrapperViewProps) => any}) {
    let contract = props.state?.stakeInfo?.qpGatewayContract;
    if (!contract) {
        return (<>
            <FLabel text={'Network not supported'} />
        </>);
    }
	return <ApprovableButtonWrapper
			contractAddress={props.state!.stakeInfo!.qpGatewayContract.toLowerCase()}
			currency={Utils.toCurrency(props.connectedNet, props.state!.stakeInfo!.baseToken)!}
			userAddress={props.userAddress}
			amount={props.state.stakeAmount}
			// @ts-ignore
			View={props.view}
			// View={(ownProps) => <SwapButtonView {...ownProps} {...props} />}
		/>
}

export function QpMinerStake(props: {}) {
    const initialized = useSelector<QpAppState, boolean>((state) => state.data.init.initialized);
	const user = useSelector((state: QpAppState) => state.connection?.account?.user);
    const connectedNet = (user.accountGroups[0]?.addresses || [])[0]?.network;
    const connectedAddr = (user.accountGroups[0]?.addresses || [])[0]?.address;
    const [state, dispatch] = useReducer(reducer, initialState) as [QpMinerStakeState, Dispatch<AnyAction>];
    console.log('STATOO', state);
    useEffect(() => {
        if (!state.init) {
            dispatch({type: 'INIT', payload: {connectedNet, connectedAddr}});
        } else if (initialized) {
            load(state, dispatch, user?.userId).catch(error => dispatch({ type: 'ERROR', payload: { error }}));
        }
    }, [state.init, connectedNet, connectedAddr, initialized]);

    const enoughToBeMiner = 'yes'; // TODO
    return (
        <>
        <FContainer width={700}>
            {state.error && <FCard>{state.error}</FCard>}
            <div> &nbsp; </div>
            <FCard>
                <FLabel text={`Quantum Portal Miner Dashboard`}/>
                <Pair itemKey={'QP Gateway Contract'} value={state?.stakeInfo?.qpGatewayContract || 'N/A'} />
                <Pair itemKey={'QP Miner Staking Contract'} value={state?.stakeInfo?.qpMinerStakingConract || 'N/A'} />
                <Pair itemKey={'Stake ID'} value={state?.stakeInfo?.stakeId || 'N/A'} />
                <Pair itemKey={'Base Token'} value={state?.stakeInfo?.baseToken || 'N/A'} />
                <Pair itemKey={'Total staked'} value={state?.stakeInfo?.totalStakesDisplay || 'N/A'} />
                <Pair itemKey={'Total rewars'} value={state?.stakeInfo?.totalRewardsDisplay || 'N/A'} />
                <Pair itemKey={'Minimum stake required'} value={state?.stakeInfo?.qpMinStakeRequiredDisplay || 'N/A'} />
            </FCard>
            <div> &nbsp; </div>
            <FCard>
                <FLabel text={`Connected Account`}/>
                <Pair itemKey={'Your Address'} value={state?.stake?.address || 'N/A'} />
                <Pair itemKey={'Delegated Address'} value={state?.stake?.delegated || 'N/A'} />
                <Pair itemKey={'Your staked amount'} value={`${state?.stake?.stakeDisplay || 'N/A'} FRM`} />
                <Pair itemKey={'Your rewards'} value={`${state?.stake?.stakeDisplay || 'N/A'} FRM`} />
                <Pair itemKey={'Enough stake to be a miner?'} value={enoughToBeMiner || 'N/A'} />
                {
                    (state?.stake?.withdrawQueue || []).length ? (
                        <>
                            <FLabel text={'Pending withdrawals'} />
                            {state!.stake!.withdrawQueue.map((wq, i) => (
                                <Pair key={i} itemKey={Utils.tillDate(wq.opensAt)}
                                    value={`${wq.amount} FRM`} />
                            ))}
                        </>
                    ) : (<FLabel text={'No pending withdrawals at the moment'} />)
                }
            </FCard>
            <div> &nbsp; </div>
            <FCard>
                <FLabel text={'Stake Actions'} />
                {(!!connectedNet) && 
                        <>
                            <FInputText label={'Delegate'}
                                value={state.delegateAddress}
                                onChange={(e: any) => dispatch({type: 'UPDATE_DELEGATE', payload: { value: e.target.value }})}
                                postfix={<FButton title={'DELEGATE'} onClick={() => delegate(state, dispatch)} />}
                            />
                            <FInputText label={'Stake FRM'}
                                value={state.stakeAmount}
                                onChange={(e: any) => dispatch({type: 'UPDATE_STAKE', payload: { value: e.target.value }})}
                                postfix={
                                    <StakeButton state={state} connectedNet={connectedNet}
                                        userAddress={user.userId}
                                        view={(p: IApprovableButtonWrapperViewProps) =>
                                            <FButton title={p.isApprovalMode ? 'APPROVE' : 'STAKE'}
                                                onClick={() => p.isApprovalMode ? p.onApproveClick() : stake(state, dispatch)} />} />}
                            />
                            <FInputText label={'Withdaw'}
                                value={state.withdrawAmount}
                                onChange={(e: any) => dispatch({type: 'UPDATE_WITHDRAW', payload: { value: e.target.value }})}
                                postfix={<FButton title={'WITHDRAW'} onClick={() => withdraw(state, dispatch)} />}
                            />
                            <FButton title={'COLLECT WITHDRAWAL ITEMS'} onClick={() => collectWithdrawItems(state, dispatch)} />
                        </>
                }
            </FCard>
            <div> &nbsp; </div>
        </FContainer>
        </>
    );
}
