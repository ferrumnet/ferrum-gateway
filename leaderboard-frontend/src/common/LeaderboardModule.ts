import { Container, Module } from "ferrum-plumbing";
import { ApiClient } from "common-containers";
import { LeaderboardClient } from "../clients/LeaderboardClient";

export class LeaderboardModule implements Module {
  private configured: boolean = false;
  private static _container: Container;

  async configAsync(c: Container): Promise<void> {
    if (this.configured) {
      return;
    }
    try {
      c.register(
        LeaderboardClient,
        (c) => new LeaderboardClient(c.get(ApiClient))
      );
    } finally {
      this.configured = true;
    }
  }
}
