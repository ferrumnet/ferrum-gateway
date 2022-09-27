import { AppInitializingState, AppState } from 'common-containers';
import { QuantumPortalMinedBlock, QuantumPortalRemoteTransactoin,
    QuantumPortalAccountBalance,
    QuantumPortalAccount,
    QuantumPortalContractObject} from 'qp-explorer-commons';
import { NetworkedConfig } from 'types';

export interface AppUiState {
    readContract: any;
    writeContract: any;
    abiInputGroup: any;
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
    selectedAddress: {
        account: QuantumPortalAccount&{contractObjects:NetworkedConfig<QuantumPortalContractObject>},
        transactions: QuantumPortalRemoteTransactoin[],
        balances: QuantumPortalAccountBalance[],
    }|undefined,
    error: string|undefined;
}

export type QpAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
