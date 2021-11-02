import { MultiSigSignature, TransactionTrackable } from "../models/chain/ChainTypes";

export interface SignableMethodArg {
	type: string;
	name: string;
}

export interface MethodAbiInput {
	internalType: string;
	name: string;
	type: string;
}

export interface MethodAbi{
	inputs: MethodAbiInput[];
	name: string;
	type: string;
}

export interface SignableMethod {
	adminOnly: boolean;
	governanceOnly: boolean;
	name: string;
	args: SignableMethodArg[];
	abi: MethodAbi;
}

export interface GovernanceContract {
	id: string;
	identifier: {
		name: string;
		version: string;
	};
	methods: SignableMethod[];
}

export interface RegisteredContract {
	network: string;
	contractAddress: string;
	governanceContractId: string;
}

export interface GovernanceTransaction extends RegisteredContract {
	requestId: string;
	created: number;
	lastUpdate: number;
	quorum: string;
	method: string;
	values: string[];
	signatures: MultiSigSignature[];
	archived: boolean;
	logs: string[];
	execution: TransactionTrackable;
}

export interface QuorumSubscription {
	quorum: string;
	groupId: number;
	minSignatures: number;
}
