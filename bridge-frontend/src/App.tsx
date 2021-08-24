import React, { useEffect, useState } from "react";
import { StoreBuilder } from "common-containers";

// import "./App.css";
import "./assets/css/icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { BridgeModule } from "./common/BridgeModule";
import { dataReducer, uiReducer, userReducer } from "./common/Reducer";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";

import {
  ThemeBuilder,
  // @ts-ignore
} from "component-library";
const _module = new BridgeModule();
//const BASE_URL = "http://localhost:8080"
//  const BASE_URL = " https://an54zzyt9h.execute-api.ap-south-1.amazonaws.com/default/test";
const BASE_URL =
  "https://sij6ulh6gc.execute-api.us-east-2.amazonaws.com/default/prod-gateway-backend";
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  BASE_URL
);

function App() {
  // const [themeConfig,setThemeConfig] = useState({primary:"",secondary:"",backgroud:"",radius:0,backgroundImage:"",logo:""});
  const [themeConfig, setThemeConfig] = useState({
    headingColor: "", //"#fff",
    btnBgColor: "", //"linear-gradient(to right, #da1e5e 0%, #f69322 50%, #da1e5e 100%)",
    btnTextColor: "", //"rgb(17, 17, 17)",
    btnTextPriColor: "", //"#fff",
    btnTextSecColor: "", //"#fff",
    btnActiveColor: "", //"linear-gradient(to right, #F69321 0%, #F69321 50%, #da1e5e 100%)",

    stepsBgColor: "", //"#19792f",
    stepsBorderColor: "", //"#19792f",
    stepsWaitBgColor: "", //"rgb(219, 72, 59)",

    cardBgColor: "", //"#0A0738",
    cardSec: "", //"#110252",

    btnBackgroundSize: "", //"100%",
    btnPadding: "", //"10px 15px",
    cardBoxShadow: "", //"rgb(0 0 0 / 14%) -2px -1px 5px 2px",
    btnBorderRadius: "", //"40px",
    cardBorderRadius: "", //"20px",
    faviconImg: "", //"https://paidnetwork.com/wp-content/uploads/2020/09/paidfav-150x150.jpg",
    mainLogo: "", //"https://i.imgur.com/2MtwKPi.png",
    useBgImg: true,
    bgImg: "", //"https://i.imgur.com/b2gZEEX.jpg",
  });
  return (
    <StoreBuilder.Provider store={store}>
      <ToastProvider>
        <Router>
          <Dashboard themeConfig={themeConfig} />
        </Router>
      </ToastProvider>
      <ThemeBuilder
        config={themeConfig}
        onChange={(value: any) => {
          setThemeConfig({ ...value });
        }}
      />
    </StoreBuilder.Provider>
  );
}

function readFile(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default App;
