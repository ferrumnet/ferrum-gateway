import { combineReducers } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { DashboardSlice } from "../pages/Dashboard/Dashboard";
import {connectSlice } from 'common-containers'
import { AppGlobalState, AppUserState} from "./BridgeAppState";
import { MainPageSlice } from '../pages/Main/Main';
import { swapageSlice} from '../pages/Swap';
import { liquidityPageSlice } from '../pages/Liquidity';
import { SidePanelSlice } from '../components/SidePanel';

import { CommonActions } from './Actions';
import { TokenBridgeClientActions } from "../clients/BridgeClient";
import { UserBridgeWithdrawableBalanceItem } from "types";
import { crossSwapSlice } from "../pages/CrossSwap/CrossSwap";
// Each UI component or page will manage its own slice of state. We purposefully 
// make thiss of type 'any' to avoid a centralized typing for UI state. 
// However the data and user state which will be shared by various selectors
// must remain fully typed.
export const uiReducer = combineReducers({
    dashboard: DashboardSlice.reducer,
    connection: connectSlice.reducer,
    pairPage: MainPageSlice.reducer,
    swapPage: swapageSlice.reducer,
    liquidityPage: liquidityPageSlice.reducer,
    sidePanel: SidePanelSlice.reducer,
	crossSwap: crossSwapSlice.reducer,
});

export function userReducer(
    state: AppUserState = {allocations: {} as any, 
    userProjects: {} as any,
    AppAccountState: {} as any,
}, action: AnyAction) {
    return state;
}

function clientReducer(state: AppGlobalState, action: AnyAction): AppGlobalState {
    switch (action.type) {
        case TokenBridgeClientActions.BRIDGE_BALANCE_ITEMS_RECEIVED:
			const items = (action.payload || []) as UserBridgeWithdrawableBalanceItem[]
			items.sort((i1, i2) => i1.sendTimestamp < i2.sendTimestamp ? 1 : -1);
			return {...state, balanceItems: items};
        case TokenBridgeClientActions.BRIDGE_BALANCE_ITEM_UPDATED:
			const upItem = (action.payload || {}) as UserBridgeWithdrawableBalanceItem;
			const newBalanceItems = [...state.balanceItems];
			const idx = state.balanceItems.findIndex(i => i.receiveTransactionId === upItem.receiveTransactionId);
			if (idx >= 0) {
				newBalanceItems[idx] = upItem;
			} else {
				if (upItem.receiveTransactionId) {
					newBalanceItems.push(upItem);
					newBalanceItems.sort((i1, i2) => i1.sendTimestamp < i2.sendTimestamp ? 1 : -1);
				}
			}
			return {...state, balanceItems: newBalanceItems};
		case TokenBridgeClientActions.TOKEN_CONFIG_LOADED:
			return {...state, currencyPairs: action.payload.currencyPairs}
		case TokenBridgeClientActions.BRIDGE_AVAILABLE_LIQUIDITY_FOR_TOKEN:
			const {currency, liquidity} = action.payload;
			return {...state, bridgeLiquidity: {...state.bridgeLiquidity, [currency]: liquidity}};
		default:
			return state;
	}
}

export function dataReducer(state: AppGlobalState = { 
        initialized: false,
        waiting: false,
		balanceItems: [],
        allProjects: [], 
        allStakings: [],
        groupInfo: {} as any,
		currencyPairs: [],
		bridgeLiquidity: {},
        error: ''
    }, action: AnyAction) {
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
			return clientReducer(state, action);
    }
}