import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { GovernanceContract, inject, SignableMethod } from 'types';
import { GovernanceAppState, NewMethodState } from '../common/GovernanceAppState';
import { Card } from '../components/Card';
import { loadContract } from './GovernanceContractPage';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import {
	InputField, RegularBtn
	// @ts-ignore
} from 'component-library';
import { Label } from '@fluentui/react/lib/Label';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GovernanceClient } from '../GovernanceClient';

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
					value={state.values[i]}
					onChange={(e: any, v: any) => {
						dispatch(newMethodSlice.actions.valueChanged({index: i, value: e.target.value}))}
					}
				/>
				</React.Fragment>
			))}
		</>
	)
}

export function Method() {
	const { requestId } = useParams() as any;
	return (
		<>
		<div className="contracts">
		</div>
		</>
	);
}

export function NewMethod() {
	const { network, contractAddress, contractId } = useParams() as any;
	const initialized = useSelector<GovernanceAppState, boolean>(
		state => state.data.init.initialized);
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const state = useSelector<GovernanceAppState, NewMethodState>(
		state => state.ui.newMethod);
	const dispatch = useDispatch();

	useEffect(() => {
		if (initialized&&!!network && !!contractAddress && !!contractId) {
			dispatch(loadContract({network, contractAddress,  contractId}));
		}
	}, [initialized, network, contractAddress, contractId]);

	const methods = (contract?.methods || []).map(m => ({key: m.name, text: m.name}));
	const method = ((contract?.methods || [])[state.methodIdx] || {});
	return (
		<>
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