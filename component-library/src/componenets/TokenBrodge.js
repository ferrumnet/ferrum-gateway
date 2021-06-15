import React, { useState } from "react";
import ConnectBrodge from "./ConnectBrodge";
import { Card, Button } from "react-bootstrap";
export const TokenBrodge = () => {
  const [startConnect, SetStartConnect] = useState(false);
  return (
    <>
      {!startConnect ? (
        <Card className="card-connect-wallet text-center">
          <small className="text-sec mb-5">
            Daily limit <strong>78,477.83 USDT</strong>? per address <br></br>
            (0.00 USDT / 78,477.83 USDT)
            <hr className="mini-underline"></hr>
          </small>
          <p className="max-w-400 mx-auto">
            You can use this token brodge to send Bondly tokens{" "}
            <strong>from Ethereum to BSC and Vice Versa</strong>
          </p>
          <p className="mt-4">
            Follow the step by step guide to send your tokens across the bridge.
          </p>
          <Button
            className="btn-pri btn-icon btn-connect mt-4"
            onClick={() => {
              SetStartConnect(true);
            }}
          >
            <i className="mdi mdi-wallet"></i>Connect
          </Button>
        </Card>
      ) : (
        <ConnectBrodge
          startConnect={startConnect}
          SetStartConnect={SetStartConnect}
        />
      )}
    </>
  );
};
export default TokenBrodge;
