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

import { ThemeBuilder
// @ts-ignore
} from 'component-library';
const _module = new BridgeModule();
//const BASE_URL = "http://localhost:8080"
//  const BASE_URL = " https://an54zzyt9h.execute-api.ap-south-1.amazonaws.com/default/test";
const BASE_URL = "https://sij6ulh6gc.execute-api.us-east-2.amazonaws.com/default/prod-gateway-backend";
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  BASE_URL
);

function App() {

  
  const [themeConfig,setThemeConfig] = useState({primary:"",secondary:"",backgroud:"",radius:0,backgroundImage:"",logo:""});




  return (
    <StoreBuilder.Provider store={store}>
        <ToastProvider>
          <Router>
            <Dashboard themeConfig={themeConfig}/>
          </Router>
        </ToastProvider>
        {/* <ThemeBuilder config={themeConfig} onChange={(value:any)=>{
            setThemeConfig({...value})
        }}/> */}
    </StoreBuilder.Provider>
  );
}


function readFile(file:File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default App;
