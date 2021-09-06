import { addressForUser } from 'common-containers';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { GovernanceContract, QuorumSubscription } from 'types';
import { GovernanceAppState } from '../common/GovernanceAppState';
import { Card } from '../components/Card';

export function UserSubscription() {
	const { contractAddress } = useParams() as any;
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const quorum = useSelector<GovernanceAppState, QuorumSubscription>(
		state => state.connection.userState.quorum);
	return (
		<>
		<Card title={'Connected Account'} subTitle=''>
			<div className="method-contract">
				<h4>Your addres: {userAddress || 'Not connected'}</h4>
				<h4>Contract: {contract.id}</h4>
				<h4>At: {contractAddress}</h4>
				<h4>Quorum: <b>{quorum.quorum || 'Not registered'}</b></h4>
				<h4>Group ID: <b>{quorum.groupId}</b></h4>
				<h4>Min signatures: <b>{quorum.minSignatures}</b></h4>
			</div>
		</Card>
		</>
	);
}