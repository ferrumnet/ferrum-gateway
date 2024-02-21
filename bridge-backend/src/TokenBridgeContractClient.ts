import {abi as bridgeAbi} from './resources/BridgePool.json';
import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { Injectable, LocalCache, Network, ValidationUtils } from 'ferrum-plumbing';
import { CustomTransactionCallRequest } from 'unifyre-extension-sdk';
import { BigUtils, UserBridgeWithdrawableBalanceItem, Utils } from 'types';
import { BridgeSwapEvent, BridgeTransaction } from './common/TokenBridgeTypes';
import { Networks } from 'ferrum-plumbing/dist/models/types/Networks';
import { ChainUtils } from 'ferrum-chain-clients';
import Web3 from 'web3';
import { Eth } from 'web3-eth';
import { Big } from 'big.js';

const GLOB_CACHE = new LocalCache();
const Helper = EthereumSmartContractHelper;

async function BridgeSwapEventAbi() {
	return GLOB_CACHE.getAsync('fun.BridgeSwapEventAbi',
		async () => bridgeAbi.find(i => i.type === 'event' && i.name === 'BridgeSwap').inputs);
}

export class TokenBridgeContractClinet implements Injectable {
	private bridgeSwapInputs = bridgeAbi.find(abi => abi.name === 'BridgeSwap' && abi.type === 'event');
	private topics: {[key: string]: { name: string, inputs: any[] }} = {}
    constructor(
        private helper: EthereumSmartContractHelper,
        private contractAddress: {[network: string]: string},
    ) {
		this.initializeTopics();
    }

    __name__() { return 'TokenBridgeContractClinet'; }
    private instance(network: string){
        const address = this.contractAddress[network];
        ValidationUtils.isTrue(!!address, `No address for network ${network}`)
        return this.bridgePool(network, address);
    }

	private initializeTopics() {
		bridgeAbi.filter(abi => abi.type === 'event').forEach(abi => {
			const signature = abi.name + "(" +
				(abi.inputs || []).map(input => input.type).join(",") + ")";
			var hash = Web3.utils.sha3(signature);
			this.topics[hash] = { name: abi.name, inputs: abi.inputs };
		});
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

    async decode(sig: string, network: string) {
        const web3 = (await this.helper.web3(network)) as Eth;
        const response = await web3.accounts.recoverTransaction(sig);
        console.log(response, 'response-decode')
    }
	
	async getSwapEventByTxId(network: string, txId: string): Promise<BridgeSwapEvent> {
        const address = this.contractAddress[network];
		const web3 = (await this.helper.web3(network)) as Eth;
		const tx = await web3.getTransactionReceipt(txId);
		ValidationUtils.isTrue(tx.status, `Transaction "${txId}" is failed`);
		ValidationUtils.isTrue(ChainUtils.addressesAreEqual(network as Network, address, tx.to),
			'Transaction is not against the bridge contract');
        const swapLog = tx.logs.find(l => address.toLocaleLowerCase() === (l.address || '').toLocaleLowerCase()); // Index for the swap event
        ValidationUtils.isTrue(!!swapLog, 'No swap log found on tx ' + txId)
        const decoded = web3.abi.decodeLog(this.bridgeSwapInputs.inputs, swapLog.data, swapLog.topics.slice(1));
        return this.parseSwapEvent(network, { returnValues: decoded, transactionHash: txId });
	}

	async parseTransaction(network: string, txId: string): Promise<BridgeTransaction> {
        const address = this.contractAddress[network];
		const web3 = (await this.helper.web3(network)) as Eth;
		const tx = await web3.getTransactionReceipt(txId);
		const rv: BridgeTransaction = {
			network,
			transactionId: txId,
			failed: false,
			type: 'unknown',
		};
		if (!tx.status) {
			rv.failed = true;
			return rv;
		}
		// Make sure this is a tx sent to the bridge
		ValidationUtils.isTrue(ChainUtils.addressesAreEqual(network as Network, address, tx.to),
			'Transaction is not against the bridge contract');
		const logs = tx.logs.filter(l =>
				ChainUtils.addressesAreEqual(network as Network, address, l.address));
		for(const l of logs) {
			const logAbi = this.topics[l.topics[0]];
			ValidationUtils.isTrue(!!logAbi,
				`Transaction has an event that cannot be understod ${txId}: ${l.topics[0]}`);
			const decoded = web3.abi.decodeLog(logAbi.inputs, l.data, l.topics.slice(1));
			switch(logAbi.name) {
				case 'swap':
					rv.type = 'swap';
					// rv.event = await this.parseSwapEvent(network,
					// 	{ returnValues: decoded, transactionHash: txId });
					break;
				default:
					ValidationUtils.isTrue(false, `Unextpected event ${logAbi.name}: ${txId}`);
			}
		}
		return rv;
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
			targetAddress: (decoded.targetAddrdess || '').toLowerCase(), // I know, but typo is correct
			targetNetwork: targetNetworkName.id,
			targetToken: (decoded.targetToken || '').toLowerCase(),
			token: (decoded.token || '').toLowerCase(),
		} as BridgeSwapEvent;
	}

	async getSwapEvents(network: string): Promise<BridgeSwapEvent[]> {
        const address = this.contractAddress[network];
        ValidationUtils.isTrue(!!address, `No address for network ${network}`);
		const web3 = await this.helper.web3(network);
		const block = await web3.getBlockNumber();
		const firstBlock = process.env.BLOCK_LOOK_BACK ?
			Number(process.env.BLOCK_LOOK_BACK) :
			(network === 'MUMBAI_TESTNET' ? 990 : network === 'AVAX_TESTNET' ? 277: network === 'MOON_MOONBASE' ? 127: network === 'MOON_MOONRIVER' ? 110: network === 'AVAX_MAINNET'?832:network==='FTM_TESTNET'?602:network==='HARMONY_TESTNET_0'?192:network==='SHIDEN_TESTNET'?650:1000);
        
        console.log(network,address)
		const events = await this.bridgePool(network, address)
			.getPastEvents('BridgeSwap', {fromBlock:
				block - firstBlock});
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
            console.info('Error estimating gas. Tx might be reverting..');
            return defaultGas;
        }
    }

    async withdrawSigned(w: UserBridgeWithdrawableBalanceItem,
            from: string): Promise<CustomTransactionCallRequest>{
        console.log(`About to withdrawSigned`, w);

        const address = this.contractAddress[w.sendNetwork];
        const p = this.instance(w.sendNetwork).methods.withdrawSigned(w.payBySig.token, w.payBySig.payee,
            w.payBySig.amount,
			(w.payBySig as any).salt || w.payBySig.swapTxId, // Backward compatibility with older data
			Utils.add0x((w.payBySig as any).signature || w.payBySig.signatures[0].signature)
			);
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

    async withdrawEvmSigned(w: UserBridgeWithdrawableBalanceItem,
        from: string): Promise<CustomTransactionCallRequest>{
        console.log(`About to withdrawSigned`, w);

        const address = this.contractAddress[w.sendNetwork];
        const p = this.instance(w.sendNetwork).methods.withdrawSigned(
            //@ts-ignore
            w.token, w.payee, w.amount, w.salt, w?.signature
        )
        const gas = await this.estimateGasOrDefault(p, from, undefined as any);
        const nonce = await this.helper.web3(w.sendNetwork).getTransactionCount(from, 'pending');
        console.log(nonce, 'nonce')
        return Helper.callRequest(address,
                w.sendCurrency,
                from,
                p.encodeABI(),
                gas ? gas.toFixed() : undefined,
                nonce,
                `Withdraw `);
    }

    async withdrawCasperEvmSigned(w: UserBridgeWithdrawableBalanceItem,
        from: string): Promise<CustomTransactionCallRequest>{
        console.log(`About to withdrawSigned`, w);

        const address = this.contractAddress[w.receiveNetwork];
        const p = this.instance(w.receiveNetwork).methods.withdrawSigned(
            //@ts-ignore
            w.token, w.payee, w.amount, w.salt, w?.signature
        )
        const gas = await this.estimateGasOrDefault(p, from, undefined as any);
        const nonce = await this.helper.web3(w.receiveNetwork).getTransactionCount(from, 'pending');
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
        ValidationUtils.isTrue(!!userAddress, 'userAddress is required');
        ValidationUtils.isTrue(!!currency, 'currency is required');
        ValidationUtils.isTrue(!!amount, 'amount is required');
        ValidationUtils.isTrue(!!BigUtils.safeParse(amount).gt(new Big(0)), 'amount must be positive');

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
        let parsedTargetToken = targetToken;
        let targetNetworkInt;
        if (targetNetwork == 'CSPR') {
            parsedTargetToken = `0x${targetToken.slice(0, 40)}`;
            targetNetworkInt = 109090
        } else {
            targetNetworkInt = Networks.for(targetNetwork).chainId;
            ValidationUtils.isTrue(!!targetNetworkInt, `'targetNetwork' must be provided for ${targetNetwork}`);
        }
        ValidationUtils.isTrue(!!targetNetworkInt, `'targetNetwork' must be provided for ${targetNetwork}`);
        ValidationUtils.isTrue(!!userAddress, "'userAddress' must be provided");
        ValidationUtils.isTrue(!!amount, "'amount' must be provided");
        console.log('About to call swap', {token,  targetNetworkInt, parsedTargetToken});
        const amountRaw = await this.helper.amountToMachine(currency, amount);
        console.log('About to call swap', {token, amountRaw, targetNetworkInt, parsedTargetToken});
        const p = this.instance(network).methods.swap(token, amountRaw, targetNetworkInt, parsedTargetToken);
        const gas = await this.estimateGasOrDefault(p, userAddress, undefined);
        const nonce = await this.helper.web3(network).getTransactionCount(userAddress, 'pending');
        const address = this.contractAddress[network];
        return Helper.callRequest(address,
                currency,
                userAddress,
                p.encodeABI(),
                gas ? gas.toFixed() : undefined,
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
