import { MultiSigSignature } from "src";

export interface SignableMethodArg {
	type: string;
	name: string;
}

export interface SignableMethod {
	adminOnly: boolean;
	governanceOnly: boolean;
	name: string;
	args: SignableMethodArg[];
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
	method: string;
	values: string[];
	signatures: MultiSigSignature[];
	transactions: { network: string, id: string, status: '' | 'pending' | 'succeeded' | 'failed' }[];
	archived: boolean;
	logs: string[];
}