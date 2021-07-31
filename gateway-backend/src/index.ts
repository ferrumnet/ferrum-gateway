import {
  UnifyreBackendProxyModule,
  UnifyreBackendProxyService,
} from "aws-lambda-helper";
import { HttpHandler } from "./HttpHandler";
import { Container, Module } from "ferrum-plumbing";
import { BasicHandlerFunction } from "aws-lambda-helper/dist/http/BasicHandlerFunction";
import { BridgeRequestProcessor } from "bridge-backend/src/BridgeRequestProcessor";
import { BridgeModule } from "bridge-backend";
import { LeaderboardModule } from "leaderboard-backend";
import { CommonBackendModule, CurrencyListSvc } from "common-backend";
import { CommonTokenServices } from "./services/CommonTokenServices";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { LeaderboardRequestProcessor } from "leaderboard-backend/src/request-processor/LeaderboardRequestProcessor";
require('dotenv').config()
export class GatewayModule implements Module {
  async configAsync(container: Container) {
    await container.registerModule(new CommonBackendModule());

    container.registerSingleton(
      "LambdaHttpHandler",
      (c) =>
        new HttpHandler(
          c.get(UnifyreBackendProxyService),
          c.get(CommonTokenServices),
          c.get(BridgeRequestProcessor),
          c.get(LeaderboardRequestProcessor),
          c.get("MultiChainConfig")
        )
    );
    container.registerSingleton(
      CommonTokenServices,
      (c) => new CommonTokenServices(c.get(EthereumSmartContractHelper), c.get(CurrencyListSvc)));
	container.registerSingleton(CurrencyListSvc, () => new CurrencyListSvc());
    // Registering other modules at the end, in case they had to initialize database...
    await container.registerModule(new BridgeModule());
    await container.registerModule(new LeaderboardModule());
  }
}

const handlerClass = new BasicHandlerFunction(new GatewayModule());

export const handler = handlerClass.handler;
