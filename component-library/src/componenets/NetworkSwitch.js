import React from "react";
import { Button } from "react-bootstrap";
import {NetworkSelector} from "./NetworkSelector";
import "../../assets/scss/_components.scss";
import {networkImages as images} from './../images';

export const NetworkSwitch = (
  {
    availableNetworks = [],
    suspendedNetworks = [],
    currentNetwork,
    currentDestNetwork,
    onNetworkChanged,
    setIsNetworkReverse,
    IsNetworkReverse
  }
) => {
  return (
    <div className="network-swap">
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-5 text-left">
          <label className="text-sec d-block w-100">From</label>
          {
            !IsNetworkReverse ?
            <NetworkSelector
              currentNetwork={currentNetwork}
              icon={images[currentNetwork.key]}
              showDropdown={false}
              availableNetworks={[]}
            /> :
              <NetworkSelector
              currentNetwork={currentDestNetwork}
              icon={images[currentDestNetwork.key]}
              availableNetworks={[...availableNetworks]}
              suspendedNetworks={[...suspendedNetworks]}
              onNetworkChanged={onNetworkChanged}
            />
          }
        </div>
        <div className="col-lg-2 col-md-2 text-center">
          <Button className="btn-pri btn-icon btn-swap my-4" onClick={()=>setIsNetworkReverse()}>
            <i className="mdi mdi-swap-horizontal"></i>
          </Button>
        </div>
        <div className="col-lg-5 col-md-5">
          <label className="text-sec d-block w-100">To</label>
          {
            !IsNetworkReverse ?
            <NetworkSelector
              currentNetwork={currentDestNetwork}
              icon={images[currentDestNetwork]}
              availableNetworks={[...availableNetworks]}
              suspendedNetworks={[...suspendedNetworks]}
              onNetworkChanged={onNetworkChanged}
            /> :
             <NetworkSelector
              currentNetwork={currentNetwork}
              icon={images[currentNetwork]}
              showDropdown={false}
              availableNetworks={["Action", "Another Action", "Something else"]}
            />
          }
         
        </div>
      </div>
    </div>
  );
};