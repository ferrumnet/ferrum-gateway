import { AppInitializingState, AppState } from 'common-containers';

export type AppUiState = any;

export interface AppUserState {
    userProjects: UserProjects,
    allocations: UserProjectAllocation,
}

export interface AppGlobalState extends AppInitializingState {
	crucibles: { [k: string]: CrucibleInfo[] };
}


export type CrucibleAppState = AppState<AppUserState, AppGlobalState, AppUiState>;