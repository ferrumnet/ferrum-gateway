import { Connection, Schema, Document } from 'mongoose';
import { AbiModel } from 'web3-tools';

export interface QuantumPortalAccountBalance {
    tokenId: string;
    symbol: string;
    balanceRaw: string;
    balanceDisplay: string;
    price: string;
    currentValue: string;
} 

export interface QuantumPortalContractObject {
    contractId: string;
    contractName: string;
    sourceName: string;
    abi: AbiModel;
    byteCode: string;
    deployedByteCode: string;
}

export interface QuantumPortalContractAccount {
    address: string;
    network: string;
    abi: AbiModel;
    code: string;
    metadata: Object;
    contractId: string;
}

export interface QuantumPortalAccount {
    address: string;
    isContract: boolean;
    contract: { [k: string]: QuantumPortalContractAccount };
}

// const quantumPortalContractSchema = new Schema<Document&QuantumPortalAccount>({
//     address: String,
//     network: String,
//     abi: String,
//     code: String,
//     metadata: Object,
// });

const quantumPortalContractObjectSchema = new Schema<Document&QuantumPortalContractObject>({
    contractId: String,
    contractName: String,
    sourceName: String,
    abi: Object,
    byteCode: String,
    deployedByteCode: String,
});

const quantumPortalAccountSchema = new Schema<Document&QuantumPortalAccount>({
    address: String,
    isContract: Boolean,
    contract: Object,
});

export const QuantumPortalContractObjectModel = (c: Connection) => c.model<QuantumPortalContractObject&Document>(
    'quantumPortalContractObject', quantumPortalContractObjectSchema);

export const QuantumPortalAccountModel = (c: Connection) => c.model<QuantumPortalAccount&Document>(
    'quantumPortalAccount', quantumPortalAccountSchema);
