import { Injectable, JsonRpcRequest } from "ferrum-plumbing";
import { ApiClient } from "common-containers";
export class LeaderboardClient implements Injectable {
  __name__() {
    return "LeaderboardClient";
  }
  constructor(private api: ApiClient) {
    console.log("LeaderboardClient")
  }

  async getLeaderboardPaginatedList() {
    const res = await this.api.api({
      command: "getLeaderboardPaginatedList",
      data: { },
      params: [],
    } as JsonRpcRequest);
    return res;
  }
}
