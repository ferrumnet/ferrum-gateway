import { RetryableError, ValidationUtils } from "ferrum-plumbing";

export type StakeType = 'none' | 'unser' | 'timed' | 'openEnded' | 'publicSale';
const stakeTypes: StakeType[] = ['none', 'unser', 'timed', 'openEnded', 'publicSale'];

export function stakeTypeToInt(t: StakeType): number {
	const rv = stakeTypes.indexOf(t);
	ValidationUtils.isTrue(rv >= 0, `Stake type ${t} not supported`);
	return rv;
}

export interface StakingContract {
	router: string;
	openEnded: string;
	timed: string;
	factory: string;
}

export interface StakeInfo {
	network: string;
	stakeType: StakeType;
	stakeId: string;
	stakedTotal: string;
	rewardsTotal: string;
}

export interface userStakeInfo {
	network: string;
	stakeType: StakeType;
	stakeId: string;
	userAddress: string;
	stake: string;
	reward: string;
}