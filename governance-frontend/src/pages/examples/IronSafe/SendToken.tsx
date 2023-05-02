import { Networks } from 'ferrum-plumbing';
import { Dispatch, useReducer } from "react";
import { Card } from "../../../components/Card";
import {
	InputField,
	// @ts-ignore
} from 'component-library';
import { FButton } from "ferrum-design-system";
import { GovernanceContract, inject, inject2, Utils } from "types";
import { StandaloneErc20 } from 'common-containers/dist/clients/StandaloneErc20';
import { GovernanceClient } from "../../../GovernanceClient";
import { useDispatch, useSelector } from "react-redux";
import { GovernanceAppState } from "../../../common/GovernanceAppState";
import { AnyAction, Dispatch as GlobalDispatch } from '@reduxjs/toolkit';
import { GovernanceUtils } from "../../../common/GovernanceUtils";
import { Big } from 'big.js';

interface State {
    tokenAddress: string;
    to: string;
    amount: string;
    decimals: string;
    tokenSymbol: string;
    addressError?: string;
    amountError?: string;
    error?: string;
    loading: boolean;
}

const ActionTypes = {
    SET_TOKEN_ADDRESS: "SET_TOKEN_ADDRESS",
    SET_TO_ADDRESS: 'SET_TO_ADDRESS',
    SET_AMOUNT: "SET_AMOUNT",
    SET_DECIMAL_AND_SYMBOL: "SET_DECIMAL_AND_SYMBOL",
    SET_ADDRESS_ERROR: "SET_ADDRESS_ERROR",
    SET_AMOUNT_ERROR: "SET_AMOUNT_ERROR",
    SET_ERROR: "SET_ERROR",
    RESET_CONTROLS: "RESET_CONTROLS",
};

function reducer(state: State, action: AnyAction): State {
    switch (action.type) {
        case ActionTypes.SET_TOKEN_ADDRESS:
            return {
                ...state,
                tokenAddress: action.payload,
                addressError: undefined,
                error: undefined,
            };
        case ActionTypes.SET_TO_ADDRESS:
            return {
                ...state,
                to: action.payload,
                addressError: undefined,
                error: undefined,
            };
        case ActionTypes.SET_AMOUNT:
            return {
                ...state,
                amount: action.payload,
                amountError: undefined,
                error: undefined,
            };
        case ActionTypes.SET_DECIMAL_AND_SYMBOL:
            return {
                ...state,
                tokenSymbol: action.payload.symbol,
                decimals: action.payload.decimals,
            };
        case ActionTypes.SET_ADDRESS_ERROR:
            return {
                ...state,
                addressError: action.payload,
            };
        case ActionTypes.SET_AMOUNT_ERROR:
            return {
                ...state,
                amountError: action.payload,
            };
        case ActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        case ActionTypes.RESET_CONTROLS:
            return {
                ...state,
                amount: '', decimals: '', to: '', tokenAddress: '', tokenSymbol: '',
            }
        default:
            return state;
    }
}

async function tryLoadToken(network: string, address: string, dispatch: Dispatch<AnyAction>) {
    try {
        console.log('Loading token', address);
        if (!network || !Utils.isAddress(address)) {
            dispatch({type: ActionTypes.SET_ADDRESS_ERROR, payload: 'Invalid address'});
            return;
        }
        const erc20 = inject<StandaloneErc20>(StandaloneErc20);
        const currency = Utils.toCurrency(network, address)!;
        const symbol = await erc20.symbol(currency);
        const decimals = await erc20.decimals(currency);
        dispatch({type: ActionTypes.SET_DECIMAL_AND_SYMBOL, payload: { decimals, symbol }});
    } catch (e) {
        console.error('tryLoadToken', e);
    }
}

async function signAndSaveSendEth(contract: GovernanceContract, network: string, contractAddress: string,
    to: string, amount: string, userHasVeto: boolean, dispatch: GlobalDispatch<AnyAction>, localDispatch: Dispatch<AnyAction>) {
    try {
        const client  = inject<GovernanceClient>(GovernanceClient);
        const amountMachine = new Big(amount).mul(new Big(10).pow(18)).toFixed();
        // args: to, amount, salt, expiry
        const args = [to, amountMachine, GovernanceUtils.randomSalt(), GovernanceUtils.defaultExpiry().toString()];
        const methodName = 'SendEthSignedMethod';
        const method = contract.methods.find(m => m.name === methodName)!;
        if (!method) { throw new Error('Method not found'); }
		const signature = await client.signMessage(
			network, contract.identifier.name,
			contract.identifier.version, contractAddress, method, args);
		await client.proposeTransaction(dispatch,
			contractAddress,
			contract.id,
			method.name,
			args,
            { symbol: 'ETH', decimals: '18', vetoSigned: userHasVeto },
			signature);
        localDispatch({type: ActionTypes.RESET_CONTROLS});
    } catch(e) {
        console.error('signAndSaveSendEth', e);
        localDispatch({type: ActionTypes.SET_ERROR, payload: Utils.errorToString(e as Error)});
    }
}

async function signAndSaveSendToken(contract: GovernanceContract,
        network: string, contractAddress: string,
        token: string, to: string, amount: string, userHasVeto: boolean, dispatch: GlobalDispatch<AnyAction>, localDispatch: Dispatch<AnyAction>) {
    try {
        const [erc20, client]  = inject2<StandaloneErc20, GovernanceClient>(StandaloneErc20, GovernanceClient);
        const currency = Utils.toCurrency(network, token)!;
        const amountMachine = await erc20.humanToMachine(currency, amount);
        // args: to, token, amount, salt, expiry
        const args = [to, token, amountMachine, GovernanceUtils.randomSalt(), GovernanceUtils.defaultExpiry().toString()];
        const methodName = 'SendSignedMethod';
        const method = contract.methods.find(m => m.name === methodName)!;
        if (!method) { throw new Error('Method not foudn'); }
		const signature = await client.signMessage(
			network, contract.identifier.name,
			contract.identifier.version, contractAddress, method, args);
		await client.proposeTransaction(dispatch,
			contractAddress,
			contract.id,
			method.name,
			args,
            { symbol: await erc20.symbol(currency), decimals: await erc20.decimals(currency), vetoSigned: userHasVeto },
			signature);
        localDispatch({type: ActionTypes.RESET_CONTROLS});
    } catch(e) {
        localDispatch({type: ActionTypes.SET_ERROR, payload: Utils.errorToString(e as Error)});
    }
}

function networkBaseCur(network: string) {
    try {
        const cur = Networks.for(network).baseCurrency;
        return Utils.parseCurrency(cur)[1];
    } catch (e) {
        return 'ETH';
    }
}

export function SendToken(params: {userAddress: string|undefined, network: string, contractAddress: string, disabled: boolean, userHasVeto: boolean }) {
    const {userAddress, network, contractAddress, disabled} = params;
    const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
    const globalDispatch = useDispatch();
    const [state, dispatch] = useReducer(reducer, {
        tokenAddress: '',
        to: '',
        amount: '',
        decimals: '',
        tokenSymbol: '',
        loading: false,
    });
    if (disabled || !userAddress) {
        return (<></>);
    }
    return (
        <>
        <Card
            title={`Send Token`}
            subTitle={``}
        >
            <div className="method-contract">
                <span>{`To`}</span>
				<InputField
					value={state.to}
					onChange={(e: any) => {
                        dispatch({type: ActionTypes.SET_TO_ADDRESS, payload: e.target.value});
                    }}
				/>

                <span>{`Token Address`}</span>
				<InputField
					value={state.tokenAddress}
					onChange={(e: any) => {
                        dispatch({type: ActionTypes.SET_TOKEN_ADDRESS, payload: e.target.value});
                        tryLoadToken(network, e.target.value, dispatch);
                    }}
				/>
                {state.amountError && <p>{state.amountError}</p>}
                
                <span>{`Amount`}</span>
				<InputField
					value={state.amount}
					onChange={(e: any) => dispatch({type: ActionTypes.SET_AMOUNT, payload: e.target.value})}
				/>
                <span>{state.tokenSymbol}</span>
                {state.amountError && <p>{state.amountError}</p>}
                
                <div className='gv-card-action-btn'>
                    <FButton 
                        disabled={!!state.addressError || !!state.amountError || state.loading}
                        title={'Create Send Token Transaction'}
                        onClick={() => signAndSaveSendToken(contract, network, contractAddress, state.tokenAddress,
                            state.to, state.amount, params.userHasVeto, globalDispatch, dispatch)}
                    />
                </div> <br/>

                <div className='gv-card-action-btn'>
                    <FButton 
                        disabled={!!state.amountError}
                        title={`Create Send ${networkBaseCur(network)} Transaction`}
                        onClick={() =>
                            signAndSaveSendEth(contract, network, contractAddress, state.to, state.amount, params.userHasVeto, globalDispatch, dispatch)}
                    />
                </div>
            </div>
        </Card>
        </>
    )
}