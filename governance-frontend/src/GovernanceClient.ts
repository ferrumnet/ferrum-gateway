import { JsonRpcRequest, ValidationUtils, Network } from 'ferrum-plumbing';
import { ApiClient } from "common-containers";
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { addAction, CommonActions } from './common/CommonActions';
import { Utils } from 'types';

export const GovernanceClientActions = {
	CONTRACTS_LOADED: 'CONTRACTS_LOADED',
	CONTRACT_LOADED: 'CONTRACT_LOADED',
	TRANSACTIONS_LOADED: 'TRANSACTIONS_LOADED',
};

const Actions = GovernanceClientActions;

export class GovernanceClient {
	constructor(private api: ApiClient) { }

	__name__() { return 'GovernanceClient'; }

	async listContracts(dispatch: Dispatch<AnyAction>) {
		const res = await this.api.api({
			command: 'listContracts',
			data: {},
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			dispatch(addAction(Actions.CONTRACTS_LOADED, res));
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

	async reloadTransactions(dispatch: Dispatch<AnyAction>, contractAddress: string) {
		const res = await this.api.api({
			command: 'reloadTransaction',
			data: { network: this.api.getNetwork(), contractAddress },
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			dispatch(addAction(Actions.TRANSACTIONS_LOADED, res));
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

	async proposeTransaction(dispatch: Dispatch<AnyAction>,
			contractAddress: string,
			governanceContractId: string,
			method: string,
			args: string[],
			signature: string,) {
		const res = await this.api.api({
			command: 'proposeTransaction',
			data: {
				network: this.api.getNetwork(),
				contractAddress,
				governanceContractId,
				method,
				args,
				signature,
			},
			params: [],
		} as JsonRpcRequest);
		if (!!res) {
			await this.reloadTransactions(dispatch, contractAddress);
		}
	}

	async deposit(dispatch: Dispatch<AnyAction>,
		currency: string,
		crucible: string,
		amount: string,
		isPublic: boolean,
		) {
		try {
			return this.api.runServerTransaction(
				async () => {
					const network = this.api.getNetwork();
					return await this.api.api({
							command: isPublic ? 'depositPublicGetTransaction' : 'depositGetTransaction',
							data: {network, currency, crucible, amount}, params: [] } as JsonRpcRequest);
				});
		} catch (e) {
			console.error('deposit', e);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
		}
	}
}