import { AppInitializingState, AppState } from 'common-containers';
import { GovernanceContract, GovernanceTransaction, RegisteredContract } from 'types';

export interface NewMethodState {
	methodIdx: number;
	values: string[];
	error?: string;
	saved: boolean;
	pending: boolean;
}

export interface AppUiState {
	newMethod: NewMethodState;
};

export interface AppUserState {
}

export interface AppGlobalState extends AppInitializingState {
	contracts: RegisteredContract[];
	selectedContract: GovernanceContract;
	requests: GovernanceTransaction[];
}

export type GovernanceAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
