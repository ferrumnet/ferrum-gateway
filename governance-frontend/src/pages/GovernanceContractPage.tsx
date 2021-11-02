import React, { useEffect } from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { GovernanceContract, GovernanceTransaction, inject, QuorumSubscription, SignableMethod, Utils } from 'types';
import { GovernanceAppState } from '../common/GovernanceAppState';
import { Card } from '../components/Card';
import { GovernanceClient } from '../GovernanceClient';
import './ContractList.css';
import {
	Row, RegularBtn, Page,
	// @ts-ignore
} from 'component-library';
import { addressForUser } from 'common-containers';
import { UserSubscription } from './UserSubscription';

function argList(m?: SignableMethod) {
	if (!m) { return '[err - not found]';}
	return m.args.map(a => `${a.type} ${a.name}`).join(', ');
}

export const loadSubscription = createAsyncThunk('governanceContract/loadSubscription',
	async (payload: { network: string, contractAddress: string }, ctx) => {
		const client = inject<GovernanceClient>(GovernanceClient);
		await client.getSubscription(ctx.dispatch, payload.network, payload.contractAddress);
});

export const loadContract = createAsyncThunk('governanceContract/load',
	async (payload: { network: string, contractAddress: string, contractId: string }, ctx) => {
		const client = inject<GovernanceClient>(GovernanceClient);
		await client.contractById(ctx.dispatch, payload.contractId);
});

export const loadTrans = createAsyncThunk('governanceContract/load',
	async (payload: { network: string, contractAddress: string }, ctx) => {
		const client = inject<GovernanceClient>(GovernanceClient);
		await client.reloadTransactions(
			ctx.dispatch, payload.network, payload.contractAddress);
});

export function ContractLoader(params:
		{ network: string, contractAddress: string, contractId: string}) {
	const { network, contractAddress, contractId } = params;
	const initialized = useSelector<GovernanceAppState, boolean>(
		state => state.data.init.initialized);
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const dispatch = useDispatch();
	const loadedContract = contract?.id;
	useEffect(() => {
		if (initialized && !!network && !!contractAddress && !!contractId) {
			dispatch(loadContract({network, contractAddress,  contractId}));
		}
	}, [initialized, network, contractAddress, contractId]);
	useEffect(() => {
		if (initialized && !!contractAddress && !!network && !!userAddress) {
			dispatch(loadSubscription({
				network, contractAddress}));
		}
	}, [initialized, contractAddress, network, userAddress]);
	useEffect(() => {
		if (!!loadedContract && !!userAddress && !!network && !!contractAddress) {
			dispatch(loadTrans({network, contractAddress}));
		}
	}, [loadedContract, userAddress, network, contractAddress]);

	return (<> </>);
}

export function GovernanceContractPage() {
	const { network, contractAddress, contractId } = useParams() as any;
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const requests = useSelector<GovernanceAppState, GovernanceTransaction[]>(
		state => state.data.state.requests);
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const quorum = useSelector<GovernanceAppState, QuorumSubscription>(
		state => state.connection.userState.quorum);

	const history = useHistory();
	return (
		<>
		<ContractLoader
			network={network} contractAddress={contractAddress} contractId={contractId}
		/>
		<div className="contracts">
			<UserSubscription />
			<h1><u>Selected Contract</u></h1>
			<Card
				title={`${contract?.identifier?.name} (Version ${contract?.identifier?.version})`}
				subTitle={`${network}:${contractAddress}`}
			>
				{quorum.quorum && <RegularBtn text={'New Request'}
					onClick={() => history.push(`/newMethod/${network}/${contractAddress}/${contractId}`)
				}/>}
			</Card>
			<h1><u>Current Requests</u></h1>
			{requests.map((r, i) => (
				<Card key={i}
					title={`${r.method}(${argList(contract.methods.find(m => m.name === r.method))})`}
					subTitle={''}
				>
			<div className="method-contract">
					<p>{r.values.join(', ')}</p>
					<p>{r.network} {r.signatures.length} of {quorum.minSignatures} Signatures</p>
					<p>{
						r.signatures.length >= quorum.minSignatures ? (
							(
								(r.execution?.status === 'sucess') ? 
								(
									<span>Complete and submitted</span>
								) : (
									<RegularBtn text={'Submit Transaction'}
										onClick={() => history.push(`/method/${network}/${contractAddress}/${contractId}/${r.requestId}`)}
									/>
								)
							)
						) : (
							(r.signatures || [] as any)
								.find(s => Utils.addressEqual(s.creator, userAddress!)) ?
							'Signed' :
							<RegularBtn text={'Sign'}
								onClick={() => history.push(`/method/${network}/${contractAddress}/${contractId}/${r.requestId}`)}/>
						)
					}</p>
				</div>
				</Card>
			))}
			</div>
		</>
	);
}