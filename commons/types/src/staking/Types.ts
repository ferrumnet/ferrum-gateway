import { RetryableError, ValidationUtils } from "ferrum-plumbing";

export type StakeType = 'none' | 'unser' | 'timed' | 'openEnded' | 'publicSale';
const stakeTypes: StakeType[] = ['none', 'unser', 'timed', 'openEnded', 'publicSale'];

export function stakeTypeToInt(t: StakeType): number {
	const rv = stakeTypes.indexOf(t);
	ValidationUtils.isTrue(rv >= 0, `Stake type ${t} not supported`);
	return rv;
}

export interface StakingContracts {
	router: string;
	openEnded: string;
	timed: string;
	factory: string;
}

export interface StakeRewardInfo {
	rewardCurrency: string;
	rewardSymbol: string;
	rewardsTotal: string;
}

export interface StakeInfo {
	network: string;
	stakeType: StakeType;
	name: string;
	stakeId: string;
	baseCurrency: string;
	baseSymbol: string;
	stakedBalance: string;
	lockPeriod: number;
	rewards: StakeRewardInfo[];
}

export interface UserStakeRewardInfo {
	rewardCurrency: string;
	rewardSymbol: string;
	rewardAmount: string;
}

export interface UserStakeInfo {
	network: string;
	stakeType: StakeType;
	stakeId: string;
	userAddress: string;
	stake: string;
	nextWithdrawalTime: number;
	rewards: UserStakeRewardInfo[];
}