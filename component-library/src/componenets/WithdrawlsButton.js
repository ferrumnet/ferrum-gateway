// Author : Abdul Ahad
import React from "react";
import { Button } from "react-bootstrap";
import "../../assets/scss/_buttons.scss";
// import ThemeSelector from "../ThemeSelector";

export const WithdrawlsButton = ({ customClasses, ...rest }) => {
  return (
    <Button variant="pri" className={`btn-icon btn-withdrawl ${customClasses ? customClasses : ""}`} {...rest}>
      <i className="mdi mdi-wrap"></i>
      <span>Withdrawals</span>
    </Button>
  );
};
