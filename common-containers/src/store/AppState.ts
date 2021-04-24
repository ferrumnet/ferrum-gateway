import { AppUserProfile } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";

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

export interface AppAccountState {
    user: AppUserProfile;
    connectionError?: string;
}

export interface AppInitializingState {
    waiting: boolean;
    initialized: boolean;
    initError?: string;
}

export interface AppState<TUserState, TGlobalState, TUiState> {
    connection: {
        account: AppAccountState;
        userState: TUserState;
    };
    data: {
        init: AppInitializingState;
        state: TGlobalState;
    };
    ui: TUiState;
}