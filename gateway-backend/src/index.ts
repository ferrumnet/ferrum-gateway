import {
    UnifyreBackendProxyModule,
    UnifyreBackendProxyService, AwsEnvs, SecretsProvider
} from 'aws-lambda-helper';
import {HttpHandler} from "./HttpHandler";
import {
    ConsoleLogger,
    Container,
    LoggerFactory, Module,
} from "ferrum-plumbing";
import { EthereumSmartContractHelper, Web3ProviderConfig } from 'aws-lambda-helper/dist/blockchain';
import { BasicHandlerFunction } from 'aws-lambda-helper/dist/http/BasicHandlerFunction';
import { BridgeRequestProcessor } from "bridge-backend/src/BridgeRequestProcessor";
import { BridgeModule } from "bridge-backend";
import { getEnv } from 'types';
export class GatewayModule implements Module {
    async configAsync(container: Container) {
        const region = process.env.AWS_REGION || process.env[AwsEnvs.AWS_DEFAULT_REGION] || 'us-east-2';
        const stakingAppConfArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + 'UNI_APP_STAKING_APP'];
        let stakingAppConfig: any = {} as any;
        if (stakingAppConfArn) {
            stakingAppConfig = await new SecretsProvider(region, stakingAppConfArn).get();
        } else {
            stakingAppConfig = {
                database: {
                    connectionString: getEnv('MONGOOSE_CONNECTION_STRING'),
                } as any,
                authRandomKey: getEnv('RANDOM_SECRET'),
                signingKeyHex: getEnv('REQUEST_SIGNING_KEY'),
                web3ProviderEthereum: getEnv('WEB3_PROVIDER_ETHEREUM'),
                web3ProviderRinkeby: getEnv('WEB3_PROVIDER_RINKEBY'),
                web3ProviderBsc: getEnv('WEB3_PROVIDER_BSC_TESTNET'),
                web3ProviderBscTestnet: getEnv('WEB3_PROVIDER_BSC'),
                backend: getEnv('UNIFYRE_BACKEND'),
                region,
                cmkKeyArn: getEnv('CMK_KEY_ARN'),
                adminSecret: getEnv('ADMIN_SECRET'),
                bridgeConfig: {
                    contractClient: {
                        'ETHEREUM': getEnv('TOKEN_BRDIGE_CONTRACT_ETHEREUM'),
                        'RINKEBY': getEnv('TOKEN_BRDIGE_CONTRACT_RINKEBY'),
                        'BSC': getEnv('TOKEN_BRDIGE_CONTRACT_BSC_TESTNET'),
                        'BSC_TESTNET': getEnv('TOKEN_BRDIGE_CONTRACT_BSC_TESTNET'),
                    }
                }
            } as any;
        }
        
        // makeInjectable('CloudWatch', CloudWatch);
        // container.register('MetricsUploader', c =>
        //     new CloudWatchClient(c.get('CloudWatch'), 'WalletAddressManager', [
        //         { Name:'Application', Value: 'WalletAddressManager' } as Dimension,
        //     ]));
        // container.registerSingleton(MetricsService, c => new MetricsService(
        //   new MetricsAggregator(),
        //   { period: 3 * 60 * 1000 } as MetricsServiceConfig,
        //   c.get('MetricsUploader'),
        //   c.get(LoggerFactory),
        // ));

        const networkProviders = {
                    // 'ETHEREUM': stakingAppConfig.web3ProviderEthereum,
                    // 'RINKEBY': stakingAppConfig.web3ProviderRinkeby,
                    // 'BSC': stakingAppConfig.web3ProviderBsc,
                    // 'BSC_TESTNET': stakingAppConfig.web3ProviderBscTestnet,
                } as Web3ProviderConfig;
        await container.registerModule(
            new UnifyreBackendProxyModule('DUMMY', 'asd', // stakingAppConfig.authRandomKey,
                '',));
        
        container.registerSingleton(EthereumSmartContractHelper,
            () => new EthereumSmartContractHelper(networkProviders));
        container.register('JsonStorage', () => new Object());
        container.registerSingleton('LambdaHttpHandler',
                c => new HttpHandler(
                    c.get(UnifyreBackendProxyService),
                    c.get(BridgeRequestProcessor),
                    // stakingAppConfig.authRandomKey,
                    // networkProviders,
                    ));
        container.registerSingleton("LambdaSqsHandler",
            () => new Object());
        container.register(LoggerFactory,
            () => new LoggerFactory((name: string) => new ConsoleLogger(name)));
        // Registering other modules at the end, in case they had to initialize database...
        await container.registerModule(new BridgeModule());

        // Initialize databases here...
    }
}

const handlerClass = new BasicHandlerFunction(new GatewayModule());

export const handler = handlerClass.handler