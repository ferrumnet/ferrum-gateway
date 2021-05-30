import React,{useContext} from 'react';
// @ts-ignore
import { TopBar, ConnectButton,Row } from 'component-library';
import { ConnectButtonWapper, IConnectViewProps } from 'common-containers';
import { ETH, FRM, FRMX } from 'types';
import { useSelector } from 'react-redux';
import { BridgeAppState } from '../common/BridgeAppState';
import { MessageBar, MessageBarType } from '@fluentui/react';
import {ThemeContext, Theme} from 'unifyre-react-helper';

export interface ConnectBarProps {
    additionalOptions?: any
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


function ErrorBar(props: {error: string}) {
    return (
        <div style={{"width": 'fit-content'}}>
            <MessageBar
                messageBarType={MessageBarType.blocked}
                isMultiline={true}
                dismissButtonAriaLabel="Close"
                truncated={true}
                overflowButtonAriaLabel="See more"
            >
                {props.error}
            </MessageBar>
        </div>
    );
}

export function ConnectBar(props: ConnectBarProps) {
    const theme = useContext(ThemeContext);
    const ConBot = <ConnectButtonWapper View={ConnectBtn} />
    const initError = useSelector<BridgeAppState, string | undefined>(state => state.data.state.error);

    const error = (initError && initError != '') && (
        <div style={{
            "padding": '20px 5%',"backgroundColor": `${theme.get(Theme.Colors.bkgShade0)}`,
            "display":"flex","justifyContent":"center"}}
            >
            <ErrorBar error={initError||'error'} />
        </div>

    );

    return (
        <>
            <TopBar
                left={<img alt="Ferrum Network"
                    src="https://ferrum.network/wp-content/uploads/2020/09/ferrum-logo.png"/>}
                actionItems={
                <> {props.additionalOptions} </>
                }
                right={(
                    <>
                    {ConBot}
                    </>)
                }
                style={{"padding": '20px 5%'}}
            />
            {error}
        </>
    )
}
