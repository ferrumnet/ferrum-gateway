import { AppInitializingState, AppState } from 'common-containers';
import { AnyAction } from 'redux';

export interface AppUiState {
}

export interface AppUserState {
}

export interface AppGlobalState extends AppInitializingState {
}


export type GatewayAppState = AppState<AppUserState, AppGlobalState, AppUiState>;


export function uiReducer(state: AppUiState = {}, action: AnyAction) {
    return state;
}

export function userReducer(state: AppUserState = {}, action: AnyAction) {
    return state;
}

export function dataReducer(state: AppGlobalState = { initialized: false, waiting: false }, action: AnyAction) {
    return state;
}