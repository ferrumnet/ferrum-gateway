import { Injectable, JsonRpcRequest } from "ferrum-plumbing";
import { ApiClient } from "common-containers";
import { QueryParams } from "../types/LeaderboardTypes";
export class LeaderboardClient implements Injectable {
  __name__() {
    return "LeaderboardClient";
  }
  constructor(private api: ApiClient) {
    console.log("LeaderboardClient");
  }

  async getLeaderboardPaginatedList(queryParams: QueryParams) {
    const res = await this.api.api({
      command: "getLeaderboardPaginatedList",
      data: {
        queryParams,
      },
      params: [],
    } as JsonRpcRequest);
    return res;
  }
}
