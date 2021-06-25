import { ConsoleLogger, Container, EncryptedData, LoggerFactory, Module, ValidationUtils } from "ferrum-plumbing";
import { getEnv } from 'types';
import { EthereumSmartContractHelper, Web3ProviderConfig } from "aws-lambda-helper/dist/blockchain";
import { ChainClientsModule, MultiChainConfig } from "ferrum-chain-clients";
import { AwsEnvs, KmsCryptor, SecretsProvider } from "aws-lambda-helper";
import { KMS } from 'aws-sdk';

export class CommonBackendModule implements Module {
	static awsRegion(): string {
        return process.env.AWS_REGION || process.env[AwsEnvs.AWS_DEFAULT_REGION] || 'us-east-2';
	}

	async configAsync(container: Container): Promise<void> {
        const region = CommonBackendModule.awsRegion();
		const chainConfArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + 'CHAIN_CONFIG'];
		const netConfig: MultiChainConfig = !!chainConfArn ?
			await new SecretsProvider(region, chainConfArn).get() : 
			({
				web3Provider: getEnv('WEB3_PROVIDER_ETHEREUM'),
				web3ProviderRinkeby: getEnv('WEB3_PROVIDER_RINKEBY'),
				web3ProviderBsc: getEnv('WEB3_PROVIDER_BSC'),
				web3ProviderBscTestnet: getEnv('WEB3_PROVIDER_BSC_TESTNET'),
				web3ProviderPolygon: getEnv('WEB3_PROVIDER_POLYGON'),
				web3ProviderMumbaiTestnet: getEnv('WEB3_PROVIDER_MUMBAI_TESTNET'),
			} as any as MultiChainConfig);
	
        container.register('MultiChainConfig', () => netConfig);
        container.registerModule(new ChainClientsModule());
        const networkProviders = {
			'ETHEREUM': netConfig.web3Provider,
			'RINKEBY': netConfig.web3ProviderRinkeby,
			'BSC': netConfig.web3ProviderBsc,
			'BSC_TESTNET': netConfig.web3ProviderBscTestnet,
			'POLYGON': netConfig.web3ProviderPolygon,
			'MUMBAI_TESTNET': netConfig.web3ProviderMumbaiTestnet,
			} as Web3ProviderConfig;
        container.registerSingleton(EthereumSmartContractHelper,
            () => new EthereumSmartContractHelper(networkProviders));
        container.register('JsonStorage', () => new Object());
        container.registerSingleton("LambdaSqsHandler",
            () => new Object());
        container.register(LoggerFactory,
            () => new LoggerFactory((name: string) => new ConsoleLogger(name)));

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
	}
}

export async function decryptKey(region: string, keyId: string, keyJson: string): Promise<string> {
    ValidationUtils.isTrue(!!keyJson, 'Private key must be provided');
    const key = JSON.parse(keyJson) as EncryptedData;
    return await new KmsCryptor(new KMS({region}), keyId).decryptToHex(key);
}