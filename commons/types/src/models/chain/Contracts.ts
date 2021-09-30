import { NetworkedConfig } from "../bridge/TokenBridgeTypes";

export interface CrucibleContracts {
	router: string;
	factory: string;
	staking: string;
}

export const CRUCIBLE_CONTRACTS: NetworkedConfig<CrucibleContracts> = {
	'RINKEBY': {
		factory: '',
		router: '',
		staking: '',
	},
};