import React from 'react';
import { useSelector } from 'react-redux';
import { CrucibleAppState } from '../../../common/CrucibleAppState';
import { useHistory, useParams } from 'react-router';
import { CrucibleInfo, Utils,UserCrucibleInfo,BigUtils } from 'types';
import { FCard, FButton } from "ferrum-design-system";
import { ConnectButtonWapper } from 'common-containers';
export function CrucibleHome() {
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state => state.data.state.crucible);
	let userCrucible = useSelector<CrucibleAppState, UserCrucibleInfo|undefined>(state => crucible?.currency ? state.connection.userState.userCrucibleInfo[crucible!.currency] : undefined);
	const depositOpen = crucible ? (crucible.activeAllocationCount > 0 || BigUtils.truthy(BigUtils.safeParse(crucible!.openCap))) : false;
	const enableWithdraw = userCrucible ? userCrucible!.balance !== '' && userCrucible!.balance !== '0' : false;
	let connected = useSelector<CrucibleAppState, string|undefined>(state => state.connection.account.user.accountGroups[0].addresses[0]?.address);
	
	const history = useHistory();
	// if (!Utils.addressEqual(crucible?.contractAddress!, contractAddress)) {
	// 	crucible = undefined;
	// }

	return (
		<>
			<div className='cr-header'> {crucible?.name}</div>
			<div className='fr-flex-container'>
				<FCard className='mini-card'>
					<span className='header'>
						Transfer fee
					</span>
					<span className='content'>{`${BigUtils.safeParse(crucible?.feeOnTransferRate || '0').times(100).toString()}%`}</span>

				</FCard>
				<FCard className='mini-card'>
					<span className='header'>
						Total Supply
					</span>
					<span className='content'>{crucible?.totalSupply || 0} {crucible?.symbol}</span>
				</FCard>
				
			</div>
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
		
			<div className='block'>
				{
					(depositOpen || enableWithdraw) && 
						<div className={`tag ${(!depositOpen || Number(crucible?.openCap) === 0) && 'error'}`}>
							{
								(depositOpen && Number(crucible?.openCap) > 0) &&  `Minting Is Open ( ${crucible?.openCap} Open Cap)`
							}
							{
								(!depositOpen || Number(crucible?.openCap) === 0) && `Minting Is Closed (Cap Full)`
							}
							{
								(enableWithdraw && !depositOpen) && `Withdraw Is Open for Crucible`
							}
						</div>
				}
				<FCard className='crucibleItemCard'>
					<span className='header'>Your Available Crucible Liquidity</span>
					<FCard className={'content-card flex no-left no-bottom'}>
						<span className='content'>{userCrucible?.balance || 0}</span>
						<div className='content2'>{crucible?.symbol || 'Crucible Token symbol'}</div>
					</FCard>
				</FCard>
			</div>
			<div>
				<FCard className='center'>
					<div className='content'>
						<span role="img" aria-label="wizard-icon" style={{"marginRight": "8px"}}>&#127855;</span>This Crucible Token attracts {BigUtils.safeParse(crucible?.feeOnWithdrawRate||'0').times(100).toString()}% on withdrawal to base Token.
					</div>
				</FCard>	
			</div>
			<FCard className='fr-btn-container'>
				{ !connected ?
						<ConnectButtonWapper View={(props)=>(
								<FButton 
									title={'Connect to Wallet'}
									disabled={!!connected}
									{...props}
									//onClick={()=>onMint()}
								/>
							)}
						/>
					:
						<>
							<FButton 
								title={'Mint'}
								disabled={!depositOpen || Number(crucible?.openCap) === 0 ||!connected}
								onClick={()=> history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}/mint`)}
								//onClick={()=>onMint()}
								
							/>
							<FButton 
								title={'Withdraw'}
								disabled={!enableWithdraw||!connected||Number(userCrucible?.balance)<=0}
								onClick={()=> history.push(`/crucible/${crucible?.network}/${crucible?.contractAddress}/withdraw`)}
							/>
						</>
				}
				
			</FCard>
		</>
	);
}
