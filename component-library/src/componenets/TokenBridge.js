import React, { useState } from "react";
import {ConnectBridge} from "./ConnectBridge";
import { Card, Button } from "react-bootstrap";

export const TokenBridge = ({ConnectBridge,...rest}) => {
  return (
    <>
      {
        !rest.connected ? (
          <Card className="card-connect-wallet text-center text-vary-color">
            <small className="text-vary-color mb-5 head">
              Swap assets across chains
              <hr className="mini-underline"></hr>
            </small>
            <p className="max-w-400 mx-auto text-vary-color">
              You can use this token bridge to swap {rest.projectTitle || 'Project'} tokens{" "}
              <strong>across Networks with ease</strong>
            </p>
            <p className="mt-4 text-vary-color">
              Follow the step by step guide to send your tokens across the bridge.
            </p>
            {rest.conBtn}
          </Card>
          ) : <><ConnectBridge/></>
      }
    </>
  );
};