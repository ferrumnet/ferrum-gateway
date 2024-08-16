import { Injectable, ValidationUtils, NetworkedConfig, LocalCache } from 'ferrum-plumbing';
import { StandaloneClient } from 'common-containers/dist/clients/StandaloneClient';
import { StandaloneErc20 } from 'common-containers/dist/clients/StandaloneErc20';
import { QuantumPortalGateway } from '../../../typechain-types/QuantumPortalGateway';
import { QuantumPortalGateway__factory } from '../../../typechain-types/factories/QuantumPortalGateway__factory';
import { QuantumPortalLedgerMgrImpl } from '../../../typechain-types/QuantumPortalLedgerMgrImpl';
import { QuantumPortalLedgerMgrImpl__factory } from '../../../typechain-types/factories/QuantumPortalLedgerMgrImpl__factory';
import { QuantumPortalStake } from '../../../typechain-types/QuantumPortalStake';
import { QuantumPortalStake__factory } from '../../../typechain-types/factories/QuantumPortalStake__factory';
import { Utils } from 'types';
import { QpContractConfig } from '../../../common/Consts';
import { QuantumPortalMinerMgr } from '../../../typechain-types/QuantumPortalMinerMgr';
import { QuantumPortalMinerMgr__factory } from '../../../typechain-types/factories/QuantumPortalMinerMgr__factory';
import { OperatorRelation } from '../../../typechain-types/OperatorRelation';
import { QuantumPortalStakeWithDelegate } from '../../../typechain-types/QuantumPortalStakeWithDelegate';
import { QuantumPortalStakeWithDelegate__factory } from '../../../typechain-types/factories/QuantumPortalStakeWithDelegate__factory';
import { QuantumPortalLedgerMgr } from '../../../typechain-types';

export interface QpMinerStakeInfo {
    qpGatewayContract: string;
    qpLedgerMgrContract: string;
    qpMinerMgrContract: string;
    qpMinerStakingConract: string;
    qpMinStakeRequiredDisplay: string;
    stakeId: string;
    baseToken: string;
    lockTime: number;
    totalRewardsDisplay: string,
    totalStakesDisplay: string,
}

export interface QpMinerStakeWithdrawItemQueue {
    amount: string;
    opensAt: number;
}

export interface QpMinerUserStakeInfo {
    address: string;
    delegated: string;
    stakeDisplay: string;
    rewardDisplay: string;
    withdrawQueue: QpMinerStakeWithdrawItemQueue[];
}

export interface QpMinerMinerInfo {
    address: string;
    operator: string;
    totalStaked: string;
    totalStakedHuman: string;
    active: boolean;
    minerIndex: string;
}

export class QpMinerClient implements Injectable {
    private qpStakeCache = new LocalCache();
    private contractAddresses = new LocalCache();
    constructor(
        private api: StandaloneClient,
        private erc: StandaloneErc20,
        private config: QpContractConfig,
    ) {}

    __name__(): string { return 'QpMinerClient'; }

    async getMinerStake(): Promise<QpMinerStakeInfo> {
        const stake = await this.stakeContract();
        const gw = this.qpGateway();
        const ledger = await this.qpLedgerMgr();
        const network = this.network();
        const id = await stake.STAKE_ID();
        const baseToken = await stake.baseToken(id);
        const rewardToken = baseToken; // This special case (Miner Staking) reward is always the same as base
        const currency = Utils.toCurrency(network, baseToken)!;
        const rewardsTotal = (await stake.rewardsTotal(id, rewardToken)).toString();
        const totalStakes = (await stake.stakedBalance(id)).toString();

        const minerMinStake = (await ledger.minerMinimumStake()).toString();
        const qpMinStakeRequiredDisplay = await this.erc.machineToHuman(currency, minerMinStake);
        return {
            qpGatewayContract: gw.address,
            qpLedgerMgrContract: await this.contractAddresses.get(network)?.ledgerMgr,
            qpMinerMgrContract: await this.contractAddresses.get(network)?.minetMgr,
            qpMinerStakingConract: stake.address,
            qpMinStakeRequiredDisplay,
            stakeId: id,
            totalRewardsDisplay: await this.erc.machineToHuman(currency, rewardsTotal),
            totalStakesDisplay: await this.erc.machineToHuman(currency, totalStakes),
            baseToken,
            lockTime: await (await stake.lockSeconds(id)).toNumber(),
        } as QpMinerStakeInfo;
    }

    async getUserStake(): Promise<QpMinerUserStakeInfo> {
        const stake = await this.stakeContract();
        const address = this.api.getAddress();
        const id = await stake.STAKE_ID();
        const rewardToken = await stake.baseToken(id); // This special case (Miner Staking) reward is always the same as base
        const currency = Utils.toCurrency(this.network(), rewardToken)!;
        const withdrawQueue: QpMinerStakeWithdrawItemQueue[] = [];
        const wqIdx = await stake.withdrawItemsQueueParam(address);
        for (let i=wqIdx[0].toNumber(); i<wqIdx[1].toNumber(); i++) {
            const wqItem = await stake.withdrawItemsQueue(address, i);
            withdrawQueue.push({
                amount: await this.erc.machineToHuman(currency, wqItem.amount.toString()),
                opensAt: wqItem.opensAt.toNumber(),
            } as QpMinerStakeWithdrawItemQueue);
        }
        const delegated = await stake.delegations(address);
        return {
            address,
            delegated,
            rewardDisplay: await this.erc.machineToHuman(currency, (await stake.rewardOf(id, address, [rewardToken])).toString()),
            stakeDisplay: await this.erc.machineToHuman(currency, (await stake.stakeOf(id, address)).toString()),
            withdrawQueue,
        } as QpMinerUserStakeInfo;
    }

    async getMinerInfo(): Promise<QpMinerMinerInfo> {
        const stake = await this.stakeContract();
        const address = this.api.getAddress();
        const id = await stake.STAKE_ID();
        const token = await stake.baseToken(id); // This special case (Miner Staking) reward is always the same as base
        const totalStakes = await stake.delegateStake(address);
        const currency = Utils.toCurrency(this.network(), token)!;
        const operator = await (stake as any as OperatorRelation).nodeOperator(address);
        const minerMgr = await this.minerMgrContract();
        console.log('Miner mgr is: ', minerMgr.address);
        const minerIdx = await minerMgr.minerIdxsPlusOne(operator);
        return {
            address,
            totalStaked: totalStakes.toString(),
            totalStakedHuman:  await this.erc.machineToHuman(currency, totalStakes.toString()),
            active: minerIdx.gt(0),
            minerIndex: minerIdx.toString(),
            operator,
        }
    }

    async assignOperator(operator: string): Promise<string> {
        const stake = await this.stakeContract();
        const tx = await (stake as any as OperatorRelation).populateTransaction.assignOperator(operator, { from: this.address() });
        return await this.api.runPopulatedTransaction(tx);
    }

    async registerMiner(): Promise<string> {
        const gw = this.qpGateway();
        const mgrAddr = await gw.quantumPortalLedgerMgr();
        const mgr = QuantumPortalLedgerMgrImpl__factory.connect(mgrAddr, this.api.ethersProvider(this.network()));
        const tx = await mgr.populateTransaction.registerMiner({ from: this.address() });
        return await this.api.runPopulatedTransaction(tx);
    }

    async stakeToDelegate(amount: string, delegate?: string): Promise<string> {
        const gw = this.qpGateway();
        const stake = await this.stakeContract();
        const id = await stake.STAKE_ID();
        const token = await stake.baseToken(id);
        const currency = Utils.toCurrency(this.network(), token)!;
        const amountMachine = await this.erc.humanToMachine(currency, amount);
        if (!delegate) {
            console.log('No delegate provided. Getting one... for', this.address())
            delegate = await stake.delegations(this.address());
            console.log('Got', {delegate});
            ValidationUtils.isTrue(Utils.isNonzeroAddress(delegate), 'No delegate!');
        }
        const tx = await gw.populateTransaction.stakeToDelegate(amountMachine, delegate!, { from: this.address() }); //,
            //value: this.network() == 'FERRUM_MAINNET' || this.network() == 'FERRUM_TESTNET' ? amountMachine : '0' });
        return await this.api.runPopulatedTransaction(tx);
    }

    async withdraw(amount: string): Promise<string> {
        const stake = await this.stakeContract();
        const id = await stake.STAKE_ID();
        const token = await stake.baseToken(id);
        const currency = Utils.toCurrency(this.network(), token)!;
        const amountMachine = await this.erc.humanToMachine(currency, amount);
        const tx = await stake.populateTransaction.withdraw(this.address(), id, amountMachine, { from: this.address() });
        return await this.api.runPopulatedTransaction(tx);
    }

    async releaseWithdrawItems(): Promise<string> {
        const stake = await this.stakeContract();
        const id = await stake.STAKE_ID();
        const token = await stake.baseToken(id);
        const tx = await stake.populateTransaction.releaseWithdrawItems(this.address(), { from: this.address() });
        console.log('USING TX, ', tx);
        return await this.api.runPopulatedTransaction(tx);
    }

    async stakeContract(): Promise<QuantumPortalStakeWithDelegate> {
        return this.qpStakeCache.getAsync(this.network(), async () => {
            try {
                const gw = this.qpGateway();
                const stakeAddr = await gw.quantumPortalStake();
                const stake = QuantumPortalStakeWithDelegate__factory.connect(stakeAddr, this.api.ethersProvider(this.network()));
                ValidationUtils.isTrue(!!stake, 'Could not connect to stake contract');
                return stake;
            } catch(e) {
                console.error('Error initialinzg the stake contract', e as Error);
                throw e;
            }
        });
    }

    async minerMgrContract(): Promise<QuantumPortalMinerMgr> {
        return this.qpStakeCache.getAsync(this.network() + '_MinerMgr', async () => {
            try {
                const gw = this.qpGateway();
                console.log('Gateway is', gw.address);
                const mmAddr = await gw.quantumPortalMinerMgr();
                const mm = QuantumPortalMinerMgr__factory.connect(mmAddr, this.api.ethersProvider(this.network()));
                ValidationUtils.isTrue(!!mm, 'Could not connect to minerMgr contract');
                return mm;
            } catch(e) {
                console.error('Error initialinzg the stake contract', e as Error);
                throw e;
            }
        });
    }

    qpGateway(): QuantumPortalGateway {
        const network = this.api.getNetwork();
        const gatewayAddr = this.config.gateway[network];
        console.log('Getting gateway', {network, gatewayAddr})
        ValidationUtils.isTrue(!!gatewayAddr, `Ledger manager is not configured for network "${network}"`);
        const gw = QuantumPortalGateway__factory.connect(gatewayAddr, this.api.ethersProvider(network));
        ValidationUtils.isTrue(!!gw, 'Could not connect to the gateway contract');
        return gw;
    }

    async qpLedgerMgr(): Promise<QuantumPortalLedgerMgrImpl> {
        const network = this.api.getNetwork();
        const gw = this.qpGateway();
        const leg = QuantumPortalLedgerMgrImpl__factory.connect(
            await gw.quantumPortalLedgerMgr(), this.api.ethersProvider(network));
        ValidationUtils.isTrue(!!leg, 'Could not connect to ledger manager contract');
        return leg;
    }

    network() {
        const net = this.api.getNetwork();
        ValidationUtils.isTrue(!!net, 'Not connected');
        return net;
    }

    address() {
        const addr = this.api.getAddress();
        ValidationUtils.isTrue(!!addr, 'Not connected');
        return addr;
    }
}