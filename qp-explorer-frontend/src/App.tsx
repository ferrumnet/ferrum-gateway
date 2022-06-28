import React from "react";
import { StoreBuilder } from "common-containers";
// import "./assets/css/icons.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/scss/styles.scss";
// import './App.css';
import { Dashboard } from "./pages/Dashboard";
import { dataReducer, uiReducer, userReducer } from "./common/Reducers";
import { BrowserRouter as Router } from "react-router-dom";
import { QpUiModule } from "./common/QpUiModule";
import { Environment } from "types";

const _module = new QpUiModule();
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  // 'https://mz7ub9w7lj.execute-api.us-east-2.amazonaws.com/default/stagin-crucible-backend',
  Environment.defaultEndPoint()
);

function App() {
  return (
    <StoreBuilder.Provider store={store}>
      <Router>
        <Dashboard />
      </Router>
    </StoreBuilder.Provider>
  );
}

export default App;
