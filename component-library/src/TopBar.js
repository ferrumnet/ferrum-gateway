import React from 'react';
import './styles.css';

export function TopBar({left, right}) {
    return (
        <div className="top-container">
            <div className="top-left">
                {left}
            </div>
            <div className="top-right">
                {right}
            </div>
        </div>
    );
}