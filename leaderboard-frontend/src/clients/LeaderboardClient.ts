import { Injectable, JsonRpcRequest } from "ferrum-plumbing";
import { ApiClient } from "common-containers";
import { Accounts } from "../types/LeaderboardTypes";
export class LeaderboardClient implements Injectable {
  __name__() {
    return "LeaderboardClient";
  }
  constructor(private api: ApiClient) {
    console.log("LeaderboardClient");
  }

  async getLeaderboardPaginatedList(): Promise<Accounts[]> {
    const res = await this.api.api({
      command: "getLeaderboardPaginatedList",
      data: {},
      params: [],
    } as JsonRpcRequest);
    return res;
  }
}
