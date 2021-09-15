import React, { useState } from 'react';
import { CrucibleInfo, BigUtils, CRUCIBLE_ROUTER, inject,
	UserCrucibleInfo, CrucibleAllocationMethods, } from "types";
import {
    Row, RegularBtn,
    // @ts-ignore
} from 'component-library';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState, CrucibleBoxState } from '../common/CrucibleAppState';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { ResponsiveMode } from 'office-ui-fabric-react';
import { ChainActionDlg } from './ChainActionDlg';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CrucibleClient } from '../CrucibleClient';
import './CrucibleList.css';

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
	}
});

const doDeposit = createAsyncThunk('crucibleBox/doDeposit',
    async (payload: {
		network: string,
		crucible: string,
		currency: string,
		amount: string,
		isPublic: boolean,
	}, ctx) => {
	const {network, crucible, currency, amount, isPublic} = payload;
	const client = inject<CrucibleClient>(CrucibleClient);
	const transactionId = await client.deposit(ctx.dispatch, currency, crucible, amount, isPublic);
	if (!!transactionId) {
		ctx.dispatch(crucibleBoxSlice.actions.registerTx({
			transactionId,
			network }));
	}
});

const doStake = createAsyncThunk('crucibleBox/doStake',
    async (payload: {
	}, ctx) => {
		// TODO: Implement
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
	}
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
	const depositOpen = params.info.activeAllocationCount > 0 ||
		BigUtils.truthy(BigUtils.safeParse(params.info.openCap));

	const userDirectAllocation = (userCrucible?.allocations || []
		).find(a => a.method === CrucibleAllocationMethods.DEPOSIT)?.allocation || '0';
	const userLpAllocation = (userCrucible?.allocations || []
		).find(a => a.method === CrucibleAllocationMethods.DEPOSIT_ADD_LIQUIDITY_STAKE)?.allocation || '0';
	const info = params.info;
	const deposit = <Modal
        isOpen={depositModal}
        onDismiss={() => showDepositModal(false)}
        isBlocking={false}
        isClickableOutsideFocusTrap={false}
        responsiveMode={ResponsiveMode.medium}
      >
		  <ChainActionDlg
		  	network={info.network as any}
			title={'Deposit and Mint'}
			contractAddress={CRUCIBLE_ROUTER[info.network]}
			userAddress={userAddr!}
			currency={info.baseCurrency}
			balance={baseBalance || '0'}
			allocation={userDirectAllocation}
			balanceTitle={`Available balance`}
			symbol={info.baseSymbol}
			feeRatio={'0'}
			feeDeducts={true}
			actionText={`Mint ${info.symbol}`}
			approvable={true}
			onClose={() => showDepositModal(false)}
			action={(total, amount, feeAmount) => dispatch(
				doDeposit({amount,
					network: info.network,
					crucible: info.currency,
					currency: info.baseCurrency,
					isPublic: !!info.openCap && !userDirectAllocation,
				}))}
			pendingTxId={activeTxId}
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
			contractAddress={''/*info.mainStaking*/}
			userAddress={userAddr!}
			currency={info.currency}
			balance={baseBalance || '0'}
			allocation={''}
			balanceTitle={`Available balance`}
			symbol={info.symbol}
			feeRatio={'0'}
			feeDeducts={true}
			actionText={`Stake ${info.symbol}`}
			approvable={true}
			onClose={() => showStakeModal(false)}
			action={(total, amount, feeAmount) => dispatch(
				doStake({ }))}
			pendingTxId={activeTxId}
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
			pendingTxId={activeTxId}
		  />
	</Modal>
	return (
		<>
		{deposit}{stake}{withdraw}
		<div className="crucible-box-container">
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
				<span>0</span>
				<span>Rewards</span>
				<span>0</span>
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
		</div>
		</>
	);
}