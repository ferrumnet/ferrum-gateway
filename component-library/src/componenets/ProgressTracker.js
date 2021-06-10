import React from "react";

import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import "../../assets/scss/_cards.scss";

import "../../assets/scss/_components.scss";
export const ProgressTracker = ({title="Progress Online",steps=[{name:"connect you wallet",isDone:true,isCurrent:false},{name:"pair your walled or swap now",isDone:true,isCurrent:false},{name:"enter swap amount",isDone:false,isCurrent:true},{name:"switch network & withdraw",isDone:false,isCurrent:false}]}) => {
  return (
    <>
      <Card>
        <small className="text-sec mb-5 text-center">
          {title}
          <hr className="mini-underline"></hr>
        </small>
        {steps?.map((step,index)=><Link className={`step-link  ${step.isDone ? "is-done" : step.isCurrent ? "is-selected" : ""}`}>
          <span className="step-circle"></span>
          <small>{step.name}</small>
        </Link>)}
        
       
      </Card>
    </>
  );
};
