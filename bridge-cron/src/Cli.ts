import {AwsEnvs, CloudWatchClient, LambdaGlobalContext, SecretsProvider} from 'aws-lambda-helper';
// import {NodeWatcherModule} from "../common/NodeWatcherModule";
import {NetworkTransactionWatcher} from "./watcher/NetworkTransactionWatcher";
import {Injectable, LoggerFactory, MetricsService, Network, ValidationUtils} from "ferrum-plumbing";
import {NetworkWatcherConfig, TransactionHookConfig} from "./NetworkWatcherConfig";
import {InMemoryAddressListener} from "./InMemoryAddressListener";
import { MultiChainConfig } from "ferrum-chain-clients";
import {Dimension} from "aws-sdk/clients/cloudwatch";
import {LongRunningScheduler} from "ferrum-plumbing/dist/scheduler/LongRunningScheduler";
// import testHooks from '../assets/testHooks.json';
import fs from 'fs';

export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}

async function getConfigFromEnv<T>(region: string, secretArn: string) {
    if (secretArn.startsWith('file://')) { // Config from file
        const js = fs.readFileSync(secretArn.substr(7)).toString('utf-8');
        return JSON.parse(js) as T;
    }
    return await new SecretsProvider(region, secretArn).get() as T;
}

async function getConfig(network: Network) {
    const configSecretArn = getEnv(AwsEnvs.AWS_SECRET_ARN_PREFIX + 'CHAIN_WATCHER');
    const region = process.env[AwsEnvs.AWS_DEFAULT_REGION] || 'us-east-2';
    const addressHooksSecretArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + 'CHAIN_WATCHER_HOOKS'];
    const networkConfigSecretArn = getEnv(AwsEnvs.AWS_SECRET_ARN_PREFIX + 'CHAINS');

    const config = await getConfigFromEnv<NetworkWatcherConfig>(region, configSecretArn);
    const chainConfig = await getConfigFromEnv<MultiChainConfig>(region, networkConfigSecretArn);
    config.network = network;
    if (process.env.USE_GANACHE) {
        chainConfig.web3Provider = 'HTTP://127.0.0.1:7545';
        chainConfig.web3ProviderRinkeby = 'HTTP://127.0.0.1:7545';
        chainConfig.requiredEthConfirmations = 0;
    }
    if (process.env.WEB3_PROVIDER) {
        if (network === 'RINKEBY') {
            chainConfig.web3ProviderRinkeby = process.env.WEB3_PROVIDER;
        } else {
            chainConfig.web3Provider = process.env.WEB3_PROVIDER;
        }
    }
    if (addressHooksSecretArn) {
        ValidationUtils.isTrue(!!addressHooksSecretArn, 'Make sure to provide the env ADDRESS_HOOKS_SECRET_ARN');
        config.hooks = await getConfigFromEnv<TransactionHookConfig[]>(region, addressHooksSecretArn!);
    // } else {
    //     config.hooks = testHooks;
    }
    config.chainConfig = chainConfig;
    config.addressQueue.sqsQueue = config.addressQueue.sqsQueue!.replace(/{{NETWORK}}/, network.toLocaleLowerCase());
    console.log('Listening to queue address ' + config.addressQueue.sqsQueue);
    config.addressQueue.region = region;

    // Net custom config
    if (network === 'ETHEREUM') {
        config.timeBetweenCalls = 500;
        config.timeBetweenBlocks = 10000;
        config.processBlocksInBatch = 1;
    }
    if (network === 'RINKEBY') {
        config.timeBetweenCalls = 500;
        config.timeBetweenBlocks = 10000;
        config.processBlocksInBatch = 1;
    }
    if (network === 'BINANCE') {
        config.timeBetweenCalls = 100;
        config.timeBetweenBlocks = 500;
        config.processBlocksInBatch = 5;
    }
    if (network === 'BITCOIN' || network === 'BITCOIN_TESTNET') {
        config.timeBetweenCalls = 1000;
        config.timeBetweenBlocks = 120000;
        config.processBlocksInBatch = 1;
    }
    return config;
}

export class Cli implements Injectable {
    async setupModule(network: Network) {
        const container = await LambdaGlobalContext.container();
        const config = await getConfig(network);
        container.register('NetworkWatcherConfig', () => config);
        container.register('MetricsUploader', c =>
          new CloudWatchClient(c.get('CloudWatch'), 'NetworkTransactionsWatcher', [
            { Name:'NetworkTransactionsWatcherApplication', Value: 'NetworkTransactionsWatcher' } as Dimension,
            ]));
        const mu = container.get<MetricsService>(MetricsService);
        mu.start();
        return container;
    }

    async main(network?: Network) {
        const container = await this.setUp(network);
        const log = container.get<LoggerFactory>(LoggerFactory).getLogger(Cli);
        const watcher = container.get<NetworkTransactionWatcher>(NetworkTransactionWatcher);
        log.info('Watcher is ready');
        try {
            const scheduler = container.get<LongRunningScheduler>(LongRunningScheduler);
            scheduler.init();
            // Listen to SQS
            const addressListener = container.get<InMemoryAddressListener>('AddressListener');
            await addressListener.listen(scheduler);
            await watcher.run();
            await LongRunningScheduler.runForever(scheduler, 1);
        } catch (e) {
            console.error('MAIN', e)
            log.error('Killing the app due to error.', e);
            process.exit(-1);
        }
        process.exit(0);
    }

    private async setUp(network?: Network) {
        // setup module
        // Init whatever necessary
        // Watch
        ValidationUtils.isTrue(!!network, 'network must be provided');
        try {
            return await this.setupModule(network!);
        } catch (e) {
            console.error("Error setting up module", e);
            throw e;
        }
    }

    __name__(): string { return 'Cli'; }
}