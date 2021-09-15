import React,{useContext} from 'react';
import { IApprovableButtonWrapperViewProps, ApprovableButtonWrapper } from 'common-containers';
import { Button } from "react-bootstrap";
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { Utils } from 'types';
import { LoadingOutlined } from '@ant-design/icons';

export interface liquidityActionProps {
    isTokenSelected: boolean,
    isAmountEntered: boolean,
    userAddress: string;
	amount: string;
    allowanceRequired: boolean,
    onManageLiquidityClick: () => void,
    addLiquidity : boolean,
    contractAddress: string,
    totalLiquidty:number,
    currency: string,
}
export function LiquidiyButtonView(props: liquidityActionProps&IApprovableButtonWrapperViewProps) {
    const theme = useContext(ThemeContext);   
    const checkRemovableLiquidity = !props.addLiquidity && (Number(props.amount) > Number(props.totalLiquidty))
    const disabled = props.isAmountEntered || props.isTokenSelected || !props.currency || checkRemovableLiquidity
    const btnContent = props.isApprovalMode ? (<>
        <i className="mdi mdi-lock-open-outline"></i>
            {'APPROVE'}
            {props.pendingApproval ? (
            <span
                style={{"display":"flex","alignItems":"center","fontSize":"20px",padding:"0px 10px"}}
            >
                <LoadingOutlined/> 
            </span>) : ''}
        </>
        ) : (<>
            <i className="mdi mdi-swap-horizontal-bold"></i>
            { props.addLiquidity ? 'Add Liquidity' : 'Remove Liquidity'}
        </>);
    let base = window.location.pathname;

    return (
        <>
            <Button
                onClick={() => props.isApprovalMode ? props.onApproveClick() : props.onManageLiquidityClick()}
                className="btn-pri liqaction btn-icon btn-connect mt-4"
                disabled={disabled}
            >
                {btnContent}
            </Button>
        </>
    )
}

export function LiquidityActionButton(props: liquidityActionProps) {
	return <ApprovableButtonWrapper
			contractAddress={props.contractAddress}
			currency={props.currency}
			userAddress={props.userAddress}
			amount={props.amount}
			// @ts-ignore
			View={(ownProps) => <LiquidiyButtonView {...ownProps} {...props} />}
		/>
}