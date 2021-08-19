import { Injectable, Network, ValidationUtils } from "ferrum-plumbing";
import { CrossSwapRequest, Utils } from "types";
import { BridgeSwapEvent } from "../common/TokenBridgeTypes";
import { CrossSwapService } from "../crossSwap/CrossSwapService";

function dbToEvent(db: CrossSwapRequest): BridgeSwapEvent {
	return {
		amount: db.amountIn,
		from: db.userAddress,
		network: db.network,
		originToken: Utils.parseCurrency(db.fromCurrency)[1],
		swapTargetTokenTo: Utils.parseCurrency(db.toCurrency)[1],
		targetAddress: db.userAddress,
		targetNetwork: Utils.parseCurrency(db.toCurrency)[0],
		targetToken: Utils.parseCurrency(db.targetThroughCurrency)[1],
		token: Utils.parseCurrency(db.throughCurrency)[1],
		transactionId: db.transactionId,
	} as BridgeSwapEvent;
}

export class TransactionListProvider implements Injectable {
	constructor(
		private crossSwap: CrossSwapService,
	) {
	}

	__name__() { return 'TransactionListProvider'; }

	/**
	 * List events from the chain.
	 * Also list them from the database.
	 * Register missing items back to the DB. // TODO: bulk insert in future
	 * return items that are new / not processed.
	 */
	async listNewTransactions(network: Network, lookBackSeconds: number = 0): Promise<BridgeSwapEvent[]> {
		await this.ensureDatabaseIsUpToDate(network, lookBackSeconds);
		return (await this.crossSwap
			.listRegisteredSwapCross(network, lookBackSeconds))
			.map(dbToEvent);
	}

	async listSingleTransaction(network: Network, txId: string): Promise<BridgeSwapEvent> {
		const tx = await this.crossSwap.getSwapEventsV12ForTransactionId(network, txId);
		ValidationUtils.isTrue(!!tx, 'Transaction not found! ' + network + ':' + txId);
		const txFromDb = await this.crossSwap.getRegisteredSwapCross(txId);
		if (!txFromDb) {
			await this.registerSwapCrossFromEvent(tx);
		}
		return tx;
	}

	async validateFromNetwork(tx: BridgeSwapEvent) {
		const event = await this.crossSwap.getSwapEventsV12ForTransactionId(tx.network, tx.transactionId);
		ValidationUtils.isTrue(
			event.amount === tx.amount &&
			event.from === tx.from &&
			event.network === tx.network &&
			event.swapTargetTokenTo === tx.swapTargetTokenTo &&
			event.targetAddress === tx.targetAddress &&
			event.targetNetwork === tx.targetNetwork &&
			event.token === tx.token &&
			event.targetToken === tx.targetToken 
		, `Mismatching transaction and event. "${JSON.stringify(tx)}" vs "${JSON.stringify(event)}"`);
	}

	async ensureDatabaseIsUpToDate(network: Network, lookBackSeconds: number) {
		const incomingFromNet = await this.crossSwap.getSwapEventsV12(
			network, !!process.env.BLOCK_LOOK_BACK ? Number(process.env.BLOCK_LOOK_BACK) : undefined);
		const processedDbIds = await this.crossSwap.processedRegisteredSwapTxIds(network, lookBackSeconds);
		const processedSet = new Set(processedDbIds);
		const missing = incomingFromNet.filter(t => !processedSet.has(t.transactionId));
		for (const tx of missing) {
			try {
				await this.registerSwapCrossFromEvent(tx);
			} catch(e) {
				console.error('Error adding tx to database: ', tx, e as Error);
			}
		}
	}

	private async registerSwapCrossFromEvent(tx: BridgeSwapEvent) {
		await this.crossSwap.registerSwapCross(
			tx.from,
			tx.targetAddress,
			tx.network,
			tx.transactionId,
			Utils.toCurrency(tx.network, tx.originToken),
			Utils.toCurrency(tx.targetNetwork, tx.swapTargetTokenTo),
			tx.amount,
			Utils.toCurrency(tx.network, tx.token),
			Utils.toCurrency(tx.targetNetwork, tx.targetToken),
			'', '',);  // Unknown from and to protocols
	}
}