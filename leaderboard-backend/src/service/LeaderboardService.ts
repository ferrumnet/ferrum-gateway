import { MongooseConnection } from "aws-lambda-helper";
import { Injectable } from "ferrum-plumbing";
import { Connection, Document, Model } from "mongoose";
import {
  QueryParams,
  Addresses,
  AddressesModel,
} from "../types/LeaderboardTypes";
const QUICK_TIMEOUT_MILLIS = 300 * 60 * 1000;
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

  async getLeaderboardPaginatedList(queryParams: QueryParams) {
    this.verifyInit();
    console.log(queryParams);
    const r = await this.addressModel!.find(
      queryParams?.filter?.by
        ? { [queryParams.filter.by]: queryParams.filter.value }
        : {}
    )
      .skip((queryParams?.page - 1) * queryParams?.limit)
      .limit(queryParams.limit)
      .sort(
        queryParams?.sort
          ? {
              [queryParams.sort.by]: queryParams.sort.order === "ASC" ? 1 : -1,
            }
          : {}
      )
      .exec();
    if (r) {
      return JSON.stringify(r);
    }
  }

  async close() {
    if (this.con) {
      await this.con!.close();
    }
  }
}
