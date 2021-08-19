import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { EncryptedData, Injectable, Network, Networks, panick, ValidationError, ValidationUtils } from "ferrum-plumbing";
import { BridgeContractVersions, PayBySignatureData, UserBridgeWithdrawableBalanceItem, Utils } from "types";
import { Eip712Params, produceSignature, signWithPrivateKey } from "web3-tools";
import { BridgeSwapEvent } from "../common/TokenBridgeTypes";
import { CrossSwapService } from "../crossSwap/CrossSwapService";
import { TokenBridgeService } from "../TokenBridgeService";
import { TransactionListProvider } from "./TransactionListProvider";
import { CreateNewAddressFactory } from "ferrum-chain-clients";
import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";

interface SignerSecret {
	address: string;
	privateKey: string;
}

export class BridgeNodeV12 implements Injectable {
	private lookBackSeconds: number = 3600;
	private signer: SignerSecret | undefined;
	constructor(
		private list: TransactionListProvider, 
		private svc: TokenBridgeService,
		private cross: CrossSwapService,
		private helper: EthereumSmartContractHelper,
		private addressFactory: CreateNewAddressFactory,
		private doubleEncryptedData: DoubleEncryptiedSecret,
		private encPrivateKey: EncryptedData,
	) {
		if (process.env.LOOK_BACK_SECONDS) {
			this.lookBackSeconds = Number(process.env.LOOK_BACK_SECONDS);
			ValidationUtils.isTrue(Number.isInteger(this.lookBackSeconds), 'Invalid loop back seconds');
		}
	}

	__name__() { return 'BridgeNodeV12'; }
	
	async init(twoFaId: string, twoFa: string) {
		let privateKey = process.env.PROCESSOR_PRIVATE_KEY_CLEAN_TEXT;
		let address = '';
		if (process.env.NODE_ENV === 'production') {
			await this.doubleEncryptedData.init(twoFaId, twoFa, this.encPrivateKey);
		} else {
			address = (await this.addressFactory.create('ETHEREUM').addressFromSk(privateKey)).address;
		}
		this.signer = {
			address,
			privateKey
		};
	}

	async processFromHistory(network: Network) {
		const txs = await this.list.listNewTransactions(network, this.lookBackSeconds);
		for (const tx of txs) {
			await this.processSingleTx(tx);
		}
	}

	async processFromTx(network: Network, txId: string) {
		const tx = await this.list.listSingleTransaction(network, txId);
		ValidationUtils.isTrue(!!tx, 'Transaction not found!');
		await this.processSingleTx(tx);
	}

	getSignerAddress(): string {
		return this.signer.address;
	}

	/**
	 * Validate tx from network to ensure db is not modified.
	 * Create the withdraw item if not existing.
	 * Add signature on the
	 */
	private async processSingleTx(tx: BridgeSwapEvent) {
		await this.list.validateFromNetwork(tx);
		const withdrawItem = await this.getOrCreateWithdrawItem(tx);
	}

	/**
	 * Get the withdraw item. create if does not exist.
	 */
	private async getOrCreateWithdrawItem(tx: BridgeSwapEvent, looped: boolean = false):
	Promise<UserBridgeWithdrawableBalanceItem> {
		const item = await this.svc.getWithdrawItem(tx.transactionId);
		if (!!item) {
			return item;
		}
		const req = await this.cross.getRegisteredSwapCross(tx.transactionId);
		ValidationUtils.isTrue(!!req, 'Tx has no relevant request! :' + JSON.stringify(tx));
		const payBySig = await this.createSignedPayment(tx);
		// TODO: Maybe double check with the config??
		const newItem = {
			id: tx.transactionId,
			timestamp: new Date().valueOf(),
			receiveNetwork: tx.network,
			receiveCurrency: Utils.toCurrency(tx.network, tx.token),
			receiveTransactionId: tx.transactionId,
			receiveAddress: tx.targetAddress,
			receiveAmount: tx.amount,
			payBySig,
			sendNetwork: tx.targetNetwork,
			sendAddress: tx.targetAddress,
			sendTimestamp: new Date().valueOf(),
			sendCurrency: Utils.toCurrency(tx.targetNetwork, tx.targetToken),
			sendAmount: tx.amount,

			originCurrency: Utils.toCurrency(tx.network, tx.originToken),
			sendToCurrency: Utils.toCurrency(tx.targetNetwork, tx.swapTargetTokenTo),

			used: '',
			useTransactions: [],
		} as UserBridgeWithdrawableBalanceItem;
		await this.svc.newWithdrawItem(newItem);
		return newItem;
	}

    private async createSignedPayment(tx: BridgeSwapEvent,)
        : Promise<PayBySignatureData> {
        const sourceChainId = Networks.for(tx.network).chainId;
        const chainId = Networks.for(tx.targetNetwork).chainId;
		const amountStr = await this.helper.amountToMachine(
			Utils.toCurrency(tx.targetNetwork, tx.targetToken), tx.amount);
		// WithdrawSigned(address token,address payee,
		//  uint256 amount,address toToken,uint32 sourceChainId,bytes32 swapTxId)
		const params = {
			contractName: 'FERRUM_TOKEN_BRIDGE_POOL',
			contractVersion: BridgeContractVersions.V1_2,
			method: 'WithdrawSigned',
			args: [
				{ type: 'address', name: 'token', value: tx.targetToken },
				{ type: 'address', name: 'payee', value: tx.targetAddress },
				{ type: 'uint256', name: 'amount', value: amountStr },
				{ type: 'address', name: 'toToken', value: tx.swapTargetTokenTo },
				{ type: 'uint32', name: 'sourceChainId', value: sourceChainId },
				{ type: 'bytes32', name: 'swapTxId', value: tx.transactionId },
			]
		} as Eip712Params;

		const bridgeContractAddress = this.cross.contract(tx.targetNetwork).bridge;
		const sig = produceSignature(
			this.helper.web3(tx.targetNetwork),
			chainId,
            bridgeContractAddress,
			params);

		const creationTime = Date.now();
		const signature = await signWithPrivateKey(this.signer.privateKey, sig.hash);
		sig.signature = signature;
        ValidationUtils.isTrue(!!signature, `Error generating signature for ${tx}`);
		return {
			token: tx.targetToken,
			payee: tx.targetAddress,
			amount: amountStr,
			toToken: tx.swapTargetTokenTo,
			sourceChainId: sourceChainId,
			swapTxId: tx.transactionId,
			contractName: params.contractName,
			contractVersion: params.contractVersion,
			contractAddress: bridgeContractAddress,
			hash: sig.hash,
			signatures: [ { creationTime, creator: this.signer.address, signature }],
		} as PayBySignatureData;
    }
}