import {
    GeneralPageLayout,Row
    // @ts-ignore
} from 'component-library';
import { ReponsivePageWrapperDispatch, ReponsivePageWrapperProps } from './PageWrapperTypes';
import {useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { useSelector } from 'react-redux';
import { BridgeAppState } from '../common/BridgeAppState';
import { MessageBar, MessageBarType } from '@fluentui/react';
import './nav.scss';

function ErrorBar(props: {error: string}) {
    return (
        <Row withPadding>
            <MessageBar
                messageBarType={MessageBarType.blocked}
                isMultiline={true}
                dismissButtonAriaLabel="Close"
                truncated={true}
                overflowButtonAriaLabel="See more"
            >
                {props.error}
            </MessageBar>
        </Row>
    );
}

export function Navbar (props: ReponsivePageWrapperProps&ReponsivePageWrapperDispatch&{children: any}) {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const initError = useSelector<BridgeAppState, string | undefined>(state => state.data.init.initError);

    const error = (
        <ErrorBar error={initError||'error'} />
    );

    return(
        <>
            <div className="nav-bar page-container" style={{...styles.container,backgroundColor: 'transparent'}}>
                <div className="nav-logo">
                    <a href={props.homepage}>
                    <img
                        className="logo_img"
                        src={theme.get(Theme.Logo.logo)  as any}
                        style={{height: theme.get(Theme.Logo.logoHeight) > 0 ? theme.get(Theme.Logo.logoHeight) : undefined}}
                        alt="Logo"
                    /> 
                    </a>
                </div>
                <div className="mobile-nav-logo">'<a href={props.homepage}>
                    <img
                        className="logo_img"
                        src={"https://s2.coinmarketcap.com/static/img/coins/64x64/4228.png" }
                        style={{height: theme.get(Theme.Logo.logoHeight) > 0 ? theme.get(Theme.Logo.logoHeight) : undefined}}
                        alt="Logo"
                    /> 
                    </a>
                </div>
                <div className="nav-children" style={{...styles.bridgeStyle}}>
                    <div></div>
                    {
                        <>
                            {props.children}
                            <div>
                                 
                            </div>
                        </>
                    }
                </div>
                <div style={{...styles.errorContainer}}>
                    {error}
                </div>
            </div>
            
        </>
    )
}

//@ts-ignore
const themedStyles = (theme) => ({
    container: {
        color: theme.get(Theme.Colors.textColor),
        backgroundColor: theme.get(Theme.Colors.themeNavBkg),
    },
    btnStyle: {
        padding: '1rem'
    },
    bridgeStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '50%',
        alignItems: 'center',
        cursor: 'pointer',
        color: theme.get(Theme.Colors.textColor),
    },
    navTxt: {
        display: 'flex',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        padding: '20px 5%'
    }
})
