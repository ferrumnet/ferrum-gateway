import { AppInitializingState, AppState,AppAccountState } from 'common-containers';
import { GatewayProject, GatewayStakings, GroupInfo, UserBridgeWithdrawableBalanceItem, UserProjectAllocation, UserProjects } from 'types';
import {DashboardProps} from './../pages/Dashboard/Dashboard';
import {MainPageState} from './../pages/Main/Main';
import {swapPageProps} from './../pages/Swap';
import {liquidityPageProps} from './../pages/Liquidity';
import { SidePanelProps} from '../components/SidePanel';
import { BridgeTokenConfig } from 'types';


export interface AppUiState {
    dashboard: DashboardProps;
    pairPage: MainPageState;
    swapPage: swapPageProps;
    liquidityPage: liquidityPageProps;
    sidePanel: SidePanelProps;
};

export interface AppUserState {
    userProjects: UserProjects,
    allocations: UserProjectAllocation,
    AppAccountState: AppAccountState
}

export interface AppGlobalState extends AppInitializingState {
	balanceItems: UserBridgeWithdrawableBalanceItem[],
    allProjects: GatewayProject[],
    allStakings: GatewayStakings,
    groupInfo: GroupInfo,
	currencyPairs: BridgeTokenConfig[],
	bridgeLiquidity: {[k: string]: string},
    error: '',
}

export type BridgeAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
