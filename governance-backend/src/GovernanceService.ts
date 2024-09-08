import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, ValidationUtils, Networks } from "ferrum-plumbing";
import { Connection, Model, Document, Schema } from "mongoose";
import { GovernanceContract, GovernanceTransaction,
	MultiSigSignature, SignableMethod, Utils, QuorumSubscription, RegisteredContract } from "types";
import { CrucibleRouter__factory } from './resources/typechain/factories/CrucibleRouter__factory';
import { CrucibleRouter } from './resources/typechain/CrucibleRouter';
import { GovernanceContractDefinitions, GovernanceContractList } from "./contracts/GovernanceContractList";
import { Eip712Params, encodeMultiSig, produceSignature, verifySignature } from 'web3-tools/dist/Eip712Utils';
import { randomBytes } from 'ferrum-crypto';
import { TransactionTrackableSchema, TransactionTracker } from 'common-backend/dist/contracts/TransactionTracker';
import { AbiFetcher } from "./AbiFetcher";

export const CACHE_TIMEOUT = 600 * 1000; // 10 min

const SigMethodCommonArgs = {
	expectedGroupId: 'expectedGroupId',
	multiSignature: 'multiSignature',
}

export function ensureNotExpired(expiry: number) {
	const now = Math.round(Date.now()/1000);
	ValidationUtils.isTrue(now < expiry, 'Allocation is expired');
}

const GovernanceTransactionSchema = new Schema<GovernanceTransaction&Document>({
	network: String,
	contractAddress: String,
	governanceContractId: String,
	requestId: String,
	quorum: String,
	created: Number,
	lastUpdate: Number,
	method: String,
	values: [String],
	metadata: Object,
	signatures: [Object],
	archived: Boolean,
	logs: [String],
	execution: TransactionTrackableSchema,
});

const GovernanceTransactionModel = (c: Connection) => c.model<GovernanceTransaction&Document>('governanceTransactions', GovernanceTransactionSchema);

const RegisteredContractSchema = new Schema<RegisteredContract&Document>({
	network: String,
	contractAddress: String,
	governanceContractId: String,
});

const RegisteredContractModel = (c: Connection) => c.model<RegisteredContract&Document>('registeredContract', RegisteredContractSchema);

export class GovernanceService extends MongooseConnection implements Injectable {
	private cache = new LocalCache();
	private transactionsModel: Model<GovernanceTransaction&Document> | undefined;
	private registeredContract: Model<RegisteredContract&Document> | undefined;
	constructor(
		private helper: EthereumSmartContractHelper,
		private tracker: TransactionTracker,
		private abi: AbiFetcher,
	) {
		super();
	}

	__name__() { return 'GovernanceService'; }

	initModels(con: Connection): void {
		// Store allocations
		this.transactionsModel = GovernanceTransactionModel(con);
		this.registeredContract = RegisteredContractModel(con);
	}

	async listContracts() {
		this.verifyInit();
		const hardCoded = GovernanceContractList;
		const fromDb = await this.registeredContract.find({}).exec();
		return [
			...hardCoded,
			...fromDb.map(f => f.toJSON()),
		]
	}

	async contractById(network: string, contractAddress: string, id: string) {
		const registered = GovernanceContractDefinitions[id];
		if (!registered) {
			const abi = await this.abi.fetchAbi(network, contractAddress);
			if (abi) {
				if (abi.find(m => m.name === 'VERSION') && abi.find(m => m.name === 'NAME')) {
					const con = await this.contract(network, contractAddress);
					const name = await con.NAME();
					const version = await con.VERSION();
					const contractId = `${name}:${version}`;
					console.log(`Read the id for contract ${contractAddress}: ${contractId}`);
					const definition = createGovernanceDefinitionFromAbi(id, abi);
					console.log('Got definition: ', {definition})
					if (!!definition) {
						GovernanceContractDefinitions[id] = definition;
					}
					return definition;
				}
			}
		}
		return registered;
	}

	async getSubscription(network: string, contractAddress: string, userAddress: string) {
		return await this.subscription(network, contractAddress, userAddress);
	}

	async listTransactions(network: string, contractAddress: string) {
		this.verifyInit();
		const txs = await this.transactionsModel.find(
			{ network, contractAddress }).exec();
		return !!txs ? txs.map(t => t.toJSON()) : undefined;
	}

	/**
	 * Archives a request. Makes sure the archives is a valid signer from quorum
	 */
	async archiveTransaction(
		userAddress: string,
		requestId: string,
		signature: string,
	) {
		ValidationUtils.allRequired({userAddress, requestId, signature});
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
		metadata: Object,
		userAddress: string,
		signature: string,
	) {
		this.verifyInit();
		const [sub, sig] = await this.methodCall(network, contractAddress, governanceContractId, method, args, false, userAddress, signature);
		const requestId = randomBytes(32);
		const tx = {
			requestId,
			network,
			contractAddress,
			governanceContractId,
			quorum: sub.quorum.toLowerCase(),
			created: Date.now(),
			lastUpdate: Date.now(),
			method: sig.method,
			values: args,
			metadata,
			signatures: [
				{
					creationTime: Date.now(),
					creator: userAddress,
					signature,
				} as MultiSigSignature
			],
			archived: false,
			logs: [ `Created by ${userAddress}` ],
			execution: { status: '', transactions: [] },
		} as GovernanceTransaction;
		await new this.transactionsModel(tx)!.save();
		return await this.getGovTransaction(requestId);
	}

	async addSignature(
		userAddress: string,
		requestId: string,
		signature: string,
		metadata: any,
	) {
		this.verifyInit();
		const tx = await this.getGovTransaction(requestId);
		ValidationUtils.isTrue(!!tx, 'requestId not found: ' + requestId);
		ValidationUtils.isTrue(!tx.signatures.find(s => s.creator.toLowerCase() === userAddress.toLowerCase()), 'Already signed by this user');
		const [sub, sig] = await this
			.methodCall(tx.network, tx.contractAddress, tx.governanceContractId, tx.method, tx.values, false, userAddress, signature);
		ValidationUtils.isTrue(sub.quorum === tx.quorum, 
			`Signer is from a different quorum: ${sub.quorum} vs ${tx.quorum}`);
		tx.signatures.push({
			creationTime: Date.now(),
			creator: userAddress.toLowerCase(),
			signature,
		} as MultiSigSignature);
		await this.transactionsModel.findOneAndUpdate({requestId}, {signatures: tx.signatures, metadata: {...tx.metadata, ...metadata}});
		return await this.getGovTransaction(requestId);
	}

	async updateTransacionsForRequest(
		requestId: string,
		transactionId?: string,
	) {
		const r = await this.getGovTransaction(requestId);
		const execution = await this.tracker.upsert(r.execution || {} as any, r.network, transactionId);
		if (!!execution) {
			await this.transactionsModel.findOneAndUpdate({requestId}, {execution});
		}
		return this.getGovTransaction(requestId);
	}

	async submitRequestGetTransaction(
		userAddress: string,
		requestId: string,
	) {
		const tx = await this.getGovTransaction(requestId);
		ValidationUtils.isTrue(!!tx, 'requestId not found: ' + requestId);
		console.log(tx.governanceContractId,'tx.governanceContractIdtx.governanceContractId')
		const [c, m] = await this.getMethod(tx.governanceContractId, tx.method);
		const quorumData = await this.contract(tx.network, tx.contractAddress)
			.quorums(tx.quorum);
		const expectedGroupId = quorumData[1];
		ValidationUtils.isTrue(Utils.isNonzeroAddress(quorumData[0]),
			`Quorum ${tx.quorum} doesnt exist on ${tx.contractAddress}`);
		const multiSig = encodeMultiSig(tx.signatures);

		// Custom logic for expectedGroupId and multiSignature?
		const web3 = this.helper.web3(tx.network);
		const contract = new web3.Contract([m.abi as any], tx.contractAddress);
		const values = tx.values;
		const groupIdIdx = m.abi.inputs.findIndex(a => a.name === SigMethodCommonArgs.expectedGroupId);
		if (groupIdIdx >= 0) {
			ValidationUtils.isTrue(groupIdIdx == m.abi.inputs.length - 2,
				"Contract's method arg 'expectedGroupId' must be the one before last");
			ValidationUtils.isTrue(m.abi.inputs.length === tx.values.length + 2,
				`Abi input size for method ${tx.method} is expected to be exactly 2 above the signable size`);
			values.push(expectedGroupId as any);
		} else {
			ValidationUtils.isTrue(m.abi.inputs.length === tx.values.length + 1,
				`Abi input size for method ${tx.method} is expected to be exactly 1 above the signable size (${m.abi.inputs.length} vs ${tx.values.length})`);
		}
		const multiSigIdx = m.abi.inputs.findIndex(a => a.name === SigMethodCommonArgs.multiSignature);
		ValidationUtils.isTrue(multiSigIdx >= 0,
			"Contract's method must have last argument: multiSignature");
		ValidationUtils.isTrue(multiSigIdx == m.abi.inputs.length - 1,
			"Contract's method arg 'multiSignature' must be the last one");
		values.push(multiSig);

		console.log('ABOUT TO CALL METHOD', m.abi.name, {values});

		const p = contract.methods[m.abi.name](...values);

		const gas = await this.estimateGasOrDefault(p, userAddress, undefined);
		const nonce = await this.helper.web3(tx.network)
			.getTransactionCount(userAddress, 'pending');
		return EthereumSmartContractHelper.callRequest(tx.contractAddress,
						'na',
						userAddress,
						p.encodeABI(),
						gas ? gas.toFixed() : undefined,
						nonce,
						tx.method);
	}

	async estimateGasOrDefault(method: any, from: string, defaultGas?: number) {
			try {
					return await method.estimateGas({from});
			} catch(e) {
					console.info('Error estimating gas. Tx might be reverting');
					return defaultGas;
			}
	}

	private async methodCall(
		network: string,
		contractAddress: string,
		contractId: string,
		method: string,
		values: string[],
		isArchive: boolean,
		userAddress: string,
		signature: string): Promise<[QuorumSubscription, Eip712Params]> {
		const [contract, m] = await this.getMethod(contractId, method);
		const sig = this.produceMethodCall(network, contractAddress, contract, m, values, isArchive);
		const subscription = await this
			.authorize(network, contractAddress, userAddress, sig.hash, signature, m.governanceOnly);
		return [subscription, sig];
	}

	private produceMethodCall(
		network: string,
		contractAddress: string,
		contract: GovernanceContract,
		m: SignableMethod,
		values: string[],
		isArchive: boolean,
	) {
		ValidationUtils.isTrue(isArchive || m.args.length === values.length, `Wrong number of arguments for method ${m.name}`);
		const args = isArchive ? 
			[
					{ type: "boolean", name: "archive", value: true as any },
			] : m.args.map((a, i) => ({ type: a.type, name: a.name, value: values[i] }));

		const params = { 
				contractName: contract.identifier.name,
				contractVersion: contract.identifier.version,
				method: m.name,
				args,
			} as Eip712Params
		const sig = produceSignature(
			this.helper.web3(network),
			Networks.for(network).chainId,
			contractAddress,
			params,
		);
		return sig;
	}

	private async authorize(network: string, contractAddress: string, userAddress: string, msg: string, signature: string, mustBeGov: boolean) {
		// First, check if the user signature is valid. Once it is verified, make sure use is allowed on the contract
		console.log('To autorize', {
			network, contractAddress, userAddress, msg, signature
		})
		verifySignature(msg.replace('0x',''), userAddress, signature);
		const subscription = await this.subscription(network, contractAddress, userAddress);
		console.log('Subscription', {subscription});
		ValidationUtils.isTrue(!!subscription, `Address ${userAddress} is not part of any quorum on ${network} - ${contractAddress}`);
		if (mustBeGov) {
			ValidationUtils.isTrue(subscription.groupId < 256, `Address ${userAddress} is of groupId ${subscription.groupId} which is not governance`);
		}
		return subscription;
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
		console.log('first sub is ', Utils.isNonzeroAddress(subscription[0]), subscription[0])
		if (!subscription || !Utils.isNonzeroAddress(subscription[0])) {
			return undefined;
		}
		const mainQuorum = await this.contract(network, contractAddress).quorums(subscription[0]);
		const minSignatures = mainQuorum.minSignatures;
		const [quorum, groupId, ] = subscription;
		return { quorum: quorum.toLowerCase(), groupId, minSignatures } as QuorumSubscription;
	}

	private async getGovTransaction(requestId: string): Promise<GovernanceTransaction|undefined> {
		this.verifyInit();
		ValidationUtils.isTrue(!!requestId, "requestId is required");
		const res = await this.transactionsModel.findOne({requestId}).exec();
		return !!res ? res.toJSON() as any : undefined;
	}

	private contract(network: string, contractAddress: string): CrucibleRouter {
		const provider = this.helper.ethersProvider(network);
		return CrucibleRouter__factory.connect(contractAddress, provider);
	}
}

function abiItemToMethod(item: any) {
	if (item.inputs?.length < 3) return null;
	const [salt, expiry, multisig] = item.inputs.slice(-3);
	if (multisig.type === 'bytes' && expiry.type === 'uint64' && salt.type === 'bytes32') {
		item.args = [...item.inputs.slice(0, item.inputs.length - 1)]; // Filter out the signature, keep the rest
		return item;
	}
}

function createGovernanceDefinitionFromAbi(id: string, abi: any[]): GovernanceContract{
	const [name, version] = id.split(':');
	return {
		id,
		identifier: {
			name, version,
		},
		methods: abi.map(m => abiItemToMethod(m)).filter(Boolean),
	}
}

