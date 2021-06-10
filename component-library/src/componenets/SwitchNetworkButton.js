// Author : Abdul Ahad
import React from "react";
import { Button } from "react-bootstrap";
import "../../assets/scss/_buttons.scss";
// import ThemeSelector from "../ThemeSelector";

export const SwitchNetworkButton = ({ customClasses, ...rest }) => {
  return (
    <Button variant="sec" className={`btn-icon btn-switch-network ${customClasses ? customClasses : ""}`} {...rest}>
      <i className={`mdi mdi-swap-horizontal`}></i>
      <span>Switch Network</span>
    </Button>
  );
};
