import { StakingContracts } from "src";
import { NetworkedConfig } from "../bridge/TokenBridgeTypes";

export interface CrucibleContracts {
	router: string;
	factory: string;
	staking: string;
}

export const CRUCIBLE_CONTRACTS_V_0_1: NetworkedConfig<CrucibleContracts> = {
	'RINKEBY': {
		factory: '0xdaaa63bba11cded6d70edc0769e93029df4dde52',
		router: '0x678bf901030558e762f7d96cc0268d6591d3a309',
		staking: '',
	},
	'ETHEREUM': {
		factory: '',
		router: '',
		staking: '',
	},
	'POLYGON': {
		factory: '',
		router: '',
		staking: '',
	},
};

export const STAKING_CONTRACTS_V_0_1: NetworkedConfig<StakingContracts> = {
	'RINKEBY': {
		router: '',
		factory: '',
		openEnded: '',
		timed: '',
	},
};