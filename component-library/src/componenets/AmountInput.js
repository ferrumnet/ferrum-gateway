import React from "react";
import { InputGroup, FormControl, Form } from "react-bootstrap";
import IconCryptoTrx from "cryptocurrency-icons/svg/color/trx.svg";
export const AmountInput = () => {
  return (
    <>
      <div className="connect-amount">
        <Form.Label className="text-sec" htmlFor="basic-url">
          Amount
        </Form.Label>
        <InputGroup className="mb-3">
          <FormControl aria-label="Amount" type="number" min="0" />
        </InputGroup>
      </div>
      <div className="amount-rec-text">
        <small className="text-pri d-flex align-items-center">
          You will receive ≈
          <span className="icon-network icon-sm mx-2">
            <img src={IconCryptoTrx} alt="loading"></img>
          </span>
          0 USDT
        </small>
      </div>
    </>
  );
};
