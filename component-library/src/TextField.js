import React,{useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';

export function WideTextField(props,style) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    return (
        <input
            {...props}
            style={styles.input}

        />
    )
}

const themedStyles = theme => ({
    input: {
        fontSize: '40px',
        fontWeight: 'bold',
        width: '100%',
        padding: '15px 20px',
        backgroundColor: '#00000008',
        borderWidth: 'thin',
        borderColor: '#00000008',
        borderRadius: '5px',
    }
});

export function InputField(props,style) {
    const theme = useContext(ThemeContext);
    const styles = inputthemedStyles(theme);
    return (
        <input
            {...props}
            style={{...styles.input,...style}}
        />
    )
}

const inputthemedStyles = theme => ({
    input: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#00000008',
        borderWidth: 'thin',
        borderColor: '#00000008',
        borderRadius: '5px',
    }
});
