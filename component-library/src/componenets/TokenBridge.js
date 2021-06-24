import React, { useState } from "react";
import {ConnectBridge} from "./ConnectBridge";
import { Card, Button } from "react-bootstrap";

export const TokenBridge = ({ConnectBridge,...rest}) => {
  return (
    <>
      {
        !rest.connected ? (
          <Card className="card-connect-wallet text-center">
            <small className="text-vary-color mb-5 head">
              Swap Assets Across <strong>chains</strong>
              <hr className="mini-underline"></hr>
            </small>
            <p className="max-w-400 mx-auto">
              You can use this token bridge to send {rest.projectTitle || 'Project'} tokens{" "}
              <strong>from Across Chains with ease</strong>
            </p>
            <p className="mt-4">
              Follow the step by step guide to send your tokens across the bridge.
            </p>
            {rest.conBtn}
          </Card>
          ) : <><ConnectBridge/></>
      }
    </>
  );
};