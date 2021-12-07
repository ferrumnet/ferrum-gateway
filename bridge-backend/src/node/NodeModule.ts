import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, LoggerFactory, Module } from "ferrum-plumbing";
import { BRIDGE_V1_CONTRACTS } from "types";
import { loadConfigFromFile } from "common-backend/dist/dev/DevConfigUtils";
import { BridgeNodeConfig  } from "./BridgeNodeConfig";
import { BridgeNodeV12 } from "./BridgeNodeV12";
import { TransactionListProvider } from "./TransactionListProvider";
import { CrossSwapService } from "../crossSwap/CrossSwapService";
import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";
import { CommonBackendModule } from "common-backend";
import { KmsCryptor } from "aws-lambda-helper";
import { TwoFaEncryptionClient } from "aws-lambda-helper/dist/security/TwoFaEncryptionClient";
import { KMS } from "aws-sdk";
import { TokenBridgeContractClinet } from "../TokenBridgeContractClient";
import { PrivateKeyProvider } from "../common/PrivateKeyProvider";
import { WithdrawItemGeneratorV1 } from "./WithdrawItemGeneratorV1";
import { WithdrawItemValidator } from "./WithdrawItemValidator";
import { BridgeNodesRemoteAccessClient } from "../nodeRemoteAccess/BridgeNodesRemoteAccessClient";

export class NodeModule implements Module {
  async configAsync(container: Container) {
    let conf: BridgeNodeConfig = loadConfigFromFile();
	await container.registerModule(new CommonBackendModule(undefined, conf.chain));

    container.registerSingleton(
      TokenBridgeContractClinet,
      (c) =>
        new TokenBridgeContractClinet(
          c.get(EthereumSmartContractHelper),
          BRIDGE_V1_CONTRACTS
        ));

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
			conf.twoFa?.accessKey,
			false));

	container.register(DoubleEncryptiedSecret, 
		c => new DoubleEncryptiedSecret(
			c.get(KmsCryptor),
		c.get(TwoFaEncryptionClient)));

	container.registerSingleton(
		PrivateKeyProvider,
		c => new PrivateKeyProvider(c.get(DoubleEncryptiedSecret)));

	container.register(WithdrawItemGeneratorV1,
		c => new WithdrawItemGeneratorV1(
			c.get(BridgeNodesRemoteAccessClient),
			c.get(TokenBridgeContractClinet),
			conf,
			conf.publicAccessKey,
			conf.secretAccessKey,));

	container.register(WithdrawItemValidator,
		c => new WithdrawItemValidator(
			c.get(BridgeNodesRemoteAccessClient),
			c.get(TokenBridgeContractClinet),
			c.get(PrivateKeyProvider),
			conf,));

	container.registerSingleton(
		BridgeNodeV12,
		c => new BridgeNodeV12(
			c.get(DoubleEncryptiedSecret),
			c.get(PrivateKeyProvider),
			conf.role === 'gnerator' ?
				c.get(WithdrawItemGeneratorV1) :
				c.get(WithdrawItemValidator),
			conf.encryptedSignerKey,
			conf.role,
		),
	);
  }
}
