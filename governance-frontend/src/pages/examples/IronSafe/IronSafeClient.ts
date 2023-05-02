import { JsonRpcRequest, Networks, ValidationUtils } from 'ferrum-plumbing';
import { StandaloneClient } from 'common-containers/dist/clients/StandaloneClient';
import { Contract } from 'ethers';

const IRON_SAFE_SUB_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "vetoRights",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vetoRightsLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

export class IronSafeClient {
	constructor(
		private api: StandaloneClient,
		) { }

	__name__() { return 'IronSafeClient'; }

    async getIronSafeVetoerInfo(network: string, contractAddress: string, userAddress: string): Promise<{vetoerCount: string, isVetoer: boolean}> {
        const provider = this.api.ethersProvider(network);
        const contract = new Contract(contractAddress, IRON_SAFE_SUB_ABI, provider);
        const vetoerCount = await contract.vetoRightsLength();
        const isVetoer = await contract.vetoRights(userAddress);
        return { vetoerCount: vetoerCount.toNumber(), isVetoer: isVetoer }
    }
}