import React, { useState } from 'react';
import { CrucibleInfo, BigUtils, CRUCIBLE_ROUTER, inject } from "types";
import {
    Row, RegularBtn,
    // @ts-ignore
} from 'component-library';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState, CrucibleBoxState } from '../common/CrucibleAppState';
import { addressesForUser } from 'common-containers';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { ResponsiveMode } from 'office-ui-fabric-react';
import { ChainActionDlg } from './ChainActionDlg';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CrucibleClient } from '../CrucibleClient';

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
	const balance = useSelector<CrucibleAppState, string>(state => {
		const addr = addressesForUser(state.connection.account.user);
		return addr.filter(a => a.currency === params.info.currency)
			.map(c => c.balance).find(Boolean) || '0';
	});
	const baseBalance = useSelector<CrucibleAppState, string>(state => {
		const addr = addressesForUser(state.connection.account.user);
		return addr.filter(a => a.currency === params.info.baseCurrency)
			.map(c => c.balance).find(Boolean) || '0';
	});
	const activeTxId = useSelector<CrucibleAppState, string>(state => 
		state.ui.crucibleBox.activeTxId);
	const userAddr = useSelector<CrucibleAppState, string|undefined>(state =>
		state.connection.account?.user?.userId);
	const depositOpen = params.info.activeAllocationCount > 0 ||
		BigUtils.truthy(BigUtils.safeParse(params.info.openCap));
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
			balance={baseBalance}
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
					crucible: info.contractAddress,
					currency: info.currency,
					isPublic: !!info.openCap,
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
			balance={baseBalance}
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
			balanceTitle={`Available balance`}
			symbol={info.symbol}
			feeRatio={info.feeOnWithdrawRate}
			feeDeducts={true}
			actionText={`Withdraw ${info.baseSymbol}`}
			approvable={false}
			onClose={() => showWithdrawModal(false)}
			action={(total, amount, feeAmount) => dispatch(
				doWithdraw({amount: total,
					network: info.network,
					crucible: info.contractAddress,
					currency: info.currency,
				}))}
			pendingTxId={activeTxId}
		  />
	</Modal>
	return (
		<>
		{deposit}{stake}{withdraw}
		<div className="crucible-box-container">
			<Row>
				<span>{params.info.symbol}</span>
				<span>Fee on tx %{params.info.feeOnTransferRate}</span>
				<span>Withdraw %{params.info.feeOnWithdrawRate}</span>
			</Row>
			<Row>
				<span>Supply: {params.info.totalSupply || '0'}</span>
				<span>Price (USD): {params.info.priceUsdt || '0'}</span>
			</Row>
			<Row>
				<span>Balance</span>
				<span>{balance}</span>
				<span>Staked</span>
				<span>0</span>
				<span>Rewards</span>
				<span>0</span>
			</Row>
			<Row>
				<span>Mint: {depositOpen ? 'OPEN' : 'CLOSED'}</span>
				<span>Public cap: {params.info.openCap || '0'}</span>
				<span>Total Allocations: {params.info.activeAllocationSum || '0'}</span>
			</Row>
			<Row>
				<span><small>{params.info.feeDescription}</small></span>
			</Row>
			<Row>
				<RegularBtn
					disabled={!depositOpen}
					text='Mint'
					onClice={() => {
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
			</Row>
		</div>
		</>
	);
}