import React from "react";
import AssetsSelector from "./AssetsSelector";
import NetworkSwitch from "./NetworkSwitch";
import AmountInput from "./AmountInput";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
export const ConnectBrodge = ({ startConnect, SetStartConnect }) => {
  return (
    <>
      <Card>
        <div className="text-left">
          <label>Assets</label>
          <AssetsSelector />
          <NetworkSwitch />
          <AmountInput />
        </div>
        <Button
          className="btn-pri btn-icon btn-connect mt-4"
          onClick={() => {
            SetStartConnect(false);
          }}
        >
          <i className="mdi mdi-wallet"></i>Disconnect
        </Button>
        <Button
          className="btn-pri btn-icon btn-connect mt-4"
          //   onClick={() => {
          //     setConnectWallet(true);
          //   }}
        >
          <i className="mdi mdi-wallet"></i>Open Meta Mask
        </Button>
      </Card>
    </>
  );
};
export default ConnectBrodge;
