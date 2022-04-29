import { Connection, Schema, Document } from 'mongoose';

export interface QuantumPortalRemoteTransactoin {
    hash: string;
    networkId: string;
    remoteNetworkId: string, // Mined on this network
    timestamp: number;
    remoteContract: string;
    sourceMsgSender: string;
    sourceBeneficiary: string;
    tokenId: string;
    tokenSymbol: string;
    amountRaw: string;
    amountDisplay: string;
    method: string;
    gas: string;
    blockHash: string;
    blockIdx: number;
}


const quantumPortalRemoteTransactoinSchema = new Schema<Document&QuantumPortalRemoteTransactoin>({
    hash: String,
    networkId: String,
    remoteNetworkId: String,
    timestamp: Number,
    remoteContract: String,
    sourceMsgSender: String,
    sourceBeneficiary: String,
    tokenId: String,
    tokenSymbol: String,
    amountRaw: String,
    amountDisplay: String,
    method: String,
    gas: String,
    blockHash: String,
    blockIdx: Number,
});

export const QuantumPortalRemoteTransactoinModel = (c: Connection) => c.model<QuantumPortalRemoteTransactoin&Document>(
    'quantumPortalRemoteTransactoin', quantumPortalRemoteTransactoinSchema);
