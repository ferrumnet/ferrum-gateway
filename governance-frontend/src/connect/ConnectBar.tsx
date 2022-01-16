import React from 'react';
import { Networks } from 'ferrum-plumbing';
// @ts-ignore
import { TopBar, ConnectButton } from 'component-library';
import { ConnectButtonWapper, IConnectViewProps } from 'common-containers';
import { FRM, FRMX } from 'types';

export interface ConnectBarProps {
}

export function ConnectBtn(props: IConnectViewProps) {
    const frmBalance = props.balances.find(a => a.currency === (FRM[a.network]||[])[0]);
    const frmxBalance = props.balances.find(a => a.currency === (FRMX[a.network]||[])[0]);
    const ethBalance = props.balances.find(a => a.currency === Networks.for(a.network || 'ETHEREUM').baseCurrency);
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
	const ConBot = <ConnectButtonWapper View={CnctButton} />
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
