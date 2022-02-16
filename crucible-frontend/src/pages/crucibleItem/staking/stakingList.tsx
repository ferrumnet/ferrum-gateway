import React from 'react';
import { useSelector } from 'react-redux';
import { CrucibleAppState } from '../../../common/CrucibleAppState';
import { useHistory, useParams } from 'react-router';
import { CrucibleInfo, Utils,UserCrucibleInfo,BigUtils } from 'types';
import { FCard, FButton } from "ferrum-design-system";
import { ConnectButtonWapper } from 'common-containers';

export function StakingList() {
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state => state.data.state.crucible);
	let userCrucible = useSelector<CrucibleAppState, UserCrucibleInfo|undefined>(state => crucible?.currency ? state.connection.userState.userCrucibleInfo[crucible!.currency] : undefined);
	const depositOpen = crucible ? (crucible.activeAllocationCount > 0 || BigUtils.truthy(BigUtils.safeParse(crucible!.openCap))) : false;
	const enableWithdraw = userCrucible ? userCrucible!.balance !== '' && userCrucible!.balance !== '0' : false;
	let connected = useSelector<CrucibleAppState, string|undefined>(state => state.connection.account.user.accountGroups[0].addresses[0]?.address);
	const history = useHistory();
	
	const getUserDetail = (active_crucible: { [key: string]: string; }) => userCrucible?.stakes.find(e=>e?.address === active_crucible?.address)
	
	return (
		<>
			<div className='cr-header'> {`${crucible?.name} Staking Contracts(Pools)`}</div>
			<div className='fr-flex-container'>
				<FCard className='mini-card'>
					<span className='header'>
						{crucible?.baseSymbol || 'Base Token'} Price (USD)
					</span>
					<span className='content '>${crucible?.basePriceUsdt|| 0}</span>
				</FCard>
				
				<FCard className='mini-card'>
					<span className='header'>{crucible?.symbol || 'Crucible Token'} Price (USD)</span>
					<span className='content'>${crucible?.priceUsdt || 0}</span>
				</FCard>
			</div>
			<div className='header page-back flex'>
				<span className="back-btn" onClick={()=> crucible && history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}`)}>
					←
				</span>
			</div>

            {
				//@ts-ignore
				crucible?.staking?.length > 0 ? 
					//@ts-ignore
					crucible?.staking.map( (e,idx) => 
						<div className='block'>
							<FCard className='crucibleItemCard staking'>
								<div className='staking_detail'>Crucible Staking Address : {e.address}</div>
								<div className='staking_detail'>Crucible Token : {crucible?.symbol}</div>
								<div className='staking_detail'>Staking Type : {e?.stakingType ? e?.stakingType[0] : '0'}</div>
								<div className='staking_detail'>Total Pool Staked Volume : {e.totalStake || '0'}</div>
								<div className='staking_detail'>Total Pool Reward Available : {e.totalPoolReward || '0'}</div>
								{
									Number(getUserDetail(e)?.stakeOf) ? (<>
										<div className='staking_detail'>Your Staked Balance : {getUserDetail(e)?.stakeOf || '0'} {crucible?.symbol}</div>
										<div className='staking_detail'>Your Accumulated Reward : {getUserDetail(e)?.rewardOf || '0'} {crucible?.symbol}</div>	
									</>) : ''
								}
								
								<div className='btn-container-oneliner'>
									<>
										
										{
											Number(e.totalPoolReward) > 0 &&
												<FButton 
													title={'Withdraw Rewards'}
													disabled={!depositOpen || Number(crucible?.openCap) === 0 ||!connected}
													onClick={()=> history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}/${idx}/withdraw-rewards`)}
													//onClick={()=>onMint()}
												/>
										}
										<FButton 
											title={'Stake'}
											disabled={Number(userCrucible?.balance)<=0}
											onClick={()=> history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}/${idx}/stake`)}
											//onClick={()=>onMint()}
											
										/>
										<FButton 
											title={'Unstake'}
											disabled={!enableWithdraw||!connected||Number(userCrucible?.balance)<=0}
											onClick={()=> history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}/${idx}/unstake`)}
										/>
									</>
								</div>
							</FCard>
							
						</div>	
					)
				: <div className='cr-header empty centered'> 
					<div className="cr-header centered">There are no Staking Contracts configured for this crucible. </div>
					<div className="back-btn" onClick={()=> crucible && history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}`)}>
						<span className="back-btn">
							←
						</span>
						<span className="subtxt">
							Back to Crucible Home
						</span>
					</div>
					
				</div>
            }
		
			
		
		</>
	);
}
