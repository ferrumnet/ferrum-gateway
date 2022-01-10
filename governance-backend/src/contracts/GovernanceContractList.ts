import { RegisteredContract, GovernanceContract } from 'types';
import * as CrucibleRouterJson from './crucible/CrucibleRouter.json';
import * as TokenDao from './tokenDao/TokenDao.json';

export const GovernanceContractDefinitions: { [k: string]: GovernanceContract } = {
		'FERRUM_CRUCIBLE_ROUTER:000.001': CrucibleRouterJson,
		'TOKEN_DAO:001.000': TokenDao,
}

export const GovernanceContractList: RegisteredContract[] = [
	{
		network: 'RINKEBY',
		contractAddress: '0x9158c7bb428059ef23a705282cdc0f37f104ef81',
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
];