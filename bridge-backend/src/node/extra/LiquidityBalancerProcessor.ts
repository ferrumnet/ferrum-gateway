import { Injectable, JsonRpcRequest, Logger, LoggerFactory, Networks, ValidationUtils } from "ferrum-plumbing";
import { NodeProcessor } from "../../common/TokenBridgeTypes";
import { Big } from 'big.js';
import { BigUtils, BRIDGE_V1_CONTRACTS, Utils } from "types";
import { PrivateKeyProvider } from "../../common/PrivateKeyProvider";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { BridgeNodesRemoteAccessClient } from "../../nodeRemoteAccess/BridgeNodesRemoteAccessClient";
import { Transaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
import Web3 from "web3";
import { HmacAuthProvider } from "aws-lambda-helper/dist/security/HmacAuthProvider";
import { AppConfig } from "common-backend";
import { BridgeNodeConfig } from "../BridgeNodeConfig";

const DISCOUNT_RATIO_DOWN = new Big('0.85');
const DISCOUNT_RATIO_UP = new Big('1.15');

export type LiquidityLevels  = { [k: string]: string; };

export class LiquidityClient extends BridgeNodesRemoteAccessClient {
    constructor(
        endpoint: string,
        private apiPublicKey: string,
        private apiSecretKey: string,
        logFac: LoggerFactory,
    ) {
        super(endpoint, logFac);
    }

    async getAvailableLiquidityForBalancer(address: string, currency: string): Promise<{
        userLiquidity: string,
        userBalance: string,
        totalLiquidity: string, }> {
        const req = {
            command: 'getAvailableLiquidityForBalancer',
            data: {
                address, currency
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new HmacAuthProvider(
            '', // this.endpoint,
            body,
            Date.now(),
            this.apiSecretKey,
            this.apiPublicKey);
        return this.api(body,  auth);
    }

    async removeLiquidityTransaction(address: string, currency: string, diff: string): Promise<CustomTransactionCallRequest> {
        const req = {
            command: 'removeLiquidityTransactionForBalancer',
            data: {
                address, currency, amount: diff
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new HmacAuthProvider(
            '', // this.endpoint,
            body,
            Date.now(),
            this.apiSecretKey,
            this.apiPublicKey);
        return this.api(body,  auth);
    }

    async addLiquidityTransaction(address: string, currency: string, diff: string): Promise<CustomTransactionCallRequest> {
        const req = {
            command: 'addLiquidityTransactionForBalancer',
            data: {
                address, currency, amount: diff
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new HmacAuthProvider(
            '', // this.endpoint,
            body,
            Date.now(),
            this.apiSecretKey,
            this.apiPublicKey);
        return this.api(body,  auth);
    }

    async sendTransaction(network: string, transaction: string) {
        const req = {
            command: 'sendRawTransaction',
            data: {
                network, transaction
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new HmacAuthProvider(
            '', // this.endpoint,
            body,
            Date.now(),
            this.apiSecretKey,
            this.apiPublicKey);
        return this.api(body,  auth);
    }
}

export class LiquidityBalancerProcessor implements Injectable, NodeProcessor {
    private log: Logger;
    constructor(
        private client: LiquidityClient,
        private liquidityLevels: LiquidityLevels,
        private key: PrivateKeyProvider,
        logFac: LoggerFactory,
    ) {
        this.log = logFac.getLogger(LiquidityBalancerProcessor);
    }

    __name__(): string {
        return 'LiquidityBalancerProcessor';
    }

    async processForNetwork(network: string): Promise<void> {
        ValidationUtils.isTrue(!!this.liquidityLevels, 'liquidityLevels is not configured');
        for(const c of Object.keys(this.liquidityLevels)) {
            await this.processForCurrency(c);
        }
    }

    /**
     * 1. Get the current liquidity.
     * 2. Compare to the target
     * 3. If deviates more than 15%, update
     */
    async processForCurrency(currency: string): Promise<void> {
        try {
            const [network,] = Utils.parseCurrency(currency);
            const address = await this.key.address();
            const current = await this.client.getAvailableLiquidityForBalancer(address, currency);
            const totalLiq = BigUtils.parseOrThrow(current.totalLiquidity, 'totalLiquidity');
            const availLiq = BigUtils.parseOrThrow(current.userLiquidity, 'userLiquidity');
            const userBalance = BigUtils.parseOrThrow(current.userBalance, 'userBalance');
            const targetLiq = BigUtils.parseOrThrow(this.liquidityLevels[currency], 'expected liquidity');
            let res: any;
            if (totalLiq.gt(targetLiq.times(DISCOUNT_RATIO_UP))) {
                // Too muc liq. Remove some
                if (availLiq.eq(new Big(0))) {
                    this.log.info('We need to remove liquidity but we don\'t have any liquidity balance');
                    return;
                }
                let diff = totalLiq.sub(targetLiq);
                if (diff.gt(availLiq)) {
                    diff = availLiq;
                }
                const removeLiqTx = await this.client.removeLiquidityTransaction(address, currency, diff.toString());
                verifyExpectedTx(network, removeLiqTx);
                const signed = this.signTx(network, removeLiqTx);
                res = await this.client.sendTransaction(network, signed);
                this.log.info(`Sent transaction for ${network}: ${JSON.stringify(res)}}`);
            }

            if (totalLiq.lt(targetLiq.times(DISCOUNT_RATIO_DOWN))
            ) {
                // Too little liq. Add some
                if (userBalance.eq(new Big(0))) {
                    this.log.info('We need to add liquidity but we don\'t have any balance');
                    return;
                }
                let diff = targetLiq.sub(totalLiq);
                if (diff.gt(userBalance)) {
                    diff = userBalance;
                }
                const addLiqTx = await this.client.addLiquidityTransaction(address, currency, diff.toString());

                const [network, token] = Utils.parseCurrency(currency);
                if (addLiqTx.contract === token) { // Approve request
                    verifyTxIsApprove(currency, addLiqTx);
                    this.log.info(`Approving tx for currency: ${currency}`);
                } else {
                    verifyExpectedTx(network, addLiqTx);
                    this.log.info(`Signing tx to add ${diff} liquidity: ${JSON.stringify(addLiqTx)}`);

                }
                const signed = this.signTx(network, addLiqTx);
                res = await this.client.sendTransaction(network, signed);
                this.log.info(`Sent transaction for ${network}: ${JSON.stringify(res)}}`);
            }
        } catch(e) {
            this.log.error(`Error processing for currency ${currency}`, e as Error);
        }
    }
    
    async processSingleTransactionById(network: string, txId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private signTx(network: string, req: CustomTransactionCallRequest): string {
        const common = Common.custom({ chainId: Networks.for(network).chainId });
        if (!!(req.gas as any).maxPriorityFeePerGas) {
            const txData = {
                from: req.from,
                nonce: Web3.utils.numberToHex(req.nonce),
                maxPriorityFeePerGas: Web3.utils.numberToHex((req.gas as any).maxPriorityFeePerGas),
                maxFeePerGas: Web3.utils.numberToHex((req as any).maxFeePerGas),
                gasLimit: Web3.utils.numberToHex(req.gas.gasLimit),
                to: Utils.add0x(req.contract),
                value: '0x',
                data: req.data,
            }
            
            const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common: common as any })
            const signedTx = tx.sign(Buffer.from(this.key.privateKey(), 'hex'))
            return '0x' + signedTx.serialize().toString('hex');
        }

        const txData = {
            from: req.from,
            nonce: Web3.utils.numberToHex(req.nonce),
            gasPrice: Web3.utils.numberToHex(req.gas.gasPrice),
            gasLimit: Web3.utils.numberToHex(req.gas.gasLimit),
            to: Utils.add0x(req.contract),
            value: '0x',
            data: req.data,
        }

        const tx = Transaction.fromTxData(txData, { common: common as any })
        const signedTx = tx.sign(Buffer.from(this.key.privateKey(), 'hex'))
        return '0x' + signedTx.serialize().toString('hex');
    }
}

function verifyExpectedTx(network: string, removeLiqTx: CustomTransactionCallRequest) {
    const bridgeContracts = AppConfig.instance().get<BridgeNodeConfig>('')?.bridgeV1Contracts || BRIDGE_V1_CONTRACTS
    const bridgeContract = bridgeContracts[network];
    ValidationUtils.isTrue(removeLiqTx.contract === bridgeContract,
        `Security Error: expected bridge contract ${bridgeContract}, but received ${removeLiqTx.contract}`);
    ValidationUtils.isTrue(
        removeLiqTx.data.startsWith('0xe91b79bc') ||
        removeLiqTx.data.startsWith('0x56688700'), // TODO: get the remove liq...
        'Expected an addLiquidity or removeLiquidity request, but got ' + removeLiqTx.data);
}

function verifyTxIsApprove(currency: string, tx: CustomTransactionCallRequest) {
    const [network, token] = Utils.parseCurrency(currency);
    ValidationUtils.isTrue(token === tx.contract, 'Approve request must be against the token');
    const bridgeContracts = AppConfig.instance().get<BridgeNodeConfig>('')?.bridgeV1Contracts || BRIDGE_V1_CONTRACTS
    const bridgeContract = bridgeContracts[network];
    ValidationUtils.isTrue(
        tx.data.startsWith(
            `0x095ea7b3000000000000000000000000${bridgeContract.replace('0x','')}`), '');
}
