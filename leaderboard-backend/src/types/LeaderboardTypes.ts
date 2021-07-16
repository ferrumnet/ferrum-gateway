import { MongooseConfig } from "aws-lambda-helper";
import { ValidationUtils } from "ferrum-plumbing";
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
