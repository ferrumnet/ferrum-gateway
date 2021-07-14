import React from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Form } from "react-bootstrap";

const SearchWalletFilters = () => {
  return (
    <div className="filter-bar">
      <div className="filter-btns">
        <ButtonGroup>
          <Button>Top 20</Button>
          <Button>Top 100</Button>
          <Button>Top 250</Button>
          <Button>Top 500</Button>
        </ButtonGroup>
        <Link
          to="/#"
          onClick={() => {
            console.log("clear");
          }}
          className="clear-filter"
        >
          Clear
        </Link>
      </div>
      <Form.Control type="email" placeholder="Search Wallet" />
    </div>
  );
};
export default SearchWalletFilters;
