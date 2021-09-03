import { MongooseConfig } from "aws-lambda-helper";

export interface GovernanceConfig {
	database: MongooseConfig;
}