import { RegisteredContract, GovernanceContract } from 'types';
import * as CrucibleRouterJson from './crucible/CrucibleRouter.json';

export const GovernanceContractDefinitions: { [k: string]: GovernanceContract } = {
		'FERRUM_CRUCIBLE_ROUTER:000.001': CrucibleRouterJson,
}

export const GovernanceContractList: RegisteredContract[] = [
	{
		network: 'RINKEBY',
		contractAddress: '0x3559b7ff53a2da38b96c9d17f2484d8e0070bc54',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
];