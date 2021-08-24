import { createAsyncThunk, createNextState, createSlice } from "@reduxjs/toolkit";
import { Module } from "ferrum-plumbing";
import { AppInitializingState } from "../store/AppState";
import { IocModule, TokenDetails } from "types/dist";
import { CommonModule } from "./Module";
import { ApiClient } from "../clients/ApiClient";

const FLAG = { init: false };

export const initThunk = createAsyncThunk('init/init', async (
		payload: {module: Module, apiBaseUrl: string}, ctx) => {
    if (FLAG.init) { console.log('ALREADY INIT'); return; }
    FLAG.init = true;
    const container = await IocModule.init();
    await container.registerModule(new CommonModule(payload.apiBaseUrl));
    await container.registerModule(payload.module);
	const api = container.get<ApiClient>(ApiClient);
	api.tokenList().then(list => ctx.dispatch(tokenListSlice.actions.listLoaded({ list})))
    return 'SUCCESS';
});

export const tokenListSlice = createSlice({
	name: 'tokenList',
	initialState: {
		list: [],
	} as { list: TokenDetails[] },
	reducers: {
		listLoaded: (state, action) => {
			state.list = action.payload.list;
		}
	}
});

export const initSlice = createSlice({
    name: 'init',
    initialState: {
        waiting: false,
        initialized: false,
    } as AppInitializingState,
    reducers: {
    },
    extraReducers: {
        [initThunk.pending as any]: (state) => {
            state.waiting = true;
        },
        [initThunk.fulfilled as any]: (state, action) => {
            console.log('PROMISE FULFILED', action)
            state.waiting = false;
            if (!action.payload) { return; }
            state.initialized = true;
        },
        [initThunk.rejected as any]: (state, action) => {
            state.waiting = false;
            state.initialized = false;
            console.log('ERROR WAS ', action)
            const err = (action.payload || action.error);
            state.initError = err.message || err.toString();
        },
    },
});
