// Author : Abdul Ahad
import React from "react";
import { Button, Navbar } from "react-bootstrap";
import "../../assets/scss/_header.scss";
// import ThemeSelector from "../ThemeSelector";

 export const Header = ({
  ConnectButton,
  WithdrawlsButton,
  SwitchNetworkButton,
  ThemeSelector,
  logo,
  altText
}) => {
  return (
    <header>
      <Navbar expand="lg">
        <Navbar.Brand href="#home">
          <img 
            alt={`${altText}`}
            src={`${logo}`}
          />
        </Navbar.Brand>        
        <span className="d-flex align-items-center ml-auto">
          <div className="theme-switcher float-left d-flex mr-3">
            {/* <strong className="text-sec mr-3">
              <i className="mdi mdi-brush"></i>
            </strong> */}
            { /*ThemeSelector && <ThemeSelector /> */}
          </div>
          {WithdrawlsButton}
          {SwitchNetworkButton}
          {ConnectButton}
        </span>
      </Navbar>
    </header>
  );
};

export default Header;
