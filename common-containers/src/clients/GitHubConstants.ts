import { Injectable, LocalCache, NetworkedConfig } from "ferrum-plumbing";
import { BackendConstants } from "types";
import { GlobalConstants } from "./StandaloneClient";

const GITHUB_URL_FOR_PROVIDER = 'https://raw.githubusercontent.com/ferrumnet/ferrum-token-list/main/globalConstants/UiConstants.json';
const GITHUB_URL_FOR_BRIDGE = 'https://raw.githubusercontent.com/ferrumnet/ferrum-token-list/main/bridge/constants.json';

export class GitHubConstants implements GlobalConstants, Injectable {
    private cache = new LocalCache();
    __name__() { return 'GitHubConstants'; }
    async get(): Promise<{ providers: NetworkedConfig<string>, constants: BackendConstants} > {
        const bridgeConstsRes = await this.cache.getAsync(GITHUB_URL_FOR_BRIDGE, async () => fetch(GITHUB_URL_FOR_BRIDGE));
        const bridgeConsts = await bridgeConstsRes.json();
        const providerConstsRes = await this.cache.getAsync(GITHUB_URL_FOR_PROVIDER, async () => fetch(GITHUB_URL_FOR_PROVIDER));
        const providerConsts = await providerConstsRes.json();
        return {
            providers: providerConsts.providers,
            constants: bridgeConsts,
        }
    }
}