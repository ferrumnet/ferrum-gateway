import { MongooseConfig } from "aws-lambda-helper";
import { ValidationUtils } from "ferrum-plumbing";
import { Connection, Schema, Document } from "mongoose";
export interface BridgeCronConfig {
  database: MongooseConfig;
}

export function getEnv(env: string) {
  const res = process.env[env];
  ValidationUtils.isTrue(
    !!res,
    `Make sure to set environment variable '${env}'`
  );
  return res!;
}

export interface Transactions {
  rinkebyTransaction: Object;
}

export const transactionsSchema: Schema = new Schema<Document & Transactions>({
  rinkebyTransaction: Object,
});

export const TransactionsModel = (c: Connection) =>
  c.model<Transactions & Document>("accounts", transactionsSchema);
