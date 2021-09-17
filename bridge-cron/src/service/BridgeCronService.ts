import { MongooseConnection } from "aws-lambda-helper";
import { Injectable, LocalCache } from "ferrum-plumbing";
import { Connection, Document, Model } from "mongoose";
import { Transactions, TransactionsModel } from "../types/BridgeCronTypes";
const GLOBAL_CACHE = new LocalCache();
const CACHE_TIMEOUT = 3600000; //1 Hour
export class BridgeCronService
  extends MongooseConnection
  implements Injectable
{
  private transactionModel: Model<Transactions & Document> | undefined;
  private con: Connection | undefined;

  initModels(con: Connection): void {
    this.transactionModel = TransactionsModel(con);
    this.con = con;
  }
  __name__() {
    return "LeaderboardService";
  }

  async getLeaderboardPaginatedList(): Promise<Transactions[]> {
    this.verifyInit();
    const key = "getLeaderboardPaginatedList";
    return await GLOBAL_CACHE.getAsync(
      key,
      async () => {
        const res = await this.transactionModel!.find({
          $and: [
            { "address.network": { $eq: "ETHEREUM" } },
            { "address.balance": { $ne: "0" } },
            {
              $or: [
                {
                  "address.currency": {
                    $eq: "ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c",
                  },
                },
                {
                  "address.currency": {
                    $eq: "ETHEREUM:0xf6832ea221ebfdc2363729721a146e6745354b14",
                  },
                },
              ],
            },
          ],
        }).exec();
        // console.log(res.length);
        // console.log(JSON.stringify(r));
        if (res) {
          return res.map((r) => r.toJSON());
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
