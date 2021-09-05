import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, Module, ValidationUtils } from "ferrum-plumbing";
import { CommonBackendModule, decryptKey } from "common-backend";
import { GovernanceConfig } from "../GovernanceTypes";
import { GovernanceRequestProcessor } from "./GovernanceRequestProcessor";
import { GovernanceService } from "./GovernanceService";

export function getEnv(env: string) {
  const res = process.env[env];
  ValidationUtils.isTrue(
    !!res,
    `Make sure to set environment variable '${env}'`
  );
  return res!;
}

export class GovernanceModule implements Module {
  async configAsync(container: Container) {
    const confArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + "GOVERNANCE"];
    let conf: GovernanceConfig = {} as any;
    const region = CommonBackendModule.awsRegion();

    if (confArn) {
      conf = await new SecretsProvider(region, confArn).get();
    } else {
      conf = {
        database: {
          connectionString: getEnv("MONGOOSE_CONNECTION_STRING"),
        } as MongooseConfig,
      } as GovernanceConfig;
    }

    container.registerSingleton(
      GovernanceRequestProcessor,
      (c) => new GovernanceRequestProcessor(c.get(GovernanceService))
    );

    container.registerSingleton(
      GovernanceService, (c) => new GovernanceService( c.get(EthereumSmartContractHelper),));

		await container.get<GovernanceService>(GovernanceService).init(conf.database);
  }
}