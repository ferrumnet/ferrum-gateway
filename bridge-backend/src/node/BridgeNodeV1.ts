import { EncryptedData, Injectable, Logger, LoggerFactory, Network } from "ferrum-plumbing";
import { NodeProcessor } from "../common/TokenBridgeTypes";
import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";
import { PrivateKeyProvider } from "../common/PrivateKeyProvider";
import { BridgeNodeRole } from "./BridgeNodeConfig";

export class BridgeNodeV1 implements Injectable {
	private log: Logger;
	constructor(
		private doubleEncryptedData: DoubleEncryptiedSecret,
		private privateKeyProvider: PrivateKeyProvider,
		private processor: NodeProcessor,
		private encPrivateKey: EncryptedData,
		private role: BridgeNodeRole,
		logFac: LoggerFactory,
	) {
		// if (process.env.LOOK_BACK_SECONDS) {
		// 	this.lookBackSeconds = Number(process.env.LOOK_BACK_SECONDS);
		// 	ValidationUtils.isTrue(Number.isInteger(this.lookBackSeconds), 'Invalid loop back seconds');
		// }
		this.log = logFac.getLogger(BridgeNodeV1);
		this.log.info(`Node is starting up with role: ${role}`);
	}

	__name__() { return 'BridgeNodeV1'; }

	getRole() { return this.role; }

	/**
	 * Initialize the private key in memory. For prod, private key must be
	 * encrypted with 2fa encryption service, and optionally with AWS KMS
	 * as a second leyer.
	 * For test environment we can use clear text private key.
	 */
	async init(twoFaId: string, twoFa: string) {
		const isProduction = process.env.NODE_ENV === 'production' && process.env.NO_TWO_FA !== 'true';
		if (this.role === 'generator') {
			// generator does not need init
			this.log.info(`Initialized for ${isProduction ? 'PRODUCTION': 'DEVELOPMENT'}`);
			return;
		}
		let privateKey = process.env.PROCESSOR_PRIVATE_KEY_CLEAN_TEXT;
		if (isProduction) {
			await this.doubleEncryptedData.init(twoFaId, twoFa, this.encPrivateKey);
			this.log.info('Initialized for PRODUCTION');
		} else {
			this.privateKeyProvider.overridePrivateKey(privateKey);
			this.log.info('Initialized for DEV');
		}
		const signer = await this.privateKeyProvider.address();
		this.log.info(`Node V1 was initialized. (Signer : ${signer})`);
	}

	async processFromHistory(network: Network) {
		await this.processor.processForNetwork(network);
	}

	async processFromTx(network: Network, txId: string) {
		await this.processor.processSingleTransactionById(network, txId);
	}
}