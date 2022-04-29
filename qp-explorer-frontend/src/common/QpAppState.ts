import { AppInitializingState, AppState } from 'common-containers';
import { QuantumPortalMinedBlock, QuantumPortalRemoteTransactoin } from 'qp-explorer-commons';

export interface AppUiState {
};

export interface AppUserState {
}

export interface AppGlobalState extends AppInitializingState {
    recentBlocks: QuantumPortalMinedBlock[];
    selectedBlock: {
        block: QuantumPortalMinedBlock,
        transactions: QuantumPortalRemoteTransactoin[],
    }|undefined,
    recentTransactions: QuantumPortalRemoteTransactoin[];
    selectedTransaction: QuantumPortalRemoteTransactoin|undefined;
    error: string|undefined;
}

export type QpAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
