import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import "../../assets/scss/_cards.scss";
import "../../assets/scss/_dropdowns.scss";
export const NetworkSelector = ({
  currentNetwork,
  icon,
  showDropdown=true,
  onNetworkChanged,
  availableNetworks = [],
  suspendedNetworks = [],
  disabled=false
}) => {
  return (
    <Card className="card-network card">
      <div className="icon-network icon-lg mb-3">
        <img src={icon} alt="loading"></img>
      </div>
      <div className="d-flex align-items-center justify-content-between text-vary-color">
        <small>{currentNetwork?.display}</small>
        {
          showDropdown &&
            <Dropdown disabled={disabled} >
              <Dropdown.Toggle variant="pri" id="dropdown-basic" disabled={disabled}>
                <i className="mdi mdi-chevron-down" disabled={disabled}></i>
              </Dropdown.Toggle>
              <Dropdown.Menu variant="dark">
                {availableNetworks?.map((network, index) => (
                  <Dropdown.Item key={"av" + index} 
                    disabled={network.key === currentNetwork.key}
                    onClick={()=>onNetworkChanged(network)}
                  >
                    {network.display}
                  </Dropdown.Item>
                ))}
                {suspendedNetworks?.map((network, index) => (
                  <Dropdown.Header key={"sus" + index}>
                    {network.display}
                  </Dropdown.Header>
                ))}
              
              </Dropdown.Menu>
            </Dropdown>
        }
      </div>
    </Card>
  );
};

