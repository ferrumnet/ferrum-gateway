//@ts-nocheck
import React from 'react';
import { TransactionList } from 'common-containers/dist/chain/TransactionList';
import Modal from 'office-ui-fabric-react/lib/Modal';
import './TransactionListModal.css';
import { APPLICATION_NAME } from '../common/CommonActions';
import { ChainEventBase, Utils } from 'types';

function TransactionItemView(props: {event: ChainEventBase}) {
	return (
		<div className="transaction-list-item">
			<div className='flex'><span>{props.event.transactionType} <a href={Utils.linkForTransaction(props.event.network, props.event.id)} target="_blank">{Utils.shorten(props.event.id)}</a></span> <span>{props.event.status}</span></div>
		</div>
	);
}

export function TransactionListModal(props: {show: boolean, onDismiss: () => void,address: string}) {
	return (
		<>
		<Modal
			isOpen={props.show}
			onDismiss={props.onDismiss}
			isBlocking={false}
			isClickableOutsideFocusTrap={false}
			className='transactions_modal'
		>
			<div className="transaction-list-container">
				<div className='item'>
					<div className='header'>
						<span><b>Account</b></span>
					</div>
					<div className='address-container'>
						<span >Connected to </span>
						<div className='address'>
							{Utils.shorten(props?.address) || '0...'}
						</div>
					</div>
				</div>
				<div className='item2'>
					<div className="transaction-list">
						<TransactionList
							eventIsRelevant={e => e.application === APPLICATION_NAME}
							eventView={TransactionItemView}
						/>
					</div>
				</div>
			</div>
		</Modal>
		</>
	);
}