import React, { useEffect } from "react";

import PageNotFound from "./pages/error/PageNotFound";
import SearchWalletPage from "./pages/search-wallet/page";
import { inject } from "types";
import { Switch, Route, Redirect } from "react-router-dom";
import { LeaderboardClient } from "./clients/LeaderboardClient";
import { useSelector } from "react-redux";
import { LeaderboardAppState } from "./common/LeaderboardAppState";
import { QueryParams } from "./types/LeaderboardTypes";
const AppRoutes = () => {
  const initialized = useSelector<LeaderboardAppState, boolean>(
    (state) => state.data.init.initialized
  );
  let queryParams: QueryParams;
  useEffect(() => {
    if (initialized) {
      queryParams = {
        filter: { by: "", value: "" },
        sort: { by: "createdAt", order: "ASC" },
        page: 1,
        limit: 2,
      };
      const client = inject<LeaderboardClient>(LeaderboardClient);
      client.getLeaderboardPaginatedList(queryParams).then((response) => {
        console.log(response.length);
      });
    }
    // eslint-disable-next-line
  }, [initialized]);
  return (
    <Switch>
      <Route exact path="/" component={SearchWalletPage} />
      <Route exact path="/search-wallet" component={SearchWalletPage} />
      <Route exact path="/404" component={PageNotFound} />
      <Redirect to="/404" />
    </Switch>
  );
};
export default AppRoutes;
