// Author : Abdul Ahad
import React from "react";
import { Button } from "react-bootstrap";
import "../../assets/scss/_buttons.scss";
// import ThemeSelector from "../ThemeSelector";

export const CnctButton = ({ customClasses, ...rest }) => {
  return (
    <Button
      variant="pri"
      className={`btn-icon btn-connect ${customClasses ? customClasses :""}`}
      onClick={rest.onClick}
    >
      <i className="mdi mdi-wallet"></i> <span>{!rest.connected ? 'Connect' : 'Disconnect'}</span>
    </Button>
  );
};
