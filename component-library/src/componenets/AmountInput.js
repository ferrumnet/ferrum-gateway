import React from "react";
import { InputGroup, FormControl, Form } from "react-bootstrap";
import IconCryptoTrx from "cryptocurrency-icons/svg/color/trx.svg";
export const AmountInput = ({...rest}) => {
  return (
    <>
      <div className="connect-amount">
        <Form.Label className="text-sec text-vary-color" htmlFor="basic-url">
          Amount
        </Form.Label>
        <div style={rest.groupAddonStyle}>
          <InputGroup className="mb-3" {...rest}>
            <FormControl aria-label="Amount" type="number" min="0" {...rest}/>
          </InputGroup>
          <span className="btn btn-pri" style={{...rest.addonStyle}}  onClick={()=>rest.setMax()}>
              Max
          </span>
        </div>
      </div>
      <div className="amount-rec-text">
        <small className="text-pri d-flex align-items-center text-vary-color">
          You have ≈ {rest.balance} {rest.symbol}
            <span className="icon-network icon-sm mx-2">
              <img src={rest.icons[rest.symbol] || rest.icons['ETH'] } alt="loading"></img>
            </span>
        </small>
      </div>
    </>
  );
};
