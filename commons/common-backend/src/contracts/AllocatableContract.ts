import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { Injectable, Networks } from 'ferrum-plumbing';
import { Eip712Params, produceSignature } from 'web3-tools';

export class AllocatableContract implements Injectable {
	__name__() { return 'AllocatableContract'; }
	constructor(private helper: EthereumSmartContractHelper) { }

	async produceHash(
		contractName: string,
		contractVersion: string,
		contractAddress: string,
		methodSelector: string,
		currency: string,
		payee: string,
		to: string,
		amount: string,
		expiry: number,
		salt: string): Promise<Eip712Params> {
		const [network, token] = EthereumSmartContractHelper.parseCurrency(currency);
		const chainId = Networks.for(network).chainId;
		const amountInt = await this.helper.amountToMachine(currency, amount);
		const eipParams = {
			method: 'AmountSigned',
			contractName,
			contractVersion,
			args: [
				{ type: 'bytes4', name: 'method', value: methodSelector },
				{ type: 'address', name: 'token', value: token },
				{ type: 'address', name: 'payee', value: payee },
				{ type: 'address', name: 'to', value: to },
				{ type: 'uint256', name: 'amount', value: amountInt },
				{ type: 'uint64', name: 'expiry', value: expiry },
				{ type: 'bytes32', name: 'salt', value: salt },
			],
		} as Eip712Params;
		return produceSignature(this.helper.web3(network), chainId, contractAddress, eipParams);
	}
}