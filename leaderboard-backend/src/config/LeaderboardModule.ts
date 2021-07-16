import { Container, LoggerFactory, Module } from "ferrum-plumbing";
import { MongooseConfig } from "aws-lambda-helper";
import { LeaderBoardConfig, getEnv } from "../types/LeaderboardTypes";
import { LeaderboardRequestProcessor } from "../request-processor/LeaderboardRequestProcessor";

export class LeaderboardModule implements Module {
  async configAsync(container: Container) {
    console.log("LeaderboardModule Initializing");
    let conf: LeaderBoardConfig = {} as any;
    conf = {
      database: {
        connectionString: getEnv("MONGOOSE_CONNECTION_STRING"),
      } as MongooseConfig,
    };
    container.register(
      LeaderboardRequestProcessor,
      () => new LeaderboardRequestProcessor()
    );
  }
}
