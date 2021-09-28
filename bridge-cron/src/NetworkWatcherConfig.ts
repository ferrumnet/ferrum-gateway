import {MultiChainConfig} from "ferrum-chain-clients";
import {Network} from "ferrum-plumbing";
import {AwsConfig, MongooseConfig} from "aws-lambda-helper";

export interface TransactionHookConfig {
    url: string;
    secret: string;
}

export interface NetworkWatcherConfig {
    network: Network;
    timeBetweenBlocks: number,
    timeBetweenCalls: number,
    chainConfig: MultiChainConfig;
    addressMongo: MongooseConfig;
    processedBlockNumbersMongo: MongooseConfig;
    processBlocksInBatch: number;
    hooks: TransactionHookConfig[];
    addressQueue:AwsConfig,
}