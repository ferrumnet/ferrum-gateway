import { CloudWatchClient, LambdaGlobalContext } from "aws-lambda-helper";
import { NetworkTransactionWatcher } from "./watcher/NetworkTransactionWatcher";
import {
  Injectable,
  LoggerFactory,
  MetricsService,
  MetricsAggregator,
  MetricsServiceConfig,
  Network,
  ValidationUtils,
  ConfigurableLogger,
} from "ferrum-plumbing";
import { Dimension } from "aws-sdk/clients/cloudwatch";
import schedule from "node-schedule";
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
    const scheduler = container.get<LongRunningScheduler>(LongRunningScheduler);
    scheduler.init();
    try {
      console.log("About to start worker");
      await watcher.run();
      console.log("Woker completed");
      console.log("going to sleep for 500");
      await LongRunningScheduler.runForever(scheduler, 5000);
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
