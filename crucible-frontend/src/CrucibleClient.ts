import { JsonRpcRequest, ValidationUtils, Network } from 'ferrum-plumbing';
import { ApiClient } from "common-containers";
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { addAction, CommonActions } from './common/CommonActions';
import { CrucibleInfo } from 'types';

export const CrucibleClientActions = {
	CRUCIBLES_LOADED: 'CRUCIBLES_LOADED',
	CRUCIBLE_LOADED: 'CRUCIBLE_LOADED',
};

const Actions = CrucibleClientActions;

export class CrucibleClient extends ApiClient {
	async getAllCrucibles(dispatch: Dispatch<AnyAction>, network: string) {
		const cs = await this.getAllCruciblesFromDb(dispatch, network);
		for(const c of cs) {
			this.updateCrucible(dispatch, network, c.contractAddress);
		}
	}

	async updateCrucible(dispatch: Dispatch<AnyAction>, network: string, contractAddress: string) {
		const crucible = await this.api({
			command: 'getCrucible',
			data: {network, contractAddress, userAddress: this.getAddress()},
			params: [],
		} as JsonRpcRequest);
		if (!!crucible) {
			dispatch(addAction(Actions.CRUCIBLE_LOADED, {crucible}));
		}
		return crucible;
	}

	async getAllCruciblesFromDb(dispatch: Dispatch<AnyAction>, network: string) 
		:Promise<CrucibleInfo[]> {
		const crucibles = await this.api({
			command: 'getAllCruciblesFromDb',
			data: {network},
			params: [],
		} as JsonRpcRequest);
		if (!!crucibles) {
			dispatch(addAction(Actions.CRUCIBLES_LOADED, {crucibles}));
		}
		return crucibles || [];
	}

	async deposit(dispatch: Dispatch<AnyAction>,
		currency: string,
		crucible: string,
		amount: string,
		isPublic: boolean,
		) {
		try {
			const network = this.getNetwork();
            const res = await this.api({
                command: isPublic ? 'depositPublicGetTransaction' : 'depositGetTransaction',
                data: {network, currency, crucible, amount}, params: [] } as JsonRpcRequest);
            ValidationUtils.isTrue(!!res, 'Error calling deposit. No requests');
            const requestId = await this.client.sendTransactionAsync(network as Network, [res],
                {});
            ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
			const txId = requestId.split('|')[0];
			console.log('Deposit generated tx id ', txId);
			return txId;
		} catch (e) {
			console.error('deposit', e);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
		}
	}

	async withdraw(dispatch: Dispatch<AnyAction>,
		currency: string,
		crucible: string,
		amount: string,
		) {
		try {
			const network = this.getNetwork();
            const res = await this.api({
                command: 'withdrawGetTransaction',
                data: {network, currency, crucible, amount}, params: [] } as JsonRpcRequest);
            ValidationUtils.isTrue(!!res, 'Error calling deposit. No requests');
            const requestId = await this.client.sendTransactionAsync(network as Network, [res],
                {});
            ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
			const txId = requestId.split('|')[0];
			console.log('Deposit generated tx id ', txId);
			return txId;
		} catch (e) {
			console.error('deposit', e);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
		}
	}
}