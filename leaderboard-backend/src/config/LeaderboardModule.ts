import { Container, Module } from "ferrum-plumbing";
import { CommonBackendModule, AppConfig } from "common-backend";
import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { LeaderBoardConfig, getEnv } from "../types/LeaderboardTypes";
import { LeaderboardRequestProcessor } from "../request-processor/LeaderboardRequestProcessor";
import { LeaderboardService } from "../service/LeaderboardService";
require("dotenv").config();
export class LeaderboardModule implements Module {
  async configAsync(container: Container) {
    console.log("LeaderboardModule Initializing");

    container.registerSingleton(
      LeaderboardRequestProcessor,
      (c) => new LeaderboardRequestProcessor(c.get(LeaderboardService))
    );
    container.registerSingleton(
      LeaderboardService,
      (c) => new LeaderboardService()
    );

    const conf = AppConfig.instance().get<LeaderBoardConfig>();
    await container
      .get<LeaderboardService>(LeaderboardService)
      .init(conf.database);
  }
}
