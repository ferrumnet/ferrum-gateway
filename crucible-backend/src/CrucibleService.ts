import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, Network, ValidationUtils, Networks, HexString } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import { CrucibleConfig, CrucibleAllocationCsvModel } from "./CrucibleTypes";
import { CrucibleToken, CrucibleToken__factory, CrucibleRouter__factory, CrucibleFactory, CrucibleFactory__factory } from "./resources/typechain";
import { AllocationSignature, BigUtils, CrucibleInfo, CurrencyValue, DEFAULT_SWAP_PROTOCOLS, ETH, MultiSigActor, StoredAllocationCsv, UserContractAllocation } from 'types';
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { ChainUtils } from "ferrum-chain-clients";
import { produceSignature } from 'web3-tools/dist/Eip712Utils';
import { UniswapPricingService } from 'common-backend/dist/uniswapv2/UniswapPricingService';
import { CrucibleRouter } from "./resources/typechain/CrucibleRouter";
import { BasicAllocation } from "common-backend/dist/contracts/BasicAllocation";
import { sha256 } from 'ferrum-crypto';
import { MultiSigUtils } from 'web3-tools/dist/MultiSigUtils';

export const CACHE_TIMEOUT = 600 * 1000; // 10 min

const AllocationMethods = {
	DEPOSIT: 'DEPOSIT',
	DEPOSIT_ADD_LIQUIDITY_STAKE: 'DEPOSIT_ADD_LIQUIDITY_STAKE',
}

export function ensureNotExpired(expiry: number) {
	const now = Math.round(Date.now()/1000);
	ValidationUtils.isTrue(now < expiry, 'Allocation is expired');
}

export class CrucibeService extends MongooseConnection implements Injectable {
	ROUTER_NAME = 'FERRUM_CRUCIBLE_ROUTER';
	ROUTER_VERSION = '000.001';
	private cache = new LocalCache();
	private crucibleAllocationsCsvModel: Model<StoredAllocationCsv&Document> | undefined;
	private crucibleModel: Model<CrucibleInfo&Document> | undefined;
	constructor(
		private helper: EthereumSmartContractHelper,
		private pricing: UniswapPricingService,
		private config: CrucibleConfig,
		private basicAllocation: BasicAllocation,
		private signingActor: MultiSigActor,
		private sk: HexString,
	) {
		super();
	}

	__name__() { return 'CrucibeService'; }

	initModels(con: Connection): void {
		// Store allocations
		this.crucibleAllocationsCsvModel = CrucibleAllocationCsvModel(con);
	}

	async getAllocations(
		crucible: string,
		userAddress: string,
	) {
		const al1 = await this.getAllocation(crucible, userAddress, AllocationMethods.DEPOSIT);
		const al2 = await this.getAllocation(crucible, userAddress,
			AllocationMethods.DEPOSIT_ADD_LIQUIDITY_STAKE);
		return [al1, al2];
	}

	async getAllocation(
		crucible: string,
		userAddress: string,
		method: string,
	): Promise<UserContractAllocation|undefined> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const alls = await this.getAllAllocations(crucible);
		const al = alls.find(a => ChainUtils
			.addressesAreEqual(network as any, a.userAddress, userAddress) && a.method === method);
		if (!!al) {
			if (!al.signature) {
				al.signature = {} as any as AllocationSignature;
			}
			al.signature!.actor = this.signingActor;
		}
		return al;
	}

	async getAllAllocations(
		crucible: string,): Promise<UserContractAllocation[]> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const key = `ALLOC-${network}:${crucible}`;
		return await this.cache.getAsync(
			key, async () => {
				const allocDefinition = await this.crucibleAllocationsCsvModel.findOne({
					network, crucible}).exec();
				return this.basicAllocation.parse(allocDefinition.csv)
			},
			CACHE_TIMEOUT);
	}

	/**
	 * For allocation we currently use only one signature. The signer quorum should be defined as such
	 */
	async depositGetTransaction(
		cur: string,
		crucible: string,
		amount: string,
		from: string,
	) {
		const [network, conAddress] = EthereumSmartContractHelper.parseCurrency(crucible);
		const currency = await this.crucibleCurrency(crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const amountInt = await this.helper.amountToMachine(currency, amount);
		const r = await this.router(network);

		const allocation = await this.signedAllocation(from, crucible, AllocationMethods.DEPOSIT, amountInt);
		const t = await r.populateTransaction.deposit(
			from,
			conAddress,
			amountInt,
			allocation.signature!.salt,
			allocation.expirySeconds,
			this.signingActor.groupId,
			MultiSigUtils.toBytes(allocation.signature),
			{from});
		return EthereumSmartContractHelper.fromTypechainTransaction(t);
	}

	private async signedAllocation(from: string, crucible: string, allocationMethod: string, amountInt: string,) {
		const [network, conAddress] = EthereumSmartContractHelper.parseCurrency(crucible);
		const allocation = await this.getAllocation(crucible, from, allocationMethod);
		ensureNotExpired(allocation.expirySeconds);
		ValidationUtils.isTrue(!!allocation && !!allocation.allocation, `No allocation for ${from}`);
		allocation.signature!.salt = await sha256(Buffer.from(`${from.toLowerCase()}-${allocation.expirySeconds}-${allocation.allocation}`, 'utf-8').toString('hex'));
		const method = produceSignature(this.helper.web3(network),
			Networks.for(network).chainId,
			this.config.contracts[network].router,
			{
				contractName: this.ROUTER_NAME,
				contractVersion: this.ROUTER_VERSION,
				method: 'Deposit',
				args: [
					{ type: 'address', name: 'to', value: from },
					{ type: 'address', name: 'crucible', value: conAddress },
					{ type: 'uint256', name: 'amount', value: amountInt },
					{ type: 'bytes32', name: 'salt', value: allocation.signature!.salt }, // Salt will be the user address?
					{ type: 'uint64', name: 'expiry', value: allocation.expirySeconds as any },
				]
			});
		allocation.signature = await MultiSigUtils.signWithPrivateKey(this.sk, method.hash!, allocation.signature!);
		return allocation;
	}

	async depositPublicGetTransaction(
		cur: string,
		crucible: string,
		amount: string,
		from: string,
	): Promise<CustomTransactionCallRequest> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const currency = await this.crucibleCurrency(crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const r = await this.router(network);
		const t = await r.populateTransaction.depositOpen(
			from,
			crucible,
			await this.helper.amountToMachine(currency, amount),
			{from});
		return EthereumSmartContractHelper.fromTypechainTransaction(t);
	}

	async depositAddLiquidityAndStake(
		userAddress: string,
		baseCur: string,
		targetCur: string,
		baseAmount: string,
		targetAmount: string,
		crucible: string,
		deadline: number,
	): Promise<CustomTransactionCallRequest> {
		const now = Math.round(Date.now() / 1000);
		ValidationUtils.isTrue(deadline > now && deadline < now + 3600 * 24, 'Deadline is invalid');
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const [, targetToken] = EthereumSmartContractHelper.parseCurrency(targetCur);
		const expectedBaseCur = await this.crucibleCurrency(crucible);
		ValidationUtils.isTrue(baseCur === expectedBaseCur, 'Unexpected base currency: ' + baseCur);
		const ammRouter = DEFAULT_SWAP_PROTOCOLS[network][0];
		ValidationUtils.isTrue(!!ammRouter, `No default AMM router is configured for ${network}`);
		const staking = this.config.contracts[network].staking; // TODO: from config...
		const baseAmountInt = await this.helper.amountToMachine(baseCur, baseAmount); // TODO: ETH
		const targetAmountInt = await this.helper.amountToMachine(targetCur, targetAmount);
		const r = await this.router(network);

		const allocation = await this.signedAllocation(userAddress, crucible, AllocationMethods.DEPOSIT_ADD_LIQUIDITY_STAKE, baseAmountInt);
		const t = targetCur === ETH[network][0] ?
			await r.populateTransaction.depositAddLiquidityStakeETH(
				userAddress,
				crucible,
				baseAmountInt,
				ammRouter,
				staking,
				allocation.expirySeconds,
				deadline,
				this.signingActor.groupId,
				MultiSigUtils.toBytes(allocation.signature),
				{ from: userAddress, value: targetAmountInt }) : 
			await r.populateTransaction.depositAddLiquidityStake(
				userAddress,
				crucible,
				targetToken,
				baseAmountInt,
				targetAmountInt,
				ammRouter,
				staking,
				allocation.expirySeconds,
				deadline,
				this.signingActor.groupId,
				MultiSigUtils.toBytes(allocation.signature),
				{ from: userAddress });
		return EthereumSmartContractHelper.fromTypechainTransaction(t);
	}

	async withdrawGetTransaction(
		cur: string,
		crucible: string,
		amount: string,
		to: string,): Promise<CustomTransactionCallRequest> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const currency = await this.crucibleCurrency(crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const r = await this.crucible(crucible);
		const t = await r.populateTransaction.withdraw(
			to,
			await this.helper.amountToMachine(currency, amount),
			{from: to});
		return this.helper.fromTypechainTransactionWithGas(network, t, to);
	}

	async deployGetTransaction(
		userAddress: string,
		baseCurrency: string,
		feeOnTransfer: string,
		feeOnWithdraw: string,
	): Promise<CustomTransactionCallRequest> {
		ValidationUtils.isTrue(!!userAddress, 'userAddress is required');
		ValidationUtils.isTrue(!!baseCurrency, 'baseCurrency is required');
		ValidationUtils.isTrue(!!feeOnTransfer, 'feeOnTransfer is required');
		ValidationUtils.isTrue(!!feeOnWithdraw, 'feeOnWithdraw is required');
		const [network, baseToken] = EthereumSmartContractHelper.parseCurrency(baseCurrency);
		const factory = await this.factory(network);
		const feeOnTransferX10000 = BigUtils.parseOrThrow(feeOnTransfer, 'feeOnTransfer')
			.mul(10000).toFixed(0);
		const feeOnWithdrawX10000 = BigUtils.parseOrThrow(feeOnWithdraw, 'feeOnWithdraw')
			.mul(10000).toFixed(0);
		ValidationUtils.isTrue(
			feeOnWithdrawX10000 != '0' && feeOnTransferX10000 != '0', 'at least one fee is required');
		const t = await factory.populateTransaction.createCrucible(
			baseToken,
			feeOnTransferX10000,
			feeOnWithdrawX10000,
			{ from: userAddress });
		return this.helper.fromTypechainTransactionWithGas(network, t, userAddress);
	}

	async stakeForGetTransaction(
		userAddress: string,
		currency: string,
		stake: string,
		amount: string
		): Promise<CustomTransactionCallRequest> {
		const [network, token] = EthereumSmartContractHelper.parseCurrency(currency);
		const router = await this.router(network);
		const amountInt = await this.helper.amountToMachine(currency, amount);
		const t = await router.populateTransaction.stakeFor(userAddress, token, stake,
			amountInt, {from: userAddress});
		return this.helper.fromTypechainTransactionWithGas(network, t, userAddress);
	}

	async remainingFromCap(crucible: string): Promise<CurrencyValue> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const r = await this.router(network);
		const cap = await r.openCaps(crucible);
		const currency = await this.crucibleCurrency(crucible);
		return {
			currency,
			value: await this.helper.amountToHuman(currency, cap.toString()),
		} as CurrencyValue;
	}

	public async getCrucibleInfo(crucible: string) {
		ValidationUtils.isTrue(!!crucible, 'address is required');
		return this.cache.getAsync(`CRUCIBLE-${crucible}`,
		async () => this.getCrucibleInfoCached(crucible));
	}

	public async getAllCruciblesFromDb(network: Network): Promise<CrucibleInfo[]> {
		const crucibles = network ?
			await this.crucibleModel.find({}).exec() :
			await this.crucibleModel.find({network}).exec();
		return crucibles.map(c => c.toJSON());
	}

	private async getCrucibleInfoCached(crucibleAddr: string)
	: Promise<CrucibleInfo> {
		const [network, contractAddress] = EthereumSmartContractHelper.parseCurrency(crucibleAddr);
		const crucible: CrucibleInfo =
			await this.crucibleModel.findOne({network, contractAddress}).exec();
		ValidationUtils.isTrue(!!crucible, 'Crucible not found');
		const allocs = await this.getAllAllocations(`${network}:${contractAddress}`);
		return {
			...crucible,
			network,
			contractAddress,
			openCap: crucible.openCap || '0',
			activeAllocationSum: allocs.map(a => new Big(a.allocation))
				.reduce((p, c) => p.add(c), new Big(0)).toFixed(),
			activeAllocationCount: allocs.length,
			priceUsdt: await this.pricing.usdPrice(crucible.currency),
			priceEth: await this.pricing.ethPrice(crucible.currency),
			basePriceUsdt: await this.pricing.usdPrice(crucible.baseCurrency),
			basePriceEth: await this.pricing.ethPrice(crucible.baseCurrency),
			leftFromCap: (await this.remainingFromCap(crucible.currency))?.value,
			currency: await this.crucibleCurrency(crucible.currency),
			feeOnTransferRate: await this.crucibleFeeOnTransferRate(crucible.currency),
			feeOnWithdrawRate: await this.crucibleFeeOnWithdrawRate(crucible.currency),
			totalSupply: await this.crucibleSupply(network, contractAddress),
			feeDescription: '',
		} as CrucibleInfo;
	}

	private async crucibleCurrency(crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		return this.cache.getAsync<string>(`CRUCIBLE-CUR-${crucible}`, async () => {
			const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
			const tok = await this.crucible(crucible);
			return `${network}:${await tok.baseToken()}`;
		});
	}

	private async crucibleSupply(network: string, crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		return this.cache.getAsync<string>(`CRUCIBLE-SUPPLY-${crucible}`, async () => {
			const tok = await this.crucible(crucible);
			const sup = (await tok.totalSupply()).toString();
			return this.helper.amountToHuman(`${network}:${crucible}`, sup);
		});
	}

	private async crucibleFeeOnTransferRate(crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		return this.cache.getAsync<string>(`CRUCIBLE-TRANSFER-${crucible}`, async () => {
			const tok = await this.crucible(crucible);
			const res = await tok.feeOnTransferX10000();
			return res.mul(10000).toString();
		});
	}

	private async crucibleFeeOnWithdrawRate(crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		return this.cache.getAsync<string>(`CRUCIBLE-WITHDRAW-${crucible}`, async () => {
			const tok = await this.crucible(crucible);
			const res = await tok.feeOnWithdrawX10000();
			return res.mul(10000).toString();
		});
	}

	async factory(network: string): Promise<CrucibleFactory> {
		const provider = await this.helper.ethersProvider(network);
		return CrucibleFactory__factory.connect(this.config.contracts[network].factory, provider);
	}

	async router(network: string): Promise<CrucibleRouter> {
		const provider = await this.helper.ethersProvider(network);
		return CrucibleRouter__factory.connect(this.config.contracts[network].router, provider);
	}

	async crucible(crucible: string): Promise<CrucibleToken> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const provider = await this.helper.ethersProvider(network);
		return CrucibleToken__factory.connect(crucible, provider);
	}
}