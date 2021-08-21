import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer>
        Copyright © 2021 <Link to={{ pathname: "https://ferrum.network/" }} target="_blank" >Ferrum</Link> All rights reserved
      </footer>
    </>
  );
};

export default Footer;
