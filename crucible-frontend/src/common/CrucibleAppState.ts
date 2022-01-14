import { AppInitializingState, AppState } from 'common-containers';
import { CrucibleInfo, UserCrucibleInfo, } from 'types';
import { StakingState } from '../staking/StakingClient';
import { TxModalState } from './../common/transactionModal';
export interface DeployState {
	baseToken: string;
	feeOnTransfer: string;
	feeOnWithdraw: string;
	error?: string;
}

export interface CrucibleBoxState {
	network: string;
	activeTxId: string;
};

export interface AppUiState {
	deploy: DeployState;
	crucibleBox: CrucibleBoxState;
	transactionModal: TxModalState
};

export interface AppUserState {
	userCrucibleInfo: { [k: string]: UserCrucibleInfo };
}

export interface AppGlobalState extends AppInitializingState {
	// Crucibles grouped by base currency
	crucibles: { [k: string]: CrucibleInfo[] };
	crucible: CrucibleInfo;
	stake: StakingState;
}

export type CrucibleAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
