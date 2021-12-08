import { EncryptedData, Injectable, Network } from "ferrum-plumbing";
import { NodeProcessor } from "../common/TokenBridgeTypes";
import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";
import { PrivateKeyProvider } from "../common/PrivateKeyProvider";
import { BridgeNodeRole } from "./BridgeNodeConfig";

export class BridgeNodeV12 implements Injectable {
	constructor(
		// private list: TransactionListProvider, 
		// private svc: TokenBridgeService,
		// private cross: CrossSwapService,
		// private helper: EthereumSmartContractHelper,
		// private addressFactory: CreateNewAddressFactory,
		private doubleEncryptedData: DoubleEncryptiedSecret,
		private privateKeyProvider: PrivateKeyProvider,
		private processor: NodeProcessor,
		private encPrivateKey: EncryptedData,
		private role: BridgeNodeRole,
	) {
		// if (process.env.LOOK_BACK_SECONDS) {
		// 	this.lookBackSeconds = Number(process.env.LOOK_BACK_SECONDS);
		// 	ValidationUtils.isTrue(Number.isInteger(this.lookBackSeconds), 'Invalid loop back seconds');
		// }
	}

	__name__() { return 'BridgeNodeV12'; }

	getRole() { return this.role; }

	/**
	 * Initialize the private key in memory. For prod, private key must be
	 * encrypted with 2fa encryption service, and optionally with AWS KMS
	 * as a second leyer.
	 * For test environment we can use clear text private key.
	 */
	async init(twoFaId: string, twoFa: string) {
		let privateKey = process.env.PROCESSOR_PRIVATE_KEY_CLEAN_TEXT;
		if (process.env.NODE_ENV === 'production') {
			await this.doubleEncryptedData.init(twoFaId, twoFa, this.encPrivateKey);
		} else {
			this.privateKeyProvider.overridePrivateKey(privateKey);
		}
	}

	async processFromHistory(network: Network) {
		await this.processor.processForNetwork(network);
	}

	// async processFromTx(network: Network, txId: string) {
	// 	const tx = await this.list.listSingleTransaction(network, txId);
	// 	ValidationUtils.isTrue(!!tx, 'Transaction not found!');
	// 	await this.processSingleTx(tx);
	// }
}