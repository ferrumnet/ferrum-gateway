import { Network } from "ferrum-plumbing";

export type ChainEventStatus = '' | 'pending' | 'failed' | 'completed';

export interface ChainEventBase {
    id: string;
    network: Network;
    status: ChainEventStatus;
    stater?: (v:number) => void,
    callback?: any,
    eventType: string;
}

export interface AllocationSignature extends MultiSignable {
	actor: MultiSigActor;
	salt: string;
	expirySeconds: number;
	from: string;
	to: string;
}

export interface UserContractAllocation {
	signature?: AllocationSignature;
	network: string;
	contractAddress: string;
	method: string;
	userAddress: string;
	currency: string;
	allocation: string;
	expirySeconds: number;
}

export interface TokenDetails {
	currency: string;
	address: string;
	chainId: number;
	name: string;
	symbol: string;
	decimals: number;
	logoURI: string;
}

export interface StoredAllocationCsv {
	network: string;
	contract: string;
	csv: string;
}

export interface CurrencyValue {
	currency: string;
	value: string;
}

export interface MultiSigSignature {
  creationTime: number;
  creator: string;
  signature: string;
}

export interface MultiSigActor {
	groupId: number;
	quorum: string;
	address: string;
	contractAddress: string;
}

export interface MultiSignable {
	signatures: MultiSigSignature[];
}

export interface TransactionTrackableItem {
	network: string;
	transactionId: string;
	timestamp: number;
	status: 'pending' | 'failed' | 'timedout' | 'sucess';
	message?: string;
}

export interface TransactionTrackable {
	status: '' | 'pending' | 'failed' | 'timedout' | 'sucess';
	transactions: TransactionTrackableItem[];
}

export interface UserStakeSummary {
	name: string;
	network: string;
	currency: string;
	rewardCurrencies: string[];
	stakeContractAddress: string;
	lastUpdate: number;
	stake: string;
	rewards: string[];
}