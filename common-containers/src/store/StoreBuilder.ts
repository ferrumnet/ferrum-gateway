import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'
import { Module } from 'ferrum-plumbing';
import { Provider } from 'react-redux'
import { chainEventsSlice } from '../chain/ChainEventItem';
import { connectSlice } from '../connect/ConnectButtonWrapper';
import { initSlice, initThunk } from '../init/Initializer';
import { AppInitializingState } from './AppState';
import logger from 'redux-logger';

export class StoreBuilder {
    static build<TUserState, TGlobalState extends AppInitializingState, TUiState>(
        userStateReducer: Reducer<TUserState>,
        dataReducer: Reducer<TGlobalState>,
        uiReducer: Reducer<TUiState>,
        initModule: Module,
        apiBaseUrl: string,
    ) {
        const store = configureStore({
			middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
			devTools: process.env.NODE_ENV !== 'production',
            reducer: combineReducers({
                connection: combineReducers({
                    account: connectSlice.reducer,
                    userState: userStateReducer,
                }),
                data: combineReducers({
                    init: initSlice.reducer,
                    state: dataReducer,
                    watchEvents: chainEventsSlice.reducer,
                }),
                ui: uiReducer,
            })
        });
        store.dispatch(initThunk({module: initModule, apiBaseUrl}));
        return store;
    }

    static Provider = Provider; // To avoid double reference from other packages and duplicate redux issues
}