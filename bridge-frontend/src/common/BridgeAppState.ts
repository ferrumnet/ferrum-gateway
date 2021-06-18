import { AppInitializingState, AppState,AppAccountState } from 'common-containers';
import { GatewayProject, GatewayStakings, UserProjectAllocation, UserProjects } from 'types';
import {DashboardProps} from './../pages/Dashboard/Dashboard';
import {MainPageProps} from './../pages/Main/Main';
import {swapPageProps} from './../pages/Swap';
import {liquidityPageProps} from './../pages/Liquidity';
import { SidePanelProps} from '../components/SidePanel';

export interface GroupInfo {
    _id?: string;
    groupId: string;
    network: string;
    themeVariables: any;
    defaultCurrency: string;
    homepage: string;
    noMainPage: boolean; // Main page should redirect to home page
    headerHtml?: string;
    footerHtml?: string;
    mainLogo?: string
}

export type AppUiState = {
    dashboard: DashboardProps,
    pairPage: MainPageProps,
    swapPage: swapPageProps,
    liquidityPage: liquidityPageProps,
    sidePanel: SidePanelProps
};

export interface AppUserState {
    userProjects: UserProjects,
    allocations: UserProjectAllocation,
    AppAccountState: AppAccountState
}

export interface AppGlobalState extends AppInitializingState {
    allProjects: GatewayProject[],
    allStakings: GatewayStakings,
    groupInfo: GroupInfo,
    error: ''
}

export type BridgeAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
