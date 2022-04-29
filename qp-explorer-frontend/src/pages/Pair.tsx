import React from 'react';
import { Link } from 'react-router-dom';

export const CHAIN_LOGO = {
    'RINKEBY': (<b>[R]</b>),
    'BSC_TESTNET': (<b>[B]</b>),
    'FRM_TESTNET': (<b>[F]</b>),
} as any;


export function Pair(props: {itemKey: any, value: any, linkTo?: string}) {
    return (
        <>
        <div className="pair-container">
            <div className="pair-left">{props.itemKey || ''}</div>
            <div className="pair-right">
                {!!props.linkTo ? (
                    <Link to={props.linkTo}>
                        {props.value || ''}
                    </Link>
                ) : (
                    props.value || ''
                )}
            </div>
        </div>
        </>
    );
}

export function MultiLinePair(props: {itemKey: any, value: any}) {
    return (
        <>
        <div className="pair-container">
            <div className="pair-left">{props.itemKey || ''}</div>
            <div className="pair-right">
                <textarea className="pair-multi-line">
                    {props.value || ''}
                </textarea>
            </div>
        </div>
        </>
    );
}