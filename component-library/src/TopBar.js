import React,{useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import './styles.css';

export function TopBar({left, right,center, actionItems, style}) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    return (
        <div className="top-container" style={{...styles.nav,...style}}>
            <div className="top-left">
                {left}
            </div>
            <div className="top-center">
                {center}
            </div>
            <div className="top-right-options" style={styles.pointer}>
                {actionItems}
            </div>
            <div className="top-right" >
                {right}
            </div>
        </div>
    );
}

const themedStyles = theme => ({
    nav: {
        backgroundColor: theme.get(Theme.Colors.bkgShade0),
        color: theme.get(Theme.Colors.textColor)
    },
    pointer: {
        cursor: 'pointer'
    }
});