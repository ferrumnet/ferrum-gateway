import { combineReducers } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { GovernanceClientActions } from "../GovernanceClient";
import { newMethodSlice } from "../pages/Method";
import { CommonActions } from "./CommonActions";
import { AppGlobalState, AppUserState } from "./GovernanceAppState";

export const uiReducer = combineReducers({
	newMethod: newMethodSlice.reducer,
});

export function userReducer(state: AppUserState = {}, action: AnyAction) {
	// TODO: Reduce user allocations...
    return state;
}

function clientReducer(state: AppGlobalState, action: AnyAction) {
	switch (action.type) {
		case GovernanceClientActions.CONTRACTS_LOADED:
			return {...state, contracts: action.payload};
		case GovernanceClientActions.CONTRACT_LOADED:
			return {...state, selectedContract: action.payload};
		case GovernanceClientActions.TRANSACTIONS_LOADED:
			return {...state, requests: action.payload};
		default:
			return state;
	}
}

export function dataReducer(state: AppGlobalState = {
		contracts: [],
		requests: [],
		selectedContract: {} as any,
		waiting: false,
		initialized: false } as AppGlobalState,
	action: AnyAction) {
	switch (action.type) {
        case CommonActions.WAITING:
            return { ...state,waiting: true,error: '' };
        case CommonActions.WAITING_DONE:
            return { ...state,waiting: false };
        case CommonActions.GROUP_INFO_LOADED:
            return {...state,groupInfo: action.payload}
        case CommonActions.ERROR_OCCURED:
            return {...state,error: action.payload.message}
        case CommonActions.RESET_ERROR:
            return {...state,error: ''}
        default:
			return clientReducer(state!, action);
	}
    return state;
}