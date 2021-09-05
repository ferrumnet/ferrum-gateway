import React from 'react';

export function Card(props: {title: string, subTitle: string, children: any}) {
	return (
		<div className="contract-item"> 
			<div><h4>{props.title}</h4></div>
			<div className="contract-item-sub"><small>{props.subTitle} </small>
			{props.children}
			</div>
		</div>
	)
}