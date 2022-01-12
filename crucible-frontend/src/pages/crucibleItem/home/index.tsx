import React from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from '../../../common/CrucibleAppState';
import { CrucibleBox } from './../../CrucibleBox';
import { useParams } from 'react-router';
import { CrucibleLoader } from './../../CrucibleLoader';
import { CrucibleInfo, Utils,UserCrucibleInfo,BigUtils } from 'types';
import { FLayout, FContainer,FCard, FButton, ThemeBuilder } from "ferrum-design-system";

export function CrucibleHome() {
	let {network, contractAddress} = useParams() as any;
	let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state =>
		state.data.state.crucible);
	let userCrucible = useSelector<CrucibleAppState, UserCrucibleInfo|undefined>(state =>
			crucible?.currency ?
				state.connection.userState.userCrucibleInfo[crucible!.currency] : undefined);
	const depositOpen = crucible ? (crucible.activeAllocationCount > 0 || BigUtils.truthy(BigUtils.safeParse(crucible!.openCap))) : false;
	const enableWithdraw = userCrucible ? userCrucible!.balance !== '' && userCrucible!.balance !== '0' : false;
	
	const dispatch = useDispatch();
	if (!Utils.addressEqual(crucible?.contractAddress!, contractAddress)) {
		crucible = undefined;
	}
	console.log(crucible)
	return (
		<>
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
				<span className='content'>${BigUtils.safeParse(crucible?.priceUsdt || '0').times(100).toString()}</span>
			</FCard>
		</div>
		
		<div>
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
			<FButton 
				title={'Mint'}
				disabled={!depositOpen}
				//onClick={()=>onMint()}
			/>
			<FButton 
				title={'Withdraw'}
				disabled={!enableWithdraw}
				//onClick={()=>onWithdraw()}
			/>
		</FCard>
		<CrucibleLoader network={network} contractAddress={contractAddress} />
		<div className="crucible-list-container">
			<div className="crucible-list-items-container">
				<CrucibleBox
					info={crucible || {} as any}
				/>
			</div>
		</div>
		</>
	);
}
