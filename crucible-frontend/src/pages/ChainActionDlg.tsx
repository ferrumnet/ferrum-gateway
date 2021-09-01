import React, { useState } from 'react';
import { Network } from 'ferrum-plumbing';
import {
    Row, RegularBtn, AmountInput,
    // @ts-ignore
} from 'component-library';
import { BigUtils, ChainEventBase, inject } from 'types';
import { ApiClient, ApprovableButtonWrapper, ChainEventItem,
	IApprovableButtonWrapperViewProps } from 'common-containers';

export interface ChainActionDlgProps {
	network: Network;
	title: string;
	contractAddress: string;
	userAddress: string;
	currency: string;
	balance: string;
	balanceTitle: string;
	symbol: string;
	feeRatio: string;
	feeDeducts: boolean;
	actionText: string;
	approvable: boolean;
	onClose: () => void;
	action: (total: string, amount: string, feeAmount: string) => void;
	pendingTxId?: string;
}

async function updateTransaction(item: ChainEventBase): Promise<ChainEventBase> {
    try {
        const c = inject<ApiClient>(ApiClient);
        const res = await c.updateChainEvent('transaction', [{ network: item.network, id: item.id}]);
		if (!res) {
			return item;
		}
		return { ...item, status: res.status, };
    } catch(e) {
        console.error('updateWithdrawItem ', e);
        return item;
    }
}

export function ChainActionDlg(props: ChainActionDlgProps) {
	const [amount, setAmount] = useState('');
	let total = amount;
	let feeAmount = '';
	if (props.feeRatio) {
		feeAmount = BigUtils.safeParse(amount)
			.times(BigUtils.safeParse(props.feeRatio)).toFixed();
		total = props.feeDeducts ?
			BigUtils.safeParse(amount).sub(new Big(feeAmount)).toFixed():
			BigUtils.safeParse(amount).add(new Big(feeAmount)).toFixed();
	}
	const fee = feeAmount ? (
		<>
		<Row withPadding>
			<span>Fee: {feeAmount} {props.symbol}</span>
		</Row>
		<Row withPadding>
			<span>Total: {amount} {props.symbol}</span>
		</Row>
		</>
	) : (<></>);
	return (
		<div className="chain-action-dlg-container">
			<Row withPadding>
				<h3>{props.title} - {props.network}</h3>
			</Row>
			<Row withPadding>
				<label>{props.balanceTitle}</label><br />
				<label>{props.balance}</label>
			</Row>
			<Row withPadding>
				<AmountInput
                    symbol={props.symbol}
                    amount={amount}
                    value={amount}
                    fee={0}
                    icons={{}}
                    balance={props.balance}
                    setMax={() => setAmount(props.balance)}
                    onChange={ (v:any) => setAmount(v.target.value)}
				/>
			</Row>
			{fee}
			<Row withPadding>
				{ props.approvable ? (
					<ApprovableButton
						disabled={!amount || !!props.pendingTxId}
						text={props.actionText}
						onClick={() => props.action(total, amount, feeAmount)}
						amount={total}
						contractAddress={props.contractAddress}
						currency={props.currency}
						userAddress={props.userAddress}
					/>
				) : (
					<RegularBtn
						disabled={!amount || !!props.pendingTxId}
						text={props.actionText}
						onClick={() => props.action(total, amount, feeAmount)}
					/>
				)}
				<RegularBtn
					text={'Close'}
					onClick={() => props.onClose()}
				/>
			</Row>
			{props.pendingTxId && (
				<ChainEventItem
					eventType="transaction"
					id={props.pendingTxId}
					initialStatus={'pending'}
					network={props.network}
					updater={updateTransaction}
				>
					<span>Transaction ID: <br/>{props.pendingTxId}</span>
				</ChainEventItem>
			)}
		</div>
	);
}

function ApprovableButtonInternal(props:
		{disabled: boolean, text: string, onClick: () => void} &
		IApprovableButtonWrapperViewProps) {
	const disabled = props.pendingApproval ||
						(props.isApprovalMode ? false : props.disabled);
	return (
		<>
			<div >
				<RegularBtn
					onClick={() => props.isApprovalMode ? props.onApproveClick() : props.onClick()}
					className="btn-pri action btn-icon btn-connect mt-4"
					text={props.isApprovalMode ? 'Approve' : props.text}
					disabled={disabled}
				/>
			</div>
		</>
	);
}

export function ApprovableButton(props: {
		disabled: boolean, text: string, onClick: () => void,
		contractAddress: string,
		currency: string,
		userAddress: string,
		amount: string,
	} ) {
	return <ApprovableButtonWrapper
			contractAddress={props.contractAddress}
			currency={props.currency}
			userAddress={props.userAddress}
			amount={props.amount}
			// @ts-ignore
			View={(ownProps) => <ApprovableButtonInternal {...ownProps} {...props} />}
		/>
}
