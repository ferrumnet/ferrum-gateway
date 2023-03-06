import { NetworkedConfig } from "types";

export interface QpContractConfig {
    gateway: NetworkedConfig<string>;
}

export const QP_CONTRACT_CONFIG: QpContractConfig = {
    gateway: {
        'BSC_TESTNET': '0x92660cbfa6f120dd4343afd4a74a030506dc9acb',
        'MUMBAI_TESTNET': '0x92660cbfa6f120dd4343afd4a74a030506dc9acb',
        'FERRUM_TESTNET': '0x92660cbfa6f120dd4343afd4a74a030506dc9acb',
        'AVAX_TESTNET': '0x92660cbfa6f120dd4343afd4a74a030506dc9acb',
    },
}