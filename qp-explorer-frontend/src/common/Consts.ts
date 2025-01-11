import { NetworkedConfig } from "types";

export interface QpContractConfig {
    gateway: NetworkedConfig<string>;
}

export const QP_CONTRACT_CONFIG_MAINNET: QpContractConfig = {
    gateway: {
        'BSC': '0x256d45a60c2491078958E0432581377EC37b4184',
        'ETHEREUM_ARBITRUM': '0x71c948fa16190b76ea833f1f738404491776dc21',
        'BASE_MAINNET': '0x256d45a60c2491078958E0432581377EC37b4184',
        'FERRUM_MAINNET': '0x71c948fa16190b76ea833f1f738404491776dc21',
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