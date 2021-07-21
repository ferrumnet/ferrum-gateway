import { MongooseConfig } from "aws-lambda-helper";
import { ValidationUtils } from "ferrum-plumbing";
import { Connection, Schema, Document } from "mongoose";
export interface LeaderBoardConfig {
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

export interface Accounts {
  accountType: String;
}

export const accountsSchema: Schema = new Schema<Document & Accounts>({
  accountType: String,
});

export const AccountsModel = (c: Connection) =>
  c.model<Accounts & Document>("accounts", accountsSchema);
