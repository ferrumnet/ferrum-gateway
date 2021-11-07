import React from 'react';
import { TransactionList } from 'common-containers/dist/chain/TransactionList';
import Modal from 'office-ui-fabric-react/lib/Modal';
import './TransactionListModal.css';
import { APPLICATION_NAME } from '../common/CommonActions';
import { ChainEventBase, Utils } from 'types';

function TransactionItemView(props: {event: ChainEventBase}) {
	return (
		<div className="transaction-list-item">
			<span>{props.event.transactionType}</span>
			<span><a href={Utils.linkForTransaction(props.event.network, props.event.id)}
				target="_blank">{Utils.shorten(props.event.id)}</a></span>
			<span>{props.event.status}</span>
		</div>
	);
}

export function TransactionListModal(props: {show: boolean, onDismiss: () => void}) {
	return (
		<>
		<Modal
			isOpen={props.show}
			onDismiss={props.onDismiss}
			isBlocking={false}
			isClickableOutsideFocusTrap={false}
		>
			<div className="transaction-list-container">
				<span><b>Your Transactions</b></span>
				<div className="transaction-list">
					<TransactionList
						eventIsRelevant={e => e.application === APPLICATION_NAME}
						eventView={TransactionItemView}
					/>
				</div>
			</div>
		</Modal>
		</>
	);
}