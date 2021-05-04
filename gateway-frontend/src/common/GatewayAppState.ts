import { AppInitializingState, AppState } from 'common-containers';
import { GatewayProject, GatewayStakings, UserProjectAllocation, UserProjects } from '../../../commons/types/dist';

export type AppUiState = any;

export interface AppUserState {
    userProjects: UserProjects,
    allocations: UserProjectAllocation,
}

export interface AppGlobalState extends AppInitializingState {
    allProjects: GatewayProject[],
    allStakings: GatewayStakings,
}


export type GatewayAppState = AppState<AppUserState, AppGlobalState, AppUiState>;