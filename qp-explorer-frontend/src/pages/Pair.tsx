import { FContainer, FGrid } from "ferrum-design-system";
import React from "react";
import { Link } from "react-router-dom";

export const CHAIN_LOGO = {
  RINKEBY: <b>[R]</b>,
  BSC_TESTNET: <b>[B]</b>,
  FRM_TESTNET: <b>[F]</b>,
} as any;

export function Pair(props: { itemKey: any; value: any; linkTo?: string, href?: string }) {
  return (
    <>
      <FContainer className="pair-container">
        <FGrid>
          <div>{props.itemKey || ""}</div>
          <div className="f-ml-2">
            {!!props.linkTo ? (
              <Link className={"pointer-cursor"} to={props.linkTo}>
                {props.value || ""}
              </Link>
              ) : !!props.href ? (
                  <a href={props.href} target='_blank'>
                    {props.value || ''}
                  </a>
                ) : props.value || ""
            }
          </div>
        </FGrid>
      </FContainer>
    </>
  );
}

export function MultiLinePair(props: { itemKey: any; value: any }) {
  return (
    <>
      <div>
        <div>{props.itemKey || ""}</div>
        <div>
          <textarea>{props.value || ""}</textarea>
        </div>
      </div>
    </>
  );
}
