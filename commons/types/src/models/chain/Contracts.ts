import { StakingContracts } from "src";
import { NetworkedConfig } from "../bridge/TokenBridgeTypes";
import { BridgeV12Contracts } from "../crossSwap/CrossSwapTypes";

export interface CrucibleContracts {
	router: string;
	factory: string;
	staking: string;
}

//old contracts
//'0x574c03527ca611a727c54ca65c963807c5db1332'
//0x9158c7bb428059ef23a705282cdc0f37f104ef81
//'0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF'
//'0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76'
//'0x54c4c29e8f46b100ef10af9331dabff33dfb1d62' - router

export const CRUCIBLE_CONTRACTS_V_0_1: NetworkedConfig<CrucibleContracts> = {
	'RINKEBY': {
		factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
		router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		staking: '',
	},
	'BSC_TESTNET': {
		factory: '0x5b2b943Bd0598111C27c6B0AEf6255338e08D43d',
		router: '0x7807a7CEc6EA97025AE2f7eBF1C4f2fBcbD401A4',
		staking: '',
	},
	'BSC': {
		factory: '0xaa703e8114600C83240145B4B524d7547A3743be',
		router: '0x830A8E8Eb51639d79b50b24374A4a52541fD7788',
		staking: '',
	},
	'ETHEREUM': {
		factory: '',
		router: '',
		staking: '',
	},
	'POLYGON': {
		factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
		router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		staking: '',
	},
};

export const STAKING_CONTRACTS_V_0_1: NetworkedConfig<StakingContracts[]> = {
	'RINKEBY': [{
		factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
		router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		openEnded: '',
		timed: '',
		address: '0x64598E2FDe27ad33448c5443A37D6f08233dAf02'
	}],
	'BSC': [
		{
			factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
			router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
			openEnded: '',
			timed: '0x64598E2FDe27ad33448c5443A37D6f08233dAf02',
			address: '0x64598E2FDe27ad33448c5443A37D6f08233dAf02'
		},
		{
			factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
			router: '0x54C4c29e8f46B100eF10Af9331DaBFf33dfb1d62',
			openEnded: '',
			timed: '0x669319FD48A5364F725aa66b4C57Bb473194AEa5',
			address: '0x669319FD48A5364F725aa66b4C57Bb473194AEa5'
		},
		{
			factory: '0x60267694219DC99aa00E866508B9aEbbCf6649dd',
			router: '0x54c4c29e8f46b100ef10af9331dabff33dfb1d62',
			openEnded: '0xAb0433AA0b5e05f1FF0FD293CFf8bEe15882cCAd',
			timed: '0xAb0433AA0b5e05f1FF0FD293CFf8bEe15882cCAd',
			address: '0xAb0433AA0b5e05f1FF0FD293CFf8bEe15882cCAd'
		},
		{
			factory: '0x948b3c3d27bc472c46addf617439248e9269e1e1',
			router: '0x3b83A1a700af32d17cE138d2527b2b48AdbA9b73',
			openEnded: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			timed: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			address: '0xeab8290c54b6307016a736ff2191bf2aaef3b697'
		},
		{
			factory: '0x948b3c3d27bc472c46addf617439248e9269e1e1',
			router: '0x3b83A1a700af32d17cE138d2527b2b48AdbA9b73',
			openEnded: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			timed: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			address: '0xeab8290c54b6307016a736ff2191bf2aaef3b697'
		},
		{
			factory: '0x948b3c3d27bc472c46addf617439248e9269e1e1',
			router: '0x3b83A1a700af32d17cE138d2527b2b48AdbA9b73',
			openEnded: '0xd87f304ca205fb104dc014696227742d20c8f10a',
			timed: '0xd87f304ca205fb104dc014696227742d20c8f10a',
			address: '0xd87f304ca205fb104dc014696227742d20c8f10a'
		}
		//0xd87f304ca205fb104dc014696227742d20c8f10a
	],
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