import React from "react";
import { InputGroup, FormControl, Form } from "react-bootstrap";
import IconCryptoTrx from "cryptocurrency-icons/svg/color/trx.svg";

export const TextInput = ({...rest}) => {
  return (
    <>
      <div className="connect-amount" style={{...rest.style}}>
        {rest.label &&
            <Form.Label className="text-sec text-vary-color" htmlFor="basic-url">
              {rest.label}
            </Form.Label>
        }
        <div style={rest.groupAddonStyle}>
          <InputGroup className="mb-3" {...rest}>
            <FormControl aria-label="Amount" type="text" {...rest}/>
          </InputGroup>
        </div>
      </div>
      <div className="amount-rec-text">
        {
          rest.subText && 
          <small className="text-pri d-flex align-items-center text-vary-color">
            {rest.subText}
          </small>
        }

      </div>
    </>
  );
};