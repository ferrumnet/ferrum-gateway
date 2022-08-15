import Web3 from "web3";

export type AbiItemStateMutability = 'view' | 'nonpayable' | 'payable';
export type AbiItemType = 'function' | 'event';
export type AbiItemInputType = 'address' | 'uint256' | 'boolean' | 'bytes32' | 'bytes';

export interface AbiItemInput {
    indexed: boolean;
    name: string;
    type: AbiItemInputType;
};

export interface AbiItemOutput {
    name: string;
    type: AbiItemInputType;
};

export interface AbiItem {
    anonymous: boolean;
    constant: boolean;
    inputs: AbiItemInput[];
    name: string;
    outputs: AbiItemOutput[];
    payable: boolean;
    stateMutability: AbiItemStateMutability;
    type: AbiItemType;
}

export type AbiModel = AbiItem[];

export class Uint256Type {
    static isUint(abiType: AbiItemInputType): boolean {
        return abiType === 'uint256';
    }

    static toWei(humanVal: string): string {
        try {
            return Web3.utils.toWei(humanVal);
        } catch (_) {
            return '';
        }
    }

    static fromWei(weiVal: string): string {
        try {
            return Web3.utils.fromWei(weiVal);
        } catch (_) {
            return '';
        }
    }
}
