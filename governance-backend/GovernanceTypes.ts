import { MongooseConfig } from "aws-lambda-helper";
import { AbiFetcherConfig } from "./src/AbiFetcher";

export interface GovernanceConfig {
	database: MongooseConfig;
	etherscan: AbiFetcherConfig;
}