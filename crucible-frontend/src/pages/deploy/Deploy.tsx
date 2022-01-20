import React from 'react';
import {
    Row, Page,
    // @ts-ignore
} from 'component-library';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState, DeployState } from '../../common/CrucibleAppState';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CrucibleClient } from '../../common/CrucibleClient';
import { inject } from 'types';
import { addressForUser } from 'common-containers';
import { FCard, FInputText, FButton } from "ferrum-design-system";
import { ConnectButtonWapper } from 'common-containers';

// fee is in ratios
interface DeployProps extends DeployState {
	network: string;
}

function stateToProps(state: CrucibleAppState): DeployProps {
	const network = addressForUser(state.connection.account.user)?.network;
	return {
		...state.ui.deploy,
		network,
	} as DeployProps;
}

const launchCrucible = createAsyncThunk('crucible/launch', async (payload: { props: DeployProps }, ctx) => {
	const client = inject<CrucibleClient>(CrucibleClient);
	const { props } = payload;
	const txId = await client.deploy(ctx.dispatch, `${props.network}:${props.baseToken.toLowerCase()}`,
		(Number(props.feeOnTransfer)/100).toString(), (Number(props.feeOnWithdraw)/100).toString());
	if (txId) {
		ctx.dispatch(deploySlice.actions.reset());
	}
});

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
			state.error = undefined;
		},
		feeOnTransferChanged: (state, action) => {
			state.feeOnTransfer = action.payload.value;
			state.error = undefined;
		},
		feeOnWithdrawChanged: (state, action) => {
			state.feeOnWithdraw = action.payload.value;
			state.error = undefined;
		},
		reset: (state) => {
			state.baseToken = '';
			state.feeOnTransfer = '';
			state.feeOnWithdraw = '';
			state.error = undefined;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(launchCrucible.rejected, (state, action) => {
			state.error = action.error.message;
		});
	}
});

export function Deploy() {
	const dispatch = useDispatch();
	const props = useSelector<CrucibleAppState, DeployProps>(stateToProps);
	const appError = useSelector<CrucibleAppState, string>(state=>state.data.state.initError!);
	const connected = useSelector<CrucibleAppState, string>(state=>state.connection.account.user.accountGroups[0]?.addresses[0]?.address||'');

	return (
		<FCard className='crucible-filled-card'>
				<div className='header'>
					<span className="title center underline">
						Deploy Crucible Token {`${props.network ? `on ${props.network}` : ''}`}
					</span>
				</div>
				{(appError) && (<span>{appError} <br/></span>)}
				<div className='extend-mgb'>
					<div className='subtxt'>
						Base Token Address
                    </div>
					<FInputText
						className={'crucible-input'}
						placeholder={'Base Token Address'}
						value={props.baseToken}
						onChange={(e:any) => dispatch(deploySlice.actions.baseTokenChanged({value: e.target.value}))}
					/>
				</div>
				<div className='extend-mgb'>
					<div className='subtxt'>
						Transfer Fee Ratio
                    </div>
					<FInputText
						className={'crucible-input'}
						placeholder={'Transfer Fee Ratio %'}
						value={props.feeOnTransfer}
						type={'number'}
						onChange={(e:any) => dispatch(deploySlice.actions.feeOnTransferChanged({value: e.target.value}))}
					/>
				</div>
				<Row/>
				<div className='extend-mgb'>
					<div className='subtxt'>
						Withdraw Fee Ratio
                    </div>
					<FInputText
						className={'crucible-input'}
						type={'number'}
						placeholder={'Withdraw Fee Ratio %'}
						value={props.feeOnWithdraw}
						onChange={(e:any) => dispatch(deploySlice.actions.feeOnWithdrawChanged({value: e.target.value}))}
					/>
				</div>
				<Row withPadding centered>
					{
						!connected ?
							<ConnectButtonWapper View={(props)=>(
								<FButton 
									title={'Connect to Wallet'}
									disabled={!!connected}
									{...props}
									//onClick={()=>onMint()}
								/>
							)}/>
						: 		
							<FButton
								disabled={!props.network || !props.feeOnWithdraw || !props.feeOnTransfer || !props.baseToken}
								className={'cr-large-btn'}
								title={`${ !props.network ? 'Connect Wallet to Deploy' : 'Deploy Crucible 🚀'}`}
								onClick={() => dispatch(launchCrucible({props}))}
							/>
					}
				</Row>
		</FCard>
	);
}