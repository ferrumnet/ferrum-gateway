import { MongooseConfig } from "aws-lambda-helper";
import { Connection, Document, Schema } from "mongoose";
import {ValidationUtils} from "ferrum-plumbing";

export interface BridgeTokenConfig {
    sourceNetwork: string;
    targetNetwork: string;
    sourceCurrency: string;
    targetCurrency: string;
    feeConstant: string;
    feeRatio: string;
}

export interface NetworkRelatedConfig {
    [network: string]: string;
}
export interface TokenBridgeConfig {
    contractClient: {[k: string]: string};
}
export interface BridgeProcessorConfig {
    database: MongooseConfig;
    addressManagerEndpoint: string;
    addressManagerSecret: string;
    bridgeConfig: TokenBridgeConfig;
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
    feeRatio: String,
});

export const BridgeTokenConfigModel = (c: Connection) =>
    c.model<BridgeTokenConfig&Document>('bridgeTokenConfig', bridgeTokenConfigSchema);
