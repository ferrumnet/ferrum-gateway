import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, Network, ValidationUtils, Networks, HexString } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import { CrucibleConfig, CrucibleAllocationCsvModel, CrucibleInfoModel } from "./CrucibleTypes";
import { CrucibleToken, CrucibleToken__factory, CrucibleRouter__factory, CrucibleFactory, CrucibleFactory__factory,StakeOpen__factory,StakeOpen } from "./resources/typechain";
import { AllocationSignature, BigUtils, CrucibleInfo,
	CurrencyValue, DEFAULT_SWAP_PROTOCOLS,
	MultiSigActor, StoredAllocationCsv, UserContractAllocation,
	UserCrucibleInfo, CrucibleAllocationMethods, SwapProtocol,
 } from 'types';
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { ChainUtils } from "ferrum-chain-clients";
import { produceSignature } from 'web3-tools/dist/Eip712Utils';
import { UniswapPricingService } from 'common-backend/dist/uniswapv2/UniswapPricingService';
import { CrucibleRouter } from "./resources/typechain/CrucibleRouter";
import { BasicAllocation } from "common-backend/dist/contracts/BasicAllocation";
import { sha256 } from 'ferrum-crypto';
import { MultiSigUtils } from 'web3-tools/dist/MultiSigUtils';
import { UniswapV2Client } from "common-backend/dist/uniswapv2/UniswapV2Client";
import {OneInchClient} from 'common-backend/dist/oneInchClient/OneInchClient';
import { OneInchPricingService } from "common-backend/dist/oneinchPricingSvc/OneInchPricingService";

export const CACHE_TIMEOUT = 120 * 1000; // 2 mins
const AllocationMethods = CrucibleAllocationMethods;

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
		private uniswap: UniswapV2Client,
		private config: CrucibleConfig,
		private basicAllocation: BasicAllocation,
		private signingActor: MultiSigActor,
		private sk: HexString,
		private oneInchPricing: OneInchPricingService
	) {
		super();
	}

	__name__() { return 'CrucibeService'; }

	initModels(con: Connection): void {
		// Store allocations
		this.crucibleAllocationsCsvModel = CrucibleAllocationCsvModel(con);
		this.crucibleModel = CrucibleInfoModel(con);
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

	async getConfiguredRouters(){
		return this.config.contracts || [];
	}

	async getConfiguredStakings(){
		return this.config.stakingContracts || [];
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
		const key = `ALLOC-${crucible}`;
		return await this.cache.getAsync(
			key, async () => {
				console.log('ABOUT TO GET CRUCI ', crucible)
				const allocDefinition = await this.crucibleAllocationsCsvModel.findOne({crucible}).exec();
				console.log('GOT CRUCI ', allocDefinition)
				const csv = allocDefinition?.csv;
				const parsed = csv ? this.basicAllocation.parse(csv) : [];
				console.log('GOT CRUCI - FIN ')
				return parsed;
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
		const currency = await this.baseCurrency(crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const amountInt = await this.helper.amountToMachine(currency, amount);
		const r = await this.router(network);

		const allocation = await this.signedAllocation(from, crucible, AllocationMethods.DEPOSIT, amountInt);
		ValidationUtils.isTrue(BigUtils.safeParse(amount).lte(BigUtils.parseOrThrow(allocation.allocation, 'allocation')),
			`Amount ${amount} larger than allocation "${allocation.allocation}"`);
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
		allocation.signature!.salt = `0x${await sha256(Buffer.from(`${from.toLowerCase()}-${allocation.expirySeconds}-${allocation.allocation}`, 'utf-8').toString('hex'))}`;
		allocation.signature!.signatures = allocation.signature!.signatures || [];

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
		console.log('ABOUT TO SIGN ', method, {allocation});
		return allocation;
	}

	async depositPublicGetTransaction(
		cur: string,
		crucible: string,
		amount: string,
		from: string,
	): Promise<CustomTransactionCallRequest> {
		const [network, contractAddress] = EthereumSmartContractHelper.parseCurrency(crucible);
		const currency = await this.baseCurrency(crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const r = await this.router(network);
		const t = await r.populateTransaction.depositOpen(
			from,
			contractAddress,
			await this.helper.amountToMachine(currency, amount),
			{from});
		return this.helper.fromTypechainTransactionWithGas(network, t, from);
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
		const expectedBaseCur = await this.baseCurrency(crucible);
		ValidationUtils.isTrue(baseCur === expectedBaseCur, 'Unexpected base currency: ' + baseCur);
		const ammRouter = DEFAULT_SWAP_PROTOCOLS[network][0];
		ValidationUtils.isTrue(!!ammRouter, `No default AMM router is configured for ${network}`);
		const staking = this.config.contracts[network].staking; // TODO: from config...
		const baseAmountInt = await this.helper.amountToMachine(baseCur, baseAmount); // TODO: ETH
		const targetAmountInt = await this.helper.amountToMachine(targetCur, targetAmount);
		const r = await this.router(network);

		const allocation = await this.signedAllocation(userAddress, crucible, AllocationMethods.DEPOSIT_ADD_LIQUIDITY_STAKE, baseAmountInt);
		const t = targetCur === Networks.for(network).baseCurrency ?
			await r.populateTransaction.depositAddLiquidityStakeETH(
				userAddress,
				crucible,
				baseAmountInt,
				ammRouter,
				staking,
				'0x',
				deadline,
				this.signingActor.groupId,
				MultiSigUtils.toBytes(allocation.signature),
				'0x'
			):
			await r.populateTransaction.depositAddLiquidityStake(
				userAddress,
				crucible,
				targetToken,
				baseAmountInt,
				targetAmountInt,
				ammRouter,
				staking,
				'0x',
				deadline,
				this.signingActor.groupId,
				MultiSigUtils.toBytes(allocation.signature),
				'0x')
		return EthereumSmartContractHelper.fromTypechainTransaction(t);
	}

	async withdrawGetTransaction(
		cur: string,
		crucible: string,
		amount: string,
		to: string,): Promise<CustomTransactionCallRequest> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
		const currency = await this.baseCurrency(crucible);
		ValidationUtils.isTrue(currency == cur, "Invalid currency");
		const r = await this.crucible(crucible);
		const t = await r.populateTransaction.withdraw(
			to,
			await this.helper.amountToMachine(currency, amount),
			{from: to});
		return this.helper.fromTypechainTransactionWithGas(network, t, to);
	}

	async unstakeGetTransaction(
		crucible: string,
		staking:string,
		amount: string,
		userAddress:string
	){
		const [network,crucibleAddress] = EthereumSmartContractHelper.parseCurrency(crucible);
		const stakingClient = await this.staking(staking,network);
		const t = await stakingClient.populateTransaction.withdraw(
			userAddress,crucibleAddress,
			await this.helper.amountToMachine(crucible, amount),
			{from: userAddress}
		)
		return this.helper.fromTypechainTransactionWithGas(network, t, userAddress)
	}

	async withdrawRewardsGetTransaction(
		crucible: string,
		staking:string,
		userAddress:string
	){
		const [network,crucibleAddress] = EthereumSmartContractHelper.parseCurrency(crucible);
		const stakingClient = await this.staking(staking,network);
		const t = await stakingClient.populateTransaction.withdrawRewards(
			userAddress,
			crucibleAddress,
			{from: userAddress}
		)
		return this.helper.fromTypechainTransactionWithGas(network, t, userAddress)
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

	async deployNamedGetTransaction(
		userAddress: string,
		baseCurrency: string,
		feeOnTransfer: string,
		feeOnWithdraw: string,
		name: string,
		symbol:string
	): Promise<CustomTransactionCallRequest> {
		ValidationUtils.isTrue(!!userAddress, 'userAddress is required');
		ValidationUtils.isTrue(!!baseCurrency, 'baseCurrency is required');
		ValidationUtils.isTrue(!!feeOnTransfer, 'feeOnTransfer is required');
		ValidationUtils.isTrue(!!feeOnWithdraw, 'feeOnWithdraw is required');
		ValidationUtils.isTrue(!!name, 'name is required');
		ValidationUtils.isTrue(!!symbol, 'symbol is required');
		const [network, baseToken] = EthereumSmartContractHelper.parseCurrency(baseCurrency);
		const factory = await this.factory(network);
		const feeOnTransferX10000 = BigUtils.parseOrThrow(feeOnTransfer, 'feeOnTransfer')
			.mul(10000).toFixed(0);
		const feeOnWithdrawX10000 = BigUtils.parseOrThrow(feeOnWithdraw, 'feeOnWithdraw')
			.mul(10000).toFixed(0);
		ValidationUtils.isTrue(
			feeOnWithdrawX10000 != '0' && feeOnTransferX10000 != '0', 'at least one fee is required');
		const t = await factory.populateTransaction.createCrucibleDirect(
			baseToken,
			name,
			symbol,
			feeOnTransferX10000,
			feeOnWithdrawX10000,
			{ from: userAddress }
			);
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
		const t = await router.populateTransaction.stakeFor(
			userAddress, token, stake,
			amountInt, {from: userAddress});
		return this.helper.fromTypechainTransactionWithGas(network, t, userAddress);
	}

	async stakeAndMint(
		cur: string,
		crucible: string,
		amount: string,
		stake: string,
		from: string,
		): Promise<CustomTransactionCallRequest> {
			const [network, conAddress] = EthereumSmartContractHelper.parseCurrency(crucible);
			const currency = await this.baseCurrency(crucible);
			ValidationUtils.isTrue(currency == cur, "Invalid currency");
			const amountInt = await this.helper.amountToMachine(currency, amount);
			const factory = await this.router(network);
			//const allocation = await this.signedAllocation(from, crucible, AllocationMethods.DEPOSIT, amountInt);
			// ValidationUtils.isTrue(BigUtils.safeParse(amount).lte(BigUtils.parseOrThrow(allocation.allocation, 'allocation')),
			// 	`Amount ${amount} larger than allocation "${allocation.allocation}"`);
			const t = await factory.populateTransaction.depositAndStake(
				from,
				conAddress,
				amountInt,
				stake,
				'0x' + '00'.repeat(32),
				0,
				0,
				'0x',
				{from}
			);
			return this.helper.fromTypechainTransactionWithGas(network, t, from);
		}


	async remainingFromCap(crucible: string): Promise<CurrencyValue> {
		const [network, address] = EthereumSmartContractHelper.parseCurrency(crucible);
		const r = await this.router(network);
		const cap = await r.openCaps(address);
		const currency = await this.baseCurrency(crucible);
		return {
			currency,
			value: await this.helper.amountToHuman(currency, cap.toString()),
		} as CurrencyValue;
	}

	public async getCrucibleInfo(crucible: string) {
		ValidationUtils.isTrue(!!crucible, 'address is required');
		return this.cache.getAsync(`CRUCIBLE-${crucible}`,
			async () => this.getCrucibleInfoCached(crucible),
		CACHE_TIMEOUT);
	}

	public async getUserCrucibleInfo(crucible: string, userAddress: string):
		Promise<UserCrucibleInfo> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		ValidationUtils.isTrue(!!userAddress, '"userAddress" must be provided');
		const info = await this.getCrucibleInfo(crucible);
		console.log('CRUCIBLE PAIR CUR IS ', info.uniswapPairCurrency)
		const baseCurrency = await this.baseCurrency(crucible);
		const cru = await this.crucible(crucible);
		const base = await this.crucible(baseCurrency);
		const balanceOfInt = (await cru.balanceOf(userAddress)).toString();
		const basebalanceOfInt = (await base.balanceOf(userAddress)).toString();
		const allocations: UserContractAllocation[] = [];
		const al1 = await this.getAllocation(crucible, userAddress, AllocationMethods.DEPOSIT);
		const al2 = await this.getAllocation(crucible, userAddress, AllocationMethods.DEPOSIT_ADD_LIQUIDITY_STAKE);
		if (!!al1?.allocation) { allocations.push(al1); }
		if (!!al2?.allocation) { allocations.push(al2); }
		const [network, contractAddress] = EthereumSmartContractHelper.parseCurrency(crucible);
		const stakingConfigured = await this.getConfiguredStakings()
		const stakes = []
		if(stakingConfigured[network]){
			for(let stakingContract of stakingConfigured[network]){
				const stakingType = await this.stakingConfigured(stakingContract.address,network,contractAddress)
				if(Number(stakingType[0]||'0') > 0){
					const totalStake = await this.stakingTotal(stakingContract.address,network,contractAddress)
					const stakeOf = await this.stakingOf(stakingContract.address,network,contractAddress,userAddress)
					const rewardOf= await this.stakingRewardOf(stakingContract.address,network,contractAddress,userAddress,contractAddress)
					stakes.push({stakingType,totalStake,stakeOf,rewardOf,address: stakingContract.address})
				}
			}
			
		}
		const userInfo = {
			currency: crucible,
			baseCurrency,
			balance: await this.helper.amountToHuman(crucible, balanceOfInt),
			baseBalance: await this.helper.amountToHuman(baseCurrency, basebalanceOfInt),
			symbol: await this.helper.symbol(crucible),
			baseSymbol: await this.helper.symbol(baseCurrency),
			uniswapPairBalance: '',
			allocations,
			stakes,
		} as UserCrucibleInfo;
		if (info.uniswapPairCurrency) {
			const pair = await this.crucible(info.uniswapPairCurrency);
			const uniswapPairBalanceOfInt = (await pair.balanceOf(userAddress)).toString();
			userInfo.uniswapPairBalance = await this.helper.amountToHuman(info.uniswapPairCurrency, uniswapPairBalanceOfInt);
		}
		return userInfo;
	}

	public async getAllCruciblesFromDb(network: Network): Promise<CrucibleInfo[]> {
		const crucibles = network ?
			await this.crucibleModel.find({}).exec() :
			await this.crucibleModel.find({network}).exec();
		return crucibles.map(c => c.toJSON());
	}

	public async getPrice(crucible:string,baseCurrency:string){
		
		return this.cache.getAsync(`CRUCIBLE-PRICING-${crucible}-${baseCurrency}`,
			async () => {
				const crPricing = await this.oneInchPricing.usdPrice(crucible)
				const basePricing = await this.oneInchPricing.usdPrice(baseCurrency)
				console.log(crPricing,basePricing)
				if(crPricing && basePricing){
					return {
						cruciblePrice: {
							cruciblePrice: crPricing.fromTokenAmount,
							usdtPrice: crPricing.toTokenAmount
						},
						basePrice: {
							basePrice: basePricing.fromTokenAmount,
							usdtPrice: basePricing.toTokenAmount
						}
					}
				}
				return ''
			},
		CACHE_TIMEOUT);
	}

	private async crucibleFromNetwork(crucible: string): Promise<CrucibleInfo> {
		const [network, ] = EthereumSmartContractHelper.parseCurrency(crucible);
		const baseCurrency = await this.baseCurrency(crucible);
		const name = (await (await this.crucible(crucible)).name()).toString();
		const pairAddress = await this.uniswap.pairAddress(crucible, Networks.for(network).baseCurrency);
		console.log('PAIR ADDRESS ISO', pairAddress)

		return {
			currency: crucible,
			baseCurrency,
			symbol: await this.helper.symbol(crucible),
			baseSymbol: await this.helper.symbol(baseCurrency),
			uniswapPairAddress: pairAddress ? EthereumSmartContractHelper.toCurrency(network, pairAddress.toLowerCase()) : undefined,
			name,
		} as any as CrucibleInfo;
	}

	private async getCrucibleInfoCached(crucibleCur: string)
	: Promise<CrucibleInfo> {
		this.verifyInit();
		const [network, contractAddress] = EthereumSmartContractHelper.parseCurrency(crucibleCur);
		let crucible: CrucibleInfo =
			await this.crucibleModel.findOne({network, contractAddress}).exec();
		if (!crucible) {
			crucible = await this.crucibleFromNetwork(crucibleCur);
			ValidationUtils.isTrue(!!crucible, 'Crucible not found');
		}
		const allocs = await this.getAllAllocations(`${network}:${contractAddress}`);
		// try one inch implementation to test
		const priceUsdt = '0' //await this.pricing.usdPrice(crucible.currency);
		const priceEth = '0' //await this.pricing.ethPrice(crucible.currency);
		const basePriceUsdt = '0' // await this.pricing.usdPrice(crucible.baseCurrency);
		const basePriceEth = '0' // await this.pricing.ethPrice(crucible.baseCurrency);
		const leftFromCap = (await this.remainingFromCap(crucible.currency))?.value;
		const feeOnTransferRate = await this.crucibleFeeOnTransferRate(crucible.currency);
		const feeOnWithdrawRate = await this.crucibleFeeOnWithdrawRate(crucible.currency);
		const totalSupply = await this.crucibleSupply(crucible.currency);
		const r = await this.router(network);
		const openCapInt = (await r.openCaps(contractAddress)).toString();
		const stakingConfigured = await this.getConfiguredStakings()
		const stakes = []
		if(stakingConfigured[network]){
			for(let stakingContract of stakingConfigured[network]){
				const stakingType = await this.stakingConfigured(stakingContract.address,network,contractAddress)
				if(Number(stakingType[0]||'0') > 0){
					const totalStake = await this.stakingTotal(stakingContract.address,network,contractAddress)
					const totalPoolReward =  await this.totalPoolReward(stakingContract.address,network,contractAddress,contractAddress)
					stakes.push({...stakingContract,totalStake,stakingType,totalPoolReward})
				}
			}
		}
		return {
			...crucible,
			network,
			contractAddress,
			openCap: await this.helper.amountToHuman(crucibleCur, openCapInt),
			activeAllocationSum: allocs.map(a => BigUtils.safeParse(a.allocation))
				.reduce((p, c) => p.add(c), BigUtils.safeParse('0')).toFixed(),
			activeAllocationCount: allocs.length,
			priceUsdt,
			priceEth,
			basePriceUsdt,
			basePriceEth,
			leftFromCap,
			feeOnTransferRate,
			feeOnWithdrawRate,
			totalSupply,
			feeDescription: '',
			staking:stakes
		} as CrucibleInfo;
	}


	private async stakingConfigured(contract:string,network:string,id:string): Promise<any> {
		ValidationUtils.isTrue(!!contract, '"staking contract" must be provided');
		return this.cache.getAsync<any>(`CRUCIBLE-STAKING-stakingConfigured-${contract}-${id}`, async () => {
			const staking = await this.staking(contract,network);
			const type = await staking.stakings(id)
			return type
		});
	}

	private async stakingTotal(contract:string,network:string,id:string): Promise<string> {
		ValidationUtils.isTrue(!!contract, '"staking contract" must be provided');
		const staking = await this.staking(contract,network);
		const stakedTotal = await staking.stakedBalance(id)
		return this.helper.amountToHuman(`${network}:${id}`,stakedTotal?.toString())
	}

	private async stakingOf(contract:string,network:string,id:string,userAddress:string): Promise<string> {
		ValidationUtils.isTrue(!!contract, '"staking contract" must be provided');
		const staking = await this.staking(contract,network);
		const stakeValue = await staking.stakeOf(id,userAddress)
		return this.helper.amountToHuman(`${network}:${id}`,stakeValue?.toString())
	}

	private async stakingRewardOf(contract:string,network:string,id:string,userAddress:string,crucible:string): Promise<string> {
		ValidationUtils.isTrue(!!contract, '"staking contract" must be provided');
		const staking = await this.staking(contract,network);
		const stakeValue = await staking.rewardOf(id,userAddress,[crucible])
		return this.helper.amountToHuman(`${network}:${crucible}`,stakeValue?.toString())
	}

	private async totalPoolReward(contract:string,network:string,id:string,crucible:string): Promise<string> {
		ValidationUtils.isTrue(!!contract, '"staking contract" must be provided');
		const staking = await this.staking(contract,network);
		const stakeValue = await staking.rewardsTotal(id,crucible)
		return this.helper.amountToHuman(`${network}:${crucible}`,stakeValue.toString())
	}

	private async baseCurrency(crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		return this.cache.getAsync<string>(`CRUCIBLE-CUR-${crucible}`, async () => {
			const [network,] = EthereumSmartContractHelper.parseCurrency(crucible);
			const tok = await this.crucible(crucible);
			return EthereumSmartContractHelper.toCurrency(network,
				ChainUtils.canonicalAddress(network as any, await tok.baseToken()));
		});
	}

	private async crucibleSupply(crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		const [network, address] = EthereumSmartContractHelper.parseCurrency(crucible);
		return this.cache.getAsync<string>(`CRUCIBLE-SUPPLY-${network}-${address}`, async () => {
			const tok = await this.crucible(crucible);
			const sup = (await tok.totalSupply()).toString();
			return this.helper.amountToHuman(crucible, sup);
		},10000);
	}

	private async crucibleFeeOnTransferRate(crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		return this.cache.getAsync<string>(`CRUCIBLE-TRANSFER-${crucible}`, async () => {
			const tok = await this.crucible(crucible);
			const res = (await tok.feeOnTransferX10000()).toString();
			return BigUtils.parseOrThrow(res, 'feeOnTransferRate').div(10000).toString();
		});
	}

	private async crucibleFeeOnWithdrawRate(crucible: string): Promise<string> {
		ValidationUtils.isTrue(!!crucible, '"crucible" must be provided');
		return this.cache.getAsync<string>(`CRUCIBLE-WITHDRAW-${crucible}`, async () => {
			const tok = await this.crucible(crucible);
			const res = (await tok.feeOnWithdrawX10000()).toString();
			return BigUtils.parseOrThrow(res, 'feeOnTransferRate').div(10000).toString();
		});
	}

	async factory(network: string): Promise<CrucibleFactory> {
		const provider = await this.helper.ethersProvider(network);
		console.log('GETTING FACTORY FOR CONFIG', this.config);
		return CrucibleFactory__factory.connect(this.config.contracts[network].factory, provider);
	}

	async router(network: string): Promise<CrucibleRouter> {
		const provider = await this.helper.ethersProvider(network);
		return CrucibleRouter__factory.connect(this.config.contracts[network].router, provider);
	}

	async crucible(crucible: string): Promise<CrucibleToken> {
		const [network, address] = EthereumSmartContractHelper.parseCurrency(crucible);
		const provider = await this.helper.ethersProvider(network);
		return CrucibleToken__factory.connect(address, provider);
	}

	async staking(stakingContract: string,network:string): Promise<StakeOpen> {
		const provider = await this.helper.ethersProvider(network);
		return StakeOpen__factory.connect(stakingContract, provider);
	}
}