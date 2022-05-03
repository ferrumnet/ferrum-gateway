import { JsonRpcRequest, } from 'ferrum-plumbing';
import { ApiClient } from "common-containers";
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { AbiItem } from 'web3-tools';

export const CommonActions = {
    WAITING: 'WAITING',
    WAITING_DONE: 'WAITING_DONE',
    ERROR_OCCURED: 'ERROR_OCCURED',
    RESET_ERROR: 'RESET_ERROR',
};

export function addAction(type: string, payload: any) {
    return { type, payload };
}

export const QpExplorerActions = {
	BLOCKS_UPDATED: 'BLOCKS_UPDATED',
	TXS_UPDATED: 'TXS_UPDATED',
	BLOCK_UPDATED: 'BLOCK_UPDATED',
	TX_UPDATED: 'TX_UPDATED',
	ACCOUNT_INFO_UPDATED: 'ACCOUNT_INFO_UPDATED',
	CONTRACT_FIELD_LOADED: 'CONTRACT_FIELD_LOADED',
};

const Actions = QpExplorerActions;

export class QpExplorerClient {
	constructor(private api: ApiClient) { }

	__name__() { return 'QpExplorerClient'; }

	async recentBlocks(dispatch: Dispatch<AnyAction>, page: number, pageSize: number) {
        const blocks = await this.api.api({
			command: 'QpRecentBlocks',
			data: {page, pageSize},
			params: [],
		} as JsonRpcRequest);
		if (!!blocks) {
			dispatch(addAction(Actions.BLOCKS_UPDATED, blocks));
		}
	}

	async recentTxs(dispatch: Dispatch<AnyAction>, page: number, pageSize: number) {
        const blocks = await this.api.api({
			command: 'QpRecentTxs',
			data: {page, pageSize},
			params: [],
		} as JsonRpcRequest);
		if (!!blocks) {
			dispatch(addAction(Actions.TXS_UPDATED, blocks));
		}
	}

	async blockByHash(dispatch: Dispatch<AnyAction>, network: string, blockHash: number) {
        const block = await this.api.api({
			command: 'QpBlockByHash',
			data: {network, blockHash},
			params: [],
		} as JsonRpcRequest);
		if (!!block) {
            const transactions = await this.blockTxs(dispatch, network, blockHash);
			if (!!transactions) {
				dispatch(addAction(Actions.BLOCK_UPDATED, { block, transactions }));
			}
		}
	}
 
	async blockTxs(dispatch: Dispatch<AnyAction>, network: string, blockHash: number) {
        const txs = await this.api.api({
			command: 'QpBlockTxs',
			data: {network, blockHash},
			params: [],
		} as JsonRpcRequest);
		return txs;
	}

	async tx(dispatch: Dispatch<AnyAction>, network: string, txId: string,) {
        const tx = await this.api.api({
			command: 'QpTx',
			data: {network, txId},
			params: [],
		} as JsonRpcRequest);
		if (!!tx) {
			dispatch(addAction(Actions.TX_UPDATED, tx));
		}
	}

	async account(dispatch: Dispatch<AnyAction>, address: string,) {
        const account = await this.api.api({
			command: 'QpAccount',
			data: {address},
			params: [],
		} as JsonRpcRequest);
		if (!!account) {
			const transactions = await this.api.api({
				command: 'QpAccountTransactions',
				data: { address },
				params: [],
			} as JsonRpcRequest);
			const balances = await this.api.api({
				command: 'QpAccountBalances',
				data: { address },
				params: [],
			} as JsonRpcRequest);
			dispatch(addAction(Actions.ACCOUNT_INFO_UPDATED, {
				account,
				transactions: transactions || [],
				balances: balances || [],
			}));
		}
	}

	async readContractField(
		network: string, contract: string, abi: AbiItem[], method: string, args: string[]) {
		return await this.api.api({
			command: 'CallMethodOnContract',
			data: {network, contract, abi, method, args},
			params: []
		});
	}
}