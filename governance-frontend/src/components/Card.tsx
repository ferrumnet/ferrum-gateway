import React, { useState } from 'react';
import './Card.css';

export function Card(props: {title: string, subTitle: string, children: any}) {
	return (
		<div className="contract-item"> 
			<div><h4>{props.title}</h4></div>
			<div className="contract-item-sub">
				<div><small>{props.subTitle} </small></div>
			</div>
			{props.children}
		</div>
	)
}

export function Accordion(props: {line1: any, children: any}) {
	const [open, setOpen] = useState(false);
	return (
		<div className="card-accordoin"> 
			<div className="row1">
				<div className="row1-content">
					{props.line1}
				</div>
				<div className="">
					<div className="expand" onClick={() => setOpen(!open)}> {open ? '-' : '+'} </div>
				</div>
			</div>
			{open &&
				<div className="rest">
					{props.children}
				</div>
			}
		</div>
	)
}