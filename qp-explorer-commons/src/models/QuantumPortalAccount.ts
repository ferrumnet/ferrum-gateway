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

export interface QuantumPortalContractAccount {
    address: string;
    network: string;
    abi: AbiModel;
    code: string;
    metadata: Object;
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

const quantumPortalAccountSchema = new Schema<Document&QuantumPortalAccount>({
    address: String,
    isContract: Boolean,
    contract: Object,
});

export const QuantumPortalAccountModel = (c: Connection) => c.model<QuantumPortalAccount&Document>(
    'quantumPortalAccount', quantumPortalAccountSchema);
