import React from 'react';
import {
    Row,
    // @ts-ignore
} from 'component-library';
import { TextField } from '@fluentui/react/lib/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState, DeployState } from '../common/CrucibleAppState';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PrimaryButton } from 'office-ui-fabric-react';
import { CrucibleClient } from '../CrucibleClient';
import { inject } from 'types';

interface DeployProps extends DeployState {
	network: string;
}

function stateToProps(state: CrucibleAppState): DeployProps {
	return {
		...state.ui.deploy,
	} as DeployProps;
}

export const deploySlice = createSlice({
	name: 'crucible/deploy',
	initialState: {
		baseToken: '',
		feeOnTransfer: '',
		feeOnWithdraw: '',
	} as DeployState,
	reducers: {
		baseTokenChanged: (state, action) => {
			state.baseToken = action.payload.value;
		},
		feeOnTransferChanged: (state, action) => {
			state.feeOnTransfer = action.payload.value;
		},
		feeOnWithdrawChanged: (state, action) => {
			state.feeOnWithdraw = action.payload.value;
		},
		reset: (state) => {
			state.baseToken = '';
			state.feeOnTransfer = '';
			state.feeOnWithdraw = '';
		}
	}
});

const launchCrucible = createAsyncThunk('crucible/launch', async (payload: { props: DeployProps }, ctx) => {
	const client = inject<CrucibleClient>(CrucibleClient);
	const { props } = payload;
	const txId = await client.deploy(ctx.dispatch, `${props.network}:${props.baseToken.toLowerCase()}`,
		props.feeOnTransfer, props.feeOnWithdraw);
	if (txId) {
		ctx.dispatch(deploySlice.actions.reset());
	}
});

export function Deploy() {
	const dispatch = useDispatch();
	const props = useSelector<CrucibleAppState, DeployProps>(stateToProps);
	return (
		<>
			<Row>
				<h3>Connected to {props.network}</h3>
			</Row>
			<Row withPadding>
				<TextField
					label="Base Token Address"
					value={props.baseToken}
					onChange={(e, value) => dispatch(deploySlice.actions.baseTokenChanged({value}))}
				/>
			</Row>
			<Row withPadding>
				<TextField
					label="Transfer Fee Ratio"
					value={props.feeOnTransfer}
					onChange={(e, value) => dispatch(deploySlice.actions.feeOnTransferChanged({value}))}
				/>
			</Row>
			<Row withPadding>
				<TextField
					label="Withdraw Fee Ratio"
					value={props.feeOnWithdraw}
					onChange={(e, value) => dispatch(deploySlice.actions.feeOnWithdrawChanged({value}))}
				/>
			</Row>
			<Row withPadding>
				<PrimaryButton
					text={'Launch 🚀'}
					onClick={() => dispatch(launchCrucible({props}))}
				/>
			</Row>
		</>
	);
}