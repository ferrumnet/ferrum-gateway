import React from "react";

import PageNotFound from "./pages/error/PageNotFound";
import SearchWalletPage from "./pages/search-wallet/page";

import { Switch, Route, Redirect } from "react-router-dom";

const AppRoutes = () => {
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
