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
		factory: '0x574c03527ca611a727c54ca65c963807c5db1332',
		router: '0x9158c7bb428059ef23a705282cdc0f37f104ef81',
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
	'MOON_MOONBASE':'0x347d11cc7fbeb535d71e1c6b34bdd33a7a999f45',
	'AVAX_MAINNET':'0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'MOON_MOONRIVER':'0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'HARMONY_TESTNET_0': '0x7ac11c3ba39c6006c1e960e04aa9ac5749247d1c',
	'HARMONY_MAINNET_0': '0xf62ccc32bf10400167b38777d32f7e3ab461254b',
	'FTM_TESTNET':'0x769a03c4080c090d6e4e751d1e362d889c4d8bec',
	'FTM_MAINNET':'0x8e01cc26d6dd73581347c4370573ce9e59e74802',
	'SHIDEN_TESTNET':'0x226fe4ecfd9b5b30f42c9fd55aaa45b2c216a499',
	'SHIDEN_MAINNET':'0xf62ccc32bf10400167b38777d32f7e3ab461254b'

};

export const BRIDGE_V12_CONTRACTS: NetworkedConfig<BridgeV12Contracts> = {
	'RINKEBY': {
		bridge: '',
		staking: '',
		router: '',
	},
};