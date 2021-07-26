import React, { useState, useEffect, useMemo } from "react";
// import { storiesOf } from '@storybook/react';
import DataTable from "react-data-table-component";
// import { accountsData } from "../../../utils/accountsData";
import { useSearchWalletUIContext } from "../search-wallet-ui-context";
import TableUtils from "../../../utils/TableUtils";

const prepareFilter = (queryParams, values) => {
  const { pageNumber, pageSize, sortField, sortOrder } = values;
  const newQueryParams = { ...queryParams };
  newQueryParams.pageNumber = pageNumber;
  newQueryParams.pageSize = pageSize;
  newQueryParams.sortField = sortField;
  newQueryParams.sortOrder = sortOrder;
  return newQueryParams;
};

const SearchWalletTable = () => {
  const [filteredData, setFilteredData] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const theme = "dark";
  const tableUtils = new TableUtils();
  const searchWalletUIContext = useSearchWalletUIContext();

  const searchWalletUIProps = useMemo(() => {
    return {
      leaderboardData: searchWalletUIContext.leaderboardData,
      queryParams: searchWalletUIContext.queryParams,
      setQueryParams: searchWalletUIContext.setQueryParams,
      columns: searchWalletUIContext.columns,
      paginationRowsPerPageOptions:
        searchWalletUIContext.paginationRowsPerPageOptions,
    };
  }, [searchWalletUIContext]);

  // console.log(searchWalletUIProps.leaderboardData);
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(
      searchWalletUIProps.queryParams,
      values
    );
    searchWalletUIProps.setQueryParams(newQueryParams);
  };
  const handlePageChange = (page) => {
    console.log(page);
    setLoading(true);
    applyFilter({ ...searchWalletUIProps.queryParams, pageNumber: page });
    setLoading(false);
  };

  const handleRowsPerPageChange = async (newPerPage, page) => {
    setLoading(true);
    applyFilter({
      ...searchWalletUIProps.queryParams,
      pageNumber: page,
      pageSize: newPerPage,
    });
    setLoading(false);
  };
  const handleSort = (column, sortDirection) => {
    setLoading(true);
    applyFilter({
      ...searchWalletUIProps.queryParams,
      sortField: column.selector,
      sortOrder: sortDirection,
    });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    applyFilter({
      ...searchWalletUIProps.queryParams,
    });
    setLoading(false);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilteredData({
      ...tableUtils.baseFilter(
        searchWalletUIProps.leaderboardData,
        searchWalletUIProps.queryParams
      ),
    });
    // eslint-disable-next-line
  }, [searchWalletUIProps]);

  return (
    <DataTable
      // title="wallets"
      columns={searchWalletUIProps.columns}
      data={filteredData.entitiesResult}
      // defaultSortFieldId={1}
      // defaultSortAsc={
      //   searchWalletUIProps.queryParams.sortOrder === "asc" ? true : false
      // }
      progressPending={loading}
      theme={theme}
      pagination
      paginationServer
      paginationTotalRows={filteredData.total}
      // selectableRows
      onChangeRowsPerPage={handleRowsPerPageChange}
      onChangePage={handlePageChange}
      onSort={handleSort}
      responsive={true}
      paginationRowsPerPageOptions={
        searchWalletUIProps.paginationRowsPerPageOptions
      }
    />
  );
};

export default SearchWalletTable;
