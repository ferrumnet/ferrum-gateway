import React, { useState } from "react";
import IconCryptoTrx from "cryptocurrency-icons/svg/color/trx.svg";
import { Dropdown, InputGroup, FormControl } from "react-bootstrap";
import "../../assets/scss/_dropdowns.scss";
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    className="btn btn-dull btn-asset btn-pri "
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
        {/* <InputGroup className="search-filter mb-3">
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
        </InputGroup> */}
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
  assets,
  network,
  selectedCurrency,
  defaultLogo,
  onChange
}) => {
  const asset = assets[selectedCurrency] || {};
  const assetList = (Object.values(assets) || []).filter(a =>
	a.currency.startsWith(network + ':'));
// console.log('ASSETS', {assetList, asset, selectedCurrency, defaultLogo, network, assets})
  return (
    <Dropdown className="assets-dropdown ">
      <Dropdown.Toggle as={CustomToggle} variant="pri" id="dropdown-basic">
        <span>
          <img 
            style={{"width": "35px"}}
            src={asset.logoURI || defaultLogo} alt=""></img> {asset.symbol}
        </span>
        <i className="mdi mdi-chevron-down"></i>
      </Dropdown.Toggle>
      {assetList.length > 1 &&
        <Dropdown.Menu as={CustomMenu}  className={ `cardTheme`}>
          {assetList.map((asset, index) => (
            <Dropdown.Item eventKey={index} active={asset.currency === selectedCurrency}
				key={index} onClick={()=>onChange(asset)}
			>
              <div className="network-detail">
                <div className="icon-network icon-lg">
                  <img style={{"width": "32px"}} src={asset.logoURI} alt=""></img>
                </div>
                <span>
                  <strong>{asset.symbol}</strong>
                  <small>{asset.network}</small>
                </span>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      }
    </Dropdown>
  );
};

