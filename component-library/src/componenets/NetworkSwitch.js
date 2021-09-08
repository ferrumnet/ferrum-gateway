import React from "react";
import { Button } from "react-bootstrap";
import {NetworkSelector} from "./NetworkSelector";
import "../../assets/scss/_components.scss";
import {networkImages as images} from './../images';

export const NetworkSwitch = (
  {
    availableNetworks = [], // {key, display, active, mainnet }
    suspendedNetworks = [],
    currentNetwork,
    currentDestNetwork,
    onNetworkChanged,
    setIsNetworkReverse,
    IsNetworkReverse,
    swapping
  }
) => {
  return (
    <div className="network-swap">
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-5 text-left">
          <label className="text-sec d-block w-100 text-vary-color">From</label>
          {
            !IsNetworkReverse ?
            <NetworkSelector
              currentNetwork={currentNetwork}
              icon={images[currentNetwork?.key]}
              showDropdown={false}
              availableNetworks={[]}
            /> :
              <NetworkSelector
              currentNetwork={currentDestNetwork}
              icon={images[currentDestNetwork?.key]}
              availableNetworks={availableNetworks}
              suspendedNetworks={suspendedNetworks}
              onNetworkChanged={onNetworkChanged}
              disabled={swapping}
            />
          }
        </div>
        <div className="col-lg-2 col-md-2 text-center mt-4">
          <Button className="btn-pri btn-icon btn-swap my-auto" disabled={swapping}
		//    onClick={()=>setIsNetworkReverse()}
		  >
            <i className="mdi mdi-arrow-right mr-0"></i>
          </Button>
        </div>
        <div className="col-lg-5 col-md-5">
          <label className="text-sec d-block w-100 text-vary-color">To</label>
          {
            !IsNetworkReverse ?
            <NetworkSelector
              currentNetwork={currentDestNetwork}
              icon={images[currentDestNetwork?.key]}
              availableNetworks={availableNetworks}
              suspendedNetworks={suspendedNetworks}
              onNetworkChanged={onNetworkChanged}
              disabled={swapping}
            /> :
             <NetworkSelector
              currentNetwork={currentNetwork}
              icon={images[currentNetwork?.key]}
              showDropdown={false}
              availableNetworks={[]}
            />
          }
         
        </div>
      </div>
    </div>
  );
};