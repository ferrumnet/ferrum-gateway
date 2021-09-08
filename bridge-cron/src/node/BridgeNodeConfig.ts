import { MongooseConfig } from "aws-lambda-helper";
import { MultiChainConfig } from "ferrum-chain-clients";
import { EncryptedData } from "ferrum-plumbing";
import { BridgeV12Contracts, NetworkedConfig } from "types";

export interface BridgeNodeConfig {
	chain: MultiChainConfig;
	bridgeContracts: NetworkedConfig<BridgeV12Contracts>;
	encryptedSignerKey: EncryptedData;
	database: MongooseConfig;
	cmkKeyId: string;
	twoFa: {
		uri: string;
		accessKey: string;
		secretKey: string;
	}
}