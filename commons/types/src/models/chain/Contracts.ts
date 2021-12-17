import { StakingContracts } from "src";
import { NetworkedConfig } from "../bridge/TokenBridgeTypes";
import { BridgeV12Contracts } from "../crossSwap/CrossSwapTypes";

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

export const BRIDGE_V1_CONTRACTS: NetworkedConfig<string> = {
	'RINKEBY': '0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877',
	'BSC_TESTNET': '0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877',
	'MUMBAI_TESTNET': '0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877',
	'ETHEREUM': '0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'BSC': '0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'POLYGON': '0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'AVAX_TESTNET': '0xbe442727d882b17144040a075acf27abbb68643f',
	'MOON_MOONBASE':'0x347d11cC7FbEb535D71e1c6B34bDD33A7a999F45',
	'AVAX_MAINNET':'0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'MOON_MOONRIVER':'0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'HARMONY_TESTNET': '0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877',
	'HARMONY_MAINNET': '0x8e01cc26d6dd73581347c4370573ce9e59e74802',
};

export const BRIDGE_V12_CONTRACTS: NetworkedConfig<BridgeV12Contracts> = {
	'RINKEBY': {
		bridge: '',
		staking: '',
		router: '',
	},
};