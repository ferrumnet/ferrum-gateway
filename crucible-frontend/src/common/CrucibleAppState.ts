import { AppInitializingState, AppState } from 'common-containers';
import { CrucibleInfo, } from 'types';

export type AppUiState = any;

export interface AppUserState {
	// TODO: Add the stuff related to staking.
}

export interface AppGlobalState extends AppInitializingState {
	// Crucibles grouped by base currency
	crucibles: { [k: string]: CrucibleInfo[] };
}

export type CrucibleAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
