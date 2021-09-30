import React from 'react';
// @ts-ignore
import { TopBar, ConnectButton } from 'component-library';
import { ConnectButtonWapper, IConnectViewProps } from 'common-containers';
import { ETH, FRM, FRMX } from 'types';

export interface ConnectBarProps {
}

export function ConnectBtn(props: IConnectViewProps) {
    const frmBalance = props.balances.find(a => a.currency === (FRM[a.network]||[])[0]);
    const frmxBalance = props.balances.find(a => a.currency === (FRMX[a.network]||[])[0]);
    const ethBalance = props.balances.find(a => a.currency === (ETH[a.network]||[])[0]);
    return (
        <ConnectButton
            frmBalance={frmBalance?.balance || '0'}
            frmxBalance={frmxBalance?.balance || '0'}
            ethBalance={ethBalance?.balance || '0'}
            ethSymbol={ethBalance?.symbol || 'ETH'}
            {...props}
        />
    )
}

export function ConnectBar(props: ConnectBarProps) {
    const ConBot = <ConnectButtonWapper View={ConnectBtn} />
    return (
        <TopBar
            left={<img alt="Ferrum Network"
                src="https://ferrum.network/wp-content/uploads/2021/05/image-1.png"/>}
            right={(
                <>
                  {ConBot}
                </>)
            }
        />
    )
}
