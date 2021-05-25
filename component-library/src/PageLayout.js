import React,{useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import {Page} from './Page';

export function Row({children}) {
    return (
            <div className="full-row">{children}</div>
    )
}

export function PageLayout({top, left, middle, right, bottom}) {
    return (
        <Page>
            <div className="full-row">{top}</div>
            <div className="full-row">
                <div className="col-left">{left}</div>
                <div className="col-mid">{middle}</div>
                <div className="col-right">{right}</div>
            </div>
            <div className="full-row">{bottom}</div>
        </Page>
    );
}

export function GeneralPageLayout({top, middle, bottom}) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    return (
        <Page
            style={{...styles.fullScreen}}        
        >
            <div>
                <div className="full-row">{top}</div>
                <div className="full-row" style={{...styles.fullScreen}}>
                    <div className="col-mid">{middle}</div>
                </div>
                <div className="full-row">{bottom}</div>
            </div>
        </Page>
    );
}

const themedStyles = theme => ({
    footer: {
        position: 'relative',
        backgroundColor: 'white',
        bottom: '0',
        width: '100%'
    },
    fullScreen: {
        minHeight: window.innerHeight,
        backgroundColor: theme.get(Theme.Colors.bkgShade0),
        color: theme.get(Theme.Colors.textColor)
    },
    smallGap: {
    }
});