import React, { useState } from 'react';
import { CrucibleInfo, BigUtils, inject,
	UserCrucibleInfo, CrucibleAllocationMethods, Utils, UserStakeInfo, CRUCIBLE_CONTRACTS_V_0_1, ChainEventBase, } from "types";
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState, CrucibleBoxState } from '../common/CrucibleAppState';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { ResponsiveMode } from 'office-ui-fabric-react';
import { ChainActionDlg } from './ChainActionDlg';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CrucibleClient } from '../CrucibleClient';
import './CrucibleList.css';
import { StakingClient, stakingKey } from '../staking/StakingClient';
import { CrucibleView } from './CrucibleView';
import { transactionListSlice } from 'common-containers/dist/chain/TransactionList';
import { APPLICATION_NAME } from '../common/CommonActions';
import { ApiClient } from 'common-containers';

const doDeposit = createAsyncThunk('crucibleBox/doDeposit',
    async (payload: {
		network: string,
		crucible: string,
		currency: string,
		amount: string,
		isPublic: boolean,
	}, ctx) => {
	const {network, crucible, currency, amount, isPublic} = payload;
	console.log('PL":', payload,)
	const client = inject<CrucibleClient>(CrucibleClient);
	const api = inject<ApiClient>(ApiClient);
	const transactionId = await client.deposit(ctx.dispatch, currency, crucible, amount, isPublic);
	if (!!transactionId) {
		ctx.dispatch(crucibleBoxSlice.actions.registerTx({
			transactionId,
			network }));
		const event = {
			createdAt: 0,
			id: transactionId,
			network,
			eventType: 'transaction',
			application: APPLICATION_NAME,
			status: 'pending',
			transactionType: 'deposit',
			userAddress: api.getAddress(),
		} as ChainEventBase;
		ctx.dispatch(transactionListSlice.actions.addTransaction(event));
	}
});

const doStake = createAsyncThunk('crucibleBox/doStake',
    async (payload: {
			crucible: string, 
			amount: string;
		}, ctx) => {
	const client = inject<StakingClient>(StakingClient);
	const [network, stakeId] = Utils.parseCurrency(payload.crucible);
	const transactionId = await client.stake(ctx.dispatch, 'openEnded', stakeId, payload.crucible, payload.amount);
	if (!!transactionId) {
		ctx.dispatch(crucibleBoxSlice.actions.registerTx({
			transactionId,
			network }));
	}
});

const doWithdraw = createAsyncThunk('crucibleBox/doWithdraw',
    async (payload: {
		network: string,
		currency: string,
		crucible: string,
		amount: string,
	}, ctx) => {
	const {network, currency, crucible, amount} = payload;
	const client = inject<CrucibleClient>(CrucibleClient);
	const transactionId = await client.withdraw(ctx.dispatch,
		currency, crucible, amount);
	if (!!transactionId) {
		ctx.dispatch(crucibleBoxSlice.actions.registerTx({
			transactionId,
			network }));
		const event = {
			createdAt: 0,
			id: transactionId,
			network,
			eventType: 'transaction',
			application: APPLICATION_NAME,
			status: 'pending',
			transactionType: 'withdraw',
		} as ChainEventBase;
		ctx.dispatch(transactionListSlice.actions.addTransaction(event));
	}
});

export const crucibleBoxSlice = createSlice({
	name: 'CrucibleBox',
	initialState: {
		network: '',
		activeTxId: '',
	} as CrucibleBoxState,
	reducers: {
		registerTx: (state, action) => {
			state.network = action.payload.network;
			state.activeTxId = action.payload.transactionId;
		},
		unregisterTx: (state,) => {
			state.network = '';
			state.activeTxId = '';
		}
	},
	extraReducers: builder => {
		builder.addCase(doStake.rejected , (state, action) => {
			console.error('Error staking', action);
		});
	},
});

export function CrucibleBox(params: {info: CrucibleInfo}) {
	const [depositModal, showDepositModal] = useState(false);
	const [stakeModal, showStakeModal] = useState(false);
	const [withdrawModal, showWithdrawModal] = useState(false);
	const dispatch = useDispatch();
	const crucible = params.info;
	let userCrucible = useSelector<CrucibleAppState, UserCrucibleInfo|undefined>(state =>
		crucible?.currency ?
			state.connection.userState.userCrucibleInfo[crucible!.currency] : undefined);

	const baseBalance = userCrucible?.baseBalance || '0';
	const balance = userCrucible?.balance || '0';
	const activeTxId = useSelector<CrucibleAppState, string>(state => 
		state.ui.crucibleBox.activeTxId);
	const userAddr = useSelector<CrucibleAppState, string|undefined>(state =>
		state.connection.account?.user?.userId);

	const [crucibleNetwork, crucibleToken] = Utils.parseCurrency(crucible.currency || '');
	const userStakeInfo = useSelector<CrucibleAppState, UserStakeInfo>(state => 
		state.data.state.stake.userStakes[stakingKey(crucibleNetwork, 'openEnded', crucibleToken)] || {});

	const lpUserStakeInfo = useSelector<CrucibleAppState, UserStakeInfo>(state => 
		state.data.state.stake.userStakes[stakingKey(crucibleNetwork, 'openEnded', crucibleToken)] || {});

	const depositOpen = params.info.activeAllocationCount > 0 ||
		BigUtils.truthy(BigUtils.safeParse(params.info.openCap));

	const userDirectAllocation = (userCrucible?.allocations || []
		).find(a => a.method === CrucibleAllocationMethods.DEPOSIT)?.allocation || '';
	const userLpAllocation = (userCrucible?.allocations || []
		).find(a => a.method === CrucibleAllocationMethods.DEPOSIT_ADD_LIQUIDITY_STAKE)?.allocation || '0';
	const info = params.info;

	const router = CRUCIBLE_CONTRACTS_V_0_1[info.network]?.router || '';
	const deposit =
			<Modal
        isOpen={depositModal}
        onDismiss={() => showDepositModal(false)}
        isBlocking={false}
        isClickableOutsideFocusTrap={false}
        responsiveMode={ResponsiveMode.medium}
      >
		  <ChainActionDlg
		  	network={info.network as any}
			title={'Deposit and Mint'}
			contractAddress={router}
			userAddress={userAddr!}
			currency={info.baseCurrency}
			balance={baseBalance || '0'}
			allocation={userDirectAllocation}
			balanceTitle={`Available balance`}
			symbol={info.baseSymbol}
			feeRatio={'0'}
			feeDeducts={true}
			actionText={`Continue to mint ${info.symbol}`}
			actionButton={`Mint`}
			approvable={true}
			onClose={() => showDepositModal(false)}
			action={(total, amount, feeAmount) => dispatch(
				doDeposit({amount,
					network: info.network,
					crucible: info.currency,
					currency: info.baseCurrency,
					isPublic: !!info.openCap && !userDirectAllocation,
				}))}
		  />
	 </Modal>
	const stake = <Modal
        isOpen={stakeModal}
        onDismiss={() => showStakeModal(false)}
        isBlocking={false}
        isClickableOutsideFocusTrap={false}
        responsiveMode={ResponsiveMode.medium}
      >
		  <ChainActionDlg
		  	network={info.network as any}
			title={`Stake your ${info.symbol}`}
			contractAddress={router}
			userAddress={userAddr!}
			currency={info.currency}
			balance={balance || '0'}
			allocation={''}
			balanceTitle={`Available balance`}
			symbol={info.symbol}
			feeRatio={'0'}
			feeDeducts={true}
			actionText={`Stake ${info.symbol}`}
			approvable={true}
			onClose={() => showStakeModal(false)}
			action={(total, amount, feeAmount) => dispatch(
				doStake({amount, crucible: info.currency }))}
		  />
	</Modal>
	const withdraw = <Modal
        isOpen={withdrawModal}
        onDismiss={() => showWithdrawModal(false)}
        isBlocking={false}
        isClickableOutsideFocusTrap={false}
        responsiveMode={ResponsiveMode.medium}
      >
		  <ChainActionDlg
		  	network={info.network as any}
			title={'Withdraw from crucible'}
			contractAddress={info.contractAddress}
			userAddress={userAddr!}
			currency={info.currency}
			balance={balance}
			allocation={''}
			balanceTitle={`Available balance`}
			symbol={info.symbol}
			feeRatio={info.feeOnWithdrawRate}
			feeDeducts={true}
			actionText={`Withdraw ${info.baseSymbol}`}
			approvable={false}
			onClose={() => showWithdrawModal(false)}
			action={(total, amount, feeAmount) => dispatch(
				doWithdraw({amount,
					network: info.network,
					crucible: info.currency,
					currency: info.baseCurrency,
				}))}
		  />
	</Modal>

	const view = <CrucibleView
			title={params.info.name}
			symbol={params.info.symbol}
			baseSymbol={params.info.baseSymbol}
			feeOnTx={BigUtils.safeParse(params.info.feeOnTransferRate).times(100).toString()}
			feeOnWithdraw={BigUtils.safeParse(params.info.feeOnWithdrawRate).times(100).toString()}
			totalSupply={params.info.totalSupply}
			priceUsd={params.info.priceUsdt}
			basePriceUsd={params.info.basePriceUsdt}
			balance={balance}
			baseBalance={baseBalance}
			directAllocation={userDirectAllocation}
			lpAllocation={userLpAllocation}
			mint={'open'}
			enableMint={depositOpen}
			openMintCap={params.info.openCap}
			onMint={() => {
						dispatch(crucibleBoxSlice.actions.unregisterTx());
						
						showDepositModal(true);
					}}
			enableWithdraw={balance !== '' && balance !== '0'}
			onWithdraw={() => {
						dispatch(crucibleBoxSlice.actions.unregisterTx());
						showWithdrawModal(true);
			}}
		/>;

	return (
		<>
		{deposit}{stake}{withdraw}
		{view}
		{/* <div className="crucible-box-container">
			<div className="crucible-box-row">
				<span><b>{params.info.name}</b></span>
			</div>
			<div className="crucible-box-row">
				<span><b>{params.info.symbol}</b></span>
				<span>Fee on tx %{BigUtils.safeParse(params.info.feeOnTransferRate).times(100).toString()}</span>
				<span>Withdraw %{BigUtils.safeParse(params.info.feeOnWithdrawRate).times(100).toString()}</span>
			</div>
			<div className="crucible-box-row">
				<p> </p>
			</div>
			<div className="crucible-box-row">
				<span>Supply: {params.info.totalSupply || '0'}</span>
				<span>Price (USD): {params.info.priceUsdt || '0'}</span>
			</div>
			<div className="crucible-box-row">
				<span>Balance</span>
				<span>{balance}</span>
				<span>Staked</span>
				<span>{userStakeInfo?.stake}</span>
				<span>Rewards</span>
				<span>
					{(userStakeInfo?.rewards || [])[0]?.rewardAmount || ''}
					{(userStakeInfo?.rewards || [])[0]?.rewardSymbol || ''}
				</span>
			</div>
			<div className="crucible-box-row">
				<span>LP</span>
				<span>{userCrucible?.balance || ''}</span>
				<span>LP Staked</span>
				<span>{lpUserStakeInfo?.stake || ''}</span>
				<span>LP Rewards</span>
				<span>
					{(lpUserStakeInfo?.rewards || [])[0]?.rewardAmount || ''}
					{(lpUserStakeInfo?.rewards || [])[0]?.rewardSymbol || ''}
				</span>
			</div>
			<div className="crucible-box-row">
				<span>Mint: {depositOpen ? 'OPEN' : 'CLOSED'}</span>
				<span>Public cap: {params.info.openCap || '0'}</span>
				<span>Total Allocations: {params.info.activeAllocationSum || '0'}</span>
			</div>
			<div className="crucible-box-row">
				<span>Your allocations</span><br/>
				<span>Direct mint: {userDirectAllocation}</span>
				<span>Liquidity mint: {userLpAllocation}</span>
			</div>
			<div className="crucible-box-row">
				<span><small>{params.info.feeDescription}</small></span>
			</div>
			<div className="crucible-box-row">
				<RegularBtn
					disabled={!depositOpen}
					text='Mint'
					onClick={() => {
						dispatch(crucibleBoxSlice.actions.unregisterTx());
						showDepositModal(true);
					}}
				/>

				<RegularBtn
					text='Stake'
					onClick={() => {
						dispatch(crucibleBoxSlice.actions.unregisterTx());
						showStakeModal(true); }}
				/>

				<RegularBtn
					text='Withdraw'
					onClick={() => {
						dispatch(crucibleBoxSlice.actions.unregisterTx());
						showWithdrawModal(true);
					}}
				/>
			</div>
		</div> */}
		</>
	);
}