import React from 'react';
import { useSelector } from 'react-redux';
import { RegisteredContract } from 'types';
import { GovernanceAppState } from '../../common/GovernanceAppState';
import {
	Row, RegularBtn, Page,
	// @ts-ignore
} from 'component-library';
import { useHistory } from 'react-router';
import { addressForUser } from 'common-containers';
import './ContractList.css';
import { Card } from '../../components/Card';
import { FButton } from "ferrum-design-system";

export function ContractList() {
	const registered = useSelector<GovernanceAppState, RegisteredContract[]>(state => state.data.state.contracts);
	const network = useSelector<GovernanceAppState, string>(state => addressForUser(state.connection.account.user)?.network || '');
	const waiting = useSelector<GovernanceAppState, boolean>(state=> state.data.state.waiting)
	const history = useHistory();

	return (
		<>
			<div className='gv-section-title'>
				<h3>{'Registered Contracts'}</h3>
			</div>
			<div className="contracts">
				{
					registered.length > 0 ? 
						registered.map((c, i) => (
							<>
								<Card
									title={c.governanceContractId}
									subTitle={`${c.network}:${c.contractAddress}`}
								>
									<div className='gv-card-action-btn'>
										<FButton title={'Open'} disabled={!(c.network === network)} onClick={() => history.push(`/contract/${c.network}/${c.contractAddress}/${c.governanceContractId}`)}/>
									</div>
								</Card>
							</>
						))
					: waiting ? <div> Loading Contracts List... </div> : <div className='gv-notice-centered'> <p> You Are Currently Not Registered Under Any Governance Quorums. (Confirm Connected Network or Contact Admin) </p></div>
				}
			</div>
		</>
		
	);
}