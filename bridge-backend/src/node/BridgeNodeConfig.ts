import { EncryptedData, NetworkedConfig } from "ferrum-plumbing";

export type BridgeNodeRole = 'generator' | 'validator';

export interface BridgeNodeConfig {
	role: BridgeNodeRole;
	providers: NetworkedConfig<string>;
	bridgeEndpoint: string;
	encryptedSignerKey: string;
	cmkKeyId: string;
	twoFa: {
		uri: string;
		accessKey: string;
		secretKey: string;
	},
	lookBackMillis: number;
	publicAccessKey: string;
	secretAccessKey: string;
}