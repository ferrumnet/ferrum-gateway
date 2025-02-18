import { NetworkedConfig } from "types";

export interface QpContractConfig {
    gateway: NetworkedConfig<string>;
}

export const QP_CONTRACT_CONFIG_MAINNET: QpContractConfig = {
    gateway: {
        'BSC': '0x46c115355982244B9F922d3E2De8fB837cf2cbDd',
        'ETHEREUM_ARBITRUM': '0x46c115355982244B9F922d3E2De8fB837cf2cbDd',
        'BASE_MAINNET': '0x46c115355982244B9F922d3E2De8fB837cf2cbDd',
        'FERRUM_MAINNET': '0x46c115355982244B9F922d3E2De8fB837cf2cbDd',
    },
}

export const QP_CONTRACT_CONFIG_TESTNET: QpContractConfig = {
    gateway: {
        'BSC': '0xaca0e5235fc2b8c00fd7bca8880aad9234ab264d',
        'ETHEREUM_ARBITRUM': '0xaca0e5235fc2b8c00fd7bca8880aad9234ab264d',
        'BASE_MAINNET': '0xaca0e5235fc2b8c00fd7bca8880aad9234ab264d',
        'FERRUM_TESTNET': '0x12bb388d536e31badb4f14cb744265989b986918',
    },
}