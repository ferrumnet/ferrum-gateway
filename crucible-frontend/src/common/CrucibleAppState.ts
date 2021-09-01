import { AppInitializingState, AppState } from 'common-containers';
import { CrucibleInfo, } from 'types';

export interface DeployState {
	baseToken: string;
	feeOnTransfer: string;
	feeOnWithdraw: string;
}

export interface CrucibleBoxState {
	network: string;
	activeTxId: string;
};

export interface AppUiState {
	deploy: DeployState;
	crucibleBox: CrucibleBoxState;
};

export interface AppUserState {
	// TODO: Add the stuff related to staking.
}

export interface AppGlobalState extends AppInitializingState {
	// Crucibles grouped by base currency
	crucibles: { [k: string]: CrucibleInfo[] };
}

export type CrucibleAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
