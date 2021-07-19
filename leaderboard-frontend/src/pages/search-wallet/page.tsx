import React from "react";
import SearchWalletView from "./view";
import { SearchWalletUIProvider } from "./search-wallet-ui-context";
const SearchWalletPage = () => {
  return (
    <>
      <SearchWalletUIProvider>
        <SearchWalletView />
      </SearchWalletUIProvider>
    </>
  );
};

export default SearchWalletPage;
