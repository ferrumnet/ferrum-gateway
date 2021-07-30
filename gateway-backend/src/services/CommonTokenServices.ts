import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { CurrencyListSvc } from "common-backend";
import { Injectable } from "ferrum-plumbing";
import { TokenDetails, UserContractAllocation } from "types";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";

export class CommonTokenServices implements Injectable {
	constructor(
		private helper: EthereumSmartContractHelper,
		private tokenListSvc: CurrencyListSvc) {}
	__name__() { return 'CommonTokenServices'; }

	async allocation(userAddress: string, contractAddress: string, currency: string):
	Promise<UserContractAllocation> {
		const allocation = await this.helper.currentAllowance(currency, userAddress, contractAddress);
		const [network, _] = EthereumSmartContractHelper.parseCurrency(currency)
		return {
			allocation: await this.helper.amountToHuman(currency, allocation.toFixed()),
			contractAddress,
			userAddress,
			currency,
			expirySeconds: 0,
			methodSelector: '',
			network,
		};
	}

	async approveGetTransaction(userAddress: string,
		contractAddress: string,
		currency: string,
		amount: string):
	Promise<CustomTransactionCallRequest[]> {
		console.log('ABOUT TO APPROVE ', {currency, userAddress, amount, contractAddress})
		const [nonce, tx] = await this.helper.approveMaxRequests(
			currency, userAddress,
			amount, contractAddress, 'the given contract');
		return tx;
	}

	async tokenList(): Promise<TokenDetails[]> {
		return this.tokenListSvc.mergedList();
	}
}