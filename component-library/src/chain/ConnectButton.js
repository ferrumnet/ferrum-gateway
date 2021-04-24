import React from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import './Chain.css';

function shorten(addr) {
    if (!addr) return '';
    return addr.substr(0, 6) + '...' + addr.substr(addr.length - 4);
}

export function ConnectButton({connected, address, network, error, onClick}) {
    return (
        <div className="connect-button-container">
            {address && (
                <span> <small>{network}</small> - {shorten(address)} </span>
            )}
            <PrimaryButton
                text={!connected ? 'Connect' : 'Disconnect'}
                onClick={onClick}
            />
        </div>
    );
}