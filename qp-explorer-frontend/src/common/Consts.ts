import { NetworkedConfig } from "types";

export interface QpContractConfig {
    gateway: NetworkedConfig<string>;
}

export const QP_CONTRACT_CONFIG: QpContractConfig = {
    gateway: {
        'BSC_TESTNET': '0xd7b6e131074b22c8f0b0f8671789349946ba6a48',
    },
}