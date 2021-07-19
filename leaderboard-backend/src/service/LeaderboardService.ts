import { MongooseConnection } from "aws-lambda-helper";
import { Injectable, LocalCache } from "ferrum-plumbing";
import { Connection, Document, Model } from "mongoose";
import { Addresses, AddressesModel } from "../types/LeaderboardTypes";
const QUICK_TIMEOUT_MILLIS = 300 * 60 * 1000;

const GLOBAL_CACHE = new LocalCache();
const CACHE_TIMEOUT = 3600000; //1 Hour
export class LeaderboardService
  extends MongooseConnection
  implements Injectable
{
  private addressModel: Model<Addresses & Document> | undefined;
  private con: Connection | undefined;

  initModels(con: Connection): void {
    this.addressModel = AddressesModel(con);
    this.con = con;
  }
  __name__() {
    return "LeaderboardService";
  }

  async getLeaderboardPaginatedList() {
    this.verifyInit();
    const key = "getLeaderboardPaginatedList";
    return await GLOBAL_CACHE.getAsync(
      key,
      async () => {
        const r = await this.addressModel!.find().exec();
        if (r) {
          return JSON.stringify(r);
        }
      },
      CACHE_TIMEOUT
    );
  }

  async close() {
    if (this.con) {
      await this.con!.close();
    }
  }
}
