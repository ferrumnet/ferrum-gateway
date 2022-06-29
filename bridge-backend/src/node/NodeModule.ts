import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, LoggerFactory, Module, panick, ValidationUtils } from "ferrum-plumbing";
import { BRIDGE_V1_CONTRACTS } from "types";
import { BridgeNodeConfig  } from "./BridgeNodeConfig";
import { BridgeNodeV1 } from "./BridgeNodeV1";
import { TransactionListProvider } from "./TransactionListProvider";
import { CrossSwapService } from "../crossSwap/CrossSwapService";
import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";
import { AppConfig, CommonBackendModule } from "common-backend";
import { KmsCryptor } from "aws-lambda-helper";
import { TwoFaEncryptionClient } from "aws-lambda-helper/dist/security/TwoFaEncryptionClient";
import { TokenBridgeContractClinet } from "../TokenBridgeContractClient";
import { PrivateKeyProvider } from "../common/PrivateKeyProvider";
import { WithdrawItemGeneratorV1 } from "./WithdrawItemGeneratorV1";
import { WithdrawItemValidator } from "./WithdrawItemValidator";
import { BridgeNodesRemoteAccessClient } from "../nodeRemoteAccess/BridgeNodesRemoteAccessClient";
import { WebNativeCryptor, CryptoJsKeyProvider } from 'ferrum-crypto';
import { LiquidityBalancerProcessor, LiquidityClient } from "./extra/LiquidityBalancerProcessor";
import { NodeUtils } from "./common/NodeUtils";

export class NodeModule implements Module {
  async configAsync(container: Container) {
    const conf: BridgeNodeConfig = AppConfig.instance().fromFile().get<BridgeNodeConfig>();
	ValidationUtils.isTrue(!!conf.providers, 'Error: no provider is configured for a chain');
	const configedChains = Object.keys(conf.providers);
	console.log('Following networks are configured in the config file: ', configedChains);
	ValidationUtils.isTrue(!!configedChains.length, 'Error: no provider is configured for a chain');
    (await AppConfig.instance().forChainProviders('', configedChains)
	).chainsRequired('', configedChains);

	await container.registerModule(new CommonBackendModule());

    container.registerSingleton(
      TokenBridgeContractClinet,
      (c) =>
        new TokenBridgeContractClinet(
          c.get(EthereumSmartContractHelper),
		  NodeUtils.bridgeV1ContractsForNode(),
        ));

	container.registerSingleton(TransactionListProvider,
		c => new TransactionListProvider(c.get(CrossSwapService)));

	container.register(WebNativeCryptor, c => new WebNativeCryptor(new CryptoJsKeyProvider()));

	container.register(TwoFaEncryptionClient,
		c => new TwoFaEncryptionClient(
			c.get(WebNativeCryptor),
			conf.twoFa?.uri,
			c.get(LoggerFactory),
			conf.twoFa?.secretKey,
			conf.twoFa?.accessKey,
			false));

	container.registerSingleton(DoubleEncryptiedSecret, 
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
			c.get(EthereumSmartContractHelper),
			conf,
			conf.publicAccessKey,
			conf.secretAccessKey,
			c.get(LoggerFactory),
			));

	container.register(WithdrawItemValidator,
		c => new WithdrawItemValidator(
			c.get(BridgeNodesRemoteAccessClient),
			c.get(TokenBridgeContractClinet),
			c.get(EthereumSmartContractHelper),
			c.get(PrivateKeyProvider),
			c.get(LoggerFactory),
	));

	container.registerSingleton(BridgeNodesRemoteAccessClient,
		c => new BridgeNodesRemoteAccessClient(
			conf.bridgeEndpoint,
			c.get(LoggerFactory)));

	container.register(LiquidityClient,
		c => new LiquidityClient(
			conf.bridgeEndpoint,
			conf.publicAccessKey,
			conf.secretAccessKey,
			c.get(LoggerFactory)));

	container.registerSingleton(LiquidityBalancerProcessor,
		c => new LiquidityBalancerProcessor(
			c.get(LiquidityClient),
			conf.liquidityLevels!,
			c.get(PrivateKeyProvider),
			c.get(LoggerFactory)));

	container.registerSingleton(
		BridgeNodeV1,
		c => new BridgeNodeV1(
			c.get(DoubleEncryptiedSecret),
			c.get(PrivateKeyProvider),
			conf.role === 'generator' ?
				c.get(WithdrawItemGeneratorV1) :
					conf.role === 'validator' ?
						c.get(WithdrawItemValidator) :
							conf.role === 'liquidityBot' ?
							  c.get(LiquidityBalancerProcessor) :
							  	panick(`Bad role ${conf.role}`) as any,
			conf.encryptedSignerKey,
			conf.twoFa.twoFaId,
			conf.role,
			c.get(LoggerFactory),
		),
	);
  }
}
