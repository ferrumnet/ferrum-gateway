import React, { useState } from 'react';
import { TransactionSummary, TransactionViewSummaryProps } from 'common-containers/dist/chain/TransactionList';
import { Button } from "react-bootstrap";
import { APPLICATION_NAME } from '../common/CommonActions';
import { useSelector } from 'react-redux';
import { CrucibleAppState } from '../common/CrucibleAppState';
import { ChainEventBase } from 'types';
import { TransactionListModal } from './TransactionListModal';

function TransactionSummarySkin(props: TransactionViewSummaryProps) {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
    <Button
      variant="pri"
      className={`btn-icon btn-connect`}
      onClick={() => setShowModal(true)}
    >
      <span>Transactions ({props.summary.pendingCount || 0}/{props.summary.total})</span>
    </Button>
		<TransactionListModal show={showModal} onDismiss={() => setShowModal(false)} />
		</>
	);
}

export function TransactionSummaryButton() {
	const user = useSelector((state: CrucibleAppState) => state.connection?.account?.user);
	const network = !!user?.accountGroups && !!user?.accountGroups[0]?.addresses
	 ? user?.accountGroups[0]?.addresses[0]?.network : undefined;
	return (
		<TransactionSummary
			network={network || ''}
			eventIsRelevant={(e: ChainEventBase) => e.application === APPLICATION_NAME}
			summaryView={TransactionSummarySkin as any}
		/>
	)
}