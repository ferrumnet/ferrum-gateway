import {
  ConsoleLogger,
  Container,
  EncryptedData,
  LoggerFactory,
  Module,
  panick,
  ValidationUtils,
} from "ferrum-plumbing";
import { getEnv } from "types";
import {
  EthereumSmartContractHelper,
  Web3ProviderConfig,
} from "aws-lambda-helper/dist/blockchain";
import { ChainClientsModule } from "ferrum-chain-clients";
import {
  AuthTokenParser,
  KmsCryptor,
  MongooseConnection,
  UnifyreBackendProxyModule,
  UnifyreBackendProxyService,
} from "aws-lambda-helper";
import { KMS } from "aws-sdk";
import { CurrencyListSvc } from "./CurrencyListSvc";
import { UniswapV2Client } from "./uniswapv2/UniswapV2Client";
import { UniswapPricingService } from "./uniswapv2/UniswapPricingService";
import { TransactionTracker } from "./contracts/TransactionTracker";
import { UniswapV2Router } from "./uniswapv2/UniswapV2Router";
import { ChainEventService } from "./events/ChainEventsService";
import { HmacApiKeyStore } from "aws-lambda-helper/dist/security/HmacApiKeyStore";
import { AppConfig, WithDatabaseConfig, WithJwtRandomBaseConfig, WithKmsConfig } from "./app/AppConfig";
import { randomSalt } from "web3-tools";

export class CommonBackendModule implements Module {
  constructor() {}

  async configAsync(container: Container): Promise<void> {
    console.log('CONFIGUREING COMM BAK')
    const netConfig = AppConfig.instance().getChainProviders();

    container.register('MultiChainConfig', () => netConfig);
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

    const conf = AppConfig.instance().get<WithDatabaseConfig&WithKmsConfig>();
    container.register(KmsCryptor, () => new KmsCryptor(
      new KMS({region: AppConfig.awsRegion()}) as any, conf.cmkKeyId,));

    container.registerSingleton(HmacApiKeyStore,
      c => new HmacApiKeyStore(c.get<KmsCryptor>(KmsCryptor)));

    await container.registerModule(
      new UnifyreBackendProxyModule("DUMMY",
        AppConfig.instance().get<WithJwtRandomBaseConfig>().jwtRandomBase, "")
    );

    container.register(AuthTokenParser, c => new AuthTokenParser(
        c.get(UnifyreBackendProxyService), c.get(HmacApiKeyStore)));

    // NOTE: Database should be configured on the field "database".
    if (conf?.database) {
      console.log('Initializing HMAC Key Store');
      await container.get<MongooseConnection>(HmacApiKeyStore).init(conf.database);
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
