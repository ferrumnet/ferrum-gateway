import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { EthereumSmartContractHelper, } from "aws-lambda-helper/dist/blockchain";
import { ChainClientFactory, EthereumAddress, } from "ferrum-chain-clients";
import { Container, LoggerFactory, Module, ValidationUtils } from "ferrum-plumbing";
import { CommonBackendModule, decryptKey } from 'common-backend';
import { CrucibleConfig } from "./CrucibleTypes";
import { CrucibleRequestProcessor } from "./CrucibleRequestProcessor";
import { CrucibeService } from "./CrucibleService";
import { BasicAllocator } from "common-backend/dist/contracts/BasicAllocator";
import { AllocatableContract } from "common-backend/dist/contracts/AllocatableContract";

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
				routerAddress: {
					'RINKEBY': getEnv('CRUCIBLE_ROUTER_ADDRESS_RINKEBY'),
				}
            } as CrucibleConfig;
        }

		container.registerSingleton(CrucibleRequestProcessor, c => new CrucibleRequestProcessor(c.get(CrucibeService)));
		container.registerSingleton(CrucibeService, c => new CrucibeService(
			c.get(EthereumSmartContractHelper),
			conf,
			c.get(BasicAllocator),
			'TBD', // Allocator SK!
			'TBD', // Allocator address
			));
		container.register('BasicAllocator', c => new BasicAllocator(
			c.get(AllocatableContract),
			c.get(EthereumSmartContractHelper),
		));
		container.register(AllocatableContract, c => new AllocatableContract(c.get(EthereumSmartContractHelper)));

        const privateKey = getEnv('PROCESSOR_PRIVATE_KEY_CLEAN_TEXT') ||
            await decryptKey(region, getEnv('KEY_ID'), getEnv('PROCESSOR_PRIVATE_KEY_ENCRYPTED'));
        const processorAddress = (await new EthereumAddress('prod').addressFromSk(privateKey)).address;
    }
}
