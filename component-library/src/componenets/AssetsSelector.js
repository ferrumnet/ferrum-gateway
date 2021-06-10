import React, { useState } from "react";
import IconCryptoTrx from "cryptocurrency-icons/svg/color/trx.svg";
import { Dropdown, InputGroup, FormControl } from "react-bootstrap";
import "../../assets/scss/_dropdowns.scss";
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    className="btn btn-dull btn-asset"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <InputGroup className="search-filter mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">
              <i className="mdi mdi-magnify"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            autoFocus
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </InputGroup>
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

export const AssetsSelector = ({
  assets = [
    { title: "USDT", subTitle: "Thther US" },
    { title: "USDT", subTitle: "Thther US" },
    { title: "USDT", subTitle: "Thther US" },
    { title: "USDT", subTitle: "Thther US" },
    { title: "USDT", subTitle: "Thther US" },
  ],
}) => {
  return (
    <Dropdown className="assets-dropdown">
      <Dropdown.Toggle as={CustomToggle} variant="pri" id="dropdown-basic">
        <span>
          <img src={IconCryptoTrx} alt="loading"></img> USDT
        </span>
        <i className="mdi mdi-chevron-down"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu as={CustomMenu}>
        {assets?.map((asset, index) => (
          <Dropdown.Item eventKey={index} active={index === 0} key={index}>
            <div className="network-detail">
              <div className="icon-network icon-lg">
                <img src={IconCryptoTrx} alt="loading"></img>
              </div>
              <span>
                <strong>{asset.title}</strong>
                <small>{asset.subTitle}</small>
              </span>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

