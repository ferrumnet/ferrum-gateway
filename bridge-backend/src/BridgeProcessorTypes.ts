import { MongooseConfig } from "aws-lambda-helper";
import { Connection, Document, Schema } from "mongoose";
import {ValidationUtils} from "ferrum-plumbing";
import { BridgeTokenConfig, BridgeV12Contracts, NetworkedConfig, SwapProtocol } from 'types';

export interface TokenBridgeConfig {
    contractClient: {[k: string]: string};
}

export interface BridgeProcessorConfig {
    database: MongooseConfig;
    addressManagerEndpoint: string;
    addressManagerSecret: string;
    bridgeConfig: TokenBridgeConfig;
	bridgeV12Config: NetworkedConfig<BridgeV12Contracts>;
	swapProtocols?: NetworkedConfig<SwapProtocol[]>;
}

export function env(env: string) {
    return process.env[env];
}

export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}

const bridgeTokenConfigSchema: Schema = new Schema<Document&BridgeProcessorConfig>({
    sourceNetwork: String,
    targetNetwork: String,
    sourceCurrency: String,
    targetCurrency: String,
    feeConstant: String,
    fee: String,
});

export const BridgeTokenConfigModel = (c: Connection) =>
    c.model<BridgeTokenConfig&Document>('bridgeTokenConfig', bridgeTokenConfigSchema);
