import { StandaloneErc20 } from 'common-containers/dist/clients/StandaloneErc20';
import { FButton } from 'ferrum-design-system';
import {
	InputField,
	// @ts-ignore
} from 'component-library';
//@ts-ignore
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { GovernanceContract, GovernanceTransaction, inject, Utils } from 'types';
import { Accordion, Card } from '../../../components/Card';
import { GovernanceClient } from '../../../GovernanceClient';
import { AnyAction, Dispatch as GlobalDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

async function addSignature(contract: GovernanceContract, tx: GovernanceTransaction, userHasVeto: boolean, dispatch: GlobalDispatch<AnyAction>) {
    try {
        const client = inject<GovernanceClient>(GovernanceClient);
        const method = contract.methods.find(m => m.name === tx.method)!;
        if (!method) { throw new Error('Method not found'); }
		const signature = await client.signMessage(
			tx.network, contract.identifier.name,
			contract.identifier.version, tx.contractAddress, method, tx.values);
        await client.addSignature(dispatch, tx.requestId, tx.contractAddress, signature, userHasVeto ? { vetoSigned: userHasVeto } : {} );
    } catch (e) {
        console.error('addSignature', e);
    }
}

async function execute(tx: GovernanceTransaction, dispatch: GlobalDispatch<AnyAction>) {
    try {
        const client = inject<GovernanceClient>(GovernanceClient);
        const txId = await client.submitTransaction(dispatch, tx.requestId, tx.contractAddress);
        console.log('execute', txId);
    } catch (e) {
        console.error('execute', e);
    }
}

async function attachTx(tx: GovernanceTransaction, transactionId: string, dispatch: GlobalDispatch<AnyAction>) {
    try {
        const client = inject<GovernanceClient>(GovernanceClient);
        await client.updateTransaction(dispatch, tx.requestId, transactionId);
    } catch (e) {
        console.error('attachTx', e);
    }
}

interface DataPairProps {
  label: string;
  value: string | number;
}

function DataPair(props: DataPairProps) {
  const { label, value } = props;
  
  return (
    <div className={'data-pair'}>
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export function IronSafeTransfer(props: { userAddress?: string, tx: GovernanceTransaction, contract: GovernanceContract, minSignatures: number,
        vetoerInfo: { vetoerCount: number, isVetoer: boolean,}, }) {
    const v = props.tx.values;
    let [to, token, amount, salt, expiryEpoch] = props.tx.method === 'SendSignedMethod' ?
        [v[0], v[1], v[2], v[3], v[4]] : 
        [v[0], '',   v[1], v[2], v[3]];
    const [symbol, setSymbol] = useState('');
    const [humanAmount, setHumanAmount] = useState('');
    const [shouldAttachTx, setShouldAttachTx] = useState(false);
    const [attachedTx, setAttachedTx] = useState('');
    const network = props.tx.network;

    useEffect(() => {
            const _do = async () => {
                if (!!token && !!network) {
                    const erc = inject<StandaloneErc20>(StandaloneErc20);
                    const cur = Utils.toCurrency(network, token)!;
                    const symbol = await erc.symbol(cur);
                    const human = await erc.machineToHuman(cur, amount);
                    console.log('SYMBOL FOR ', cur, 'IS', symbol)
                    setSymbol(symbol);
                    setHumanAmount(human);
                };
            };
            _do();
    }, [token, network, amount]);
    /**
     * TODO: Create the component as following. Use FluentUI.
     * - This component is a full line item hosted in a flexbox. An arrow on the rght hand side opens up the box to show the detailed version
     * - First line, compact version: [Amount] [Symbol] -> [To] [Date relative (tx.creationDate)]
     * - First line on the right hand side, tx.execution.status: 'Pending' or 'Completed', 'Failed', or 'Success' Use logos and relevant colors
     * - First line on the right hand side has a short version of both number of normal signatures required. And if veto signature is required or satisfied
     * - When arrow is clicked show the expanded version.
     * - Expanded version has following items: each in one line: [to], [token], [amount] [symbol], [time left from expiry (use moment.js)]
     * - On the bottom of the extended version we have a section for tx.execution.id. And its state. Use appropriate colors
     * - On the top right of the extended version, there is number of more signatures required
     * - if tx.signatures.length >= minSignature, and there is one vetoer in the signatures, we consider the transaction ready to execute
     * - If tx.signatures.length < minSignature - (vetoers.length ? 1 : 0)  and user is not vetoer, you cannot sign
     * - but if the user is vetoer, you can sign as vetoer.
     * - The top right hand side should have a button in three states: Disabled (if cannot sign), Sign, Veto Sign, or Execute transaction
     */

    const relativeDate = useMemo(() => {
        return moment().to(moment(props.tx.created));
    }, [props.tx.created]);
    const expiryDate = useMemo(() => {
        return moment().to(moment(Number.parseInt(expiryEpoch) * 1000));
    }, [expiryEpoch]);

    const globalDispatch = useDispatch();
    const txHasVeto = (props.tx.metadata as any)?.vetoSigned; // NOTE: This is set with the proposeTransaction
    const nonVetoSigs = (!txHasVeto && props.vetoerInfo.vetoerCount > 0) ? props.minSignatures - 1 : props.minSignatures;
    let canSign = props.tx.signatures.length < nonVetoSigs; // Everybody can add a non-veto sig if neeeded
    const canExecute = props.tx.signatures.length >= props.minSignatures && props.tx.execution.status !== 'successful'; // Enough signatures
    let signMessage = canExecute ? 'Execute the transaction' : canSign ? 'Add your singature' : 'Vetoer signature is required';
    if (!canExecute && !canSign && props.vetoerInfo.isVetoer && nonVetoSigs < props.minSignatures) {
        canSign = true; // If only a vetoer sig is needed, and you are a vetoer, you can sign
        signMessage = 'Add your singature';
    }
    if (props.tx.signatures.find(s => s.creator === props.userAddress)) {
        canSign = false;
        signMessage = 'Already signed';
    }
    return (
        <Accordion line1={
            <div className='transaction-head'>
                <div className='token-line'>
                    <span>Send</span>
                    <span>{humanAmount || ''}</span>
                    <span>{symbol || ''}</span>
                    <span>=&gt;</span>
                    <span><a href={Utils.linkForAddress(network, to)} target={'_blank'}>{to}</a></span>
                </div>
                <div className='sigs'>
                    <span className={props.tx.signatures.length >= props.minSignatures ? 'sigs-complete' : 'sigs-required'}>
                        {props.tx.signatures.length} from {props.minSignatures} Sigs
                    </span>
                    {props.vetoerInfo.vetoerCount > 0 && (
                        txHasVeto ? (<span className='veto-provided'>Veto Signed</span>) : (<span className='veto-needed'>Veto Needed</span>)
                    )}
                </div>
                {props.tx.execution?.status && (
                    <div className={`tx-status ${props.tx.execution.status === 'successful' ? 'tx-status-success' : 'tx-status-failed'}`}>
                        {props.tx.execution.status === 'successful' ? <span>Executed</span> : <span>{props.tx.execution.status}</span>}
                    </div>
                )}
            </div>
        }>
            <div className={'transaction-body'}>
                <div className='details'>
                    <DataPair label="Request ID" value={props.tx.requestId || ''} />
                    <DataPair label="Raw amount" value={amount || ''} />
                    <DataPair label="Token address" value={token || ''} />
                    <DataPair label="To" value={to} />
                    <DataPair label="Salt" value={salt} />
                    <DataPair label="Expiry" value={expiryDate} />
                    <DataPair label="Submittion Time" value={relativeDate} />
                    <a className="attach-tx" onClick={() => setShouldAttachTx(true)}>attach transaction</a>
                    {shouldAttachTx && (
                        <div>
                            <InputField
                                value={attachedTx}
                                onChange={(e: any) => setAttachedTx(e.target.value)}/>
                            <FButton 
                                title={`Attach`}
                                onClick={() => attachTx(props.tx, attachedTx, globalDispatch)}
                            />
                        </div>
                    )}
                    {!!(props.tx.execution?.transactions || []).length && (
                        <Card title='transactions' subTitle=''>
                            {props.tx.execution.transactions.map((t, i) =>
                            <a key={i} href={Utils.linkForTransaction(t.network, t.transactionId)} target='_blank'>{t.transactionId}</a>)}
                        </Card>
                    )}
                </div>
                <div className='right-side'>
                    <span
                        className={'item'}
                    >{signMessage}</span>
                    <FButton 
                        className={'item'}
                        disabled={!canSign}
                        title={`Add Your Signature`}
                        onClick={() => addSignature(props.contract, props.tx, props.vetoerInfo.isVetoer, globalDispatch)}
                    />
                    <FButton 
                        className={'item'}
                        disabled={!canExecute}
                        title={`Execute`}
                        onClick={() => execute(props.tx, globalDispatch)}
                    />
                </div>
            </div>
        </Accordion>
    );
}