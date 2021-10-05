import {
  CloudWatchClient,
  LambdaGlobalContext,
  AwsEnvs,
} from "aws-lambda-helper";
import { NetworkTransactionWatcher } from "./watcher/NetworkTransactionWatcher";
import { CloudWatch } from "aws-sdk";
import {
  Injectable,
  LoggerFactory,
  MetricsService,
  MetricsAggregator,
  MetricsServiceConfig,
  Network,
  ValidationUtils,
  makeInjectable,
  ConfigurableLogger,
} from "ferrum-plumbing";
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
    container.register(
      "MetricsUploader",
      (c) =>
        new CloudWatchClient(
          c.get("CloudWatch"),
          "NetworkTransactionsWatcher",
          [
            {
              Name: "NetworkTransactionsWatcherApplication",
              Value: "NetworkTransactionsWatcher",
            } as Dimension,
          ]
        )
    );
    container.registerSingleton(
      MetricsService,
      (c) =>
        new MetricsService(
          new MetricsAggregator(),
          { period: 3 * 60 * 1000 } as MetricsServiceConfig,
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
      NetworkTransactionWatcher,
      (c) =>
        new NetworkTransactionWatcher(
          c.get(MetricsService),
          c.get(LongRunningScheduler)
        )
    );
    const mu = container.get<MetricsService>(MetricsService);
    mu.start();
    return container;
  }

  async main() {
    const container = await this.setupModule();
    const watcher = container.get<NetworkTransactionWatcher>(
      NetworkTransactionWatcher
    );
    console.log(watcher, "watcher");
    // makeInjectable("CloudWatch", CloudWatch);
    // container.register(
    //   CloudWatch,
    //   (c) =>
    //     new CloudWatch({
    //       region: process.env[AwsEnvs.AWS_DEFAULT_REGION] || "us-east-1",
    //     })
    // );
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

  __name__(): string {
    return "Cli";
  }
}
