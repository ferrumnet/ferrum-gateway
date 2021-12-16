import { Connection, Document, Schema } from "mongoose";
import {ValidationUtils} from "ferrum-plumbing";
import { BridgeTokenConfig, BridgeV12Contracts, NetworkedConfig, SwapProtocol } from 'types';
import { WithDatabaseConfig } from "common-backend";

export interface TokenBridgeConfig {
    contractClient: {[k: string]: string};
}

export interface BridgeProcessorConfig extends WithDatabaseConfig {
    bridgeConfig: TokenBridgeConfig;
	bridgeV12Config: NetworkedConfig<BridgeV12Contracts>;
	swapProtocols?: NetworkedConfig<SwapProtocol[]>;
    validatorAddressesV1?: string[];
    blackListAdminSecret?: string;
}

export function env(env: string) {
    return process.env[env];
}

export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}

const bridgeTokenConfigSchema: Schema = new Schema<BridgeTokenConfig&Document>({
    sourceNetwork: String,
    targetNetwork: String,
    sourceCurrency: String,
    targetCurrency: String,
    feeConstant: String,
    fee: String,
});

export const BridgeTokenConfigModel = (c: Connection) =>
    c.model<BridgeTokenConfig&Document>('bridgeTokenConfig', bridgeTokenConfigSchema);
