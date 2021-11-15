import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, Module, ValidationUtils } from "ferrum-plumbing";
import { ChainEventService, CommonBackendModule, decryptKey } from "common-backend";
import { CrucibleConfig } from "./CrucibleTypes";
import { CrucibleRequestProcessor } from "./CrucibleRequestProcessor";
import { CrucibeService } from "./CrucibleService";
import { UniswapPricingService } from "common-backend/dist/uniswapv2/UniswapPricingService";
import { BasicAllocation } from "common-backend/dist/contracts/BasicAllocation";
import { CRUCIBLE_CONTRACTS_V_0_1, STAKING_CONTRACTS_V_0_1 } from "types";
import { StakingConfig, StakingModule } from "./staking/StakingModule";
import { UniswapV2Client } from "common-backend/dist/uniswapv2/UniswapV2Client";

export function getEnv(env: string, def?: string) {
  const res = process.env[env] || def;
  ValidationUtils.isTrue(
    !!res,
    `Make sure to set environment variable '${env}'`
  );
  return res!;
}

export class CrucibleModule implements Module {
  async configAsync(container: Container) {
    const confArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + "CRUCIBLE"];
    let conf: CrucibleConfig = {} as any;
    const region = CommonBackendModule.awsRegion();

    if (confArn) {
      conf = await new SecretsProvider(region, confArn).get();
    } else {
      conf = {
        database: {
          connectionString: getEnv("MONGOOSE_CONNECTION_STRING"),
        } as MongooseConfig,
        contracts: CRUCIBLE_CONTRACTS_V_0_1,
        stakingContracts: STAKING_CONTRACTS_V_0_1,
        actor: {
          address: getEnv("CRUCIBLE_ACTOR_ADDRESS", 'N/A'),
					contractAddress: '', // Contract will be taken  from other configs
					groupId: Number(getEnv("CRUCIBLE_ACTOR_GROUP_ID", 'N/A')),
					quorum: getEnv("CRUCIBLE_ACTOR_QUORUM", 'N/A'),
        },
      } as CrucibleConfig;
    }

    container.registerSingleton(
      CrucibleRequestProcessor,
      (c) => new CrucibleRequestProcessor(c.get(CrucibeService))
    );

    const cleanTextPrivateKey = getEnv("CRUCIBLE_ACTOR_PRIVATE_KEY_CLEAN_TEXT", 'N/A') 

    const privateKey = cleanTextPrivateKey === 'N/A' ? cleanTextPrivateKey :
      (await decryptKey(
        region,
        getEnv("PROCESSOR_PRIVATE_KEY_ID"),
        getEnv("CRUCIBLE_ACTOR_PRIVATE_KEY_ENCRYPTED")
      ));

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
