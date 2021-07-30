import React, {useContext} from 'react';
import { IApprovableButtonWrapperViewProps, ApprovableButtonWrapper } from 'common-containers';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { LoadingOutlined } from '@ant-design/icons';
import { Button } from 'react-bootstrap';

export interface SwapButtonProps {
	contractAddress: string;
	currency: string;
	userAddress: string;
	amount: string;
	approveDisabled: boolean;
	swapDisabled: boolean;
	pendingSwap: boolean;
	onSwapClick: () => void;
}

export function SwapButtonView(props: SwapButtonProps&IApprovableButtonWrapperViewProps) {
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
	const disabled = props.pendingApproval ||
						(props.isApprovalMode ? props.approveDisabled : props.swapDisabled);
 	// TODO: Use a spinner
	const btnContent = props.isApprovalMode ? (<>
					<i className="mdi mdi-lock-open-outline"></i>
						{'APPROVE'}
						{props.pendingApproval ? 
							(
								<span
									style={{"display":"flex","alignItems":"center","fontSize":"20px",padding:"0px 10px"}}
								>
									<LoadingOutlined/> 
								</span>
							) : ''
						}
					</>
					) : (<>
                        <i className="mdi mdi-swap-horizontal-bold"></i>
						{ props.pendingSwap ? 'Swap Processing' : 'Swap'}
					</>);
	return (
		<>
			<div style={styles.swapBtnContainer}>
				<Button
					onClick={() => props.isApprovalMode ? props.onApproveClick() : props.onSwapClick()}
					className="btn-pri action btn-icon btn-connect mt-4"
					disabled={disabled}
				>
					{btnContent}
				</Button>
			</div>
		</>
	);
}

export function SwapButton(props: SwapButtonProps) {
	return <ApprovableButtonWrapper
			contractAddress={props.contractAddress}
			currency={props.currency}
			userAddress={props.userAddress}
			amount={props.amount}
			// @ts-ignore
			View={(ownProps) => <SwapButtonView {...ownProps} {...props} />}
		/>
}

const themedStyles = (theme: Theme) => ({
    swapBtnContainer: {
        width: '100%',
        textAlign: 'center' as 'center',
        margin: '0.5rem auto',
        marginBottom: '0rem'
    },
});