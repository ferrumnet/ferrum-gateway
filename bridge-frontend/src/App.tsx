import React, { useState } from "react";
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
import { Environment } from 'types';

import {
  ThemeBuilder,
  // @ts-ignore
} from "component-library";
const _module = new BridgeModule();
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  'https://api-gateway.svcs.ferrumnetwork.io/gateway-backend-prod'
);

const showThemeBuilder = false

function App() {
  // const [themeConfig,setThemeConfig] = useState({primary:"",secondary:"",backgroud:"",radius:0,backgroundImage:"",logo:""});
  const [themeConfig, setThemeConfig] = useState({
    headingColor: "", //"#fff",

    // btnBackgroundSize: "", //"100%",
    btnPadding: "", //"10px 15px",
    btnBorderRadius: "", //"40px",
    btnBgColor: "", //"linear-gradient(to right, #da1e5e 0%, #f69322 50%, #da1e5e 100%)",
    btnTextColor: "", //"rgb(17, 17, 17)",
    btnTextPriColor: "", //"#fff",
    btnTextSecColor: "", //"#fff",
    btnActiveColor: "", //"linear-gradient(to right, #F69321 0%, #F69321 50%, #da1e5e 100%)",

    stepsFinishBgColor: "", //"rgb(219, 72, 59)",
    stepsFinishBorderColor: "", //"rgb(219, 72, 59)",
    stepsWaitBgColor: "", //"rgb(219, 72, 59)",
    stepsWaitBorderColor: "", //"rgb(219, 72, 59)",
    stepsProcessBgColor: "", //"rgb(219, 72, 59)",
    stepsProcessBorderColor: "",

    cardBorderRadius: "", //"20px",
    cardBoxShadow: "", //"rgb(0 0 0 / 14%) -2px -1px 5px 2px",
    cardPri: "", //"#0A0738",
    cardTextPri: "", //"#0A0738",
    cardSec: "", //"#110252",
    cardTextSec: "", //"#110252",

    alertFailBgColor: "",
    alertFailBgText: "",

    useBgImage: undefined,
    removeBgShadow: undefined,
    faviconImg: "", //"https://paidnetwork.com/wp-content/uploads/2020/09/paidfav-150x150.jpg",
    mainLogo: "", //"https://i.imgur.com/2MtwKPi.png",
    bgImg: " ", //"https://i.imgur.com/b2gZEEX.jpg",
  });
  return (
    <StoreBuilder.Provider store={store}>
      <ToastProvider>
        <Router>
          <Dashboard themeConfig={themeConfig} />
        </Router>
      </ToastProvider>
      {
        showThemeBuilder &&
        <ThemeBuilder
          config={themeConfig}
          onChange={(value: any) => {
            setThemeConfig({ ...value });
          }}
        />
      }
    </StoreBuilder.Provider>
  );
}

export default App;
