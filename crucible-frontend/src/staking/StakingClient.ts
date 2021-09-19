import { ApiClient } from 'common-containers';
import { Injectable, ValidationUtils } from 'ferrum-plumbing';
import { AnyAction, Dispatch } from 'redux';
import { StakeInfo, StakeType } from 'types';
import { UserStakeInfo } from 'types';
import { createSlice } from '@reduxjs/toolkit';

export function stakingKey(network: string, sType: string, stakeId: string) {
	ValidationUtils.allRequired(['network', 'sType', 'stakeId'], {network, sType, stakeId});
	return `${network}:${sType}/${stakeId}`;
}

export interface StakingState {
	userStakes: { [k: string]: UserStakeInfo};
	stakes: { [k: string]: StakeInfo };
	error?: string;
	pendingStakeTransactionIds: string[];
	pendingWithdrawTransactionIds: string[];
	pendingTakeRewardsTransactionIds: string[];
}

export const StakingSlice = createSlice({
	name: 'stakingClient',
	initialState: {
		stakes: {},
		userStakes: {},
	} as StakingState,
	reducers: {
		stakeInfoLoaded: (state, action) => {
			const info = action.payload as StakeInfo;
			if (info.stakeId && info.network && info.stakeType) {
				const key = stakingKey(info.network, info.stakeType, info.stakeId);
				state.stakes[key] = info;
			} else {
				console.error(`Bad staking info loaded:`, info);
			}
		},
		userStakeInfoLoaded: (state, action) => {
			const info = action.payload as UserStakeInfo;
			if (info.stakeId && info.network && info.stakeType) {
				const key = stakingKey(info.network, info.stakeType, info.stakeId);
				state.userStakes[key] = info;
			} else {
				console.error(`Bad user staking info loaded:`, info);
			}
		},
		newPendingStakeTx: (state, action) => {
			const txId = action.payload.transactionId;
			if (state.pendingStakeTransactionIds.indexOf(txId) < 0) {
				state.pendingStakeTransactionIds.push(txId);
			}
		},
		removePendingStakeTx: (state, action) => {
			const txId = action.payload.transactionId;
			state.pendingStakeTransactionIds = state.pendingStakeTransactionIds.filter(i => i != txId);
		},
		newWithdrawTx: (state, action) => {
			const txId = action.payload.transactionId;
			if (state.pendingWithdrawTransactionIds.indexOf(txId) < 0) {
				state.pendingWithdrawTransactionIds.push(txId);
			}
		},
		removeWithdrawTx: (state, action) => {
			const txId = action.payload.transactionId;
			state.pendingWithdrawTransactionIds = state.pendingWithdrawTransactionIds
				.filter(i => i != txId);
		},
		newTakeRewardsTx: (state, action) => {
			const txId = action.payload.transactionId;
			if (state.pendingTakeRewardsTransactionIds.indexOf(txId) < 0) {
				state.pendingTakeRewardsTransactionIds.push(txId);
			}
		},
		removeTakeRewardsTx: (state, action) => {
			const txId = action.payload.transactionId;
			state.pendingTakeRewardsTransactionIds = state.pendingTakeRewardsTransactionIds
				.filter(i => i != txId);
		},
		error: (state, action) => {
			state.error = action.payload.message;
		}
	}
});

export class StakingClient implements Injectable {
	constructor(
		private api: ApiClient,
	) { }

	__name__() { return 'StakingClient'; }

	async stakeInfo(dispatch: Dispatch<AnyAction>, network: string, sType: StakeType, stakeId: string) {
		return this.wrap(dispatch, async () => {
			const res = await this.api.api({command: 'stakeInfo', params: [], data: {
				network, sType, stakeId, }});
			if (res) {
				dispatch(StakingSlice.actions.stakeInfoLoaded(res));
			} else {
				dispatch(StakingSlice.actions.error({ message: 'Stake not found' }));
			}
		});
	}
	
	async stake(dispatch: Dispatch<AnyAction>,
			stakeType: StakeType, stakeId: string, currency: string, amount: string) {
		return this.wrap(dispatch, async () => {
			const txId = await this.api.runServerTransaction(async () => 
				this.api.api({ command: 'stakeGetTransaction', params: [], data: {
					stakeType,
					stakeId,
					currency,
					amount,
				}}));
			if (txId) {
				// TODO: register the stake transaction.
				dispatch(StakingSlice.actions.newPendingStakeTx({transactionId: txId}));
			}
			return txId;
			});
	}

	async withdraw(dispatch: Dispatch<AnyAction>,
			stakeType: StakeType, stakeId: string, currency: string, amount: string) {
		return this.wrap(dispatch, async () => {
			const txId = await this.api.runServerTransaction(async () => 
				this.api.api({ command: 'withdrawGetTransaction', params: [], data: {
					stakeType,
					stakeId,
					currency,
					amount,
				}}));
			if (txId) {
				// TODO: register the stake transaction.
				dispatch(StakingSlice.actions.newWithdrawTx({transactionId: txId}));
			}
			return txId;
			});
	}

	async takeRewards(dispatch: Dispatch<AnyAction>,
			network: string, stakeType: StakeType, stakeId: string) {
		return this.wrap(dispatch, async () => {
			const txId = await this.api.runServerTransaction(async () => 
				this.api.api({ command: 'takeRewardsGetTransaction', params: [], data: {
					network,
					stakeType,
					stakeId,
				}}));
			if (txId) {
				// TODO: register the stake transaction.
				dispatch(StakingSlice.actions.newTakeRewardsTx({transactionId: txId}));
			}
			return txId;
			});
	}

	async userStakeInfo(dispatch: Dispatch<AnyAction>, userAddress: string, network: string,
		sType: StakeType, stakeId: string,) {
		return this.wrap(dispatch, async () => {
			const res = await this.api.api({command: 'userStakeInfo', params: [], data: {
				userAddress, network, sType, stakeId, }});
			if (res) {
				dispatch(StakingSlice.actions.userStakeInfoLoaded(res));
			} else {
				dispatch(StakingSlice.actions.error({ message: 'Stake not found' }));
			}
		});
	}

	private wrap<T>(dispatch: Dispatch<AnyAction>, fun: () => Promise<T>) {
		try {
			return fun();
		} catch(e) {
			dispatch(StakingSlice.actions.error({
				message: (e as Error).message || (e as Error).toString()}));
		}
	}
}