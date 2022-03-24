import React, { useEffect, useState } from "react";
import { StoreBuilder } from "common-containers";
// import "./App.css";
import "./assets/css/icons.min.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { BridgeModule } from "./common/BridgeModule";
import { dataReducer, uiReducer, userReducer } from "./common/Reducer";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { GlobalStyles } from "./theme/GlobalStyles";

const _module = new BridgeModule();
const BASE_URL = "https://tymkxhvpfj.us-east-2.awsapprunner.com/";
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  BASE_URL
);
require('dotenv').config()

function App() { 

  return (
    <StoreBuilder.Provider store={store}>
        <GlobalStyles/>
        <ToastProvider>
          <Router>
            <Dashboard />
          </Router>
        </ToastProvider>
     
    </StoreBuilder.Provider>
  );
}

export default App;
