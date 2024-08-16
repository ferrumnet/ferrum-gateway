import { NetworkedConfig } from "types";

export interface QpContractConfig {
    gateway: NetworkedConfig<string>;
}

export const QP_CONTRACT_CONFIG: QpContractConfig = {
    gateway: {
        'BSC': '0x69b029230cdb36366419ef3d1e72ccb896d9c75c',
        'ETHEREUM_ARBITRUM': '0x69b029230cdb36366419ef3d1e72ccb896d9c75c',
        'BASE_MAINNET': '0x69b029230cdb36366419ef3d1e72ccb896d9c75c',
        'FERRUM_TESTNET': '0x69b029230cdb36366419ef3d1e72ccb896d9c75c',
    },
}