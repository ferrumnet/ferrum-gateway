import React,{useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import './styles.css';
import { Divider as MainDivider } from 'antd';

const rootStyle = {
    minWidth: '100%',
    minHeight: '100%',
    fontSize: '12px',
}
export function Divider(style) {
    return (
        <MainDivider
            style={{...style.style}}
        />
    );
}
