import { HttpRequestProcessor, HttpRequestData } from "types";
import { Injectable } from "ferrum-plumbing";
import { LeaderboardService } from "../service/LeaderboardService";
export class LeaderboardRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
  constructor(private ls: LeaderboardService) {
    super();

    this.registerProcessor("getLeaderboardPaginatedList", (req) =>
      this.getLeaderboardPaginatedList(req)
    );
  }

  __name__() {
    return "LeaderboardRequestProcesser";
  }

  async getLeaderboardPaginatedList(req: HttpRequestData) {
    return this.ls.getLeaderboardPaginatedList();
  }
}
