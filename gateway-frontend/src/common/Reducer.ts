import { combineReducers } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { ProjectListSlice } from "../pages/projectList/ProjectList";
import { AppGlobalState, AppUserState } from "./GatewayAppState";

// Each UI component or page will manage its own slice of state. We purposefully 
// make thiss of type 'any' to avoid a centralized typing for UI state. 
// However the data and user state which will be shared by various selectors
// must remain fully typed.
export const uiReducer = combineReducers({
    projectList: ProjectListSlice.reducer,
});

export function userReducer(state: AppUserState = {allocations: {} as any, userProjects: {} as any}, action: AnyAction) {
    return state;
}

export function dataReducer(state: AppGlobalState = { initialized: false,
        waiting: false, allProjects: [], allStakings: [], }, action: AnyAction) {
    return state;
}