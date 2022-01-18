import { JsonRpcRequest, Networks, ValidationUtils } from 'ferrum-plumbing';
import { ApiClient } from "common-containers";
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { addAction, CommonActions } from './common/CommonActions';
import { eip712Json, eipTransactionRequest, Eip712TypeDefinition, 
	DomainSeparator } from "unifyre-extension-web3-retrofit/dist/client/Eip712";
import { Connect, UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { SignableMethod, Utils } from 'types';

import { recoverTypedSignature_v4 } from 'eth-sig-util';

export const GovernanceClientActions = {
	CONTRACTS_LOADED: 'CONTRACTS_LOADED',
	CONTRACT_LOADED: 'CONTRACT_LOADED',
	TRANSACTIONS_LOADED: 'TRANSACTIONS_LOADED',
	SUBSCRIPTION_LOADED: 'SUBSCRIPTION_LOADED',
	CLEAR_SUBSCRIPTION: 'CLEAR_SUBSCRIPTION',
};

const Actions = GovernanceClientActions;

export class GovernanceClient {
	constructor(
		private api: ApiClient,
		private connect: Connect,
		) { }

	__name__() { return 'GovernanceClient'; }

	async listContracts(dispatch: Dispatch<AnyAction>) {
		try{
			dispatch(addAction(CommonActions.WAITING,''))
			const res = await this.api.api({
				command: 'listContracts',
				data: {},
				params: [],
			} as JsonRpcRequest);
			if (!!res) {
				dispatch(addAction(Actions.CONTRACTS_LOADED, res));
			}
		}catch(e){
			console.log(e)
		}finally{
			dispatch(addAction(CommonActions.WAITING_DONE,''))
		}
	}

	async contractById(dispatch: Dispatch<AnyAction>, id: string) {
		const res = await this.api.api({
			command: 'contractById',
			data: { id },
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			dispatch(addAction(Actions.CONTRACT_LOADED, res));
		}
	}

	async reloadTransactions(dispatch: Dispatch<AnyAction>,
			network: string, contractAddress: string) {
		const res = await this.api.api({
			command: 'listTransactions',
			data: { network, contractAddress },
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			dispatch(addAction(Actions.TRANSACTIONS_LOADED, res));
		}
	}

	async getSubscription(dispatch: Dispatch<AnyAction>,
			network: string, contractAddress: string) {
		const res = await this.api.api({
			command: 'getSubscription',
			data: { network, contractAddress },
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			dispatch(addAction(Actions.SUBSCRIPTION_LOADED, res));
		} else {
			dispatch(addAction(Actions.CLEAR_SUBSCRIPTION, res));
		}
	}

	async archiveTransaction(dispatch: Dispatch<AnyAction>, id: string) {
		// const res = await this.api.api({
		// 	command: 'contractById',
		// 	data: { id },
		// 	params: [],
		// } as JsonRpcRequest);
		// if (!!res) {
		// 	dispatch(addAction(Actions.CONTRACT_LOADED, res));
		// }
	}

	async submitTransaction(dispatch: Dispatch<AnyAction>,
			requestId: string,
			contractAddress: string,
			) {
		const network = this.api.getNetwork();
		const txId = await this.api.runServerTransaction(async () => {
			return await this.api.api({
				command: 'submitRequestGetTransaction',
				data: {
					requestId,
				},
				params: [],
			} as JsonRpcRequest);
		})
		if (!!txId) {
			return await this.api.api({
				command: 'updateTransacionsForRequest',
				data: {
					requestId,
					transactionId: txId,
				},
				params: [],
			} as JsonRpcRequest);
		}
		await this.reloadTransactions(dispatch, network, contractAddress);
	}

	async proposeTransaction(dispatch: Dispatch<AnyAction>,
			contractAddress: string,
			governanceContractId: string,
			method: string,
			args: string[],
			signature: string,) {
		const network = this.api.getNetwork();
		const res = await this.api.api({
			command: 'proposeTransaction',
			data: {
				network,
				contractAddress,
				governanceContractId,
				method,
				args,
				signature,
			},
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			await this.reloadTransactions(dispatch, network, contractAddress);
		}
	}
	
	async addSignature(dispatch: Dispatch<AnyAction>,
			requestId: string,
			contractAddress: string,
			signature: string,) {
		const network = this.api.getNetwork();
		const res = await this.api.api({
			command: 'addSignature',
			data: {
				requestId,
				signature,
			},
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			await this.reloadTransactions(dispatch, network, contractAddress);
		}
	}

	async signMessage(network: string,
			contractName: string,
			contractVersion: string,
			contractAddress: string,
			method: SignableMethod, values: string[]) {
		const eipArgs: any = { [method.name]: method.args };
		const data: any = {};
		method.args.forEach((a, i) => { data[a.name] = values[i]; });
		const ds = {
			name: contractName,
			version: contractVersion,
			chainId: Networks.for(network).chainId as any,
			verifyingContract: contractAddress,
		} as DomainSeparator;
		const jsonData = eip712Json(ds, eipArgs, method.name, data,);
		const request = eipTransactionRequest(
				this.connect.getProvider()!.web3()!, this.connect.account()!, jsonData);
		console.log('Sending REQUEST', {request, data, values, ds});
		const sig = await (this.api.client as UnifyreExtensionWeb3Client).sendAsync(request);
		const signature = sig.split('|')[0];

		const jsonData2 = JSON.parse(eip712Json(ds, eipArgs, method.name, data));
		console.log('VERIFICATION JSON DATA', jsonData, {signature});
		const recoveredAddress = recoverTypedSignature_v4(
			{data: jsonData2, sig: signature});
		ValidationUtils.isTrue(Utils.addressEqual(recoveredAddress, this.api.getAddress()),
			`Signature verification error. Recovered ${recoveredAddress} vs ${this.api.getAddress()}`);
		return signature;
	}
}