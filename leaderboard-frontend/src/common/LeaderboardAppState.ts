import { AppInitializingState,AppState } from "common-containers";
export interface AppUserState {}
export interface AppGlobalState extends AppInitializingState {}
export interface AppUiState {
};
export type LeaderboardAppState = AppState<AppUserState, AppGlobalState, AppUiState>;