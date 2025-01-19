import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, LoggerFactory, Module, panick, ValidationUtils } from "ferrum-plumbing";
import { BridgeNodeConfig  } from "../BridgeNodeConfig";
import { AppConfig, CommonBackendModule } from "common-backend";
import { TokenBridgeContractClinet } from "../../TokenBridgeContractClient";
import { PrivateKeyProvider } from "../../common/PrivateKeyProvider";
import { SimpleNode } from "./SimpleNode";
import { BridgeNodesRemoteAccessService } from "../../nodeRemoteAccess/BridgeNodesRemoteAccessService";
import { TokenBridgeService } from "../../TokenBridgeService";
import { NodeUtils } from "../common/NodeUtils";

export class SimpleNodeModule implements Module {
  async configAsync(container: Container) {
    const conf: BridgeNodeConfig = AppConfig.instance().fromFile().get<BridgeNodeConfig>();
	ValidationUtils.isTrue(!!conf.providers, 'Error: no provider is configured for a chain');
	const configedChains = Object.keys(conf.providers);
	console.log('Following networks are configured in the config file: ', configedChains);
	ValidationUtils.isTrue(!!configedChains.length, 'Error: no provider is configured for a chain');
    (await AppConfig.instance().forChainProviders('', configedChains)
	).chainsRequired('', configedChains);

	await container.registerModule(new CommonBackendModule());

	console.log('Contracts configured for the token bridge: ', NodeUtils.bridgeV1ContractsForNode());

	container.registerSingleton(
      TokenBridgeContractClinet,
      (c) =>
        new TokenBridgeContractClinet(
          c.get(EthereumSmartContractHelper),
		  NodeUtils.bridgeV1ContractsForNode(),
        ));

	container.registerSingleton(
		PrivateKeyProvider,
		c => new PrivateKeyProvider(null)); // PrivateKeyProvider is not needed for simple node

	if (!process.env.PRIVATE_KEY) {
		throw new Error('PRIVATE_KEY is not set as env');
	}
	container.get<PrivateKeyProvider>(PrivateKeyProvider).overridePrivateKey(process.env.PRIVATE_KEY);
	
	container.registerSingleton(
      TokenBridgeService,
      (c) =>
        new TokenBridgeService(
          c.get(EthereumSmartContractHelper),
          c.get(TokenBridgeContractClinet),
					null, // BridgeNotificationSvc is not needed for simple node
        )
    );

	container.registerSingleton(BridgeNodesRemoteAccessService, c =>
		new BridgeNodesRemoteAccessService(
			c.get(TokenBridgeService),
			c.get(EthereumSmartContractHelper),
			[], // Validator addresses are not needed for simple node
		));
    
	container.registerSingleton(SimpleNode,
		c => new SimpleNode(
			c.get(TokenBridgeContractClinet),
			c.get(BridgeNodesRemoteAccessService),
			c.get(TokenBridgeService),
			c.get(EthereumSmartContractHelper),
			c.get(PrivateKeyProvider),
			c.get(LoggerFactory),
		));

	await container.get<TokenBridgeService>(TokenBridgeService).init(AppConfig.instance().get("database"));
	await container.get<BridgeNodesRemoteAccessService>(BridgeNodesRemoteAccessService).init(AppConfig.instance().get("database"));

  }

}
