import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as themes from "./theme/schema.json";
import { setToLS,setAllThemes,getFromLS } from "./storageUtils/storage";
import { getGroupIdFromHref } from './common/Utils';

const Index = () => {
  let groupId = getGroupIdFromHref();
  if(groupId){
    const theme = getFromLS(`${groupId}-all-themes`)
    if(!theme){
      setToLS(`${groupId}-all-themes`,themes);
      setToLS(`${groupId}-theme`,themes);
    }else{
      setAllThemes(`all-themes`,themes);
    }
  }else{
    setAllThemes(`all-themes`,themes);
  }
 
  return <App />;
};
ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById("root")
);
 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();