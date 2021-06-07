import React,{useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';


export function CustomSelect({style,items={},defaultValue,onChange}) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    const list = Object.values(items);

    return (
        <select defaultValue={defaultValue} style={{...style,...styles.select }} onChange={(v)=>onChange(v.target.value)}>
            {
                list.map(e=>
                    <option style={{...styles.textStyles,...styles.optionColor}} value={e}>{e}</option>
                )
            }
        </select>
    )
}

const themedStyles = theme => ({
    select: {
        width: '100%',
        padding: '10px',
        borderColor: '#f6f5f7',
        borderRadius: '5px',
        backgroundColor: '#0000000f'
    },
    textStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    optionColor: {
        backgroundColor: theme.get(Theme.Colors.bkgShade0)
    },
});
