import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { NetworkedConfig, StakeInfo, StakeRewardInfo, 
	StakeType, stakeTypeToInt, UserStakeInfo, StakingContracts, Utils, UserStakeRewardInfo } from "types";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { RouterV2Staking__factory,
	StakeOpen, StakeOpen__factory, StakeTimed__factory } from "../resources/typechain";

const TEN_MINUTES_MILLI = 10 * 1000 * 60;

export class StakingService implements Injectable {
	private cache = new LocalCache();
	constructor (
		private helper: EthereumSmartContractHelper,
		private contracts: NetworkedConfig<StakingContracts>,
	) {}

	__name__() { return 'StakingService'; }

	// TODO: Implement allocation...
	async stakeGetTransaction(userAddress: string, stakeType: StakeType,
			stakeId: string, currency: string, amount: string)
	: Promise<CustomTransactionCallRequest> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
		const router = this.router(network);
		const amountBig = await this.helper.amountToMachine(currency, amount);
		const tx = await router.populateTransaction.stake(userAddress, stakeTypeToInt(stakeType), stakeId, amountBig);
		return this.helper.fromTypechainTransactionWithGas(network, tx, userAddress);
	}

	async takeRewardsGetTransaction(userAddress: string, network: string,
			stakeType: StakeType, stakeId: string) {
		const stake = this.stake(network, stakeType) as StakeOpen;
		// const rewCurs = (await this.rewardCurrencies(network, stakeType, stakeId))
		// 	.map(EthereumSmartContractHelper.parseCurrency).map(p => p[1]);
		const tx = await stake.populateTransaction.withdrawRewards(userAddress, stakeId);
		return this.helper.fromTypechainTransactionWithGas(network, tx, userAddress);
	}

	async withdrawGetTransaction(userAddress: string, stakeType: StakeType, stakeId: string, currency: string, amount: string) {
		const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
		const amountBig = await this.helper.amountToMachine(currency, amount);
		const stake = this.stake(network, stakeType) as StakeOpen;
		const tx = await stake.populateTransaction.withdraw(userAddress, stakeId, amountBig);
		return this.helper.fromTypechainTransactionWithGas(network, tx, userAddress);
	}

	async stakeOf(userAddress: string, network: string, stakeType: StakeType, stakeId: string) {
		const base = await this.baseCurrency(network, stakeType, stakeId);
		const st = await this.stake(network, stakeType).stakeOf(stakeId, userAddress);
		return this.helper.amountToHuman(base, st.toString());
	}

	async rewardOf(userAddress: string, network: string, stakeType: StakeType, stakeId: string) {
		const base = await this.baseCurrency(network, stakeType, stakeId);
		const st = await this.stake(network, stakeType).stakeOf(stakeId, userAddress);
		return this.helper.amountToHuman(base, st.toString());
	}

	async userStakeInfo(userAddress: string, network: string, sType: StakeType, stakeId: string,
		): Promise<UserStakeInfo> {
		const stake = await this.stake(network, sType) as StakeOpen;
		const rewards: UserStakeRewardInfo[] = [];
		const rewardToks = await this.rewardCurrencies(network, sType, stakeId);
		for(const rew of rewardToks) {
			const rewardCurrency = Utils.toCurrency(network, rew);
			rewards.push({
				rewardCurrency,
				rewardSymbol: await this.helper.symbol(rew),
				rewardAmount: (await stake.rewardOf(stakeId, userAddress,
					await this.rewardTokens(network, sType, stakeId))).toString(),
			} as UserStakeRewardInfo)
		}
		const nextWithdrawalTime = (await stake.withdrawTimeOf(stakeId, userAddress)).toNumber();
		return {
			network,
			nextWithdrawalTime,
			stake: await this.stakeOf(userAddress, network, sType, stakeId),
			stakeId,
			stakeType: sType,
			userAddress,
			rewards,
		} as UserStakeInfo;
	}

	async stakeInfo(network: string, sType: StakeType, stakeId: string): Promise<StakeInfo> {
		return this.cache.getAsync(`STAKE_INFO-${network}-${sType}-${stakeId}`, async () => {
			const stake = await this.stake(network, sType);
			const baseToken = await stake.baseToken(stakeId);
			const baseCurrency = Utils.toCurrency(network, baseToken);
			const baseSymbol = await this.helper.symbol(baseCurrency);
			const stakedBalance = await this.helper.amountToHuman(
				baseCurrency, (await stake.stakedBalance(stakeId)).toString());
			const rewards: StakeRewardInfo[] = [];
			const rewardTokens = await stake.allowedRewardTokenList(stakeId);
			for(const rew of rewardTokens) {
				const rewardsTotal = '0'; // await stake.rewardsTotal(stakeId, rew);
				const rewardCurrency = Utils.toCurrency(network, rew);
				const rewardSymbol = await this.helper.symbol(rewardCurrency);
				rewards.push({
					rewardCurrency,
					rewardsTotal,
					rewardSymbol,
				} as StakeRewardInfo);
			}

			return {
				baseCurrency,
				baseSymbol,
				lockPeriod: 0, //(await stake.lockSeconds(stakeId))
				name: await stake.name(stakeId),
				network,
				stakeId,
				stakedBalance,
				stakeType: sType,
				rewards,
			} as StakeInfo;
		}, TEN_MINUTES_MILLI);
	}

	private async rewardCurrencies(network: string, sType: StakeType, stakeId: string): Promise<string[]> {
		const rewToks = await this.rewardTokens(network, sType, stakeId);
		return (rewToks || []).map(t => Utils.toCurrency(network, t));
	}

	private async rewardTokens(network: string, sType: StakeType, stakeId: string) {
		return this.cache.getAsync(`REWARD_TOKENS-${network}-${sType}-${stakeId}`, async () => {
			return await this.stake(network, sType).allowedRewardTokenList(stakeId);
		});
	}

	private async baseCurrency(network: string, sType: StakeType, stakeId: string) {
		return this.cache.getAsync(`BASE-${network}-${sType}-${stakeId}`, async () => {
			const stake = (await this.stake(network, sType)).baseToken(stakeId);
			return `${network}:${(await stake).toLowerCase()}`;
		});
	}

	private stake(network: string, sType: StakeType) {
		ValidationUtils.isTrue(sType === 'openEnded' || sType === 'timed', 'Invalid stake type ' + sType);
		const provider = this.helper.ethersProvider(network);
		const address = sType === 'openEnded' ? this.contracts[network]?.openEnded : this.contracts[network]?.timed;
		ValidationUtils.isTrue(!!address, `Not staking configured for ${network} - ${sType}`);
		return sType === 'openEnded' ? StakeOpen__factory.connect(address, provider) : StakeTimed__factory.connect(address, provider);
	}

	private router(network: string) {
		const routerAddress =this.contracts[network]?.router; 
		ValidationUtils.isTrue(!!routerAddress, `Not staking router configured for ${network}`);
		const provider = this.helper.ethersProvider(network);
		return RouterV2Staking__factory.connect(routerAddress, provider);
	}
}