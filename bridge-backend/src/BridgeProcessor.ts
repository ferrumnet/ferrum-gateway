import { ChainClientFactory, SimpleTransferTransaction } from "ferrum-chain-clients";
import { Injectable, Logger, LoggerFactory, Network, ValidationUtils } from "ferrum-plumbing";
import { BridgeModule } from "./BridgeModule";
import { LambdaGlobalContext } from "aws-lambda-helper";
import { PairAddressSignatureVerifyre } from "./common/PairAddressSignatureVerifyer";
import { TokenBridgeService } from "./TokenBridgeService";
import { BridgeProcessorConfig } from "./BridgeProcessorTypes";
import { CHAIN_ID_FOR_NETWORK, PayBySignatureData, UserBridgeWithdrawableBalanceItem } from "types";
import { BridgeConfigStorage } from "./BridgeConfigStorage";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { fixSig, produceSignatureWithdrawHash, randomSalt } from "./BridgeUtils";
import { toRpcSig } from 'ethereumjs-util';
import { SignedPairAddress } from "types";
import { TokenBridgeContractClinet } from "./TokenBridgeContractClient";
import { BridgeSwapEvent } from "./common/TokenBridgeTypes";
import * as Eip712 from 'web3-tools';

export class BridgeProcessor implements Injectable {
    private log: Logger;
    constructor(
        private config: BridgeProcessorConfig,
        private chain: ChainClientFactory,
        private svc: TokenBridgeService,
		private bridgeContract: TokenBridgeContractClinet,
        private tokenConfig: BridgeConfigStorage,
        private pairVerifyer: PairAddressSignatureVerifyre,
        private helper: EthereumSmartContractHelper,
        private privateKey: string,
        private processorAddress: string,
        logFac: LoggerFactory,
    ) {
        this.log = logFac.getLogger('BridgeProcessor')
    }

    __name__() { return 'BridgeProcessor'; }

    async processCrossChain(network: Network) {
        /**
         * Find all incoming transactions for the given network.
         * Get the sender details from mongo and verify the pair target.
         * Send tokens to their address.
         */
        const poolAddress = this.config.bridgeConfig.contractClient[network];
        ValidationUtils.isTrue(!!poolAddress, `No payer for ${network} is configured`);
        const client = this.chain.forNetwork(network);
        const relevantTokens = await this.tokenConfig.getSourceCurrencies(network);
        ValidationUtils.isTrue(!!relevantTokens.length, `No relevent token found in config for ${network}`);
        try {
            console.log(relevantTokens.map((j:any) => j.sourceCurrency),'soucre currencies')
			// todo: get event logs
            const incoming = await this.bridgeContract.getSwapEvents(network);
            console.log('Got icoming txs:', {...incoming},{...incoming})
            if (!incoming || !incoming.length) {
                this.log.info('No recent transaction for address ' + network + ':' + poolAddress);
                return;
            }
            
            for (const tx of incoming.reverse()) {
                this.log.info(`Processing transaction ${tx.transactionId}`);
                const [existed, _] = await this.processSingleTransaction(tx);
                if (existed) {
                    this.log.info(`Reached a transaction that was already processed: ${tx.transactionId}`);
                    return;
                }
            }
        } finally {
            await this.svc.close();
            await this.tokenConfig.close();
        }
    }

    private async getAndValidatePairForTransaction(tx: SimpleTransferTransaction):
        Promise<SignedPairAddress | undefined> {
        const network = tx.network;
        if (!(tx.fromItems || []).length) {
            return undefined;
        }
        const userAddress = tx.fromItems[0].address;
        const unverifiedPair = await this.svc.getUserPairedAddress(network, userAddress);
        if (!unverifiedPair || !this.pairVerifyer.verify(unverifiedPair!)) {
            this.log.info(`[${network}] Unverified pair ${unverifiedPair} related to the transaction ${tx.id}. Cannot process`);
            return undefined;
        }
        return unverifiedPair;
    }

    private async processSingleTransaction(event: BridgeSwapEvent):
        Promise<[Boolean, UserBridgeWithdrawableBalanceItem?]> {
        try {
            let processed = await this.svc.getWithdrawItem(event.transactionId);
            if (!!processed) {
                return [true, processed];
            } else {
            }

            // const pair = await this.getAndValidatePairForTransaction(tx);
            // if (!pair) {
            //     this.log.info(`No pair for the transactino: ${tx.id}`);
            //     return [false, undefined];
            // }

            // Creating a new process option.
            // Find the relevant token config for the pair
            // Calculate the target amount
            const sourceNetwork = event.network;
            // const sourceAddress = pair.pair.network1 === tx.network ? pair.pair.address1 :
            //     pair.pair.network2 === tx.network ? pair.pair.address2 : undefined;
            // const targetNetwork = pair.pair.network1 === tx.network ? pair.pair.network2 :
            //     pair.pair.network1;
            // const targetAddress = pair.pair.network1 === tx.network ? pair.pair.address2 :
            //     pair.pair.address1;
            const sourceAddress = event.from;
            const targetAddress = event.targetAddrdess || event.from;
            const targetNetwork = event.targetNetwork;
            //ValidationUtils.isTrue(!!sourceAddress, `Pairs (${pair}) source and destination don''t match transaction ${tx}`);
            const conf = await this.tokenConfig.tokenConfig(sourceNetwork, targetNetwork);
			const sourcecurrency = `${sourceNetwork}:${event.token}`;
			const targetCurrency = `${targetNetwork}:${event.targetToken}`;
            ValidationUtils.isTrue(!!conf &&
				conf.sourceCurrency === sourcecurrency && conf.targetCurrency === targetCurrency,
				`No token config between ${JSON.stringify(sourcecurrency)} networks (target ${targetCurrency})`);

            const sourceAmount = await this.helper.amountToMachine(sourcecurrency, event.amount);
            const targetAmount = await this.helper.amountToMachine(targetCurrency, event.amount);
            // let targetAmount = sourceAmount.minus(new Big(conf!.feeConstant || '0'));
            // if (targetAmount.lt(new Big(0))) {
            //     targetAmount = new Big(0);
            // }

            // ValidationUtils.isTrue(sourceAddress === tx.fromItems[0].address,
            //     `UNEXPECTED ERROR: Source address is different from the transaction source ${tx.id}`);
            const payBySig = await this.createSignedPayment(
                targetNetwork, targetAddress, targetCurrency, targetAmount,
            );
            processed = {
                id: payBySig.hash, // same as signedWithdrawHash
                timestamp: new Date().valueOf(),
                receiveNetwork: conf!.sourceNetwork,
                receiveCurrency: conf!.sourceCurrency,
                receiveTransactionId: event.transactionId,
                receiveAddress: sourceAddress,
                receiveAmount: event.amount,
                payBySig,

                sendNetwork: targetNetwork,
                sendAddress: targetAddress,
                sendTimestamp: new Date().valueOf(),
                sendCurrency: conf?.targetCurrency,
                sendAmount: event.amount,

                used: '',
                useTransactions: [],
            } as UserBridgeWithdrawableBalanceItem;
            await this.svc.withdrawSignedVerify(conf!.targetCurrency, targetAddress,
                targetAmount,
                payBySig.hash,
                payBySig.salt,
                payBySig.signature,
                this.processorAddress);
            await this.svc.newWithdrawItem(processed);
            return [true, processed];
        } catch (e) {
            this.log.error(`Error when processing transactions "${JSON.stringify(event)}": ${e}`);
            return [false, undefined];
        }
    }

    async createSignedPayment(network: string, address: string, currency: string, amount: string)
        : Promise<PayBySignatureData> {
        const amountStr = await this.helper.amountToMachine(currency, amount);
        const [_, token] = EthereumSmartContractHelper.parseCurrency(currency);
        const salt = randomSalt();
        const chainId = CHAIN_ID_FOR_NETWORK[network];
        const payBySig = produceSignatureWithdrawHash(
            this.helper.web3(network),
            chainId,
            this.config.bridgeConfig.contractClient[network],
            token,
            address,
            amountStr,
            salt,
        );

		const params = {
			contractName: 'FERRUM_TOKEN_BRIDGE_POOL',
			contractVersion: '0.0.2',
			method: 'WithdrawSigned',
			args: [
				{ type: 'address', name: 'token', value: address },
				{ type: 'address', name: 'payee', value: token },
				{ type: 'uint256', name: 'amount', value: amountStr },
				{ type: 'bytes32', name: 'sat', value: salt },
			]
		} as Eip712.Eip712Params;

		const sig2 = Eip712.produceSignature(
			this.helper.web3(network),
			chainId,
            this.config.bridgeConfig.contractClient[network],
			params);
		
		console.log('SIG 2 WAS ', sig2);
        // Create signature. TODO: Use a more secure method. Address manager is not secure enough.
        // E.g. Have an ecnrypted SK as ENV. Configure KMS to only work with a certain IP
        const sigP = await this.chain.forNetwork(network as any)
            .sign(this.privateKey, payBySig.hash.replace('0x', ''), true);
        const baseV = sigP.v - chainId * 2 - 8;
        //@ts-ignore
        const rpcSig = fixSig(toRpcSig(baseV, Buffer.from(sigP.r, 'hex'),Buffer.from(sigP.s, 'hex'), 1));

        payBySig.signature = rpcSig;
        ValidationUtils.isTrue(!!payBySig.signature, `Error generating signature for ${(
            { network, address, currency, amount })}`);
        return payBySig;
    }
}

export async function processOneWay(network: string) {
    const c = await LambdaGlobalContext.container();
    await c.registerModule(new BridgeModule());
    const processor = c.get<BridgeProcessor>(BridgeProcessor);
    await processor.processCrossChain(network as any);
}
