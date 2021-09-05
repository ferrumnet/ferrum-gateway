import React from 'react';
import { useSelector } from 'react-redux';
import { RegisteredContract } from 'types';
import { GovernanceAppState } from '../common/GovernanceAppState';
import {
	Row, RegularBtn, Page,
	// @ts-ignore
} from 'component-library';
import { useHistory } from 'react-router';
import { addressForUser } from 'common-containers';
import './ContractList.css';
import { Card } from '../components/Card';

export function ContractList() {
	const registered = useSelector<GovernanceAppState, RegisteredContract[]>(state =>
		state.data.state.contracts);
	const network = useSelector<GovernanceAppState, string>(state => 
		addressForUser(state.connection.account.user)?.network || '');
	const history = useHistory();
	return (
		<div className="contracts">
			{registered.map((c, i) => (
				<>
					<Card
						title={c.governanceContractId}
						subTitle={`${c.network}:${c.contractAddress}`}
					>
						{c.network === network && (
							<RegularBtn text={'Open'} onClick={() =>
								history.push(`/contract/${c.network}/${c.contractAddress}/${c.governanceContractId}`)}/>
						)}
					</Card>
				</>
			))}
		</div>
	);
}