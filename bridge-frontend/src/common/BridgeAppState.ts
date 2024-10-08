import {
  AppInitializingState,
  AppState,
  AppAccountState,
} from "common-containers";
import {
  GatewayProject,
  GatewayStakings,
  GroupInfo,
  RoutingTableLookup,
  TokenDetails,
  UserBridgeWithdrawableBalanceItem,
  UserProjectAllocation,
  UserProjects,
} from "types";
import { DashboardProps } from "./../pages/Dashboard/Dashboard";
import { MainPageState } from "./../pages/Main/Main";
import { swapPageProps } from "./../pages/Swap";
import { liquidityPageProps } from "./../pages/Liquidity";
import { SidePanelProps } from "../components/SidePanel";
import { BridgeTokenConfig, RoutingTable } from "types";
import { CrossSwapState } from "../pages/CrossSwap/CrossSwap";
import { notificationServiceProps } from "./../pages/SelfService/notificationMgt";

export interface SwapTxStatus {
  swapStatus: string;
  swapTimeStamp: string;
  withdrawalItemStatus: string;
  withdrawalItemTimeStamp: string;
  withdrawn: false;
}

export interface SelfServiceState {
  network: string;
  txId: string;
  txStatus: SwapTxStatus;
}

export interface AppUiState {
  dashboard: DashboardProps;
  pairPage: MainPageState;
  swapPage: swapPageProps;
  liquidityPage: liquidityPageProps;
  sidePanel: SidePanelProps;
  selfServicePage: SelfServiceState;
  notificationServicePage: notificationServiceProps;
  crossSwap: CrossSwapState;
}

export interface AppUserState {
  userProjects: UserProjects;
  allocations: UserProjectAllocation;
  AppAccountState: AppAccountState;
}

export type FilteredTokenDetails = { [k: string]: TokenDetails };

export interface AppGlobalState extends AppInitializingState {
  balanceItems: UserBridgeWithdrawableBalanceItem[];
  allProjects: GatewayProject[];
  allStakings: GatewayStakings;
  groupInfo: GroupInfo;
  routingTable: RoutingTableLookup;
  currencyPairs: BridgeTokenConfig[]; // TODO: Deprecated. Phase out
  bridgeLiquidity: { [k: string]: string };
  filteredAssets: FilteredTokenDetails;
  error: "";
}

export type BridgeAppState = AppState<AppUserState, AppGlobalState, AppUiState>;
