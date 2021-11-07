import {
  UnifyreBackendProxyService,
} from "aws-lambda-helper";
import { HttpHandler } from "./HttpHandler";
import { Container, Module } from "ferrum-plumbing";
import { BasicHandlerFunction } from "aws-lambda-helper/dist/http/BasicHandlerFunction";
import { BridgeModule } from "bridge-backend";
import { LeaderboardModule } from "leaderboard-backend";
import { ChainEventService, CommonBackendModule, CurrencyListSvc } from "common-backend";
import { CommonTokenServices } from "./services/CommonTokenServices";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { LeaderboardRequestProcessor } from "leaderboard-backend/src/request-processor/LeaderboardRequestProcessor";
import { BridgeRequestProcessor } from "bridge-backend/src/BridgeRequestProcessor";
import { CrucibleRequestProcessor, CrucibleModule } from 'crucible-backend';
import { GovernanceModule, GovernanceRequestProcessor } from 'governance-backend';
import { StakingRequestProcessor } from "crucible-backend/src/staking/StakingRequestProcessor";

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
					c.get(ChainEventService),
          c.get(BridgeRequestProcessor),
          c.get(LeaderboardRequestProcessor),
		  		c.get(CrucibleRequestProcessor),
					c.get(StakingRequestProcessor),
		  		c.get(GovernanceRequestProcessor),
          c.get("MultiChainConfig"),
        )
    );
    container.registerSingleton(
      CommonTokenServices,
      (c) => new CommonTokenServices(c.get(EthereumSmartContractHelper), c.get(CurrencyListSvc)));
    // Registering other modules at the end, in case they had to initialize database...
    await container.registerModule(new BridgeModule());
    await container.registerModule(new LeaderboardModule());
		await container.registerModule(new CrucibleModule());
		await container.registerModule(new GovernanceModule());
  }
}

const handlerClass = new BasicHandlerFunction(new GatewayModule());

export const handler = handlerClass.handler;
