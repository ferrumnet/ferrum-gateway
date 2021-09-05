import React, { useEffect } from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { GovernanceContract, GovernanceTransaction, inject, SignableMethod, Utils } from 'types';
import { GovernanceAppState } from '../common/GovernanceAppState';
import { Card } from '../components/Card';
import { GovernanceClient } from '../GovernanceClient';
import './ContractList.css';
import {
	Row, RegularBtn, Page,
	// @ts-ignore
} from 'component-library';
import { addressForUser } from 'common-containers';

function argList(m?: SignableMethod) {
	if (!m) { return '[err - not found]';}
	return m.args.map(a => `${a.type} ${a.name}`).join(', ');
}

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

export function GovernanceContractPage() {
	const { network, contractAddress, contractId } = useParams() as any;
	const initialized = useSelector<GovernanceAppState, boolean>(
		state => state.data.init.initialized);
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const requests = useSelector<GovernanceAppState, GovernanceTransaction[]>(
		state => state.data.state.requests);
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const loadedContract = contract?.id;

	const history = useHistory();
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (initialized && !!network && !!contractAddress && !!contractId) {
			dispatch(loadContract({network, contractAddress,  contractId}));
		}
	}, [initialized, network, contractAddress, contractId]);

	useEffect(() => {
		if (!!loadedContract && !!userAddress && !!network && !!contractAddress) {
			dispatch(loadTrans({network, contractAddress}));
		}
	}, [loadedContract, userAddress, network, contractAddress]);
	
	return (
		<>
		<div className="contracts">
			<Card
				title={`${contract?.identifier?.name} (Version ${contract?.identifier?.version})`}
				subTitle={`${network}:${contractAddress}`}
			>
				<RegularBtn text={'New Request'}
					onClick={() => history.push(`/newMethod/${network}/${contractAddress}/${contractId}`)}/>
			</Card>
			<h1><u>Current Requests</u></h1>
			{requests.map((r, i) => (
				<Card key={i}
					title={`${r.method}(${argList(contract.methods.find(m => m.name === r.method))})`}
					subTitle={r.values.join(', ')}
				>
					<p>{r.network}</p>
					<p>{
						(r.signatures || [] as any).find(s => Utils.addressEqual(s.creator, userAddress!))?
							'Signed' :
							<RegularBtn text={'Sign'}
								onClick={() => history.push(`/method/${contractId}`)}/>
					}</p>
				</Card>
			))}
			</div>
		</>
	);
}