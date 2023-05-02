import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { Utils } from "types/dist/Utils";
import { StandaloneClient } from "./StandaloneClient";
import { Contract } from 'ethers';
import Big from 'big.js';

const DECIMALS_ABI = [{
    "constant": true,
    "inputs": [
    ],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }];

const SYMBOL_ABI = [{
    "constant": true,
    "inputs": [
    ],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }];

export class StandaloneErc20 implements Injectable {
    private cache = new LocalCache();
    constructor(
        private api: StandaloneClient,
    ) {}

    __name__(): string { return 'StandaloneErc20'; }

    async decimals(currency: string) {
        ValidationUtils.isTrue(!!currency, '"currency" is required');
        return this.cache.getAsync(currency + '_DECIMALS', async () => {
            const [network, token] = Utils.parseCurrency(currency);
            const provider = this.api.ethersProvider(network);
            const contract = new Contract(token, DECIMALS_ABI, provider);
            return await contract.decimals();
        });
    }

    async symbol(currency: string) {
        ValidationUtils.isTrue(!!currency, '"currency" is required');
        return this.cache.getAsync(currency + '_SYMBOL', async () => {
            const [network, token] = Utils.parseCurrency(currency);
            const provider = this.api.ethersProvider(network);
            const contract = new Contract(token, SYMBOL_ABI, provider);
            return await contract.symbol();
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