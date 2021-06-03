import React,{useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import './styles.css';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

const rootStyle = {
    minWidth: '100%',
    minHeight: '100%',
    fontSize: '12px',
}
export function RegularBtn({ onClick=()=>{},disabled,text,propStyle,props }) {
    const theme = useContext(ThemeContext);
    const style= {
      ...propStyle,
        rootDisabled: [{
          backgroundColor: 'red'                //  <---                //  <---
        }],
        root: [
          {
            ...rootStyle,
            backgroundColor: theme.get(Theme.Button.btnPrimary),
            color: theme.get(Theme.Colors.textColor),
            border: `1px solid ${theme.get(Theme.Button.btnPrimary)}`,
            borderRadius: theme.get(Theme.Button.btnBorderRadius),
            ...propStyle,
            selectors: {                     //  <--- 
              ':disabled': {                    //  <--- this part doesn't work.
                color: theme.get(Theme.Colors.textColor),  
                backgroundColor: 'red'                //  <---                //  <---
              },
            }
          }
        ]
      };
    return (
        <PrimaryButton  
            {...props}
            style={style}
            text={text}
            onClick={onClick} 
            disabled={disabled} 
        />
    );
}

export function OutlinedBtn({onClick=()=>{},text,disabled,propStyle,props}) {
    const theme = useContext(ThemeContext);
    const style= {
        ...propStyle,
        rootDisabled: [{
          backgroundColor: 'red'                //  <---                //  <---
        }],
        root: [
          {
            ...rootStyle,
            background: 'transparent',
            border: `1px solid ${theme.get(Theme.Button.btnPrimary)}`,
            color: theme.get(Theme.Colors.textColor),
            borderRadius: theme.get(Theme.Button.btnBorderRadius),
            ...propStyle,
            minHeight: '43px',
            selectors: {                     //  <--- 
              ':disabled': {                    //  <--- this part doesn't work.
                color: theme.get(Theme.Colors.textColor), 
                backgroundColor: 'red'                //  <---                //  <---
              },
            }
          }
        ],
      };
    return (
        <PrimaryButton 
            styles={style}
            text={text}
            onClick={onClick} 
            disabled={disabled} 
            {...props}
        />
    );
}


