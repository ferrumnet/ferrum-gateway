import React, { Dispatch, useEffect, useReducer } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { FButton, FCard, FContainer, FInputText, FLabel } from "ferrum-design-system";
import { inject, Utils } from "types";
import { addAction } from "../../../QpExplorerClient";
import { useSelector } from 'react-redux';
import { QpAppState } from '../../../common/QpAppState';
import { Pair } from '../../Pair';
import { ApprovableButtonWrapper, IApprovableButtonWrapperViewProps } from 'common-containers';
import { QpMinerClient, QpMinerMinerInfo, QpMinerStakeInfo, QpMinerUserStakeInfo } from './QpMinerClient';
import { config } from "process";

interface QpMinerStakeState {
    init: boolean;
    masterNetwork: string;
    masterContract: string;
    stakeInfo: QpMinerStakeInfo;
    stake: QpMinerUserStakeInfo;
    miner: QpMinerMinerInfo;

    stakeAmount: string;
    withdrawAmount: string;
    delegateAddress: string;
    operatorAddress: string;
    validatorOperatorAddress: string;
    configNet: 'mainnet' | 'testnet';

    error?: string;
}

const initialState = {
    init: false,
    clients: [] as any,
    stake: {} as any,
    configNet: 'mainnet',
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
        case 'UPDATE_OPERATOR':
            return {
                ...state,
                operatorAddress: action.payload.value,
            }
        case 'UPDATE_VALIDATOR_OPERATOR':
            return {
                ...state,
                validatorOperatorAddress: action.payload.value,
            }
        case 'UPDATE_WITHDRAW':
            return {
                ...state,
                stake: {
                    ...(state?.stake || {}),
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
        case 'UPDATE_CONFIG_NET':
            return {
                ...state,
                configNet: action.payload.value,
            }
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

async function load(dispatch: Dispatch<AnyAction>, configNet: 'mainnet' | 'testnet') {
    try {
        // Get the backend config (explorer client, etc.)
        const client = inject<QpMinerClient>(QpMinerClient);
        client.mode = configNet;
        const stakeInfo = await client.getMinerStake();
        console.log('Got miner stake: ', stakeInfo)
        dispatch(addAction('UPDATE_ALL', { stakeInfo }))
        const stake = await client.getUserStake();
        console.log('Got user stake: ', stake)
        dispatch(addAction('UPDATE_ALL', { stake }))
        const miner = await client.getMinerInfo();
        console.log('Got user miner: ', miner)
        dispatch(addAction('UPDATE_ALL', { miner }))
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function stakeToDelegate(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.stakeToDelegate(state.stakeAmount, state.delegateAddress);
    console.log('txid: ', txId);
    // TODO: Handle tx ID
}

async function withdraw(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.withdraw(state.withdrawAmount);
    // TODO: Handle tx ID
}

async function assignOperator(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.assignOperator(state.operatorAddress);
    // TODO: Handle tx ID
}

async function assignValidatorOperator(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.assignValidatorOperator(state.validatorOperatorAddress);
    // TODO: Handle tx ID
}

async function delegate(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.delegate(state.delegateAddress);
    // TODO: Handle tx ID
}

async function registerMiner(state: QpMinerStakeState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpMinerClient>(QpMinerClient);
    const txId = await client.registerMiner();
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
    const configNet = state.configNet;
    console.log('STATOO', state);
    useEffect(() => {
        if (!state.init) {
            dispatch({type: 'INIT', payload: {connectedNet, connectedAddr}});
        } else if (initialized) {
            load(dispatch, configNet).catch(error => dispatch({ type: 'ERROR', payload: { error }}));
        }
    }, [state.init, connectedNet, connectedAddr, initialized, configNet]);

    const enoughToBeMiner = 'yes'; // TODO
    return (
        <>
        <FContainer width={700}>
            {state.error && <FCard>{state.error}</FCard>}
            <FCard>
                <FLabel text={`Using <<${configNet.toUpperCase()}>> configuration on ${connectedNet}`}/> <br/>
                <FButton title={'Use Mainnet'} onClick={() => dispatch({type: 'UPDATE_CONFIG_NET', payload: { value: 'mainnet' }})} /> <FButton
                    title={'Use Testnet'} onClick={() => dispatch({type: 'UPDATE_CONFIG_NET', payload: { value: 'testnet' }})} />
            </FCard>
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
                <FLabel text={`Connected Account - if Staker`}/>
                <Pair itemKey={'Your Address'} value={state?.stake?.address || 'N/A'} />
                <Pair itemKey={'Delegated Address'} value={state?.stake?.delegated || 'N/A'} />
                <Pair itemKey={'Your staked amount'} value={`${state?.stake?.stakeDisplay || 'N/A'} FRM`} />
                <Pair itemKey={'Your rewards'} value={`${state?.stake?.stakeDisplay || 'N/A'} FRM`} />
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
                <FLabel text={'Connected Account - if Miner (Delegate)'}/>
                <Pair itemKey={'Your Address'} value={state?.miner?.address || 'N/A'} />
                <Pair itemKey={'Assigned Operator Address'} value={state?.miner?.operator || 'N/A'} />
                <Pair itemKey={'Stakes delegated to you'} value={`${state?.miner?.totalStakedHuman || 'N/A'} FRM`} />
                <Pair itemKey={'Miner index'} value={`${state?.miner?.minerIndex || 'N/A'} FRM`} />
                <Pair itemKey={'Registered'} value={`${state?.miner?.active?.toString() || 'N/A'} FRM`} />
                <Pair itemKey={'Enough stake to be a miner?'} value={enoughToBeMiner || 'N/A'} />
            </FCard>
            <div>&nbsp;</div>
            <FCard>
                <FLabel text={'Connected Account - if Operator (Miner Node)'}/>
                &nbsp;<br/>
                <FButton title={'Register miner'} onClick={() => registerMiner(state, dispatch)} />
                &nbsp;
            </FCard>
            <div>&nbsp;</div>
            <FCard>
                <FLabel text={'Stake Actions'} />
                {(!!connectedNet) && 
                        <>
                            <FInputText label={'Miner Operator'}
                                value={state.operatorAddress}
                                onChange={(e: any) => dispatch({type: 'UPDATE_OPERATOR', payload: { value: e.target.value }})}
                                postfix={<FButton
                                    title={'ASSIGN - ONLY MINER'} onClick={() => assignOperator(state, dispatch)}
                                    disabled={Number(state.miner?.totalStakedHuman || '0') === 0}
                                />}
                            />
                            <FInputText label={'Validator Operator'}
                                value={state.validatorOperatorAddress}
                                onChange={(e: any) => dispatch({type: 'UPDATE_VALIDATOR_OPERATOR', payload: { value: e.target.value }})}
                                postfix={<FButton
                                    title={'ASSIGN - ONLY VALIDATOR'} onClick={() => assignValidatorOperator(state, dispatch)}
                                />}
                            />
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
                                                onClick={() => p.isApprovalMode ? p.onApproveClick() : stakeToDelegate(state, dispatch)} />} />}
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
