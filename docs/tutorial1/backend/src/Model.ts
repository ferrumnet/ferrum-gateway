import { Connection, Document, Schema } from "mongoose";

export interface Winner {
    timestamp: number;
    address: string;
    amount: string;
}

const winnerSchema = new Schema<Winner&Document>({
    timestamp: Number,
    address: String,
    amount: String,
});

export const WinnerModel = (c: Connection) => c.model<Winner&Document>(
    'winners', winnerSchema);