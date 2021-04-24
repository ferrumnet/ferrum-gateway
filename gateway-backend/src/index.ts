import {
    LambdaGlobalContext, UnifyreBackendProxyModule,
    UnifyreBackendProxyService, KmsCryptor, AwsEnvs, SecretsProvider, MongooseConfig,
} from 'aws-lambda-helper';
import {HttpHandler} from "./HttpHandler";
import {
    ConsoleLogger,
    Container,
    LoggerFactory, Module,
} from "ferrum-plumbing";
import { ClientModule, UnifyreExtensionKitClient } from 'unifyre-extension-sdk';
import { KMS } from 'aws-sdk';
import { EthereumSmartContractHelper, Web3ProviderConfig } from 'aws-lambda-helper/dist/blockchain';
import { GatewayConfig } from './common/Types';

const global = { init: false };

async function init() {
    if (global.init) {
        return LambdaGlobalContext.container();
    }
    const container = await LambdaGlobalContext.container();
    await container.registerModule(new stakingAppModule());
    global.init = true;
    return container;
}

// Once registered this is the handler code for lambda_template
export async function handler(event: any, context: any) {
    try {
        const container = await init();
        const lgc = container.get<LambdaGlobalContext>(LambdaGlobalContext);
        return await lgc.handleAsync(event, context);
    } catch (e) {
        console.error(e);
        return {
            body: e.message,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Authorization, Host',
            },
            isBase64Encoded: false,
            statusCode: 500,
        }
    }
}

export class stakingAppModule implements Module {
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
                    // stakingAppConfig.authRandomKey,
                    // networkProviders,
                    ));
        container.registerSingleton("LambdaSqsHandler",
            () => new Object());
        container.register(LoggerFactory,
            () => new LoggerFactory((name: string) => new ConsoleLogger(name)));
    }
}