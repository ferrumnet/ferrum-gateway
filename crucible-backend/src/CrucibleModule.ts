import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, Module } from "ferrum-plumbing";
import { ChainEventService, decryptKey, AppConfig } from "common-backend";
import { CrucibleConfig } from "./CrucibleTypes";
import { CrucibleRequestProcessor } from "./CrucibleRequestProcessor";
import { CrucibeService } from "./CrucibleService";
import { UniswapPricingService } from "common-backend/dist/uniswapv2/UniswapPricingService";
import { BasicAllocation } from "common-backend/dist/contracts/BasicAllocation";
import { CRUCIBLE_CONTRACTS_V_0_1, STAKING_CONTRACTS_V_0_1 } from "types";
import { StakingConfig, StakingModule } from "./staking/StakingModule";
import { UniswapV2Client } from "common-backend/dist/uniswapv2/UniswapV2Client";

export class CrucibleModule implements Module {
  static async configuration() {
    AppConfig.instance().orElse('', () => ({
      contracts: CRUCIBLE_CONTRACTS_V_0_1,
      stakingContracts: STAKING_CONTRACTS_V_0_1,
      actor: {
        address: AppConfig.env("CRUCIBLE_ACTOR_ADDRESS", 'N/A'),
        contractAddress: '', // Contract will be taken  from other configs
        groupId: Number(AppConfig.env("CRUCIBLE_ACTOR_GROUP_ID", 'N/A')),
        quorum: AppConfig.env("CRUCIBLE_ACTOR_QUORUM", 'N/A'),
      },
    }));
  }

  async configAsync(container: Container) {
    container.registerSingleton(
      CrucibleRequestProcessor,
      (c) => new CrucibleRequestProcessor(c.get(CrucibeService))
    );

    const cleanTextPrivateKey = AppConfig.env("CRUCIBLE_ACTOR_PRIVATE_KEY_CLEAN_TEXT", 'N/A') 

    const privateKey = cleanTextPrivateKey === 'N/A' ? cleanTextPrivateKey :
      (await decryptKey(
        AppConfig.awsRegion(),
        AppConfig.env("PROCESSOR_PRIVATE_KEY_ID"),
        AppConfig.env("CRUCIBLE_ACTOR_PRIVATE_KEY_ENCRYPTED")
      ));

    const conf = AppConfig.instance().get<CrucibleConfig>();
    container.registerSingleton(
      CrucibeService,
      (c) =>
        new CrucibeService(
          c.get(EthereumSmartContractHelper),
          c.get(UniswapPricingService),
					c.get(UniswapV2Client),
          conf,
          c.get(BasicAllocation),
          conf.actor,
          privateKey
        )
    );
    container.register(
      BasicAllocation,
      (c) => new BasicAllocation(c.get(EthereumSmartContractHelper))
    );

		await container.get<ChainEventService>(ChainEventService).init(conf.database);

		// Register staking...
		await container.registerModule(
			new StakingModule({ contracts: conf.stakingContracts } as StakingConfig));

		await container.get<CrucibeService>(CrucibeService).init(conf.database);
  }
}
