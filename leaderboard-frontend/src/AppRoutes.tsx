import React, { useEffect } from "react";

import PageNotFound from "./pages/error/PageNotFound";
import SearchWalletPage from "./pages/search-wallet/page";
import { inject } from "types";
import { Switch, Route, Redirect } from "react-router-dom";
import { LeaderboardClient } from "./clients/LeaderboardClient";
import { useSelector } from "react-redux";
import { LeaderboardAppState } from "./common/LeaderboardAppState";
import axios from "axios";
const AppRoutes = () => {
  const initialized = useSelector<LeaderboardAppState, boolean>(
    (state) => state.data.init.initialized
  );
  useEffect(() => {
    if (initialized) {
      const client = inject<LeaderboardClient>(LeaderboardClient);
      client.getLeaderboardPaginatedList().then((response) => {
        console.log(response.length);
      });
      axios
        .get(
          "https://api.coingecko.com/api/v3/simple/price?ids=frmx-token%2Cferrum-network&vs_currencies=USD"
        )
        .then((response) => {
          console.log(response);
        });
    }
    // eslint-disable-next-line
  }, [initialized]);
  return (
    <Switch>
      <Route exact path="/" component={SearchWalletPage} />
      {/* <Route exact path="/search-wallet" component={SearchWalletPage} /> */}
      <Route exact path="/404" component={PageNotFound} />
      <Redirect to="/404" />
    </Switch>
  );
};
export default AppRoutes;
