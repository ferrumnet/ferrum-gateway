import { Container, LoggerFactory, Module } from "ferrum-plumbing";
import { MongooseConfig } from "aws-lambda-helper";
import { LeaderBoardConfig, getEnv } from "../types/LeaderboardTypes";
import { LeaderboardRequestProcessor } from "../request-processor/LeaderboardRequestProcessor";
import { LeaderboardService } from "../service/LeaderboardService";
require("dotenv").config();
export class LeaderboardModule implements Module {
  async configAsync(container: Container) {
    console.log("LeaderboardModule Initializing");
    let conf: LeaderBoardConfig = {} as any;
    conf = {
      database: {
        connectionString: getEnv("MONGOOSE_CONNECTION_STRING_LEADERBOARD"),
      } as MongooseConfig,
    };
    container.registerSingleton(
      LeaderboardRequestProcessor,
      (c) => new LeaderboardRequestProcessor(c.get(LeaderboardService))
    );
    container.registerSingleton(
      LeaderboardService,
      (c) => new LeaderboardService()
    );
    await container
      .get<LeaderboardService>(LeaderboardService)
      .init(conf.database);
  }
}
