import { AppInitializingState, AppState } from 'common-containers';
import { GovernanceContract, GovernanceTransaction, RegisteredContract, QuorumSubscription
} from 'types';

export interface NewMethodState {
	methodIdx: number;
	values: string[];
	error?: string;
	saved: boolean;
	pending: boolean;
}

export interface MethodState {
	error?: string;
	saved: boolean;
	pending: boolean;
}

export interface AppUiState {
	newMethod: NewMethodState;
	method: MethodState;
};

export interface AppUserState {
	quorum: QuorumSubscription;
}

export interface AppGlobalState extends AppInitializingState {
	contracts: RegisteredContract[];
	selectedContract: GovernanceContract;
	requests: GovernanceTransaction[];
}

export type GovernanceAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
