import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils, Network } from "ferrum-plumbing";
import { Schema, Document, Connection, Model } from "mongoose";
import { ChainEventBase } from "types";

const MAX_EVENT_RETRY = 7;

const ChainEventSchema = new Schema<ChainEventBase&Document>({
	id: String,
	userAddress: String,
	network: String,
	application: String,
	status: String,
	eventType: String,
	transactionType: String,
	createdAt: Number,
	lastUpdate: Number,
	reason: String,
	retry: Number,
});

const ChainEventModel = (c: Connection) => c.model<ChainEventBase&Document>('chainevents', ChainEventSchema);

export class ChainEventService extends MongooseConnection implements Injectable  {
	private model: Model<ChainEventBase&Document>|undefined;
	constructor(
		private helper: EthereumSmartContractHelper,
	) {
		super();
	}

	__name__() { return 'ChainEventService'; }

	initModels(c: Connection) {
		this.model = ChainEventModel(c);
	}

	async updateChainEvents(userAddress: string, events: ChainEventBase[]) {
		const rv: ChainEventBase[] = [];
		for(const ev of events) {
			rv.push(await this.updateChainEvent(userAddress, ev));
		}
		return rv;
	}

	async updateChainEvent(userAddress: string, event: ChainEventBase): Promise<ChainEventBase> {
		this.verifyInit();
		ValidationUtils.isTrue(!!event, '"event" is required');
		ValidationUtils.isTrue(!!event.id, '"event" must have "id"');
		event.id = event.id.toLowerCase();
		// Get the event from chain.
		if (event.status === 'completed' || event.status === 'failed') {
			return event;
		}
		const now = Date.now();
		try {
			const hasTime = !!event.createdAt;
			let stat = await this.helper.getTransactionStatus(event.network, event.id, hasTime ? event.createdAt : now - 10);
			console.log(`Got transaction status for ${event.id}: ${stat}`);
			if (stat === 'timedout' && !hasTime) { stat = 'pending'; }
			event.status = stat as any;
			if (!hasTime) {
				event.createdAt = now;
			}
			event.lastUpdate = now;
		} catch(e) {
			event.retry = (event.retry || 0) + 1;
			event.reason = (e as Error).message || (e as Error).toString();
			if (event.retry > MAX_EVENT_RETRY) {
				event.status = 'failed';
			}
		}
		event.userAddress = event.userAddress || userAddress.toLowerCase();
		console.log('ABOUT TO UPDATA', event);
		await this.model!.findOneAndUpdate({network: event.network, id: event.id}, event, {upsert: true});
		return (await this.getEvent(event.network, event.id))!;
	}

	async getEvent(network: Network, id: string): Promise<ChainEventBase|undefined> {
		this.verifyInit();
		ValidationUtils.isTrue(!!network, '"network" is required');
		ValidationUtils.isTrue(!!id, '"id" is required');
		const rv = await this.model!.findOne({network, id}).exec();
		return !!rv ? rv.toJSON() as any : undefined;
	}

	async getUserEvents(userAddress: string, application: string): Promise<ChainEventBase[]> {
		this.verifyInit();
		ValidationUtils.isTrue(!!userAddress, '"id" is required');
		ValidationUtils.isTrue(!!application, '"application" is required');
		const rv = await this.model!.find({userAddress, application}).exec();
		return rv.map(r => r.toJSON() as any);
	}
}