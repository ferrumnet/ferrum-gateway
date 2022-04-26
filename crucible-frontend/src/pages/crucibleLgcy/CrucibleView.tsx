import React, { useContext, useState } from 'react';
import { Card, Button } from "react-bootstrap";
import {ThemeContext, Theme} from 'unifyre-react-helper';
import './CrucibleView.css';

export interface CrucibleViewProps {
	title: string;
	symbol: string;
	baseSymbol: string;
	feeOnTx: string;
	feeOnWithdraw: string;
	totalSupply: string;
	priceUsd: string;
	basePriceUsd: string;

	balance: string;
	baseBalance: string;
	directAllocation: string;
	lpAllocation: string;

	mint: 'open' | 'closed' | 'allocation';
	openMintCap: string;
	enableMint: boolean;
	onMint: () => void;
	enableWithdraw: boolean;
	onWithdraw: () => void;
}

export function CrucibleView(props: CrucibleViewProps) {
	//@ts-ignore
	const theme = useContext(ThemeContext);
	const styles = themedStyles(theme);   
	const mintBox = props.mint === 'closed' ? (
		<>
		<div className="mint-box-container">
			<div className="mint-box">
				Minting is closed
			</div>
		</div>
		</>
	) : props.mint === 'open' ? (
		<>
		<div className="mint-box-container">
			<div className="mint-box">
				<span>Mint is Open</span> <span>({props.openMintCap} tokens cap)</span>
			</div>
		</div>
		</>
	) : (
		<>
		<div className="mint-box-container">
			<div className="mint-box">
				Mint with Allocation ({props.openMintCap} total)
				<a>How to get allocation?</a>
			</div>
		</div>
		</>
	);

	return (
		<>
		<Card className="text-center crucible-view-container">
			<div className="crucible-title">
				<span>{props.title}</span>
			</div>
			<div className="crucible-symbol">
				<div className="crucible-symbol-left">
					<span>{props.symbol}</span>
				</div>
				<div className="crucible-symbol-right">
					<span>Transfer fee: <b>{props.feeOnTx}%</b></span>
					<span>Withdraw fee: <b>{props.feeOnWithdraw}%</b></span>
				</div>
			</div>
			<div className="crucible-details">
				<div className="crucible-details-left">
					<span>Total Supply</span>
					<span><b>{props.totalSupply} {props.symbol}</b></span>
					{mintBox}
				</div>
				<div className="crucible-details-right">
					<span>{props.symbol} Price USD</span>
					<span><b>${props.priceUsd}</b></span>
					<span>{props.baseSymbol} Price USD</span>
					<span><b>{props.basePriceUsd}</b></span>
				</div>
			</div>
			<div className="crucible-details">
				<div className="crucible-details-left">
					
				</div>
				<div className="crucible-details-right crucible-balance">
					<span><small>Your balance:</small></span>
					<span><b>{props.balance}</b><small> {props.symbol}</small></span>
				</div>
			</div>
			<div className="crucible-details">
				<div className="crucible-details-left">
					<Button
						disabled={false}
						className="btn-pri liqaction btn-icon btn-connect mt-4"
						style={styles.btnCont}
						onClick={props.onMint}>
							Mint
					</Button>
				</div>
				<div className="crucible-details-right">
					<Button
						disabled={false}
						className="btn-pri liqaction btn-icon btn-connect mt-4"
						style={styles.btnCont}
						onClick={props.onWithdraw}>
							Withdraw
					</Button>
				</div>
			</div>
		</Card>
		</>
	);
}

//@ts-ignore
const themedStyles = (theme) => ({
	btnCont: {
			width: 120,
			height: 50,
	},
});