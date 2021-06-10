import React from "react";
import { Button } from "react-bootstrap";
import IconCryptoTrx from "cryptocurrency-icons/svg/color/trx.svg";
import IconCryptoEth from "cryptocurrency-icons/svg/color/eth.svg";
import {NetworkSelector} from "./NetworkSelector";
import "../../assets/scss/_components.scss";
export const NetworkSwitch = () => {
  return (
    <div className="network-swap">
      <label className="text-sec d-block w-100">From</label>
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-5 text-left">
          <NetworkSelector
            currentNetwork={"TRX Network"}
            icon={IconCryptoTrx}
            availableNetworks={["Action", "Another Action", "Something else"]}
          />
        </div>
        <div className="col-lg-2 col-md-2 text-center">
          <Button className="btn-pri btn-icon btn-swap my-4">
            <i className="mdi mdi-swap-horizontal"></i>
          </Button>
        </div>
        <div className="col-lg-5 col-md-5">
          <NetworkSelector
            currentNetwork={"Binance Smart Chain Network"}
            icon={IconCryptoEth}
            availableNetworks={["Action", "Another Action", "Something else"]}
            suspendedNetworks={["OMNI Network"]}
            specialNetworks={["Special Link"]}
          />
        </div>
      </div>
    </div>
  );
};