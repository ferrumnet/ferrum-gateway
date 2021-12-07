import { EncryptedData, NetworkedConfig } from "ferrum-plumbing";

export type BridgeNodeRole = 'gnerator' | 'validator';

export interface BridgeNodeConfig {
	role: BridgeNodeRole;
	chain: NetworkedConfig<string>;
	encryptedSignerKey: EncryptedData;
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