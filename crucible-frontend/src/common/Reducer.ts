import { combineReducers } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { CrucibleInfo } from "types";
import { CrucibleClientActions } from "./CrucibleClient";
import { crucibleBoxSlice } from "../pages/crucibleLgcy/CrucibleBox";
import { deploySlice } from "./../pages/deploy/Deploy";
import { dashboardSlice } from "./../pages/main/Dashboard";
import { StakingSlice } from "../staking/StakingClient";
import { TransactionModalSlice } from './../common/transactionModal';
import { APPLICATION_NAME, CommonActions } from "./CommonActions";
import { AppGlobalState, AppUserState } from "./CrucibleAppState";

export const uiReducer = combineReducers({
  crucibleBox: crucibleBoxSlice.reducer,
  deploy: deploySlice.reducer,
  transactionModal: TransactionModalSlice.reducer,
  dashboardSlice: dashboardSlice.reducer 
});

export function userReducer(
  state: AppUserState = { userCrucibleInfo: {},userActionError:'',processingRequest:false },
  action: AnyAction
) {
  switch (action.type) {
    case CrucibleClientActions.USER_CRUCIBLE_LOADED:
      const actionUci = action.payload.userCrucibleInfo;
      const uci = { ...(state.userCrucibleInfo || ({} as any)) };
      uci[actionUci.currency] = actionUci;
      return { ...state, userCrucibleInfo: uci };
     case CrucibleClientActions.PROCESSING_REQUEST:
        return { ...state, processingRequest:!state.processingRequest };
    default:
      return state;
  }
}

function clientReducer(state: AppGlobalState, action: AnyAction) {
  switch (action.type) {
    case CrucibleClientActions.CRUCIBLES_LOADED:
      const allCru: CrucibleInfo[] = action.payload.crucibles || [];
      const cru: any = {};
      allCru.forEach((c) => {
        const cb: CrucibleInfo[] = cru[c.baseCurrency] || [];
        cb.push(c);
      });
      return { ...state, crucibles: cru };
    case CrucibleClientActions.CRUCIBLE_LOADED:
      const upCru: CrucibleInfo = action.payload.crucible;
      const upCrus = state.crucibles[upCru.baseCurrency] || [];
      const idx = upCrus.findIndex((c) => c.currency === upCru.currency);
      if (idx >= 0) {
        upCrus[idx] = upCru;
      } else {
        upCrus.push(upCru);
      }
      return {
        ...state,
        crucibles: {
          ...state.crucibles,
          [upCru.baseCurrency]: upCrus,
        },
      };
    case CrucibleClientActions.SELECT_CRUCIBLE:
      return { ...state, crucible: action.payload.crucible };
    case CrucibleClientActions.LOADED_CRUCIBLE_PRICE:
      return { ...state, crucible: {...state.crucible,priceUsdt: action.payload.cruciblePrice,basePriceUsdt:action.payload.basePrice }}
    case CrucibleClientActions.PROCESSING_REQUEST:
        return { ...state, error: action.payload.error };
    case CrucibleClientActions.CLEAR_ERROR:
        return { ...state, error: '' };
    default:
      return state;
  }
}

export function dataReducer(
  state: AppGlobalState = {
    crucibles: {},
    waiting: false,
    initialized: false,
  } as AppGlobalState,
  action: AnyAction
) {
  switch (action.type) {
    case CommonActions.WAITING:
      return { ...state, waiting: true, initError: "" };
    case CommonActions.WAITING_DONE:
      return { ...state, waiting: false };
    case CommonActions.GROUP_INFO_LOADED:
      return { ...state, groupInfo: action.payload };
    case CommonActions.ERROR_OCCURED:
      return { ...state, initError: action.payload.message,waiting: false };
    case 'transactionListSlice/transactionUpdated':
      if(action.payload.application === APPLICATION_NAME ){
        if(action.payload.status === 'successful'){
          return { ...state, txUpdate: {status:'success',type: action.payload.transactionType, id: action.payload.id },waiting: false };
        }
        if(action.payload.status === 'failed'){
          return { ...state, txUpdate: {status:'error',type: action.payload.transactionType, id: action.payload.id },waiting: false };
        }
      }
      return {...state}
    case CommonActions.RESET_ERROR:
      return { ...state, initError: "",txUpdate: "" };
    default:
  		state = {...state, stake: StakingSlice.reducer(state.stake, action)};
      return clientReducer(state!, action);
  }
}

