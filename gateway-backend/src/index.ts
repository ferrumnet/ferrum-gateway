import {
  AuthTokenParser,
  UnifyreBackendProxyService,
} from "aws-lambda-helper";
import { HttpHandler } from "./HttpHandler";
import { Container, Module } from "ferrum-plumbing";
import { BasicHandlerFunction } from "aws-lambda-helper/dist/http/BasicHandlerFunction";
import { BridgeModule, BridgeNodesRemoteAccessRequestProcessor } from "bridge-backend";
import { LeaderboardModule } from "leaderboard-backend";
import { ChainEventService, CommonBackendModule, CurrencyListSvc, AppConfig, SUPPORTED_CHAINS_FOR_CONFIG, WithDatabaseConfig } from "common-backend";
import { CommonTokenServices } from "./services/CommonTokenServices";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { LeaderboardRequestProcessor } from "leaderboard-backend/dist/src/request-processor/LeaderboardRequestProcessor";
import { BridgeRequestProcessor } from "bridge-backend/dist/src/BridgeRequestProcessor";
import { CrucibleRequestProcessor, CrucibleModule } from 'crucible-backend';
import { GovernanceModule, GovernanceRequestProcessor } from 'governance-backend';
import { StakingRequestProcessor } from "crucible-backend/dist/src/staking/StakingRequestProcessor";

// To solve webpack issue with ethers
// see: https://github.com/ethers-io/ethers.js/issues/1312
import fetch from "node-fetch";
import { HmacApiKeyStore } from "aws-lambda-helper/dist/security/HmacApiKeyStore";
// tslint:disable-next-line:no-any
declare var global: any;
global.fetch = fetch;

export class GatewayModule implements Module {
  async configAsync(container: Container) {

    // Set up the configs
    await AppConfig.instance().forChainProviders();
    await AppConfig.instance().fromSecret('', 'BRIDGE');
    await AppConfig.instance().fromSecret('', 'CRUCIBLE');
    await AppConfig.instance().fromSecret('', 'LEADERBOARD');
    await AppConfig.instance().fromSecret('', 'GOVERNANCE');
    AppConfig.instance().orElse('', () => ({
      database: {
        connectionString: AppConfig.env('MONGOOSE_CONNECTION_STRING')
      },
      cmkKeyId: AppConfig.env('CMK_KEY_ID'),
    }));
      
    await BridgeModule.configuration();
    await CrucibleModule.configuration();
    await BridgeNodesRemoteAccessRequestProcessor.configuration();

    AppConfig.instance()
      .chainsRequired('', SUPPORTED_CHAINS_FOR_CONFIG)
      .required<WithDatabaseConfig>('', c => ({
        'MONGOOSE_CONNECTION_STRING': c.database.connectionString!,
      }));

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
		  		c.get(BridgeNodesRemoteAccessRequestProcessor),
          c.get(HmacApiKeyStore),
          c.get(AuthTokenParser),
          AppConfig.instance().getChainProviders(),
        )
    );
    container.registerSingleton(
      CommonTokenServices,
      (c) => new CommonTokenServices(c.get(EthereumSmartContractHelper), c.get(CurrencyListSvc)));
    
    // Set up modules
    await container.registerModule(new CommonBackendModule());
    await container.registerModule(new BridgeModule());
    await container.registerModule(new LeaderboardModule());
		await container.registerModule(new CrucibleModule());
		await container.registerModule(new GovernanceModule());
  }
}

const handlerClass = new BasicHandlerFunction(new GatewayModule());

export const handler = handlerClass.handler;
