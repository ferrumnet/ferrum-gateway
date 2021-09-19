import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, Module } from "ferrum-plumbing";
import { StakingRequestProcessor } from "./StakingRequestProcessor";
import { StakingService } from "./StakingService";
import { NetworkedConfig, StakingContracts } from "types";

export interface StakingConfig {
	contracts: NetworkedConfig<StakingContracts>;
}

export class StakingModule implements Module {
	constructor(
		private config: StakingConfig,
	) { }

  async configAsync(container: Container,
		) {

    container.registerSingleton(
      StakingRequestProcessor,
      (c) => new StakingRequestProcessor(c.get(StakingService))
    );

		container.registerSingleton(StakingService,
			c => new StakingService(c.get(EthereumSmartContractHelper), this.config.contracts));
  }
}
