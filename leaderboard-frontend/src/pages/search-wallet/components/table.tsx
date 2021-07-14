import React, { useState, useEffect } from "react";
import axios from "axios";
// import { storiesOf } from '@storybook/react';
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "Rank",
    selector: "rank",
    sortable: true,
  },
  {
    name: "Wallet Address",
    selector: "wallet_address",
    sortable: true,
  },
  {
    name: "USD of FRM and FRMx",
    selector: "usd_frm_frmx",
    sortable: true,
  },
  {
    name: "FRM Holiday",
    selector: "frm_holiday",
    sortable: true,
  },
  {
    name: "FRMx Holiday",
    selector: "frmx_holiday",
    sortable: true,
  },
];

const SearchWalletTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const theme = "dark";

  const fetchwallets = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `https://reqres.in/api/wallets?page=${page}&per_page=${perPage}&delay=1`
    );

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchwallets(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `https://reqres.in/api/wallets?page=${page}&per_page=${newPerPage}&delay=1`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchwallets(1);
    // eslint-disable-next-line
  }, []);

  return (
    <DataTable
      // title="wallets"
      columns={columns}
      data={data}
      progressPending={loading}
      theme={theme}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      selectableRows
      onChangeRowsPerPage={handlePerRowsChange}
      onChangePage={handlePageChange}
    />
  );
};

export default SearchWalletTable;
