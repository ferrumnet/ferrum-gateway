import { RegisteredContract, GovernanceContract } from 'types';
import * as CrucibleRouterJson from './crucible/CrucibleRouter.json';
import * as CrucibleRouterV2Json from './crucible/CrucibleRouterV2.json';
import * as MultiSig from './multiSig/MultiSig.json';
import * as TokenDao from './tokenDao/TokenDao.json';
import * as BasicIronSafe from './basicIronSafe/BasicIronSafe.json';

function merge(base: GovernanceContract, child: GovernanceContract): GovernanceContract {
	return {
		id: child.id,
		identifier: child.identifier,
		methods: [
			...base.methods,
			...child.methods,
		]
	}
}

export const GovernanceContractDefinitions: { [k: string]: GovernanceContract } = {
		'FERRUM_CRUCIBLE_ROUTER:000.001': merge(MultiSig, CrucibleRouterJson),
		'FERRUM_CRUCIBLE_ROUTER:000.002': merge(MultiSig, CrucibleRouterV2Json),
		'FERRUM_BASIC_IRON_SAFE:000.001': BasicIronSafe,
		'TOKEN_DAO:001.000': merge(MultiSig, TokenDao),
}

export const GovernanceContractList: RegisteredContract[] = [
	{
		network: 'RINKEBY',
		contractAddress: '0x9158c7bb428059ef23a705282cdc0f37f104ef81',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'BSC_TESTNET',
		contractAddress: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'BSC_TESTNET',
		contractAddress: '0x05d9Fdbb9B21907b1E8f8122D11FEb450B4b2870',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.002',
	},
	{
		network: 'BSC_TESTNET',
		contractAddress: '0x7807a7CEc6EA97025AE2f7eBF1C4f2fBcbD401A4',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.002',
	},
	{
		network: 'BSC',
		contractAddress: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'BSC',
		contractAddress: '0x54C4c29e8f46B100eF10Af9331DaBFf33dfb1d62',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'BSC',
		contractAddress: '0x3b83A1a700af32d17cE138d2527b2b48AdbA9b73',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'BSC',
		contractAddress: '0x830A8E8Eb51639d79b50b24374A4a52541fD7788',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.002',
	},
	{
		network: 'RINKEBY',
		contractAddress: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'POLYGON',
		contractAddress: '0xe369b5407f1ac0e956ae79ff91ead86e71c3cf14',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'RINKEBY',
		contractAddress: '0x9c3db68bd508d56abfad84272ccb7ddc53431ee8',
		governanceContractId: 'TOKEN_DAO:001.000',
	},
	{
		network: 'AVAX_MAINNET',
		contractAddress: '0x9c3db68bd508d56abfad84272ccb7ddc53431ee8',
		governanceContractId: 'TOKEN_DAO:001.000', 
	},
	{
		network: 'BSC_TESTNET',
		contractAddress: '0xff810a9188aef1d1933dc9ec58e4ca4b5c52185f',
		governanceContractId: 'FERRUM_BASIC_IRON_SAFE:000.001', 
	},
];