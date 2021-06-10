// Author : Abdul Ahad
import React from "react";
import { Button } from "react-bootstrap";
import "../../assets/scss/_buttons.scss";
import { Badge } from 'antd';
// import ThemeSelector from "../ThemeSelector";

export const WithdrawlsButton = ({ customClasses, ...rest }) => {
  return (
    <Button variant="pri" className={`btn-icon btn-withdrawl ${customClasses ? customClasses : ""}`} {...rest}>
      <i className="mdi mdi-wrap"></i>
      <span>Withdrawals</span>
      <span>
          <Badge
              className="site-badge-count-109"
              count={rest.count}
              style={{ backgroundColor: '#52c41a',marginLeft: '6px' }}
          />
      </span>
    </Button>
  );
};
