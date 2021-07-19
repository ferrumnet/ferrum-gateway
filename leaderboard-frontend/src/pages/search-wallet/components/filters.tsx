import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { useSearchWalletUIContext } from "../search-wallet-ui-context";
const prepareFilter = (queryParams, values) => {
  const { searchValue, top } = values;
  const newQueryParams = { ...queryParams };
  const filter = { walletAddress: "" };
  filter.walletAddress = searchValue;
  newQueryParams.top = top;
  newQueryParams.filter = filter;
  return newQueryParams;
};

const SearchWalletFilters = () => {
  const [searchValue, setSearchValue] = useState("");
  const [top, setTop] = useState(0);
  const searchWalletUIContext = useSearchWalletUIContext();
  const searchWalletUIProps = useMemo(() => {
    return {
      queryParams: searchWalletUIContext.queryParams,
      setQueryParams: searchWalletUIContext.setQueryParams,
    };
  }, [searchWalletUIContext]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(
      searchWalletUIProps.queryParams,
      values
    );
    // update list by queryParams
    searchWalletUIProps.setQueryParams(newQueryParams);
  };

  useEffect(() => {
    applyFilter({ top, searchValue });
    // eslint-disable-next-line
  }, [top, searchValue]);

  return (
    <div className="filter-bar">
      <div className="filter-btns">
        <ButtonGroup>
          <Button
            className={top === 20 ? "active" : ""}
            onClick={() => {
              setTop(20);
            }}
          >
            Top 20
          </Button>
          <Button
            className={top === 100 ? "active" : ""}
            onClick={() => {
              setTop(100);
            }}
          >
            Top 100
          </Button>
          <Button
            className={top === 250 ? "active" : ""}
            onClick={() => {
              setTop(250);
            }}
          >
            Top 250
          </Button>
          <Button
            className={top === 500 ? "active" : ""}
            onClick={() => {
              setTop(500);
            }}
          >
            {" "}
            Top 500
          </Button>
        </ButtonGroup>
        <Link
          to="/#"
          onClick={() => {
            setTop(0);
          }}
          className="clear-filter"
        >
          Clear
        </Link>
      </div>
      <Form.Control
        type="email"
        placeholder="Search Wallet"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
    </div>
  );
};
export default SearchWalletFilters;
