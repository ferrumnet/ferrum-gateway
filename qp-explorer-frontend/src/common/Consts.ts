import { NetworkedConfig } from "types";

export interface QpContractConfig {
    gateway: NetworkedConfig<string>;
}

export const QP_CONTRACT_CONFIG: QpContractConfig = {
    gateway: {
        'BSC': '0xba084017c14c81b9bb07c7730176307cbb264763',
        'ETHEREUM_ARBITRUM': '0xba084017c14c81b9bb07c7730176307cbb264763',
        'BASE_MAINNET': '0xba084017c14c81b9bb07c7730176307cbb264763',
        'FERRUM_TESTNET': '0x01072085b62f3572e034798f3fca46cbe6d581d3',
    },
}