import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { GovernanceContract, GovernanceTransaction, inject, MultiSigSignature, QuorumSubscription, SignableMethod } from 'types';
import { GovernanceAppState, MethodState, NewMethodState } from '../common/GovernanceAppState';
import { Card } from '../components/Card';
import { ContractLoader, loadContract } from './GovernanceContractPage';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import {
	InputField, RegularBtn
	// @ts-ignore
} from 'component-library';
import { Label } from '@fluentui/react/lib/Label';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GovernanceClient } from '../GovernanceClient';
import { Utils } from 'types';
import { addressForUser } from 'common-containers';

const addSignature = createAsyncThunk('method/addSignature',
	async (payload: {method: SignableMethod, contract: GovernanceContract,
		network:string, contractAddress: string,
		request: GovernanceTransaction,}, ctx) => {
		const state = ctx.getState() as GovernanceAppState;
		const client = inject<GovernanceClient>(GovernanceClient);
		const signature = await client.signMessage(
			payload.network, payload.contract.identifier.name,
			payload.contract.identifier.version, payload.contractAddress, payload.method, 
			payload.request.values);
		await client.addSignature(ctx.dispatch,
			payload.request.requestId,
			payload.contractAddress,
			signature);
	});

const signAndSave = createAsyncThunk('method/signAndSave',
	async (payload: {method: SignableMethod, contract: GovernanceContract,
		network:string, contractAddress: string,}, ctx) => {
		const state = ctx.getState() as GovernanceAppState;
		const client = inject<GovernanceClient>(GovernanceClient);
		const args = state.ui.newMethod.values;
		const signature = await client.signMessage(
			payload.network, payload.contract.identifier.name,
			payload.contract.identifier.version, payload.contractAddress, payload.method, args);
		await client.proposeTransaction(ctx.dispatch,
			payload.contractAddress,
			payload.contract.id,
			payload.method.name,
			args,
			signature);
	});

const submitTransaction = createAsyncThunk('method/submit',
	async (payload: { requestId: string, contractAddress: string }, ctx) => {
		const client = inject<GovernanceClient>(GovernanceClient);
		await client.submitTransaction(ctx.dispatch, payload.requestId, payload.contractAddress);
	});

export const methodSlice = createSlice({
	name: 'method/update',
	initialState: {
		pending: false,
	} as MethodState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(submitTransaction.pending, (state, payload) => {
			state.pending = true;
		});
		builder.addCase(submitTransaction.rejected, (state, payload) => {
			state.error = payload.error.message;
			state.pending = false;
		});
		builder.addCase(submitTransaction.fulfilled, (state, payload) => {
			state.pending = false;
		});
		builder.addCase(addSignature.pending, (state, payload) => {
			state.pending = true;
		});
		builder.addCase(addSignature.rejected, (state, payload) => {
			state.error = payload.error.message;
			state.pending = false;
		});
		builder.addCase(addSignature.fulfilled, (state, payload) => {
			state.pending = false;
		});
	}
});


export const newMethodSlice = createSlice({
	name: 'method/new',
	initialState: {
		methodIdx: 0,
		values: [],
		saved: false,
		pending: false,
	} as NewMethodState,
	reducers: {
		methodChanged: (state, action) => {
			state.methodIdx = action.payload.value;
			state.error = undefined;
			state.saved = false;
		},
		valueChanged: (state, action) => {
			state.values = [...state.values];
			state.values[action.payload.index] = action.payload.value;
			state.error = undefined;
			state.saved = false;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(signAndSave.pending, (state, payload) => {
			state.pending = true;
		});
		builder.addCase(signAndSave.rejected, (state, payload) => {
			state.error = payload.error.message;
			state.saved = false;
			state.pending = false;
		});
		builder.addCase(signAndSave.fulfilled, (state, action) => {
			state.saved = true;
			state.values = [];
			state.pending = false;
		});
	}
});

export function MethodArgs(props: {
	method: SignableMethod,
	request?: GovernanceTransaction,
	disabled: boolean,
}) {
	const dispatch = useDispatch();
	const state = useSelector<GovernanceAppState, NewMethodState>(
		state => state.ui.newMethod);
	return (
		<>
			{(props.method.args || []).map((a, i) => (
				<React.Fragment key={i}>
				<Label>{`${a.type} ${a.name}`}</Label>
				<InputField
				  disabled={props.disabled}
					value={(props.request?.values || state.values)[i]}
					onChange={(e: any, v: any) => {
						dispatch(newMethodSlice.actions.valueChanged({index: i, value: e.target.value}))}
					}
				/>
				</React.Fragment>
			))}
		</>
	)
}

function SignButton(props: {disabled: boolean,
		request: GovernanceTransaction,
		contract: GovernanceContract,
		method: SignableMethod,
		network: string, contractAddress: string}) {
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const dispatch = useDispatch();
	const alreadySigned = !!(props.request?.signatures || [] as MultiSigSignature[])
		.find(s => Utils.addressEqual(s.creator, userAddress!));
	console.log('ALREADY? ', alreadySigned, {userAddress, cr: props.request.signatures})
	return alreadySigned ? (
		<>
		<RegularBtn
			disabled={true}
			text={'Already Sign'}
		/>
		</>) : (
		<RegularBtn
			disabled={props.disabled}
			text={'Sign'}
			onClick={() => dispatch(addSignature({
				request: props.request,
				contract: props.contract,
				method: props.method,
				network: props.network,
				contractAddress: props.contractAddress}))
			} />
	);
}

export function Method() {
	const { network, contractAddress, contractId, requestId } = useParams() as any;
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const state = useSelector<GovernanceAppState, MethodState>(
		state => state.ui.method);
	const request = useSelector<GovernanceAppState, GovernanceTransaction|undefined>(
		state => state.data.state.requests.find(r => r.requestId === requestId));
	const dispatch = useDispatch();
	const quorum = useSelector<GovernanceAppState, QuorumSubscription>(
		state => state.connection.userState.quorum);

	const method: SignableMethod = 
		(contract?.methods || []).find(m => m.name === request?.method) || {} as any;

	const relevantUser = quorum.quorum === request?.quorum && quorum.minSignatures > 0;
	const isExecutable = (quorum?.minSignatures >= (request?.signatures?.length || 0));

	const btn = relevantUser ? (
		isExecutable ? (
			<>
				{request?.execution?.status === 'sucess' ? (
					<>
					<b>Completed: {
						request.execution.transactions.find(t => t.status === 'sucess')?.transactionId
					}</b>
					</>
				) : (
				<>
					<SignButton
						disabled={state.pending}
						contractAddress={contractAddress}
						method={method}
						network={network}
						request={request! as any}
						contract={contract}
					/>

					<RegularBtn
						disabled={state.pending}
						text={'Submit Transaction'}
						onClick={() => dispatch(submitTransaction({
							requestId: request?.requestId!, contractAddress}))
						}
					/>
				</>
				)}
			</>) : (<>
				<SignButton
					disabled={state.pending}
					contractAddress={contractAddress}
					method={method}
					network={network}
					request={request! as any}
					contract={contract}
				/>
			</>)
	) : (
		<>
		<small>Address not in the quorum</small>
		</>);
	return (
		<>
		<ContractLoader
			network={network} contractAddress={contractAddress} contractId={contractId}
		/>
		<div className="contracts">
			<Card title={method?.name || '...'} subTitle={''}>
				<div className="method-contract">
					<MethodArgs method={method} request={request} disabled={true} />
					<p> Signature Quorum: <b>{request?.quorum || ''}</b> </p>
					<p> Signatures: <b>{request?.signatures?.length} of {quorum?.minSignatures || 0}</b> </p>
					{state.error && <p>{state.error}</p>}
					{btn}
				</div>
			</Card>
		</div>
		</>
	);
}

export function NewMethod() {
	const { network, contractAddress, contractId } = useParams() as any;
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const state = useSelector<GovernanceAppState, NewMethodState>(
		state => state.ui.newMethod);
	const dispatch = useDispatch();

	const methods = (contract?.methods || []).map(m => ({key: m.name, text: m.name}));
	const method = ((contract?.methods || [])[state.methodIdx] || {});
	return (
		<>
		<ContractLoader
			network={network} contractAddress={contractAddress} contractId={contractId}
		/>
		<div className="contracts">
			<Card title={'New method'} subTitle={''}>
				<div className="method-contract">
					<Dropdown
						placeholder="Select a method"
						label="Method"
						options={methods}
						onChange={(e, o, i) =>
							dispatch(newMethodSlice.actions.methodChanged({value: i}))}
					/>
					<MethodArgs method={method} disabled={state.pending} />
					{state.error && <p>{state.error}</p>}
					{state.saved && <h4>Request was successfully added</h4>}
					<RegularBtn
						disabled={!!state.error || state.pending}
						text={'Sign and Save'}
						onClick={() => dispatch(
							signAndSave({method, contract, network, contractAddress}))
						} />
				</div>
			</Card>
		</div>
		</>
	);
}