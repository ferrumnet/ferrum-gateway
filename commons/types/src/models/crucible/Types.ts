import { UserContractAllocation, UserStakeSummary } from "src";

export interface CrucibleBase {
	currency: string;
	baseCurrency: string;
}

export interface CruciblePrice {
	priceUsdt: string;
	priceEth: string;
	basePriceUsdt: string;
	basePriceEth: string;
}

export interface CrucibleAllocations {
	currency: string;
	openCap: string;
	leftFromCap: string;
	activeAllocationSum: string;
	activeAllocationCount: number;
	totalSupply: string;
}

export interface CrucibleInfo extends CrucibleBase, CrucibleAllocations, CruciblePrice {
	network: string;
	contractAddress: string;
	symbol: string;
	name: string;
	baseSymbol: string;
	feeOnTransferRate: string;
	feeOnWithdrawRate: string;
	feeDescription: string;
}

export interface UserCrucibleInfo extends  CrucibleBase {
	balance: string;
	baseBalance: string;
	symbol: string;
	baseSymbol: string;
	allocations: UserContractAllocation[];
	stakes: UserStakeSummary[];
}

export const CrucibleAllocationMethods = {
	DEPOSIT: 'DEPOSIT',
	DEPOSIT_ADD_LIQUIDITY_STAKE: 'DEPOSIT_ADD_LIQUIDITY_STAKE',
}

