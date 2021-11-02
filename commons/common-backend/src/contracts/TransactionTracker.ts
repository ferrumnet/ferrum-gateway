import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { Schema, Document } from 'mongoose';
import { TransactionTrackable, TransactionTrackableItem } from 'types';

function isStatusTerminal(status: '' | 'pending' | 'failed' | 'timedout' | 'sucess') {
	return !(status === 'pending' || !status);
}

const transactionTrackableItemSchema = new Schema<TransactionTrackableItem&Document>({
	network: String,
	transactionId: String,
	timestamp: Number,
	status: String,
	message: String,
});

export const TransactionTrackableSchema = new Schema<TransactionTrackable&Document>({
	status: String,
	transactions: [transactionTrackableItemSchema],
})

export class TransactionTracker implements Injectable {
	constructor(
		private helper: EthereumSmartContractHelper,
	) {
	}

	__name__() { return 'TransactionTracker'; }

	async upsert(
		item: TransactionTrackable,
		network: string,
		transactionId?: string): Promise<TransactionTrackable|undefined> {
		const txs: TransactionTrackableItem[] = item.transactions || [];
		if (transactionId && !txs.find(t => t.transactionId == transactionId)) {
			return this.insert(item, network, transactionId);
		}

		const allStatusesF = txs
			.filter(t => !transactionId || t.transactionId === transactionId)
			.filter(t => !isStatusTerminal(t.status))
			.map(t =>
				this.helper.getTransactionStatus(network, t.transactionId, t.timestamp)
				.then(status => ({ t, status }))
			);
		const allStatuses = await Promise.all(allStatusesF);
		let changed = {} as any;
		allStatuses.filter(p => p.t.status !== p.status).forEach(p => {
			changed[p.t.transactionId] = p.status;
		});
		if (!Object.keys(changed).length) { return; }
		item = {...item};
		item.transactions = txs
			.map(i => {
				if (changed[i.transactionId]) {
					return {...i, status: changed[i.transactionId]};
				}
				return i;
			});
		const hasSuccess = item.transactions.find(t => t.status === 'sucess');
		const hasPending = item.transactions.find(t => t.status === 'pending');
		item.status = hasSuccess ? 'sucess' : hasPending ? 'pending' :
			item.transactions[item.transactions.length -1].status;
		return item;
	}

	private async insert(
		item: TransactionTrackable,
		network: string,
		transactionId: string) {
		ValidationUtils.isTrue(isStatusTerminal(item.status),
			'Status is already terminal: ' + transactionId);
		const now = Date.now();
		item = {...item};
		item.transactions = [...(item.transactions || [])];
		let status = await this.helper.getTransactionStatus(network, transactionId, now);
		if (status === 'timedout') {  // Cannot be timed out. We just submitted
			status = 'pending';
		}
		item.transactions.push({
			network, status, timestamp: now, transactionId
		} as TransactionTrackableItem);
		item.status = 'pending';
		return item;
	}
}