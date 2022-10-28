import { Networks, ValidationUtils } from 'ferrum-plumbing';
import { AnyAction } from "@reduxjs/toolkit";
import { FCard, FContainer, FLabel } from "ferrum-design-system";
import React, { Dispatch, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { inject, Utils } from "types";
import { QpExplorerClient } from "../../../QpExplorerClient";
import { useSelector } from 'react-redux';
import { QpAppState } from '../../../common/QpAppState';
import { abi as ClientAbi } from './MultiChainStakingClient.json';
import { abi as MasterAbi } from './MultiChainStakingMaster.json';
import { Pair } from '../../Pair';

const NETWORKS = ['BSC_TESTNET', 'AVAX_TESTNET'];

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
    error?: string;
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
    const states: SingleState[] = []
    for(const network of NETWORKS) {
        const netId = Networks.for(network).chainId.toString();
        const contract = await client.readContractField(
            state.masterNetwork, state.masterContract, method('remoteAddress'), 'remoteAddress', [netId]);
        console.log('Got data for contract', network, contract, netId)
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

export function MultiStaking(props: {}) {
    let {network, address} = useParams() as { network: string, address: string };
    network = (network || '').toUpperCase();
    address = (address || '').toLowerCase();
    const initialized = useSelector<QpAppState, boolean>((state) => state.data.init.initialized);
	const user = useSelector((state: QpAppState) => state.connection?.account?.user);
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log('STATOO', state)
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
            </FCard>
            <div> &nbsp; </div>
            <FCard>
                <FLabel text={'Admin Actions'} />
            </FCard>
        </FContainer>
        </>
    );
}