import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, ValidationUtils, Networks } from "ferrum-plumbing";
import { Connection, Model, Document, Schema } from "mongoose";
import { GovernanceContract, GovernanceTransaction, MultiSigSignature, SignableMethod } from "types";
import { CrucibleRouter__factory } from './resources/typechain/factories/CrucibleRouter__factory';
import { CrucibleRouter } from './resources/typechain/CrucibleRouter';
import { GovernanceContractDefinitions, GovernanceContractList } from "./contracts/GovernanceContractList";
import { Eip712Params, produceSignature, verifySignature } from 'web3-tools/dist/Eip712Utils';
import { randomBytes } from 'ferrum-crypto';

export const CACHE_TIMEOUT = 600 * 1000; // 10 min

export function ensureNotExpired(expiry: number) {
	const now = Math.round(Date.now()/1000);
	ValidationUtils.isTrue(now < expiry, 'Allocation is expired');
}

interface QuorumSubscription {
	quorum: string;
	groupId: number;
	minSignatures: number;
}

const GovernanceTransactionSchema = new Schema<GovernanceTransaction&Document>({
	network: String,
	contractAddress: String,
	governanceContractId: String,
	requestId: String,
	created: Number,
	lastUpdate: Number,
	method: String,
	values: [String],
	signatures: [Object],
	transactions: [new Schema({ network: String, id: String, status: String })],
	archived: Boolean,
	logs: [String],
});

const GovernanceTransactionModel = (c: Connection) => c.model<GovernanceTransaction&Document>('governanceTransactions', GovernanceTransactionSchema);

export class GovernanceService extends MongooseConnection implements Injectable {
	private cache = new LocalCache();
	private transactionsModel: Model<GovernanceTransaction&Document> | undefined;
	constructor(
		private helper: EthereumSmartContractHelper,
	) {
		super();
	}

	__name__() { return 'GovernanceService'; }

	initModels(con: Connection): void {
		// Store allocations
		this.transactionsModel = GovernanceTransactionModel(con);
	}

	async listContracts() {
		return GovernanceContractList;
	}

	async contractById(id: string) {
		return GovernanceContractDefinitions[id];
	}

	/**
	 * Archives a request. Makes sure the archives is a valid signer from quorum
	 */
	async archiveTransaction(
		userAddress: string,
		requestId: string,
		signature: string,
	) {
		ValidationUtils.allRequired(['userAddress', 'requestId', 'signature'], {userAddress, requestId, signature});
		const tx = await this.getGovTransaction(requestId);
		ValidationUtils.isTrue(!!tx, 'requestId not found: ' + requestId);
		await this.methodCall(tx.network, tx.contractAddress, tx.governanceContractId, tx.method, [], true, userAddress, signature);
		await this.transactionsModel.findOneAndUpdate({requestId}, {archived: true});
		return await this.getGovTransaction(requestId);
	}

	async proposeTransaction(
		network: string,
		contractAddress: string,
		governanceContractId: string,
		method: string,
		args: string[],
		userAddress: string,
		signature: string,
	) {
		this.verifyInit();
		const sig = await this.methodCall(network, contractAddress, governanceContractId, method, args, false, userAddress, signature);
		const requestId = randomBytes(32);
		const tx = {
			requestId,
			created: Date.now(),
			lastUpdate: Date.now(),
			method: sig.method,
			values: args,
			signatures: [
				{
					creationTime: Date.now(),
					creator: userAddress,
					signature,
				} as MultiSigSignature
			],
			transactions: [],
			archived: false,
			logs: [ `Created by ${userAddress}` ],
		} as GovernanceTransaction;
		await new this.transactionsModel(tx)!.save();
		return await this.getGovTransaction(requestId);
	}

	async addSignature(
		userAddress: string,
		requestId: string,
		signature: string,
	) {
		this.verifyInit();
		const tx = await this.getGovTransaction(requestId);
		ValidationUtils.isTrue(!!tx, 'requestId not found: ' + requestId);
		ValidationUtils.isTrue(!tx.signatures.find(s => s.creator.toLowerCase() === userAddress.toLowerCase()), 'Already signed by this user');
		await this.methodCall(tx.network, tx.contractAddress, tx.governanceContractId, tx.method, tx.values, false, userAddress, signature);
		tx.signatures.push({
			creationTime: Date.now(),
			creator: userAddress.toLowerCase(),
			signature,
		} as MultiSigSignature);
		await this.transactionsModel.findOneAndUpdate({requestId}, {signatures: tx.signatures});
		return await this.getGovTransaction(requestId);
	}

	private async methodCall(
		network: string,
		contractAddress: string,
		contractId: string,
		method: string,
		values: string[],
		isArchive: boolean,
		userAddress: string,
		signature: string) {
		const [contract, m] = await this.getMethod(contractId, method);
		ValidationUtils.isTrue(isArchive || m.args.length === values.length, `Wrong number of arguments for method ${method}`);
		const args = isArchive ? 
			[
					{ type: "boolean", name: "archive", value: true as any },
			] : m.args.map((a, i) => ({ type: a.type, name: a.name, value: values[i] }));

		const sig = produceSignature(
			this.helper.web3(network),
			Networks.for(network).chainId,
			contractAddress,
			{ 
				contractName: contract.identifier.name,
				contractVersion: contract.identifier.version,
				method: m.name,
				args,
			} as Eip712Params,
		);
		if (signature) {
			await this.authorize(network, contractAddress, userAddress, sig.hash, signature, m.governanceOnly);
		}
		return sig;
	}

	private async authorize(network: string, contractAddress: string, userAddress: string, msg: string, signature: string, mustBeGov: boolean) {
		// First, check if the user signature is valid. Once it is verified, make sure use is allowed on the contract
		verifySignature(msg, userAddress, signature);
		const subscription = await this.subscription(network, contractAddress, userAddress);
		ValidationUtils.isTrue(!!subscription, `Address ${userAddress} is not part of any quorum on ${network} - ${contractAddress}`);
		if (mustBeGov) {
			ValidationUtils.isTrue(subscription.groupId < 256, `Address ${userAddress} is of groupId ${subscription.groupId} which is not governance`);
		}
	}

	private async getMethod(contractId: string, method: string): Promise<[GovernanceContract, SignableMethod]> {
		const registered = GovernanceContractList.find(c => c.governanceContractId === contractId);
		ValidationUtils.isTrue(!!registered, `Contract "${contractId}" is not registered`);
		const con = GovernanceContractDefinitions[contractId];
		ValidationUtils.isTrue(!!con, `Contract "${contractId} not found`);
		const meth = con.methods.find(m => m.name === method);
		ValidationUtils.isTrue(!!meth, `Contract "${contractId} has not method "${method}"`);
		return [con!, meth!];
	}

	private async subscription(network: string, contractAddress: string, userAddress: string): Promise<QuorumSubscription | undefined> {
		const subscription = (await this.contract(network, contractAddress).quorumSubscriptions(userAddress)) || ['', 0, 0];
		if (!subscription || !subscription[0]) {
			return undefined;
		}
		const [quorum, groupId, minSignatures] = subscription;
		return { quorum, groupId, minSignatures } as QuorumSubscription;
	}

	private async getGovTransaction(requestId: string): Promise<GovernanceTransaction|undefined> {
		this.verifyInit();
		ValidationUtils.isTrue(!!requestId, "requestId is required");
		const res = await this.transactionsModel.findOne({requestId}).exec();
		return !!res ? res.toJSON() : undefined;
	}

	private contract(network: string, contractAddress: string): CrucibleRouter {
		const provider = this.helper.ethersProvider(network);
		return CrucibleRouter__factory.connect(contractAddress, provider);
	}
}

function shat256(requestId: string) {
	throw new Error("Function not implemented.");
}
