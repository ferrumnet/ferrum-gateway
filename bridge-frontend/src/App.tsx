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
import { ToastProvider } from "react-toast-notifications";

const _module = new BridgeModule();
//const BASE_URL = "http://localhost:8080"
const BASE_URL = " https://an54zzyt9h.execute-api.ap-south-1.amazonaws.com/default/test";
//const BASE_URL = "https://sij6ulh6gc.execute-api.us-east-2.amazonaws.com/default/prod-gateway-backend";
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  BASE_URL
);

function App() {
  
  return (
    <StoreBuilder.Provider store={store}>
        <ToastProvider>
          <Router>
            <Dashboard/>
          </Router>
        </ToastProvider> 
    </StoreBuilder.Provider>
  );
}

export default App;
