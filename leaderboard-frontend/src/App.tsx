import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";
import AppRoutes from "./AppRoutes";
import Footer from "./layout/footer";
import Header from "./layout/header";
import { StoreBuilder } from "common-containers";
import { LeaderboardModule } from "./common/LeaderboardModule";
import { BrowserRouter } from "react-router-dom";
import { dataReducer, uiReducer, userReducer } from "./common/Reducer";

const _module = new LeaderboardModule();
const BASE_URL = "https://0tuzdel09c.execute-api.us-east-1.amazonaws.com/default/leaderboard-backend-prod";
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  BASE_URL
);

function App() {
  return (
    <>
      {_module ? (
        <StoreBuilder.Provider store={store}>
          <BrowserRouter>
            <div className="app-wrapper">
              <Header />
              <main>
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </StoreBuilder.Provider>
      ) : (
        "loading"
      )}
    </>
  );
}

export default App;
