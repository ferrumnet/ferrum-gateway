import { MongooseConnection } from "aws-lambda-helper";
import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { Connection, Model, Schema } from "mongoose";
import { RoutingTable, RoutingTableGroup, RoutingTableItem } from 'types';

const ROUTING_TABLE_VERSION = '1.0';
const TEN_MINUTES = 10 * 60 * 1000;

const routingTableSchema = new Schema<RoutingTableGroup&Document>({
    routingId: String,
    items: [new Schema<RoutingTableItem&Document>({
        network: String,
        currency: String,
        fee: String,
    })],
});

const RoutingTableModel = (c: Connection) =>
  c.model<RoutingTableGroup & Document>(
    "bridgeroutingtable",
    routingTableSchema,
  );

export class RoutingTableService extends MongooseConnection implements Injectable {
    private routingTableModel: Model<RoutingTableGroup&Document> | undefined;
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
            const routingTable = { version: ROUTING_TABLE_VERSION, groups: [] } as RoutingTable;
             all.forEach(g => {
                 const group = g.toJSON() as RoutingTableGroup;
                 routingTable.groups.push(group);
             });
             return routingTable;
        }, TEN_MINUTES);
    }
}