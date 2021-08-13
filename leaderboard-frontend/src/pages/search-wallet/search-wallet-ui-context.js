import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./search-wallet-ui-helper";

const SearchWalletUIContext = createContext();

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function useSearchWalletUIContext() {
  return useContext(SearchWalletUIContext);
}

export const SearchWalletUIConsumer = SearchWalletUIContext.Consumer;

export function SearchWalletUIProvider({ leaderboardData, children }) {
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
      maxWidth: "10px",
      name: "Rank",
      selector: "rank",
      sortable: true,
    },
    {
      width: "auto",
      name: "Wallet Address",
      selector: "address",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div className="col-web">
            <span>{row.address}</span>
          </div>
          <div className="col-mobile">
            <span>{shorten(row.address)}</span>
          </div>
        </div>
      ),
    },
    {
      name: "USD of FRM and FRMx",
      selector: "usd_frm_and_frmx",
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <span>{formatter.format(row.usd_frm_and_frmx.toFixed(2))}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "FRM Holdings",
      selector: "frm_holiday",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <span>
              {formatter.format(row.frm_holiday.toFixed(2)).replaceAll("$", "")}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "FRMx Holdings",
      selector: "frmx_holiday",
      sortable: true,
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <div>
            <span>
              {formatter
                .format(row.frmx_holiday.toFixed(2))
                .replaceAll("$", "")}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const value = {
    leaderboardData,
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    paginationRowsPerPageOptions: [20, 50, 100, 250, 500],
    columns,
  };

  return (
    <SearchWalletUIContext.Provider value={value}>
      {children}
    </SearchWalletUIContext.Provider>
  );
}

function shorten(addr) {
  if (!addr) return '';
  return addr.substr(0, 6) + '...' + addr.substr(addr.length - 4);
}
