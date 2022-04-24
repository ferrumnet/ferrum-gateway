import { Connection, Schema, Document } from 'mongoose';
import { QuantumPortalRemoteTransactoin } from "./QuantumPortalRemoteTransaction";

export interface QuantumPortalBlockFinalization {
    timestamp: number;
    executorId: string;
    finalizedBlockHash: string;
    finalizerHash: string;
    totalBlockStake: string;
}

export interface QuantumPortalMinedBlock {
    version: string;
    networkId: string;
    nonce: number;
    timestamp: number;
    finalization?: QuantumPortalBlockFinalization;
    blockHash: string;
    minerId: string;
    stake: string;
    totalValue: string;
    transactions: QuantumPortalRemoteTransactoin[];
    transactionCount: number;
}

const quantumPortalBlockFinalizationSchema = new Schema<Document&QuantumPortalBlockFinalization>({
    timestamp: Number,
    executorId: String,
    finalizedBlockHash: String,
    finalizerHash: String,
    totalBlockStake: String,
});

const quantumPortalMinedBlockSchema = new Schema<Document&QuantumPortalMinedBlock>({
    version: String,
    networkId: String,
    nonce: Number,
    timestamp: Number,
    finalization: quantumPortalBlockFinalizationSchema,
    blockHash: String,
    minerId: String,
    stake: String,
    totalValue: String,
    transactionCount: String,
    // transactions: QuantumPortalRemoteTransactoin[]; // This should come from a join query
});

export const QuantumPortalMinedBlockModel = (c: Connection) => c.model<QuantumPortalMinedBlock&Document>('quantumPortalMinedBlock', quantumPortalMinedBlockSchema);