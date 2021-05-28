import React from 'react';
 import {
    GeneralPageLayout,Row
    // @ts-ignore
} from 'component-library';

import { Provider as FluentProvider, teamsTheme } from '@fluentui/react-northstar';
import { ThemeContext } from 'unifyre-react-helper';
import { ConnectBar } from './../connect/ConnectBar';
import { ReponsivePageWrapperDispatch, ReponsivePageWrapperProps } from './PageWrapperTypes';

export function ResponsivePageWrapper(props: ReponsivePageWrapperProps&ReponsivePageWrapperDispatch) {
    return (
        <>
        <ThemeContext.Provider value={props.theme}>
            <FluentProvider theme={teamsTheme}>
            <GeneralPageLayout
                    top={
                        <ConnectBar
                            additionalOptions={
                                <>
                                    {props.navBarContent}
                                </>
                            }
                        />
                    }
                    middle={props.children}
                >
            </GeneralPageLayout>
            </FluentProvider>
        </ThemeContext.Provider>
        </>
    );
}