import { combineReducers } from "@reduxjs/toolkit";
import { QuantumPortalMinedBlock, QuantumPortalRemoteTransactoin } from "qp-explorer-commons";
import { AnyAction } from "redux";
import { readContractSlice } from "../pages/ContractInteraction";
import { CommonActions, QpExplorerActions } from "../QpExplorerClient";
import { AppGlobalState, AppUserState } from "./QpAppState";

export const uiReducer = combineReducers({
  readContract: readContractSlice.reducer,
});

export function userReducer(
  state: AppUserState = { },
  action: AnyAction
) {
    return state;
}

function clientReducer(state: AppGlobalState, action: AnyAction): AppGlobalState {
  switch (action.type) {
    case QpExplorerActions.BLOCKS_UPDATED:
      const recentBlocks: QuantumPortalMinedBlock[] = action.payload || [];
      return { ...state, recentBlocks };
    case QpExplorerActions.TXS_UPDATED:
      const recentTransactions: QuantumPortalRemoteTransactoin[] = action.payload;
      return {
        ...state,
        recentTransactions,
      };
    case QpExplorerActions.TX_UPDATED:
      const selectedTransaction: QuantumPortalRemoteTransactoin = action.payload;
      return {
        ...state,
        selectedTransaction,
      }
    case QpExplorerActions.BLOCK_UPDATED:
        return {
            ...state,
            selectedBlock: action.payload,
        };
    case QpExplorerActions.ACCOUNT_INFO_UPDATED:
        return {
          ...state,
          selectedAddress: action.payload,
        };
    default:
      return state;
  }
}

export function dataReducer(
  state: AppGlobalState = {
    recentBlocks: [],
    recentTransactions: [],
    selectedBlock: undefined,
    selectedTransaction: undefined,
    selectedAddress: undefined,
    waiting: false,
    initialized: false,
    error: undefined,
  } as AppGlobalState,
  action: AnyAction
): AppGlobalState {
  switch (action.type) {
    case CommonActions.WAITING:
      return { ...state, waiting: true, error: "" };
    case CommonActions.WAITING_DONE:
      return { ...state, waiting: false };
    case CommonActions.ERROR_OCCURED:
      return { ...state, error: action.payload.message };
    case CommonActions.RESET_ERROR:
      return { ...state, error: "" };
    default:
        state = {
            ...state,
        };
        return clientReducer(state!, action);
  }
}
