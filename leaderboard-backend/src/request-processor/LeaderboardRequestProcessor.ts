import { HttpRequestProcessor, HttpRequestData } from "types";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
export class LeaderboardRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
  constructor() {
    super();

    this.registerProcessor("getLeaderboardPaginatedList", (req, userId) =>
      this.getLeaderboardPaginatedList(req, userId!)
    );
  }

  __name__() {
    return "LeaderboardRequestProcesser";
  }

  async getLeaderboardPaginatedList(req: HttpRequestData, userId: string) {
    console.log("weheeeeeee");
  }
}
