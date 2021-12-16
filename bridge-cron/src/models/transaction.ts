import { Schema, model, Connection, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.

export interface Transactions {
  blockHash: String;
  blockNumber: Number;
  contractAddress: String;
  cumulativeGasUsed: Number;
  effectiveGasPrice: String;
  from: String;
  gasUsed: Number;
  logs: any[];
  logsBloom: String;
  status: Boolean;
  to: String;
  transactionHash: String;
  transactionIndex: Number;
  type: String;
  network: String;
  date: String;
  sent: String;
  symbol: String;
  decimal: String;
}

// 2. Create a Schema corresponding to the document interface.

const transactionsSchema: Schema = new Schema<Document & Transactions>({
  transaction: { type: String },
  blockHash: { type: Number },
  blockNumber: { type: Object },
  contractAddress: { type: String },
  cumulativeGasUsed: { type: Number },
  effectiveGasPrice: { type: String },
  from: { type: String },
  gasUsed: { type: Number },
  logs: { type: Array },
  logsBloom: { type: String },
  status: { type: Boolean },
  to: { type: String },
  transactionHash: { type: String },
  transactionIndex: { type: Number },
  type: { type: String },
  network: { type: String },
  date: { type: String },
  sent: { type: String },
  symbol: { type: String },
  decimal: { type: String },
} as any);

// 3. Create a Model.

export const TransactionModel = model("Transaction", transactionsSchema);
export const transactionModel = (c: Connection) =>
  c.model<Transactions & Document>("Transaction", transactionsSchema);
