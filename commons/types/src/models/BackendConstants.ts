import { NetworkedConfig } from "ferrum-plumbing";

export interface BackendConstants {
    explorerLinkForTransaction: NetworkedConfig<string>[];
    explorerLinkForAddress: NetworkedConfig<string>[];
    networkLogos: NetworkedConfig<string>;
    bridgeNetworks: string[];
}