import { CloudWatchClient, LambdaGlobalContext } from "aws-lambda-helper";
import { NetworkTransactionWatcher } from "./watcher/NetworkTransactionWatcher";
import {
  Injectable,
  LoggerFactory,
  MetricsService,
  MetricsAggregator,
  MetricsServiceConfig,
  ConfigurableLogger,
} from "ferrum-plumbing";
import {
  EthereumSmartContractHelper,
  Web3ProviderConfig,
} from "aws-lambda-helper/dist/blockchain";
import { Dimension } from "aws-sdk/clients/cloudwatch";
import { getLogger } from "log4js";
import { LongRunningScheduler } from "ferrum-plumbing/dist/scheduler/LongRunningScheduler";

const logger = getLogger();
const errorLogger = getLogger("error");

const Log4jsLogger = (name: string) =>
  new ConfigurableLogger(
    name,
    (...vals: any[]) => errorLogger.error(vals),
    (...vals: any[]) => errorLogger.error(vals),
    (...vals: any[]) => logger.info(vals),
    (...vals: any[]) => logger.debug(vals)
  );

export class Cli implements Injectable {
  async setupModule() {
    const container = await LambdaGlobalContext.container();
    const networkProviders = {
      ETHEREUM: process.env.WEB3_PROVIDER_ETHEREUM,
      RINKEBY: process.env.WEB3_PROVIDER_RINKEBY,
      BSC: process.env.WEB3_PROVIDER_BSC,
      BSC_TESTNET: process.env.WEB3_PROVIDER_BSC_TESTNET,
      POLYGON: process.env.WEB3_PROVIDER_POLYGON,
      MUMBAI_TESTNET: process.env.WEB3_PROVIDER_MUMBAI_TESTNET,
      AVAX_TESTNET: process.env.WEB3_PROVIDER_AVAX_TESTNET,    
      MOON_MOONBASE: process.env.WEB3_PROVIDER_MOON_MOONBASE,
      AVAX_MAINNET:process.env.WEB3_PROVIDER_AVAX_MAINNET,
      MOON_MOONRIVER: process.env.WEB3_PROVIDER_MOON_MOONRIVER,
      FTM_TESTNET:process.env.WEB3_PROVIDER_FTM_TESTNET,
      FTM_MAINNET:process.env.WEB3_PROVIDER_FTM_MAINNET,
      HARMONY_TESTNET_0:process.env.WEB3_PROVIDER_HARMONY_TESTNET_0,
      SHIDEN_TESTNET:process.env.WEB3_PROVIDER_SHIDEN_TESTNET


    };
    container.register(
      "MetricsUploader",
      (c) =>
        new CloudWatchClient(
          c.get("CloudWatch"),
          "NetworkTransactionsWatcher",
          [
            {
              Name: "Application",
              Value: "NetworkTransactionsWatcher",
            } as Dimension,
            {
              Name: "Network",
              Value: "NETWORK",
            } as Dimension,
          ]
        )
    );
    container.registerSingleton(
      MetricsService,
      (c) =>
        new MetricsService(
          new MetricsAggregator(),
          { period: 5000 } as MetricsServiceConfig,
          c.get("MetricsUploader"),
          c.get(LoggerFactory)
        )
    );
    container.register("LoggerForClassName", () => Log4jsLogger);
    container.register(
      LoggerFactory,
      (c) => new LoggerFactory(c.get("LoggerForClassName"))
    );
    container.registerSingleton(
      LongRunningScheduler,
      (c) => new LongRunningScheduler(c.get(LoggerFactory))
    );
    container.registerSingleton(
      EthereumSmartContractHelper,
      (c) => new EthereumSmartContractHelper(c.get(networkProviders))
    );
    container.registerSingleton(
      NetworkTransactionWatcher,
      (c) =>
        new NetworkTransactionWatcher(
          c.get(MetricsService),
          // c.get(EthereumSmartContractHelper),
          c.get(LongRunningScheduler)
        )
    );
    const mu = container.get<MetricsService>(MetricsService);
    mu.start();
    return container;
  }

  async main(): Promise<void> {
    const container = await this.setupModule();
    const watcher = container.get<NetworkTransactionWatcher>(
      NetworkTransactionWatcher
    );
    const scheduler = container.get<LongRunningScheduler>(LongRunningScheduler);
    scheduler.init();
    try {
      await watcher.run();
      console.log("Woker completed");
      await LongRunningScheduler.runForever(scheduler, 100);
      console.log("sleep over");
    } catch (e) {
      console.error("MAIN", e);
      console.log("Killing the app due to error.", e);
      process.exit(-1);
    }
    process.exit(0);
  }

  __name__() {
    return "Cli";
  }
}
