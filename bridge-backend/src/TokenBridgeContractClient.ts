import {abi as bridgeAbi} from './resources/BridgePool.json';
import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { HexString, Injectable, LocalCache, Network, ValidationUtils } from 'ferrum-plumbing';
import { CustomTransactionCallRequest } from 'unifyre-extension-sdk';
import { CHAIN_ID_FOR_NETWORK, UserBridgeWithdrawableBalanceItem } from 'types';
import { BridgeSwapEvent } from './common/TokenBridgeTypes';
import { Networks } from 'ferrum-plumbing/dist/models/types/Networks';
import { ChainUtils, ETHEREUM_CHAIN_ID_FOR_NETWORK } from 'ferrum-chain-clients';
import Web3 from 'web3';
import { Eth } from 'web3-eth';

const GLOB_CACHE = new LocalCache();
const Helper = EthereumSmartContractHelper;
async function BridgeSwapEventAbi() {
	return GLOB_CACHE.getAsync('fun.BridgeSwapEventAbi',
		async () => bridgeAbi.find(i => i.type === 'event' && i.name === 'BridgeSwap').inputs);
}

const NetworkNameByChainId: {[k:number]: string} = {};
Object.keys(ETHEREUM_CHAIN_ID_FOR_NETWORK)
	.forEach(k => NetworkNameByChainId[ETHEREUM_CHAIN_ID_FOR_NETWORK[k]] = k);

export class TokenBridgeContractClinet implements Injectable {
	private bridgeSwapInputs = bridgeAbi.find(abi => abi.name === 'BridgeSwap' && abi.type === 'event');
    constructor(
        private helper: EthereumSmartContractHelper,
        private contractAddress: {[network: string]: string},
    ) {
    }

    __name__() { return 'TokenBridgeContractClinet'; }
    private instance(network: string){
        const address = this.contractAddress[network];
        ValidationUtils.isTrue(!!address, `No address for network ${network}`)
        return this.bridgePool(network, address);
    }

    async withdrawSignedVerify(targetCurrency: string, payee: string, amount: string,
        hash: string, salt: string, signature: string, expectedAddress: string) {
        const [network, token] = EthereumSmartContractHelper.parseCurrency(targetCurrency);
        const amountInt = await this.helper.amountToMachine(targetCurrency, amount);
        // console.log('Pre Result of withdrawSignedVerify', {targetCurrency, payee, amount, hash, salt, signature},this.instance(network).methods,this.instance(network));
        // const res = await this.instance(network).methods.withdrawSigned(token, payee, amountInt,
        //     salt, signature).call();
        // console.log('Result of withdrawSignedVerify', res);
        // ValidationUtils.isTrue(res[0] === hash, 'Invalid hash - cannot verify');
        // ValidationUtils.isTrue(ChainUtils.addressesAreEqual(network as any, res[1], expectedAddress),
        //     `Invalid signature: expected ${expectedAddress}. Got ${res[1]}`);
    }

	async getSwapEventByTxId(network: string, txId: string): Promise<BridgeSwapEvent> {
        const address = this.contractAddress[network];
		const web3 = (await this.helper.web3(network)) as Eth;
		const tx = await web3.getTransactionReceipt(txId);
		ValidationUtils.isTrue(ChainUtils.addressesAreEqual(network as Network, address, tx.to),
			'Transaction is not against the bridge contract');
        const swapLog = tx.logs.find(l => ChainUtils.addressesAreEqual(network as Network, address, l.address)); // Index for the swap event
        ValidationUtils.isTrue(!!swapLog, 'No swap log found on tx ' + txId)
        const decoded = web3.abi.decodeLog(this.bridgeSwapInputs.inputs, swapLog.data, swapLog.topics.slice(1));
        return this.parseSwapEvent(network, { returnValues: decoded, transactionHash: txId });
	}

	private async parseSwapEvent(network: string, e: any): Promise<BridgeSwapEvent> {
		const decoded = e.returnValues;
		const currency = `${network}:${decoded.token.toLowerCase()}`;
		const targetNetworkName = Networks.forChainId(decoded.targetNetwork);
		ValidationUtils.isTrue(network !==
			targetNetworkName.id, 'to and from network are same!');
		return {
			network,
			transactionId: e.transactionHash,
			from: decoded.from?.toLowerCase(),
			amount: await this.helper.amountToHuman(currency, decoded.amount),
			targetAddress: decoded.targetAddrdess?.toLowerCase(), // I know, but typo is correct
			targetNetwork: targetNetworkName.id,
			targetToken: decoded.targetToken?.toLowerCase(),
			token: decoded.token?.toLowerCase(),
		} as BridgeSwapEvent;
	}

	async getSwapEvents(network: string): Promise<BridgeSwapEvent[]> {
        const address = this.contractAddress[network];
        ValidationUtils.isTrue(!!address, `No address for network ${network}`)
		const web3 = await this.helper.web3(network);
		const block = await web3.getBlockNumber();
		const events = await this.bridgePool(network, address)
			.getPastEvents('BridgeSwap', {fromBlock:
				block - (network === 'MUMBAI_TESTNET' ? 990 : 1000)});
		const logs: BridgeSwapEvent[] = [];
		for (const e of events) {
			try {
				const event = await this.parseSwapEvent(network, e);
				logs.push(event);
			} catch (er) {
				console.error('Error decoding log event: ', e, '-', er);
			}
		}
		return logs;
	}

    protected bridgePool(network: string, contractAddress: string) {
        const web3 = this.helper.web3(network);
        return new web3.Contract(bridgeAbi as any, contractAddress);
    }

    async estimateGasOrDefault(method: any, from: string, defaultGas?: number) {
        try {
            return await method.estimateGas({from});
        } catch(e) {
            console.info('Error estimating gas. Tx might be reverting');
            return defaultGas;
        }
    }

    async withdrawSigned(w: UserBridgeWithdrawableBalanceItem,
            from: string): Promise<CustomTransactionCallRequest>{
        console.log(`About to withdrawSigned`, w);
        const address = this.contractAddress[w.sendNetwork];
        const p = this.instance(w.sendNetwork).methods.withdrawSigned(w.payBySig.token, w.payBySig.payee,
            w.payBySig.amount, w.payBySig.salt, w.payBySig.signature);
        const gas = await this.estimateGasOrDefault(p, from, undefined as any);
        const nonce = await this.helper.web3(w.sendNetwork).getTransactionCount(from, 'pending');
        return Helper.callRequest(address,
                w.sendCurrency,
                from,
                p.encodeABI(),
                gas ? gas.toFixed() : undefined,
                nonce,
                `Withdraw `);
    }

    async approveIfRequired(userAddress: string, currency: string, amount: string):
        Promise<CustomTransactionCallRequest[]> {
        const [network, __] = Helper.parseCurrency(currency);
        const address = this.contractAddress[network];
        ValidationUtils.isTrue(!!address, `No address for network ${network}`)
        const [_, requests] = await this.helper.approveMaxRequests(
            currency,
            userAddress,
            amount,
            this.contractAddress[network],
            'TokenBridgePool',
        );
        return requests;
    }

    async addLiquidity(userAddress: string, currency: string, amount: string):
        Promise<CustomTransactionCallRequest> {
        const [network, token] = Helper.parseCurrency(currency);
        const amountRaw = await this.helper.amountToMachine(currency, amount);
        const p = this.instance(network).methods.addLiquidity(token, amountRaw);
        const gas = await this.estimateGasOrDefault(p, userAddress);
        const nonce = await this.helper.web3(network).getTransactionCount(userAddress, 'pending');
        const address = this.contractAddress[network];
        return Helper.callRequest(address,
                currency,
                userAddress,
                p.encodeABI(),
                gas ? gas.toFixed() : undefined,
                nonce,
                `Add liquidity `);
    }

    async removeLiquidityIfPossible(userAddress: string, currency: string, amount: string) {
        const [network, token] = Helper.parseCurrency(currency);
        const amountRaw = await this.helper.amountToMachine(currency, amount);
        const p = this.instance(network).methods.removeLiquidityIfPossible(token, amountRaw);
        const gas = await this.estimateGasOrDefault(p, userAddress);
        const nonce = await this.helper.web3(network).getTransactionCount(userAddress, 'pending');
        const address = this.contractAddress[network];
        return Helper.callRequest(address,
                currency,
                userAddress,
                p.encodeABI(),
                gas ? gas.toFixed() : undefined,
                nonce,
                `Remove liquidity `);
    }

    async swap(userAddress: string, currency: string, amount: string, targetCurrency: string) {
        const [network, token] = Helper.parseCurrency(currency);
        const [targetNetwork, targetToken] = Helper.parseCurrency(targetCurrency);
        const targetNetworkInt = Networks.for(targetNetwork).chainId;
        ValidationUtils.isTrue(!!targetNetworkInt, `'targetNetwork' must be provided for ${targetNetwork}`);
        ValidationUtils.isTrue(!!userAddress, "'userAddress' must be provided");
        ValidationUtils.isTrue(!!amount, "'amount' must be provided");
        console.log('About to call swap', {token,  targetNetworkInt, targetToken});
        const amountRaw = await this.helper.amountToMachine(currency, amount);
        console.log('About to call swap', {token, amountRaw, targetNetworkInt, targetToken});
        const p = this.instance(network).methods.swap(token, amountRaw, targetNetworkInt, targetToken);
        const gas = await this.estimateGasOrDefault(p, userAddress, undefined);
        const nonce = await this.helper.web3(network).getTransactionCount(userAddress, 'pending');
        const address = this.contractAddress[network];
        return Helper.callRequest(address,
                currency,
                userAddress,
                p.encodeABI(),
                gas.toFixed(),
                nonce,
                `Swap `);
    }

    async getLiquidity(userAddress: string, currency: string): Promise<string> {
        const [network, token] = Helper.parseCurrency(currency);
        const p = await this.instance(network).methods.liquidity(token, userAddress).call();
        return this.helper.amountToHuman(currency,p);
    }

    async getTokenAllowance(userAddress: string, currency: string): Promise<string> {
        const [network, token] = Helper.parseCurrency(currency);
        const p = await this.instance(network).methods.getAllowance(userAddress, userAddress).call();
        return this.helper.amountToHuman(currency,p);
    }

    async getAvaialableLiquidity(currency: string){
        const [network, token] = Helper.parseCurrency(currency);
        const p = await this.helper.erc20(network, token).methods.balanceOf(this.contractAddress[network]).call();
        return this.helper.amountToHuman(currency,p);
    }
}