import React from 'react';
// @ts-ignore
import { TopBar, ConnectButton } from 'component-library';
import { ConnectButtonWapper } from 'common-containers';

export interface ConnectBarProps {
}

export function ConnectBar(props: ConnectBarProps) {
    const ConBot = <ConnectButtonWapper
            View={ConnectButton}
            onConnect={async () => { return true; }}
        />
    return (
        <TopBar
            left={<img alt="Ferrum Network"
                src="https://ferrum.network/wp-content/uploads/2020/09/ferrum-logo.png"/>}
            right={(
                <>
                  {ConBot}
                </>)
            }
        />
    )
}
