import { AppInitializingState, AppState } from 'common-containers';

export interface AppUiState {
};

export interface AppUserState {
}

export interface AppGlobalState extends AppInitializingState {
}

export type GovernanceAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
