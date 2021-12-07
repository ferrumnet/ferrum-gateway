import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { CreateNewAddressFactory } from "ferrum-chain-clients";
import { Container, LoggerFactory, Module } from "ferrum-plumbing";
import { NetworkedConfig } from "types";
import { loadConfigFromFile } from "common-backend/dist/dev/DevConfigUtils";
import { BridgeNodeConfig  } from "./BridgeNodeConfig";
import { BridgeNodeV12 } from "./BridgeNodeV12";
import { TransactionListProvider } from "./TransactionListProvider";
import { TokenBridgeService } from "../TokenBridgeService";
import { CrossSwapService } from "../crossSwap/CrossSwapService";
import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";
import { BridgeConfigStorage } from "../BridgeConfigStorage";
import { CommonBackendModule } from "common-backend";
import { KmsCryptor } from "aws-lambda-helper";
import { TwoFaEncryptionClient } from "aws-lambda-helper/dist/security/TwoFaEncryptionClient";
import { KMS } from "aws-sdk";
import { BridgeModuleCommons } from "../BridgeModule";

export class NodeModule implements Module {
  async configAsync(container: Container) {
    let conf: BridgeNodeConfig = loadConfigFromFile();
	const brigeContracts: NetworkedConfig<string> = {};
	Object.keys(conf.bridgeContracts).forEach(net => {
		brigeContracts[net] = conf.bridgeContracts[net].bridge;
	});

	await container.registerModule(new CommonBackendModule());

    await container.registerModule(new BridgeModuleCommons(conf.database,),);

	container.registerSingleton(TransactionListProvider,
		c => new TransactionListProvider(c.get(CrossSwapService)));

	container.register(KmsCryptor, () => new KmsCryptor(
		new KMS({region: process.env.DEFAULT_AWS_REGION}),
		conf.cmkKeyId,));

	/*container.register(TwoFaEncryptionClient,
		c => new TwoFaEncryptionClient(
			c.get(KmsCryptor),
			conf.twoFa?.uri,
			c.get(LoggerFactory),
			conf.twoFa?.secretKey,
			conf.twoFa?.accessKey));*/

	container.register(DoubleEncryptiedSecret, 
		c => new DoubleEncryptiedSecret(
			c.get(KmsCryptor),
		c.get(TwoFaEncryptionClient)));

	container.registerSingleton(
		BridgeNodeV12,
		c => new BridgeNodeV12(
			c.get(TransactionListProvider),
			c.get(TokenBridgeService),
			c.get(CrossSwapService),
			c.get(EthereumSmartContractHelper),
			c.get(CreateNewAddressFactory),
			c.get(DoubleEncryptiedSecret),
			conf.encryptedSignerKey,
		),
	);

    await container
      .get<TokenBridgeService>(TokenBridgeService)
      .init(conf.database);
    await container
      .get<BridgeConfigStorage>(BridgeConfigStorage)
      .init(conf.database);
	await container
	  .get<CrossSwapService>(CrossSwapService).init(conf.database);
  }
}
