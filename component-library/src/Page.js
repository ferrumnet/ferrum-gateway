import React from 'react';
import './styles.css';

export function Page({children}) {
    return (
        <div className="page">
            {children}
        </div>
    );
}
