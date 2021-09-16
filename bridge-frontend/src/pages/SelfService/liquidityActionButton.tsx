import React,{useContext} from 'react';
import { IApprovableButtonWrapperViewProps, ApprovableButtonWrapper } from 'common-containers';
import { Button } from "react-bootstrap";
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { Utils } from 'types';
import { LoadingOutlined } from '@ant-design/icons';

export interface liquidityActionProps {
    onclick: () => void,
    disabled: boolean,
    searching?: boolean,
    service?:string,
    style?: any
}
export function SearchButton(props: liquidityActionProps) {
    const theme = useContext(ThemeContext);   

    const btnContent =  (
        <>
            {props.service === 'search' && <i className="mdi mdi-magnify" style={{"margin":"2.5px"}}></i>}
            {props.service === 'search' ? 'SEARCH' : 'Log Tx'}
            {   
                ( props.searching &&
                    <span
                        style={{"display":"flex","alignItems":"center","fontSize":"20px",padding:"0px 10px"}}
                    >
                        <LoadingOutlined/> 
                    </span>
                )
            }
        </>
    )

    return (
        <>
            <Button
                onClick={() => props.onclick()}
                className="btn-pri liqaction btn-icon btn-connect mt-4"
                disabled={props.disabled}
                style={{...props.style}}
            >
                {btnContent}
            </Button>
        </>
    )
} 
