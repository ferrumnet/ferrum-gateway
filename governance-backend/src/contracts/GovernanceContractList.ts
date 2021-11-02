import { RegisteredContract, GovernanceContract } from 'types';
import * as CrucibleRouterJson from './crucible/CrucibleRouter.json';

export const GovernanceContractDefinitions: { [k: string]: GovernanceContract } = {
		'FERRUM_CRUCIBLE_ROUTER:000.001': CrucibleRouterJson,
}

export const GovernanceContractList: RegisteredContract[] = [
	{
		network: 'RINKEBY',
		contractAddress: '0x678bf901030558e762f7d96cc0268d6591d3a309',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'POLYGON',
		contractAddress: '0xe369b5407f1ac0e956ae79ff91ead86e71c3cf14',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	}
];