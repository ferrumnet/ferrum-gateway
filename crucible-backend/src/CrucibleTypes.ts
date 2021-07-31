import { Schema, Document, Connection, } from "mongoose";
import { NetworkRelatedConfig, StoredAllocationCsv, CrucibleInfo } from "types";

export interface CrucibleConfig {
	routerAddress: NetworkRelatedConfig;
}

export const crucibleAllocationCsvSchema = new Schema<Document & StoredAllocationCsv> ({
	network: String,
	contract: String,
	csv: String,
});

export const CrucibleAllocationCsvModel = (c: Connection) =>
    c.model<StoredAllocationCsv&Document>('crucibleAllocationCsv', crucibleAllocationCsvSchema);

export const crucibleInfoSchema = new Schema<Document & CrucibleInfo> ({
	network: String,
	contractAddress: String,
	openCap: String,
	activeAllocationSum: String,
	activeAllocationCount: Number,
	priceUsdt: String,
	priceEth: String,
	leftFromCap: String,
	currency: String,
	feeOnTransferRate: String,
	feeOnWithdrawRate: String,
	totalSupply: String,
	feeDescription: String,
});

export const CrucibleInfoModel = (c: Connection) =>
    c.model<CrucibleInfo&Document>('crucibleInfo', crucibleInfoSchema);
