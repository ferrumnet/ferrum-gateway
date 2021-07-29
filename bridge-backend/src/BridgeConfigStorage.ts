import { MongooseConnection } from "aws-lambda-helper";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { Connection, Document, Model } from "mongoose";
import { BridgeTokenConfigModel } from "./BridgeProcessorTypes";
import { BridgeTokenConfig } from 'types';

export class BridgeConfigStorage extends MongooseConnection implements Injectable {
    private con: Connection|undefined;
    private model?: Model<BridgeTokenConfig&Document>;
    constructor(
    ) {
        super();
    }

    initModels(con: Connection): void {
        this.model = BridgeTokenConfigModel(con);
        this.con = con;
    }

    __name__() { return 'BridgeConfigStorage'; }

    async tokenConfig(sourceNetwork: string, targetNetwork: string,sourceCurrency:string): Promise<BridgeTokenConfig|undefined> {
        this.verifyInit();
        const r = await this.model!.findOne({'$and': [{sourceNetwork}, {targetNetwork}, {sourceCurrency}]}).exec();
        return !!r ? r.toJSON() : undefined;
    }

    async tokenConfigForCurrencies(currencies: string[]): Promise<BridgeTokenConfig[]> {
        this.verifyInit();
		ValidationUtils.isTrue(currencies.length && !currencies.find(c => !c), "Bad currency list");
        const r = await this.model!.find({'$or': [{
			sourceCurrency: { '$in': currencies },
		}, {
			targetCurrency: { '$in': currencies },
		}]}).exec();
        if (r) {
            return r
        }
        return [];
    }

    async getSourceCurrencies(sourceNetwork: string): Promise<BridgeTokenConfig[]> {
        this.verifyInit();
        const r = await this.model!.find({sourceNetwork});
        if (r) {
            return r.map(i => i.toJSON() as BridgeTokenConfig);
        }
        return [];
    }

    async close() {
        if (this.con) {
            await this.con!.close();
        }
    }
}