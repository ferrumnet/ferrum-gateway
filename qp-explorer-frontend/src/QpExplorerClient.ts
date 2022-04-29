import { JsonRpcRequest, } from 'ferrum-plumbing';
import { ApiClient } from "common-containers";
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

export const CommonActions = {
    WAITING: 'WAITING',
    WAITING_DONE: 'WAITING_DONE',
    CONTINUATION_DATA_RECEIVED: 'CONTINUATION_DATA_RECEIVED',
    CONTINUATION_DATA_FAILED: 'CONTINUATION_DATA_FAILED',
    GROUP_INFO_LOADED: 'GROUP_INFO_LOADED',
    ERROR_OCCURED: 'ERROR_OCCURED',
    RESET_ERROR: 'RESET_ERROR'
};

export function addAction(type: string, payload: any) {
    return { type, payload };
}

export const APPLICATION_NAME = 'CRUCIBLE';
export const QpExplorerActions = {
	BLOCKS_UPDATED: 'BLOCKS_UPDATED',
	TXS_UPDATED: 'TXS_UPDATED',
	BLOCK_UPDATED: 'BLOCK_UPDATED',
	TX_UPDATED: 'TX_UPDATED',
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
}