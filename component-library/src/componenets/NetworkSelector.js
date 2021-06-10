import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import "../../assets/scss/_cards.scss";
import "../../assets/scss/_dropdowns.scss";
export const NetworkSelector = ({
  currentNetwork,
  icon,
  availableNetworks = [],
  suspendedNetworks = [],
  specialNetworks = [],
}) => {
  return (
    <Card className="card-network card-sec">
      <div className="icon-network icon-lg mb-3">
        <img src={icon} alt="loading"></img>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <small>{currentNetwork}</small>
        <Dropdown>
          <Dropdown.Toggle variant="pri" id="dropdown-basic">
            <i className="mdi mdi-chevron-down"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            {suspendedNetworks?.map((network, index) => (
              <Dropdown.Header key={"sus" + index}>
                {network}
                <span className="message float-right">Suspended</span>
              </Dropdown.Header>
            ))}
            {availableNetworks?.map((network, index) => (
              <Dropdown.Item href={`#/action-${index}`} key={"av" + index}>
                {network}
              </Dropdown.Item>
            ))}
            {specialNetworks?.length ? (
              <>
                <Dropdown.Divider />
                {specialNetworks.map((network, index) => (
                  <Dropdown.Item href={`#/action-{index}`} key={"spe" + index}>
                    {network}
                  </Dropdown.Item>
                ))}
              </>
            ) : null}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Card>
  );
};

