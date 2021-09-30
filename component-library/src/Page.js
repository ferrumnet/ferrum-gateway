import React from 'react';
import './styles.css';

export function Page({children, gap}) {
    return (
        <div className={`page ${gap ? 'page-horizontal-gap' : ''}`}>
            {children}
        </div>
    );
}