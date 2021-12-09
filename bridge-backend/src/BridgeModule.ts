import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { ChainClientFactory, EthereumAddress } from "ferrum-chain-clients";
import { Container, LoggerFactory, Module } from "ferrum-plumbing";
import { TokenBridgeService } from "./TokenBridgeService";
import { BridgeConfigStorage } from "./BridgeConfigStorage";
import { BridgeProcessor } from "./BridgeProcessor";
import { BridgeProcessorConfig, env, getEnv } from "./BridgeProcessorTypes";
import { BridgeRequestProcessor } from "./BridgeRequestProcessor";
import { TokenBridgeContractClinet } from "./TokenBridgeContractClient";
import { AppConfig, CurrencyListSvc, decryptKey } from "common-backend";
import { CrossSwapService } from "./crossSwap/CrossSwapService";
import { OneInchClient } from "./crossSwap/OneInchClient";
import { UniswapV2Client } from "common-backend/dist/uniswapv2/UniswapV2Client";
import { BridgeNotificationSvc } from './BridgeNotificationService';
import { BRIDGE_V12_CONTRACTS, BRIDGE_V1_CONTRACTS } from "types";
import { BridgeNodesRemoteAccessRequestProcessor } from "..";
import { BridgeNodesRemoteAccessService } from "./nodeRemoteAccess/BridgeNodesRemoteAccessService";

export class BridgeModuleCommons implements Module {
	constructor(private conf: MongooseConfig) { }

  async configAsync(container: Container) {
    container.registerSingleton(
      BridgeConfigStorage,
      () => new BridgeConfigStorage()
    );
    container.registerSingleton(
      TokenBridgeService,
      (c) =>
        new TokenBridgeService(
          c.get(EthereumSmartContractHelper),
          c.get(TokenBridgeContractClinet),
					c.get(BridgeNotificationSvc),
        )
    );

    await container
      .get<TokenBridgeService>(TokenBridgeService)
      .init(this.conf);
    await container
      .get<BridgeConfigStorage>(BridgeConfigStorage)
      .init(this.conf);
	}
}

export class BridgeModule implements Module {
  static async configuration() {
    (await AppConfig.instance()
      .fromSecret('', 'BRIDGE_BACKEND'))

      .orElse('', () => ({
        bridgeConfig: {
          contractClient: BRIDGE_V1_CONTRACTS,
        },
        bridgeV12Config: BRIDGE_V12_CONTRACTS,
        swapProtocols: {},
      } as BridgeProcessorConfig));
  }

  async configAsync(container: Container) {
    const conf = AppConfig.instance().get<BridgeProcessorConfig>();

    const privateKey =
      getEnv("PROCESSOR_PRIVATE_KEY_CLEAN_TEXT") ||
      (await decryptKey(
        AppConfig.awsRegion(),
        getEnv("KEY_ID"),
        getEnv("PROCESSOR_PRIVATE_KEY_ENCRYPTED")
      ));
    const processorAddress = (
      await new EthereumAddress("prod").addressFromSk(privateKey)
    ).address;
    container.registerSingleton(
      TokenBridgeContractClinet,
      (c) =>
        new TokenBridgeContractClinet(
          c.get(EthereumSmartContractHelper),
          conf.bridgeConfig.contractClient
        )
    );
    container.registerSingleton(
      BridgeProcessor,
      (c) =>
        new BridgeProcessor(
          conf,
          c.get(ChainClientFactory),
          c.get(TokenBridgeService),
          c.get(TokenBridgeContractClinet),
          c.get(BridgeConfigStorage),
          c.get(EthereumSmartContractHelper),
          privateKey,
          processorAddress,
          c.get(LoggerFactory)
        )
    );

    container.registerSingleton(
      BridgeRequestProcessor,
      (c) =>
        new BridgeRequestProcessor(
          c.get(TokenBridgeService),
          c.get(BridgeConfigStorage),
					c.get(CrossSwapService),
        )
    );
    container.registerSingleton(
      BridgeNotificationSvc, (c) => new BridgeNotificationSvc()
    )

		container.register(OneInchClient,
			c => new OneInchClient(c.get(EthereumSmartContractHelper), c.get(LoggerFactory)));
		container.register(UniswapV2Client, c => new UniswapV2Client(c.get(EthereumSmartContractHelper)));
		container.registerSingleton(CrossSwapService, c => new CrossSwapService(
			c.get(OneInchClient),
			c.get(CurrencyListSvc),
			c.get(UniswapV2Client),
			c.get(EthereumSmartContractHelper),
			c.get(BridgeConfigStorage),
			c.get(TokenBridgeService),
			conf.swapProtocols!,
			conf.bridgeV12Config,));

    container.registerSingleton(BridgeNodesRemoteAccessService, c =>
      new BridgeNodesRemoteAccessService(
        c.get(TokenBridgeService),
        c.get(EthereumSmartContractHelper),
      ));

    container.registerSingleton(BridgeNodesRemoteAccessRequestProcessor, c =>
      new BridgeNodesRemoteAccessRequestProcessor(
        c.get(BridgeNodesRemoteAccessService),
        c.get(TokenBridgeService),
      ));

		await container.registerModule(new BridgeModuleCommons(conf.database));
  }
}
