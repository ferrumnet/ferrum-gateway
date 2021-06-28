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

export interface UserContractAllocation {
	contractAddress: string;
	userAddress: string;
	allocation: string;
}