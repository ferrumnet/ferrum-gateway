import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, Module } from "ferrum-plumbing";
import { GovernanceConfig } from "../GovernanceTypes";
import { GovernanceRequestProcessor } from "./GovernanceRequestProcessor";
import { GovernanceService } from "./GovernanceService";
import { TransactionTracker } from "common-backend/dist/contracts/TransactionTracker";
import { AppConfig } from "common-backend";

export class GovernanceModule implements Module {
  async configAsync(container: Container) {

    container.registerSingleton(
      GovernanceRequestProcessor,
      (c) => new GovernanceRequestProcessor(c.get(GovernanceService))
    );

    container.registerSingleton(
      GovernanceService, (c) => new GovernanceService(
				c.get(EthereumSmartContractHelper),
				c.get(TransactionTracker)));

    const conf = AppConfig.instance().get<GovernanceConfig>();
		await container.get<GovernanceService>(GovernanceService).init(conf.database);
  }
}