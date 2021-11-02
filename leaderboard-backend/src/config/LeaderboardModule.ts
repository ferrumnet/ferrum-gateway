import { Container, Module } from "ferrum-plumbing";
import { CommonBackendModule } from "common-backend";
import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { LeaderBoardConfig, getEnv } from "../types/LeaderboardTypes";
import { LeaderboardRequestProcessor } from "../request-processor/LeaderboardRequestProcessor";
import { LeaderboardService } from "../service/LeaderboardService";
require("dotenv").config();
export class LeaderboardModule implements Module {
  async configAsync(container: Container) {
    console.log("LeaderboardModule Initializing");

    const confArn =
      process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + "LEADERBOARD_PROCESSOR"];
    const region = CommonBackendModule.awsRegion();
    let conf: LeaderBoardConfig = {} as any;

    if (confArn) {
      conf = await new SecretsProvider(region, confArn).get();

    } else {
      conf = {
        database: {
          connectionString: getEnv("MONGOOSE_CONNECTION_STRING_LEADERBOARD"),
        } as MongooseConfig,
      };
    }
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
