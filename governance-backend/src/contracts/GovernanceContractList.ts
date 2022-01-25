import { RegisteredContract, GovernanceContract } from 'types';
import * as CrucibleRouterJson from './crucible/CrucibleRouter.json';
import * as MultiSig from './multiSig/MultiSig.json';
import * as TokenDao from './tokenDao/TokenDao.json';

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
		'TOKEN_DAO:001.000': merge(MultiSig, TokenDao),
}

export const GovernanceContractList: RegisteredContract[] = [
	{
		network: 'RINKEBY',
		contractAddress: '0x9158c7bb428059ef23a705282cdc0f37f104ef81',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
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
];