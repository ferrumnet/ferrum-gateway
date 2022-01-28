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
	const user = useSelector((state: CrucibleAppState) => state.connection?.account?.user);
	const address = !!user?.accountGroups && !!user?.accountGroups[0]?.addresses
	 ? user?.accountGroups[0]?.addresses[0]?.address.toLowerCase() : undefined;
	return (
		<>
    <Button
      variant="pri"
      className={`btn-icon btn-connect`}
      onClick={() => setShowModal(true)}
    >
      <span>Transactions ({props.summary.pendingCount || 0}/{props.summary.total})</span>
    </Button>
		<TransactionListModal show={showModal} onDismiss={() => setShowModal(false)} address={address||'0x0....'} />
		</>
	);
}

export function TransactionSummaryButton() {
	const user = useSelector((state: CrucibleAppState) => state.connection?.account?.user);
	const network = !!user?.accountGroups && !!user?.accountGroups[0]?.addresses
	 ? user?.accountGroups[0]?.addresses[0]?.network.toLowerCase() : undefined;
	
	return (
		<TransactionSummary
			address={user.accountGroups[0]?.addresses[0]?.address}
			network={network || ''}
			eventIsRelevant={(e: ChainEventBase) => e.application === APPLICATION_NAME}
			summaryView={TransactionSummarySkin as any}
		/>
	)
}