import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { Utils } from "types/dist/Utils";
import { StandaloneClient } from "./StandaloneClient";
import Big from 'big.js';

export class StandaloneErc20 implements Injectable {
    private cache = new LocalCache();
    constructor(
        private api: StandaloneClient,
    ) {}

    __name__(): string { return 'StandaloneErc20'; }

    async decimals(currency: string) {
        ValidationUtils.isTrue(!!currency, '"currency" is required');
        return this.cache.getAsync(currency, async () => {
            const [network, token] = Utils.parseCurrency(currency);
            const provider = this.api.ethersProvider(network);
            // TODO: Get token decimals
            return 18;
        });
    }

    async humanToMachine(currency: string, amount: string): Promise<string> {
        const decimals = await this.decimals(currency);
        return new Big(amount).mul(new Big(10).pow(decimals)).toFixed();
    }

    async machineToHuman(currency: string, amount: string): Promise<string> {
        const decimals = await this.decimals(currency);
        return new Big(amount).div(new Big(10).pow(decimals)).toFixed();
    }
}