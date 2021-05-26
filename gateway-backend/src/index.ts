import {
    UnifyreBackendProxyModule,
    UnifyreBackendProxyService, KmsCryptor, AwsEnvs, SecretsProvider
} from 'aws-lambda-helper';
import {HttpHandler} from "./HttpHandler";
import {
    ConsoleLogger,
    Container,
    LoggerFactory, Module,
} from "ferrum-plumbing";
import { KMS } from 'aws-sdk';
import { EthereumSmartContractHelper, Web3ProviderConfig } from 'aws-lambda-helper/dist/blockchain';
import { BasicHandlerFunction } from 'aws-lambda-helper/dist/http/BasicHandlerFunction';
import { GatewayConfig } from './common/Types';
import { BridgeRequestProcessor } from "bridge-backend/src/BridgeRequestProcessor";
import { BridgeModule } from "bridge-backend/src/BridgeModule";
import { TokenBridgeService } from "bridge-backend/src/TokenBridgeService";
import { BridgeConfigStorage } from "bridge-backend/src/BridgeConfigStorage";
export class GatewayModule implements Module {
    async configAsync(container: Container) {
        const region = process.env.AWS_REGION || process.env[AwsEnvs.AWS_DEFAULT_REGION] || 'us-east-2';
        const stakingAppConfArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + 'UNI_APP_STAKING_APP'];
        let stakingAppConfig: GatewayConfig = {} as any;
        if (stakingAppConfArn) {
            stakingAppConfig = await new SecretsProvider(region, stakingAppConfArn).get();
        } else {
            stakingAppConfig = {
            } as GatewayConfig;
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