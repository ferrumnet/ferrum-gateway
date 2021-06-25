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
import { useTheme } from "./theme/useTheme";
import { ThemeProvider } from "styled-components";
import { getEnv } from 'types';

const _module = new BridgeModule();
const BASE_URL = "http://localhost:8080";
const store = StoreBuilder.build(
  userReducer,
  dataReducer,
  uiReducer,
  _module,
  BASE_URL
);
require('dotenv').config()

function App() {
  const { theme, themeLoaded, getFonts } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [newTheme] = useState();
  useEffect(() => {
    setSelectedTheme(theme);
    // eslint-disable-next-line
  }, [themeLoaded]);

  console.log(selectedTheme)

  return (
    <StoreBuilder.Provider store={store}>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyles/>
        <ToastProvider>
          <Router>
            <Dashboard setter={(value :any)=>setSelectedTheme(value)} newTheme={newTheme}/>
          </Router>
        </ToastProvider>
     
      </ThemeProvider>
    </StoreBuilder.Provider>
  );
}

export default App;
