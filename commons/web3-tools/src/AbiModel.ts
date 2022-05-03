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