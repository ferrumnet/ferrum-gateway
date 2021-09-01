import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { EthereumSmartContractHelper, } from "aws-lambda-helper/dist/blockchain";
import { EthereumAddress, } from "ferrum-chain-clients";
import { Container, Module, ValidationUtils } from "ferrum-plumbing";
import { CommonBackendModule, decryptKey } from 'common-backend';
import { CrucibleConfig, CrucibleContracts } from "./CrucibleTypes";
import { CrucibleRequestProcessor } from "./CrucibleRequestProcessor";
import { CrucibeService } from "./CrucibleService";
import { UniswapPricingService } from "common-backend/dist/uniswapv2/UniswapPricingService";
import { networkEnvConfig } from "common-backend/dist/dev/DevConfigUtils";
import { BasicAllocation } from 'common-backend/dist/contracts/BasicAllocation';

export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}

export class CrucibleModule implements Module {
    async configAsync(container: Container) {
        const confArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + 'CRUCIBLE'];
        let conf: CrucibleConfig = {} as any;
		const region = CommonBackendModule.awsRegion();
		
        if (confArn) {
            conf = await new SecretsProvider(region, confArn).get();
        } else {
            conf = {
                database: {
                    connectionString: getEnv('MONGOOSE_CONNECTION_STRING'),
                } as MongooseConfig,
                addressManagerEndpoint: getEnv('ADDRESS_MANAGER_ENDPOINT'),
                addressManagerSecret: getEnv('ADDRESS_MANAGER_SECRET'),
							contracts: networkEnvConfig<CrucibleContracts>(
								['RINKEBY'],
								'CRUCIBLE_CONTRACTS',
								(v) => {
									const [router, factory, staking] = v.split(',');
									return { router, factory, staking } as CrucibleContracts;
								}
							),
            } as CrucibleConfig;
        }

			container.registerSingleton(CrucibleRequestProcessor, c => new CrucibleRequestProcessor(c.get(CrucibeService)));
			container.registerSingleton(CrucibeService, c => new CrucibeService(
				c.get(EthereumSmartContractHelper),
				c.get(UniswapPricingService),
				conf,
				c.get(BasicAllocation),
				'TBD', // Allocator SK!
				'TBD', // Allocator address
				));
			container.register(BasicAllocation, c => new BasicAllocation(c.get(EthereumSmartContractHelper),));

			const privateKey = getEnv('PROCESSOR_PRIVATE_KEY_CLEAN_TEXT') ||
					await decryptKey(region, getEnv('KEY_ID'), getEnv('PROCESSOR_PRIVATE_KEY_ENCRYPTED'));
			const processorAddress = (await new EthereumAddress('prod').addressFromSk(privateKey)).address;
    }
}
