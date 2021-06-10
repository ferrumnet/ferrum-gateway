import React from "react";

import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import "../../assets/scss/_cards.scss";

import "../../assets/scss/_components.scss";
export const ProgressTrackers = () => {
  return (
    <>
      <Card>
        <small className="text-sec mb-5 text-center">
          Progress Online
          <hr className="mini-underline"></hr>
        </small>
        <Link className="step-link is-done">
          <span className="step-circle"></span>
          <small>connect you wallet</small>
        </Link>
        <Link className="step-link is-selected">
          <span className="step-circle"></span>
          <small>pair your walled or swap now</small>
        </Link>
        <Link className="step-link">
          <span className="step-circle"></span>
          <small>enter swap amount</small>
        </Link>
        <Link className="step-link ">
          <span className="step-circle"></span>
          <small>switch network & withdraw</small>
        </Link>
      </Card>
    </>
  );
};
export default ProgressTrackers;
