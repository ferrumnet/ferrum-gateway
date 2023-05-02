import { Network } from 'ferrum-plumbing';
import { addressForUser, ChainEventItem } from "common-containers";
import { FButton } from "ferrum-design-system";
import { Dispatch, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { ChainEventBase, inject, Utils } from "types";
import { GovernanceContract, GovernanceTransaction, QuorumSubscription } from "types/dist/governance/GovernanceTypes";
import { GovernanceAppState } from "../../../common/GovernanceAppState";
import { Card } from "../../../components/Card";
import { ContractLoader } from "../../ContractDetails/GovernanceContractPage";
import { UserSubscription } from "../../UserSubscription";
import { IronSafeClient } from "./IronSafeClient";
import { IronSafeTransfer } from "./IronSafeTransfer";
import { SendToken } from "./SendToken";
import './IronSafe.css';
import { GovernanceClient } from '../../../GovernanceClient';
import { AnyAction, Dispatch as GlobalDispatch } from '@reduxjs/toolkit';

interface IronSafeVetoerInfo {
    vetoerCount: number,
    isVetoer: boolean,
}

interface IronSafeState {
    vetoLoaded: boolean;
    vetoerInfo: IronSafeVetoerInfo;
    tab: string;
    error?: string;
}

const ActionTypes = {
    SET_VETO_LOADED: "SET_VETO_LOADED",
    SET_VETOER_INFO: "SET_VETOER_INFO",
    ERROR: "ERROR",
    SET_TAB: "SET_TAB",
};

const Tabs = {
    Active: 'Active',
    Archived: 'Archived',
}

function ironSafeReducer(state: IronSafeState, action: AnyAction): IronSafeState {
    switch (action.type) {
        case ActionTypes.SET_VETO_LOADED:
            return { ...state, vetoLoaded: action.payload, error: undefined };
        case ActionTypes.SET_VETOER_INFO:
            return { ...state, vetoerInfo: action.payload, error: undefined };
        case ActionTypes.SET_TAB:
            return { ...state, tab: action.payload };
        case ActionTypes.ERROR:
            return { ...state, error: action.payload }
        default:
            return state;
    }
}

async function updateTransactionStatus(item: ChainEventBase, dispatch: GlobalDispatch<AnyAction>): Promise<ChainEventBase> {
    try {
        const client = inject<GovernanceClient>(GovernanceClient);
        const newTx = await client.updateTransaction(dispatch, item.id) as GovernanceTransaction;
        const txStat =  newTx?.execution?.status;
        const status = txStat === 'pending' ? 'pending' : 'completed';
        return {...item, status}
    } catch(e) {
        console.error('updateTransactionStatus', e);
        return item;
    }
}

async function loadVeto(network: string, contractAddress: string, dispatch: Dispatch<AnyAction>, userAddress: string) {
    // Get the backend config (explorer client, etc.)
    try {
        console.log('LOADING VETO')
        const client = inject<IronSafeClient>(IronSafeClient);
        const vetoerInfo = await client.getIronSafeVetoerInfo(network, contractAddress, userAddress);
        console.log('VETO LOADED', vetoerInfo);
        if (vetoerInfo)  {
            dispatch({type: ActionTypes.SET_VETOER_INFO, payload: vetoerInfo});
            dispatch({type: ActionTypes.SET_VETO_LOADED, payload: true});
        }
    } catch (e) {
        dispatch({type: ActionTypes.ERROR, payload: Utils.errorToString(e as Error) });
    }
}

export function IronSafePage() {
	let { network, contractAddress, contractId } = useParams() as any;
    contractAddress = (contractAddress || '').toLowerCase();
    // Mixing redux with reacts internal useReducer. useReducer is only for this page. Redux is global.
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
    const vetoLoaded = useSelector<GovernanceAppState, boolean>(
		state => !!state.data.state.exampleIronSafe?.vetoLoaded);
    const quorum = useSelector<GovernanceAppState, QuorumSubscription>(
		state => state.connection.userState.quorum);
    const [ironSafeState, dispatch] = useReducer(ironSafeReducer, {
        vetoLoaded: vetoLoaded,
        tab: Tabs.Active,
        vetoerInfo: {
            vetoerCount: 0,
            isVetoer: false,
        }
    });
    useEffect(() => {
		if (!vetoLoaded && userAddress && contractAddress) {
            console.log('NOW LOADING');
			loadVeto(network, contractAddress, dispatch, userAddress);
		}
	}, [network, vetoLoaded, userAddress, contractAddress]);

    const iHaveVetoRight = !!ironSafeState.vetoerInfo.isVetoer ? 'YES' : 'NO';
	return (
		<>
			<div className='gv-section-title'>
				<h3>{`${contract?.identifier?.name} Governance `}</h3>
			</div>
			<ContractLoader
				network={network} contractAddress={contractAddress} contractId={contractId}
			/>
			<div className="gv-page-content">
				<UserSubscription />
				<div className='column'>
					<h1  className='gv-title'><u>Selected Contract</u></h1>
					<Card
						title={`Iron Safe`}
						subTitle={`${network}:${contractAddress}`}
					>
                    <div className="method-contract">
                        {ironSafeState.error && <span className="error-msg">{ironSafeState.error}</span>}
                        <h4><div className='title-mini'>Veto right:</div> {iHaveVetoRight.toString()}</h4>
                        <h4><div className='title-mini'>Total vetoers:</div> {ironSafeState.vetoerInfo.vetoerCount}</h4>
                    </div>
					</Card>
				</div>
                <SendToken 
                    userAddress={userAddress}
                    network={network}
                    contractAddress={contractAddress}
                    disabled={!quorum.quorum}
                    userHasVeto={ironSafeState.vetoerInfo.isVetoer}
                />
                <div>
                    <div className='gv-card-action-btn'>
                        <FButton title={'Active Transactions'}
                            disabled={ironSafeState.tab == Tabs.Active}
                            onClick={() =>  dispatch({type: ActionTypes.SET_TAB, payload: Tabs.Active})}/>
                        &nbsp;
                        <FButton title={'Archived Transactions'}
                            disabled={ironSafeState.tab == Tabs.Archived}
                            onClick={() =>  dispatch({type: ActionTypes.SET_TAB, payload: Tabs.Archived})}/>
                    </div>
                </div>
                <TransferList filter={ironSafeState.tab} vetoerInfo={ironSafeState.vetoerInfo}/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
			</div>
		</>
	);
}

function pendingTx(tx: GovernanceTransaction) {
    return tx.execution?.status !== 'successful';
}

function TransferList(props: {filter: string, vetoerInfo: IronSafeVetoerInfo}) {
	const allRequests = useSelector<GovernanceAppState, GovernanceTransaction[]>(
		state => state.data.state.requests);
    const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
    const requests = props.filter == Tabs.Active ?
        allRequests.filter(r => pendingTx(r) ) :
        allRequests.filter(r => !pendingTx(r));
    const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
    const quorum = useSelector<GovernanceAppState, QuorumSubscription>(
		state => state.connection.userState.quorum);

    return (
        <>
        <div className='gv-section-title'>
            <h4>Transactions</h4>
        </div>
        {requests.filter(r => r.method === 'SendEthSignedMethod' || r.method === 'SendSignedMethod').map((r, i) => (
            <ChainEventItem
                key={i}
                id={r.requestId}
                network={r.network as Network}
                initialStatus={r.execution.status === 'pending' ? 'pending' : 'completed'}
                eventType={'TX_EXEC'}
                updater={updateTransactionStatus}
            >
                <IronSafeTransfer
                    tx={r}
                    contract={contract}
                    minSignatures={quorum.minSignatures}
                    vetoerInfo={props.vetoerInfo}
                    userAddress={userAddress} />
            </ChainEventItem>
        ))}
        </>
    );
}