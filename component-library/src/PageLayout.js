import React from 'react';
import {Page} from './Page';

export function Row({children}) {
    return (
            <div className="full-row">{children}</div>
    )
}

export function PageLayout({top, left, middle, right, bottom}) {
    return (
        <Page>
            <div className="full-row">{top}</div>
            <div className="full-row">
                <div className="col-left">{left}</div>
                <div className="col-mid">{middle}</div>
                <div className="col-right">{right}</div>
            </div>
            <div className="full-row">{bottom}</div>
        </Page>
    );
}