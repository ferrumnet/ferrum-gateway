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
import {
  CommonBackendModule,
  CurrencyListSvc,
  decryptKey,
} from "common-backend";
import { networkEnvConfig } from "common-backend/dist/dev/DevConfigUtils";
import { CrossSwapService } from "./crossSwap/CrossSwapService";
import { OneInchClient } from "./crossSwap/OneInchClient";
import {
  BridgeV12Contracts,
  BRIDGE_NETWORKS,
  DEFAULT_SWAP_PROTOCOLS,
  NetworkedConfig,
  SwapProtocol,
} from "types";
import { UniswapV2Client } from "common-backend/dist/uniswapv2/UniswapV2Client";
require("dotenv").config();
const GLOBAL_BRIDGE_CONTRACT = "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877";

export class BridgeModuleCommons implements Module {
  constructor(
    private bridgeContracts: NetworkedConfig<string>,
    private bridgeV12Contracts: NetworkedConfig<BridgeV12Contracts>,
    private swapProtocols: NetworkedConfig<SwapProtocol[]>
  ) {}

  async configAsync(container: Container) {
    container.registerSingleton(
      TokenBridgeContractClinet,
      (c) =>
        new TokenBridgeContractClinet(
          c.get(EthereumSmartContractHelper),
          this.bridgeContracts
        )
    );
    container.registerSingleton(
      BridgeConfigStorage,
      () => new BridgeConfigStorage()
    );

    container.registerSingleton(
      CrossSwapService,
      (c) =>
        new CrossSwapService(
          c.get(OneInchClient),
          c.get(CurrencyListSvc),
          c.get(UniswapV2Client),
          c.get(EthereumSmartContractHelper),
          c.get(BridgeConfigStorage),
          c.get(TokenBridgeService),
          this.swapProtocols || DEFAULT_SWAP_PROTOCOLS,
          this.bridgeV12Contracts
        )
    );
    container.registerSingleton(
      OneInchClient,
      (c) =>
        new OneInchClient(
          c.get(EthereumSmartContractHelper),
          c.get(LoggerFactory)
        )
    );
    container.registerSingleton(
      BridgeRequestProcessor,
      (c) =>
        new BridgeRequestProcessor(
          c.get(TokenBridgeService),
          c.get(BridgeConfigStorage),
          c.get(CrossSwapService)
        )
    );
    container.registerSingleton(
      TokenBridgeService,
      (c) =>
        new TokenBridgeService(
          c.get(EthereumSmartContractHelper),
          c.get(TokenBridgeContractClinet),
        )
    );
  }
}

export class BridgeModule implements Module {
  async configAsync(container: Container) {
    const confArn =
      process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + "BRIDGE_PROCESSOR"];
    let conf: BridgeProcessorConfig = {} as any;
    const region = CommonBackendModule.awsRegion();

    if (confArn) {
      conf = await new SecretsProvider(region, confArn).get();
    } else {
      conf = {
        database: {
          connectionString: getEnv("MONGOOSE_CONNECTION_STRING"),
        } as MongooseConfig,
        addressManagerEndpoint: getEnv("ADDRESS_MANAGER_ENDPOINT"),
        addressManagerSecret: getEnv("ADDRESS_MANAGER_SECRET"),
        bridgeConfig: {
          contractClient: networkEnvConfig<string>(
            BRIDGE_NETWORKS,
            "TOKEN_BRDIGE_CONTRACT",
            (v) => v
          ),
        },
        bridgeV12Config: networkEnvConfig<BridgeV12Contracts>(
          BRIDGE_NETWORKS,
          "TOKEN_BRIDGE_V12_CONTRACT",
          (v) => {
            const [bridge, router, staking] = v.split(",");
            return { bridge, router, staking } as BridgeV12Contracts;
          }
        ),
        swapProtocols: networkEnvConfig<SwapProtocol[]>(
          BRIDGE_NETWORKS,
          "SWAP_PROTOCOLS",
          (v) => v.split(",")
        ),
      } as BridgeProcessorConfig;
    }

    const privateKey =
      getEnv("PROCESSOR_PRIVATE_KEY_CLEAN_TEXT") ||
      (await decryptKey(
        region,
        getEnv("KEY_ID"),
        getEnv("PROCESSOR_PRIVATE_KEY_ENCRYPTED")
      ));
    const processorAddress = (
      await new EthereumAddress("prod").addressFromSk(privateKey)
    ).address;

    await container.registerModule(
      new BridgeModuleCommons(
		  conf.bridgeConfig.contractClient,
		  conf.bridgeV12Config,
		  conf.swapProtocols!,
		),
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

    await container
      .get<TokenBridgeService>(TokenBridgeService)
      .init(conf.database);
    await container
      .get<BridgeConfigStorage>(BridgeConfigStorage)
      .init(conf.database);
    await container.get<CrossSwapService>(CrossSwapService).init(conf.database);
  }
}
