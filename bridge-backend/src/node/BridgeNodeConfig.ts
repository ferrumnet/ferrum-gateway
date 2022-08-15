import { EncryptedData, NetworkedConfig } from "ferrum-plumbing";

export type BridgeNodeRole = 'generator' | 'validator' | 'liquidityBot';

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
		twoFaId: string;
	},
	lookBackMillis: number;
	publicAccessKey: string;
	secretAccessKey: string;
	liquidityLevels?: { [k: string]: string};
	bridgeV1Contracts: NetworkedConfig<string>;
}