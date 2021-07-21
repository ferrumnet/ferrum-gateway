import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, Network, ValidationUtils } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import { CrucibleConfig, CrucibleAllocationCsvModel } from "./CrucibleTypes";
import { CrucibleToken__factory, CruicibleRouter__factory } from "./resources/typechain";
import { CrucibleInfo, CurrencyValue, StoredAllocationCsv, UserContractAllocation } from 'types';
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { ChainUtils } from "ferrum-chain-clients";
import { BasicAllocator } from 'common-backend/dist/contracts/BasicAllocator';
import { signWithPrivateKey } from 'web3-tools/dist/Eip712Utils';

export const CACHE_TIMEOUT = 600 * 1000; // 10 min

export class CrucibeService extends MongooseConnection implements Injectable {
	ROUTER_NAME = 'FERRUM_CRUCIBLE_ROUTER';
	ROUTER_VERSION = '000.001';
	private cache = new LocalCache();
	private crucibleAllocationsCsvModel: Model<StoredAllocationCsv&Document> | undefined;
	private crucibleModel: Model<CrucibleInfo&Document> | undefined;
	constructor(
		private helper: EthereumSmartContractHelper,
		private config: CrucibleConfig,
		private basicAllocator: BasicAllocator,
		private allocatorPrivateKey: string,
		private allocatorAddress: string,
	) {
		super();
	}
	__name__() { return 'CrucibeService'; }

    initModels(con: Connection): void {
		// Store allocations
		this.crucibleAllocationsCsvModel = CrucibleAllocationCsvModel(con);
    }

	async getAllocation(
		network: Network,
		crucible: string,
		userAddress: string,
	): Promise<UserContractAllocation|undefined> {
		const alls = await this.getAllAllocations(network, crucible);
		return alls.find(a => ChainUtils.addressesAreEqual(network, a.userAddress, userAddress));
	}

	async getAllAllocations(
		network: Network,
		crucible: string,): Promise<UserContractAllocation[]> {
		const key = `ALLOC-${network}:${crucible}`;
		return await this.cache.getAsync(
			key, async () => {
				const allocDefinition = await this.crucibleAllocationsCsvModel.findOne({
					network, crucible}).exec();
				return this.basicAllocator.parse(allocDefinition.csv)
			},
			CACHE_TIMEOUT);
	}

	async depositGetTransaction(
		network: Network,
		cur: string,
		crucible: string,
		amount: string,
		from: string,
	) {
		const currency = await this.crucibleCurrency(network, crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const amountInt = await this.helper.amountToMachine(currency, amount);
		const r = await this.router(network);
		const allocation = await this.getAllocation(network, crucible, from);
		ValidationUtils.isTrue(!!allocation && !!allocation.allocation, 
			`No allocation for ${from}`);
		const signed = await this.basicAllocator.sign(
			this.allocatorAddress,
			this.ROUTER_NAME,
			this.ROUTER_VERSION,
			allocation,
			allocation.userAddress, // No randomized salt
			async msg => signWithPrivateKey(this.allocatorPrivateKey, msg));
		const t = await r.populateTransaction.deposit(
			from,
			crucible,
			amountInt,
			signed.signature.salt,
			signed.signature.expirySeconds,
			signed.signature.signature,
			{from});
		return EthereumSmartContractHelper.fromTypechainTransaction(t);
	}

	async depositPublicGetTransaction(
		network: string,
		cur: string,
		crucible: string,
		amount: string,
		from: string,
	): Promise<CustomTransactionCallRequest> {
		const currency = await this.crucibleCurrency(network, crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const r = await this.router(network);
		const t = await r.populateTransaction.depositOpen(
			from,
			crucible,
			await this.helper.amountToMachine(currency, amount),
			{from});
		return EthereumSmartContractHelper.fromTypechainTransaction(t);
	}

	async withdrawGetTransaction(
		network: string,
		cur: string,
		crucible: string,
		amount: string,
		to: string,): Promise<CustomTransactionCallRequest> {
		const currency = await this.crucibleCurrency(network, crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const r = await this.crucible(network, crucible);
		const t = await r.populateTransaction.withdraw(
			to,
			await this.helper.amountToMachine(currency, amount),
			{from: to});
		return EthereumSmartContractHelper.fromTypechainTransaction(t);
	}

	async remainingFromCap(network: string, crucible: string): Promise<CurrencyValue> {
		const r = await this.router(network);
		const cap = await r.openCaps(crucible);
		const currency = await this.crucibleCurrency(network, crucible);
		return {
			currency,
			value: await this.helper.amountToHuman(currency, cap.toString()),
		} as CurrencyValue;
	}

	public async getCrucibleInfo(network: Network, address: string) {
		ValidationUtils.isTrue(!!network, 'network is required');
		ValidationUtils.isTrue(!!address, 'address is required');
		return this.cache.getAsync(`CRUCIBLE-${network}:${address}`,
		async () => this.getCrucibleInfoCached(network, address));
	}

	public async getAllCruciblesFromDb(network: Network): Promise<CrucibleInfo[]> {
		const crucibles = network ? await this.crucibleModel.find({}).exec() : await this.crucibleModel.find({network}).exec();
		return crucibles.map(c => c.toJSON());
	}

	private async getCrucibleInfoCached(network: Network, contractAddress: string)
	: Promise<CrucibleInfo> {
		const crucible: CrucibleInfo =
			await this.crucibleModel.findOne({network, contractAddress}).exec();
		ValidationUtils.isTrue(!!crucible, 'Crucible not found');
		const allocs = await this.getAllAllocations(network, contractAddress);
		return {
			...crucible,
			network,
			contractAddress,
			openCap: crucible.openCap || '0',
			activeAllocationSum: allocs.map(a => new Big(a.allocation))
				.reduce((p, c) => p.add(c), new Big(0)).toFixed(),
			activeAllocationCount: allocs.length,
			priceUsdt: '',
			priceEth: '',
			leftFromCap: (await this.remainingFromCap(network, contractAddress))?.value,
			currency: await this.crucibleCurrency(network, contractAddress),
			// feeOnTransferRate: crucible.,
			// feeOnWithdrawRate: String,
			totalSupply: await this.crucibleSupply(network, contractAddress),
			// feeDescription: String,
		} as CrucibleInfo;
	}

	private async crucibleCurrency(network: string, crucible: string): Promise<string> {
		const tok = await this.crucible(network, crucible);
		return `${network}:${await tok.baseToken()}`;
	}

	private async crucibleSupply(network: string, crucible: string): Promise<string> {
		const tok = await this.crucible(network, crucible);
		const sup = (await tok.totalSupply()).toString();
		return this.helper.amountToHuman(`${network}:${crucible}`, sup);
	}

	async router(network: string) {
		const provider = await this.helper.ethersProvider(network);
		return CruicibleRouter__factory.connect(this.config.routerAddress[network], provider);
	}

	async crucible(network: string, crucible: string) {
		const provider = await this.helper.ethersProvider(network);
		return CrucibleToken__factory.connect(crucible, provider);
	}
}