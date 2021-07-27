import React from "react";
import { Container } from "react-bootstrap";
import SearchWalletFilters from "./components/filters";
import SearchWalletTable from "./components/table";

const SearchWalletView = () => {
  return (
    <Container>
      <SearchWalletFilters />
      <SearchWalletTable />
    </Container>
  );
};
export default SearchWalletView;
