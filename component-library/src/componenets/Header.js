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
  altText,
  logoHeight,
}) => {
  return (
    <header className="navbar">
      <Navbar expand="lg">
        <Navbar.Brand href="#home">
          <img 
            style={{"maxHeight": '45px'}}
            alt={`${altText}`}
            src={`${logo}`}
          />
        </Navbar.Brand>        
        <span className="d-flex align-items-center ml-auto">
          <div className="theme-switcher float-left d-flex mr-3">
            {/* {ThemeSelector && <ThemeSelector />} */}
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
