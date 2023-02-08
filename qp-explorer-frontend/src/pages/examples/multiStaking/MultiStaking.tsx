import { Networks, ValidationUtils } from 'ferrum-plumbing';
import { AnyAction } from "@reduxjs/toolkit";
import { FButton, FCard, FContainer, FInputText, FLabel } from "ferrum-design-system";
import React, { Dispatch, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { inject, Utils } from "types";
import { QpExplorerClient } from "../../../QpExplorerClient";
import { useSelector } from 'react-redux';
import { QpAppState } from '../../../common/QpAppState';
import { abi as ClientAbi } from './MultiChainStakingClient.json';
import { abi as MasterAbi } from './MultiChainStakingMaster.json';
import { Pair } from '../../Pair';
import { stat } from 'fs';
import { ApprovableButtonWrapper, IApprovableButtonWrapperViewProps } from 'common-containers';

const NETWORKS = ['BSC_TESTNET', 'AVAX_TESTNET', 'RINKEBY', 'FERRUM_TESTNET', 'MUMBAI_TESTNET'];

function method(name: string, abi: any[] = MasterAbi) {
    const rv = abi.find(a => a.name === name);
    ValidationUtils.isTrue(!!rv, `ABI ${name} not found`);
    return [rv];
}

interface SingleState {
    network: string;
    contract: string;
    baseToken: string;
    stake: string;
}

interface MultiState {
    init: boolean;
    masterNetwork: string;
    masterContract: string;
    clients: SingleState[];
    canDistRewards: boolean;
    stakeClosed: boolean;
    totalRewards: string,
    totalStakes: string,
    stakeAmount: string,
    withdrawChain: string,
    error?: string;
}

const initialState = {
    init: false,
    clients: [] as any,
} as MultiState;

const reducer = (state: MultiState, action: AnyAction) => {
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
            }
        case 'UPDATE_STAKE':
            return {
                ...state,
                stakeAmount: action.payload.value,
            }
        case 'UPDATE_WITHDRAW_CHAIN':
            return {
                ...state,
                withdrawChain: action.payload.value,
            }
        case 'ERROR':
            console.error("Error happend", action.payload);
            return {
                ...state,
                error: action.payload.toString(),
            }
        default:
            return state;
    }
}

async function load(state: MultiState, dispatch: Dispatch<AnyAction>, userAddress: string) {
    const client = inject<QpExplorerClient>(QpExplorerClient);
    const states: SingleState[] = [{

    } as SingleState]
    for(const network of NETWORKS) {
        const netId = Networks.for(network).chainId.toString();
        const contract = state.masterNetwork === network ? state.masterContract : await client.readContractField(
            state.masterNetwork, state.masterContract, method('remotes'), 'remotes', [netId]);
        if (Utils.isNonzeroAddress(contract)) {
            const baseToken = await client.readContractField(
                state.masterNetwork, state.masterContract, method('baseTokens'), 'baseTokens', [netId]);
            const stake = await client.readContractField(
                state.masterNetwork, state.masterContract, method('stakes'), 'stakes', [netId, userAddress || Utils.ZERO_ADDRESS]);
            states.push({
                network,
                contract,
                baseToken,
                stake,
            } as SingleState);
        }
    }
    const canDistRewards = await client.readContractField(
        state.masterNetwork, state.masterContract, method('distributeRewards'), 'distributeRewards', []);
    const stakeClosed = await client.readContractField(
        state.masterNetwork, state.masterContract, method('stakeClosed'), 'stakeClosed', []);
    const totalRewards = await client.readContractField(
        state.masterNetwork, state.masterContract, method('totalRewards'), 'totalRewards', []);
    const totalStakes = await client.readContractField(
        state.masterNetwork, state.masterContract, method('totalStakes'), 'totalStakes', []);
    console.log('All stuff: ', {
        canDistRewards, stakeClosed, totalRewards, totalStakes, states
    });
    const newState = {
        canDistRewards: canDistRewards === 'true',
        stakeClosed: stakeClosed === 'true',
        totalRewards,
        totalStakes,
        clients: states,
    } as MultiState;
    dispatch({ type: 'UPDATE_ALL', payload: newState});
}

async function stakeMaster(state: MultiState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpExplorerClient>(QpExplorerClient);
    const txId = await client.writeContractField(state.masterContract, method('stake'), 'stake', [state.stakeAmount]);
    // dispatch(writeContractSlice.actions.valueRead({method: payload.abiItem.name, txid}));
}

async function stakeClient(state: MultiState, network: string, dispatch: Dispatch<AnyAction>) {
    const connected = state.clients.find(c => c.network === network);
    if (!connected) {
        dispatch({type: 'ERROR', payload: 'Connected network is not supported'})
        return;
    }
    const client = inject<QpExplorerClient>(QpExplorerClient);
    const txId = await client.writeContractField(connected.contract, method('stake', ClientAbi), 'stake', [
        connected.baseToken, state.stakeAmount, '1']);
    // dispatch(writeContractSlice.actions.valueRead({method: payload.abiItem.name, txid}));
}

async function closePosition(state: MultiState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpExplorerClient>(QpExplorerClient);
    const txId = await client.writeContractField(state.masterContract, method('closePosition'), 'closePosition', [
        '1', state.withdrawChain]);
    // dispatch(writeContractSlice.actions.valueRead({method: payload.abiItem.name, txid}));
}

async function closeStakePeriod(state: MultiState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpExplorerClient>(QpExplorerClient);
    const txId = await client.writeContractField(state.masterContract, method('closeStakePeriod'), 'closeStakePeriod', []);
    // dispatch(writeContractSlice.actions.valueRead({method: payload.abiItem.name, txid}));
}

async function enableRewardDistribution(state: MultiState, dispatch: Dispatch<AnyAction>) {
    const client = inject<QpExplorerClient>(QpExplorerClient);
    const txId = await client.writeContractField(state.masterContract, method('enableRewardDistribution'), 'enableRewardDistribution', []);
    // dispatch(writeContractSlice.actions.valueRead({method: payload.abiItem.name, txid}));
}

export function StakeButton(props: {state: MultiState, connectedNet: string, userAddress: string,
        view: (p: IApprovableButtonWrapperViewProps) => any}) {
    let contract = props.state.clients.find(c => c.network === props.connectedNet);
    if (!contract) {
        return (<>
            <FLabel text={'Network not supported'} />
        </>);
    }
	return <ApprovableButtonWrapper
			contractAddress={contract.contract.toLowerCase()}
			currency={Utils.toCurrency(contract.network, contract.baseToken)!}
			userAddress={props.userAddress}
			amount={props.state.stakeAmount}
			// @ts-ignore
			View={props.view}
			// View={(ownProps) => <SwapButtonView {...ownProps} {...props} />}
		/>
}

export function MultiStaking(props: {}) {
    let {network, address} = useParams() as { network: string, address: string };
    network = (network || '').toUpperCase();
    address = (address || '').toLowerCase();
    const initialized = useSelector<QpAppState, boolean>((state) => state.data.init.initialized);
	const user = useSelector((state: QpAppState) => state.connection?.account?.user);
    const connectedNet = (user.accountGroups[0]?.addresses || [])[0]?.network;
    const [state, dispatch] = useReducer(reducer, initialState) as [MultiState, Dispatch<AnyAction>];
    console.log('STATOO', state);
    useEffect(() => {
        if (!state.init) {
            dispatch({type: 'INIT', payload: {network, address}});
        } else if (initialized) {
            load(state, dispatch, user?.userId).catch(error => dispatch({ type: 'ERROR', payload: { error }}));
        }
    }, [state.init, network, address, initialized]);
    return (
        <>
        <FContainer width={700}>
            <FCard>
                <FLabel text={`Multi-chain Staking - (${state.masterNetwork}:${Utils.shorten(state.masterContract || '')})`}/>
                <Pair itemKey={'Open for stake?'} value={state?.stakeClosed === false ? 'Yes' : 'No'} />
                <Pair itemKey={'Open for Withdraw?'} value={state?.canDistRewards === true ? 'Yes': 'No'} />
                <Pair itemKey={'Total Staked'} value={state?.totalStakes} />
                <Pair itemKey={'Total Rewards'} value={state?.totalRewards} />
                <FLabel text={`Contracts:`}/>
                {
                    state.clients.map((c: SingleState, i: number) => (
                        <React.Fragment key={i}>
                        <Pair itemKey={'Network'} value={c.network} />
                        <Pair itemKey={'Address'} value={c.contract} linkTo={Utils.linkForAddress(c.network, c.contract)} />
                        <Pair itemKey={'Stake Token'} value={c.baseToken} linkTo={Utils.linkForAddress(c.network, c.baseToken)} />
                        </React.Fragment>
                    ))}
            </FCard>
            <div> &nbsp; </div>
            <FCard>
                <FLabel text={'Stake Actions'} />
                {(state.masterNetwork && !!connectedNet) && 
                    connectedNet === state.masterNetwork ? (
                        <>
                            <FInputText label={'Stake amount on server'}
                                value={state.stakeAmount}
                                onChange={(e: any) => dispatch({type: 'UPDATE_STAKE', payload: { value: e.target.value }})}
                                postfix={<FButton title={'STAKE'} onClick={() => stakeMaster(state, dispatch)} />}
                            />
                        </>
                    ) : (
                        <>
                            <FInputText label={'Stake amount on client'}
                                value={state.stakeAmount}
                                onChange={(e: any) => dispatch({type: 'UPDATE_STAKE', payload: { value: e.target.value }})}
                                postfix={
                                    <StakeButton state={state} connectedNet={connectedNet}
                                        userAddress={user.userId}
                                        view={(p: IApprovableButtonWrapperViewProps) =>
                                            <FButton title={p.isApprovalMode ? 'APPROVE' : 'STAKE'}
                                                onClick={() => p.isApprovalMode ? p.onApproveClick() : stakeClient(state, connectedNet, dispatch)} />} />
                                }
                            />
                        </>
                    )
                }
                {state.masterNetwork && (
                        <FInputText
                            label={'Network chain ID'}
                            value={state.withdrawChain}
                            onChange={(e: any) => dispatch({type: 'UPDATE_WITHDRAW_CHAIN', payload: { value: e.target.value }})}
                            postfix={
                                <FButton
                                    title={'Close Position'}
                                    onClick={() => closePosition(state, dispatch)}
                                    disabled={state.masterNetwork !== connectedNet}
                                />
                            }
                        />
                )}
            </FCard>
            <div> &nbsp; </div>
            <FCard>
                <FLabel text={'Admin Actions'} />
                {state.masterNetwork && (
                    state.stakeClosed ? <FLabel text={'Stake is closed'} /> :
                    <FButton
                        title={'Close Stake Period'}
                        onClick={() => closeStakePeriod(state, dispatch)}
                        disabled={state.masterNetwork !== connectedNet}
                    />
                )}
                {state.masterNetwork && (
                    state.canDistRewards ? <FLabel text={'Reward distribution enabled'} /> :
                    <FButton
                        title={'Enable Reward Distribution'}
                        onClick={() => enableRewardDistribution(state, dispatch)}
                        disabled={state.masterNetwork !== connectedNet}
                    />
                )}
            </FCard>
        </FContainer>
        </>
    );
}