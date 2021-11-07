import React, { useContext, useState } from 'react';
import { Network } from 'ferrum-plumbing';
import {
    AmountInput, supportedIcons,
    // @ts-ignore
} from 'component-library';
import { BigUtils, } from 'types';
import { ApprovableButtonWrapper,
	IApprovableButtonWrapperViewProps } from 'common-containers';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {
    Gap
    // @ts-ignore
} from 'desktop-components-library';

export interface ChainActionDlgProps {
	network: Network;
	title: string;
	contractAddress: string;
	userAddress: string;
	currency: string;
	balance: string;
	allocation: string|undefined;
	balanceTitle: string;
	symbol: string;
	feeRatio: string;
	feeDeducts: boolean;
	actionText: string;
	actionButton?: string;
	approvable: boolean;
	onClose: () => void;
	action: (total: string, amount: string, feeAmount: string) => void;
}

export function ChainActionDlg(props: ChainActionDlgProps) {
	const theme = useContext(ThemeContext);
	const styles = themedStyles(theme);   
	console.log('Action DLG', props)
	const [amount, setAmount] = useState('');
	let total = amount;
	let feeAmount = '';
	if (props.feeRatio) {
		feeAmount = BigUtils.safeParse(amount)
			.times(BigUtils.safeParse(props.feeRatio)).toFixed();
		total = props.feeDeducts ?
			BigUtils.safeParse(amount).sub(BigUtils.safeParse(feeAmount)).toFixed():
			BigUtils.safeParse(amount).add(BigUtils.safeParse(feeAmount)).toFixed();
	}
	const fee = feeAmount ? (
		<>
		<Gap size={'small'}/>
		<div className="text-sec text-left">
			<span>Fee: {feeAmount || '0'} {props.symbol}</span>
		</div>
		<Gap size={'small'}/>
		<div className="text-sec text-left">
			<span>Total: {amount || '0'} {props.symbol}</span>
		</div>
		<Gap size={'small'}/>
		</>
	) : (<></>);
	return (
		<div className="centered-body liquidity1" style={styles.maincontainer} >
			<Card className="text-center">
				<div className="body-not-centered swap liquidity">
						<small className="text-vary-color mb-5 head">
										{props.title} - {props.network}
										<hr className="mini-underline"></hr>
						</small>
				</div>
				<div  style={styles.container} >
					<div className="0pad-main-body">
					{ props.allocation && (
							<div className="text-sec text-left">
								<label>Allocation</label><br />
								<label>{props.allocation}</label>
							</div>) }
					<div className="text-sec text-left">
						<label>{props.balanceTitle}</label><br />
						<label>{props.balance} {props.symbol}</label>
					</div>
					<div >
							<div className="content text-left" >
								<AmountInput
														symbol={props.symbol}
														amount={amount}
														value={amount}
														fee={0}
														icons={supportedIcons}
														addonStyle={styles.addon}
														groupAddonStyle={styles.groupAddon}
														balance={props.balance}
														setMax={() => setAmount((props.allocation && BigUtils.safeParse(props.allocation).lt(BigUtils.safeParse(props.balance))) ? props.allocation : props.balance)}
														onChange={ (v:any) => setAmount(v.target.value)}
														onWheel={ (event:any) => event.currentTarget.blur() }
								/>
							</div>
					</div>
					{fee}
					{!!props.actionButton && props.actionText ? (
						<div className="text-sec text-left">
						{props.actionText}
						</div>
					) : (<></>)}
					<div className="crucible-box-row">
						{ props.approvable ? (
							<ApprovableButton
								disabled={!amount}
								text={props.actionButton || props.actionText}
								onClick={() => props.action(total, amount, feeAmount)}
								amount={total}
								contractAddress={props.contractAddress}
								currency={props.currency}
								userAddress={props.userAddress}
							/>
						) : (
							<Button
								disabled={!amount}
                className="btn-pri liqaction btn-icon btn-connect mt-4"
								style={styles.btnCont}
								onClick={() => props.action(total, amount, feeAmount)}>
								{props.actionButton || props.actionText}
							</Button>
						)}
						<Button
                className="btn-pri liqaction btn-icon btn-connect mt-4"
								style={styles.btnCont}
							onClick={() => props.onClose()}
						>Close</Button>
					</div>
				</div>
				</div>
			</Card>
		</div>
	);
}

function ApprovableButtonInternal(props:
		{disabled: boolean, text: string, onClick: () => void} &
		IApprovableButtonWrapperViewProps) {
	const disabled = props.pendingApproval ||
						(props.isApprovalMode ? false : props.disabled);
	const theme = useContext(ThemeContext);
	const styles = themedStyles(theme);   
	return (
		<>
			<div >
				<Button
					onClick={() => props.isApprovalMode ? props.onApproveClick() : props.onClick()}
					className="btn-pri action btn-icon btn-connect mt-4"
					style={styles.btnCont}
					disabled={disabled}>
					{props.isApprovalMode ? 'Approve' : props.text}
				</Button>
			</div>
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
    },
    groupAddon: {
        display: "flex",
        position: "relative" as "relative"
    },
    addon: {
        position: "absolute" as "absolute",
        right: '5%',
        display: "flex",
        height: "40%",
        alignItems: "center" as "center",
        cursor: "pointer",
        top: "15px",
        padding: "10px"
    },
    btnStyle:  {
        root: [
          {
            padding: "1.3rem 2.5rem",
            backgroundColor: theme.get(Theme.Button.btnPrimary),
            borderColor: theme.get(Theme.Button.btnPrimary) || '#ceaa69',
            color: theme.get(Theme.Button.btnPrimary),
            height: '40px',
          }
        ]
    },
    headerStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    textStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    optionColor: {
        backgroundColor: theme.get(Theme.Colors.bkgShade0)
    }
});
