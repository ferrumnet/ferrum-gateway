import React, { useState } from 'react';
import { Network } from 'ferrum-plumbing';
import {
    Row, RegularBtn, AmountInput, supportedIcons,
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
	console.log('Action DLG', props)
	const [amount, setAmount] = useState('');
	let total = amount;
	let feeAmount = '';
	if (props.feeRatio) {
		feeAmount = BigUtils.safeParse(amount)
			.times(BigUtils.safeParse(props.feeRatio)).toFixed();
		total = props.feeDeducts ?
			BigUtils.safeParse(amount).sub(BigUtils.safeParse(feeAmount)).toFixed():
			BigUtils.safeParse(amount).add(BigUtils.safeParse(feeAmount)).toFixed();
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
			<div className="crucible-box-row">
				<h3>{props.title} - {props.network}</h3>
			</div>
			<div className="crucible-box-row">
				<label>{props.balanceTitle}</label><br />
				<label>{props.balance}</label>
			</div>
			<div className="crucible-box-row">
				<AmountInput
                    symbol={props.symbol}
                    amount={amount}
                    value={amount}
                    fee={0}
                    icons={supportedIcons}
										addonStyle={styles.addon}
                    balance={props.balance}
                    setMax={() => setAmount(props.balance)}
                    onChange={ (v:any) => setAmount(v.target.value)}
				/>
			</div>
			<div className="crucible-box-row">
			{fee}
			</div>
			<div className="crucible-box-row">
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
			</div>
			<div className="crucible-box-row">
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

const styles = {
    addon: {
        position: "absolute" as "absolute",
        right: '5%',
        display: "flex",
        height: "40%",
        alignItems: "center" as "center",
        cursor: "pointer",
        top: "15px",
        padding: "10px",
				width: '30px',
    },
}