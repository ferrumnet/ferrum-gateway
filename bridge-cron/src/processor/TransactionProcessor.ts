import { HttpRequestProcessor, HttpRequestData } from "types";
import { Injectable } from "ferrum-plumbing";
import { BridgeCronService } from "../service/BridgeCronService";
export class BridgeCronRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
  constructor(private ls: BridgeCronService) {
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
