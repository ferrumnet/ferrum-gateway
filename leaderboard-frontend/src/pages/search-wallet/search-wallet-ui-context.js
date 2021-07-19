import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./search-wallet-ui-helper";

const SearchWalletUIContext = createContext();

export function useSearchWalletUIContext() {
  return useContext(SearchWalletUIContext);
}

export const SearchWalletUIConsumer = SearchWalletUIContext.Consumer;

export function SearchWalletUIProvider({ children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const columns = [
    {
      name: "Rank",
      selector: "rank",
      sortable: true,
    },
    {
      name: "Wallet Address",
      selector: "walletAddress",
      sortable: true,
    },
    {
      name: "USD of FRM and FRMx",
      selector: "usdOfFerrumAndFerrumX",
      sortable: true,
    },
    {
      name: "FRM Holiday",
      selector: "frmHolidy",
      sortable: true,
    },
    {
      name: "FRMx Holiday",
      selector: "frmXHolidy",
      sortable: true,
    },
  ];

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    columns,
  };

  return (
    <SearchWalletUIContext.Provider value={value}>
      {children}
    </SearchWalletUIContext.Provider>
  );
}
