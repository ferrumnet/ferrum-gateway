import { NetworkedConfig } from 'types';
import web3 from 'web3';

export const USDT: NetworkedConfig<string> = {
    'ETHEREUM': 'ETHEREUM:0xdac17f958d2ee523a2206206994597c13d831ec7',
    'RINKEBY': 'RINKEBY:0x8120736d9fa0b5e7cc1a6c3007f7b02450ccf6b7',
}

export function toWei(amount: string) {
    return web3.utils.toWei(amount.toString(), "ether");
}