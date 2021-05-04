import React from 'react';
// @ts-ignore
import { Page, PageLayout } from 'component-library';
import { ConnectBar } from '../connect/ConnectBar';
import { LeftNav } from './LeftNav';
import { DashboardContent } from './DashboardContent';
import { GatewayAppState } from '../common/GatewayAppState';
import { useSelector } from 'react-redux';

export interface DashboardProps {
}

export function Dashboard(props: DashboardProps) {
    const initError = useSelector<GatewayAppState, string | undefined>(state => state.data.init.initError);
    return (
        <>
            {!!initError ? (
                <Page>
                    <h3>Error loading the application</h3><br />
                    <p>{initError}</p>
                </Page>
            ):(
                <PageLayout
                    top={(
                        <ConnectBar />
                    )}
                    left={(
                        <LeftNav />
                    )}
                    middle={(
                        <DashboardContent />
                    )}
                    bottom={(
                        <div style={{justifyContent: 'center', display: 'flex', flex: 1}}>
                            <p>(c) Copyright Ironworks ltd.</p></div>
                    )}
                />
            ) }
        </>
    );
}
