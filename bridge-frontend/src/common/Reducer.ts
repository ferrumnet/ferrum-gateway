import { combineReducers } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { DashboardSlice } from "../pages/Dashboard/Dashboard";
import {connectSlice } from 'common-containers'
import { AppGlobalState, AppUserState, GroupInfo} from "./BridgeAppState";
import { MainPageSlice } from '../pages/Main/Main';
import { swapageSlice} from '../pages/Swap';
import { liquidityPageSlice } from '../pages/Liquidity';
import { SidePanelSlice } from '../components/SidePanel';

import { CommonActions } from './Actions';
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
    sidePanel: SidePanelSlice.reducer
});

export function userReducer(
    state: AppUserState = {allocations: {} as any, 
    userProjects: {} as any,
    AppAccountState: {} as any,
}, action: AnyAction) {
    return state;
}

export function dataReducer(state: AppGlobalState = { 
        initialized: false,
        waiting: false, 
        allProjects: [], 
        allStakings: [],
        groupInfo: {} as any,
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
        default:
            return state;
    }
}