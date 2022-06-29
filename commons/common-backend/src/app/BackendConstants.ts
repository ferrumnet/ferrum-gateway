import { NetworkedConfig } from "ferrum-plumbing";
import { BridgeV12Contracts } from "types";

export interface BackendConstants {
    explorerLinkForTransaction: NetworkedConfig<string>[];
    explorerLinkForAddress: NetworkedConfig<string>[];
    bridgeNetworks: string[];
    contracts: {
        bridgeV1Contracts: NetworkedConfig<string>;
        bridgeV12Contracts: NetworkedConfig<BridgeV12Contracts>;
    };
    networkLogos: NetworkedConfig<string>;
}