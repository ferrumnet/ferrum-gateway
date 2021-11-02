import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, Module, ValidationUtils } from "ferrum-plumbing";
import { CommonBackendModule, decryptKey } from "common-backend";
import { CrucibleConfig } from "./CrucibleTypes";
import { CrucibleRequestProcessor } from "./CrucibleRequestProcessor";
import { CrucibeService } from "./CrucibleService";
import { UniswapPricingService } from "common-backend/dist/uniswapv2/UniswapPricingService";
import { networkEnvConfig } from "common-backend/dist/dev/DevConfigUtils";
import { BasicAllocation } from "common-backend/dist/contracts/BasicAllocation";
import { StakingContracts, CRUCIBLE_CONTRACTS_V_0_1 } from "types";
import { StakingConfig, StakingModule } from "./staking/StakingModule";
import { UniswapV2Client } from "common-backend/dist/uniswapv2/UniswapV2Client";

export function getEnv(env: string) {
  const res = process.env[env];
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
        stakingContracts: networkEnvConfig<StakingContracts>(
          ["RINKEBY"],
          "STAKING_CONTRACTS",
          (v) => {
            const [router, factory, openEnded, timed] = v.split(",");
            return { router, factory, openEnded, timed,  } as StakingContracts;
          }
        ),
        actor: {
          address: getEnv("CRUCIBLE_ACTOR_ADDRESS"),
					contractAddress: '',
					groupId: Number(getEnv("CRUCIBLE_ACTOR_GROUP_ID")),
					quorum: getEnv("CRUCIBLE_ACTOR_QUORUM"),
        },
      } as CrucibleConfig;
    }

    container.registerSingleton(
      CrucibleRequestProcessor,
      (c) => new CrucibleRequestProcessor(c.get(CrucibeService))
    );

    const privateKey =
      getEnv("PROCESSOR_PRIVATE_KEY_CLEAN_TEXT") ||
      (await decryptKey(
        region,
        getEnv("KEY_ID"),
        getEnv("PROCESSOR_PRIVATE_KEY_ENCRYPTED")
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

		// Register staking...
		await container.registerModule(
			new StakingModule({ contracts: conf.stakingContracts } as StakingConfig));

		await container.get<CrucibeService>(CrucibeService).init(conf.database);
  }
}
