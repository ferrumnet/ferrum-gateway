import {
  ConsoleLogger,
  Container,
  EncryptedData,
  LoggerFactory,
  Module,
  ValidationUtils,
  NetworkedConfig,
} from "ferrum-plumbing";
import { getEnv } from "types";
import {
  EthereumSmartContractHelper,
  Web3ProviderConfig,
} from "aws-lambda-helper/dist/blockchain";
import { ChainClientsModule } from "ferrum-chain-clients";
import {
  AwsEnvs,
  KmsCryptor,
  MongooseConfig,
  MongooseConnection,
  SecretsProvider,
  UnifyreBackendProxyModule,
} from "aws-lambda-helper";
import { KMS } from "aws-sdk";
import { CurrencyListSvc } from "./CurrencyListSvc";
import { UniswapV2Client } from "./uniswapv2/UniswapV2Client";
import { UniswapPricingService } from "./uniswapv2/UniswapPricingService";
import { TransactionTracker } from "./contracts/TransactionTracker";
import { UniswapV2Router } from "./uniswapv2/UniswapV2Router";
import { ChainEventService } from "./events/ChainEventsService";
import { HmacApiKeyStore } from "aws-lambda-helper/dist/security/HmacApiKeyStore";

export class CommonBackendModule implements Module {
  constructor(
    private dbConfig?: MongooseConfig,
<<<<<<< HEAD
    private chainConfig?: NetworkedConfig<string>,
=======
    private chainConfig?: MultiChainConfig,
>>>>>>> 8c1c36fde8bb79ceaf5f41da2b6e07072f9dc8b5
  ) {}

  static awsRegion(): string {
    return (
      process.env.AWS_REGION ||
      process.env[AwsEnvs.AWS_DEFAULT_REGION] ||
      "us-east-2"
    );
  }

  async configAsync(container: Container): Promise<void> {
    const region = CommonBackendModule.awsRegion();
    const chainConfArn =
      process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + "CHAIN_CONFIG"];
    const netConfig: NetworkedConfig<string> =
      this.chainConfig ||
      (!!chainConfArn
        ? await new SecretsProvider(region, chainConfArn).get()
        : ({
<<<<<<< HEAD
            'ETHEREUM': getEnv("WEB3_PROVIDER_ETHEREUM"),
            'RINKEBY': getEnv("WEB3_PROVIDER_RINKEBY"),
            'BSC': getEnv("WEB3_PROVIDER_BSC"),
            'BSC_TESTNET': getEnv("WEB3_PROVIDER_BSC_TESTNET"),
            'POLYGON': getEnv("WEB3_PROVIDER_POLYGON"),
            'MUMBAI_TESTNET': getEnv("WEB3_PROVIDER_MUMBAI_TESTNET"),
            'AVAX_TESTNET': getEnv("WEB3_PROVIDER_AVAX_TESTNET"),
          } as NetworkedConfig<string>));

    container.register('MultiChainConfig', () => netConfig);
    container.register('NetworksConfig', () => netConfig);
=======
            web3Provider: getEnv("WEB3_PROVIDER_ETHEREUM"),
            web3ProviderRinkeby: getEnv("WEB3_PROVIDER_RINKEBY"),
            web3ProviderBsc: getEnv("WEB3_PROVIDER_BSC"),
            web3ProviderBscTestnet: getEnv("WEB3_PROVIDER_BSC_TESTNET"),
            web3ProviderPolygon: getEnv("WEB3_PROVIDER_POLYGON"),
            web3ProviderMumbaiTestnet: getEnv("WEB3_PROVIDER_MUMBAI_TESTNET"),
            web3ProviderAvaxTestnet: getEnv("WEB3_PROVIDER_AVAX_TESTNET"),
          } as any as MultiChainConfig));

    container.register("MultiChainConfig", () => netConfig);
>>>>>>> 8c1c36fde8bb79ceaf5f41da2b6e07072f9dc8b5
    container.registerModule(new ChainClientsModule());

    const networkProviders = netConfig as Web3ProviderConfig;
    container.registerSingleton(
      CurrencyListSvc,
      (c) => new CurrencyListSvc(c.get(EthereumSmartContractHelper))
    );
    container.registerSingleton(
      EthereumSmartContractHelper,
      () => new EthereumSmartContractHelper(networkProviders)
    );
    container.register(
      UniswapV2Client,
      (c) => new UniswapV2Client(c.get(EthereumSmartContractHelper))
    );
    container.register("JsonStorage", () => new Object());
    container.registerSingleton("LambdaSqsHandler", () => new Object());
    container.register(
      LoggerFactory,
      () => new LoggerFactory((name: string) => new ConsoleLogger(name))
    );

		container.registerSingleton(UniswapV2Router,
			c => new UniswapV2Router(c.get(EthereumSmartContractHelper)));

		container.registerSingleton(UniswapPricingService,
			c => new UniswapPricingService(
				c.get(EthereumSmartContractHelper),
				c.get(UniswapV2Router)));
		container.register(TransactionTracker,
			c => new TransactionTracker(c.get(EthereumSmartContractHelper)));

		container.registerSingleton(ChainEventService,
			c => new ChainEventService(c.get(EthereumSmartContractHelper)));

    container.registerSingleton(HmacApiKeyStore,
      c => new HmacApiKeyStore(c.get<KmsCryptor>(KmsCryptor)));

    await container.registerModule(
      new UnifyreBackendProxyModule("DUMMY", getEnv("JWT_RANDOM_KEY"), "")
    );

    if (this.dbConfig) {
      await container.get<MongooseConnection>(HmacApiKeyStore).init(this.dbConfig);
    }

    // makeInjectable('CloudWatch', CloudWatch);
    // container.register('MetricsUploader', c =>
    //     new CloudWatchClient(c.get('CloudWatch'), 'WalletAddressManager', [
    //         { Name:'Application', Value: 'WalletAddressManager' } as Dimension,
    //     ]));
    // container.registerSingleton(MetricsService, c => new MetricsService(
    //   new MetricsAggregator(),
    //   { period: 3 * 60 * 1000 } as MetricsServiceConfig,
    //   c.get('MetricsUploader'),
    //   c.get(LoggerFactory),
    // ));
  }
}

export async function decryptKey(
  region: string,
  keyId: string,
  keyJson: string
): Promise<string> {
  ValidationUtils.isTrue(!!keyJson, "Private key must be provided");
  const key = JSON.parse(keyJson) as EncryptedData;
  return await new KmsCryptor(new KMS({ region }) as any, keyId).decryptToHex(key);
}
