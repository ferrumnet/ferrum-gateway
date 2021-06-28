import { AddressDetails, AppUserProfile } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { ChainEventBase, ChainEventStatus } from 'types';

export const dummyAppUserProfile = {
    id: '',
    accountGroups: [ {
        addresses: [],
    }],
} as any as AppUserProfile;

export function addressForUser(user?: AppUserProfile) {
    if (!user) { return undefined; }
    return (user.accountGroups || [])[0].addresses[0] || {};
}

export function addressesForUser(user?: AppUserProfile): AddressDetails[] {
    if (!user) { return []; }
    return (user.accountGroups || [])[0].addresses || [];
}

export interface AppAccountState {
    user: AppUserProfile;
    connectionError?: string;
}

export interface AppInitializingState {
    waiting: boolean;
    initialized: boolean;
    initError?: string;
}

export interface ApprovalState {
	pending: boolean;
	approveTransactionId: string;
	approvals: { [key: string]: string };
	status?: ChainEventStatus;
	error?: string;
}

export interface AppState<TUserState, TGlobalState, TUiState> {
    connection: {
        account: AppAccountState;
        userState: TUserState;
    };
    data: {
        init: AppInitializingState;
        state: TGlobalState;
        watchEvents: { [k: string]: ChainEventBase };
		approval: ApprovalState;
    };
    ui: TUiState;
}