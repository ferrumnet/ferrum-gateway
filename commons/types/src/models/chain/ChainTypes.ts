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

export interface AllocationSignature {
	issuedAt: number;
	allocator: string;
	salt: string;
	signature: string;
	expirySeconds: number;
	from: string;
	to: string;
}

export interface UserContractAllocation {
	signature?: AllocationSignature;
	network: string;
	contractAddress: string;
	methodSelector: string;
	userAddress: string;
	currency: string;
	allocation: string;
}

export interface TokenDetails {
	currency: string;
	address: string;
	chainId: number;
	name: string;
	symbol: string;
	decimals: number;
	logoURI: string;
	expirySeconds: number;
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