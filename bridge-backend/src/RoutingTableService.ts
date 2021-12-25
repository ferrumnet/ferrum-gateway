import { MongooseConnection } from "aws-lambda-helper";
import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { Connection, Model, Schema } from "mongoose";
import { RoutingTable, RoutingTableItem } from 'types';

const routingTableSchema = new Schema<RoutingTable&Document>({
    version: String,
    items: [new Schema<RoutingTableItem&Document>({
        network: String,
        currency: String,
        fee: String,
    })],
});

const RoutingTableModel = (c: Connection) =>
  c.model<RoutingTable & Document>(
    "bridgeroutingtable",
    routingTableSchema,
  );

export class RoutingTableService extends MongooseConnection implements Injectable {
    private routingTableModel: Model<RoutingTable&Document> | undefined;
    private cache = new LocalCache();
    constructor() {
        super();
    }

    __name__(): string {
        return 'RoutingTableService';
    }

    initModels(con: Connection): void {
        this.routingTableModel = RoutingTableModel(con);
    }

    async getRoutingTable(): Promise<RoutingTable> {
        return this.cache.getAsync<RoutingTable>('ROUTING_TABLE', async () => {
            const all =  await this.routingTableModel.find().exec();
            ValidationUtils.isTrue(!!all && !!all.length, 'No routing table defined');
            return all[0].toJSON();
        });
    }
}