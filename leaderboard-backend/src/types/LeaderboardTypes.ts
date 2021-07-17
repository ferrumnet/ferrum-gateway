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

export interface Addresses {
  network: String;
  address: String;
  createdAt: Date;
}

export interface QueryParams {
  filter: { by: string; value: string };
  sort: { by: string; order: string };
  page: number;
  limit: number;
}

export const addressSchema: Schema = new Schema<Document & Addresses>({
  network: String,
  address: String,
  createdAt: Date,
});

export const AddressesModel = (c: Connection) =>
  c.model<Addresses & Document>("addresses", addressSchema);
