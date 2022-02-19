import React, { useContext, useState } from 'react';
import { ApprovableButtonWrapper, IApprovableButtonWrapperViewProps } from 'common-containers';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { Button } from "react-bootstrap";
import { FLayout, FContainer,FCard, FInputText, FButton } from "ferrum-design-system";

function ApprovableButtonInternal(props: {disabled: boolean, text: string, onClick: () => void} & IApprovableButtonWrapperViewProps) {

	const disabled = props.pendingApproval || (props.isApprovalMode ? false : props.disabled);
	const theme = useContext(ThemeContext);
	const styles = themedStyles(theme);   

    return (
		<>
			<FButton
				onClick={() => props.isApprovalMode ? props.onApproveClick() : props.onClick()}
				className={'cr-large-btn'}
				disabled={disabled}
				title={props.isApprovalMode ? 'Approve' : props.text}
			/>
		</>
	);
    
}

export function ApprovableButton(props: {
    disabled: boolean, text: string, onClick: () => void,
    contractAddress: string,
    currency: string,
    userAddress: string,
    amount: string,
} ) {
	return <ApprovableButtonWrapper
		contractAddress={props.contractAddress}
		currency={props.currency}
		userAddress={props.userAddress}
		amount={props.amount}
		// @ts-ignore
		View={(ownProps) => <ApprovableButtonInternal {...ownProps} {...props} />}
	/>
}

//@ts-ignore
const themedStyles = (theme) => ({
    container: {
        width: '100%',
        margin: '0px auto'
    },
    maincontainer: {
        // width: '70%',
        margin: '0px auto'
    },
    btnCont: {
        width: 120,
				height: 50,
    }
})