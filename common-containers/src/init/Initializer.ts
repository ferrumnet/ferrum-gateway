import { createAsyncThunk, createNextState, createSlice } from "@reduxjs/toolkit";
import { Module, sleep } from "ferrum-plumbing";
import { AppInitializingState } from "../store/AppState";
import { IocModule, TokenDetails, ChainLogos } from "types/dist";
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
    api.chainLogos().then(logos => ctx.dispatch(tokenListSlice.actions.chainLogosLoaded(logos)));
	api.tokenList().then(list => ctx.dispatch(tokenListSlice.actions.listLoaded({ list})));
    return 'SUCCESS';
});

export const tokenListSlice = createSlice({
	name: 'tokenList',
	initialState: {
		list: [],
        lookup: {},
        chainLogos: {},
	} as { list: TokenDetails[], lookup: { [k: string]: TokenDetails }, chainLogos: { [n: string]: ChainLogos } },
	reducers: {
		listLoaded: (state, action) => {
			state.list = action.payload.list;
            const lookup: { [k: string]: TokenDetails } = {};
            state.list.forEach(s => lookup[s.currency] = s);
            state.lookup = lookup;
		},
        chainLogosLoaded: (state, action) => {
            state.chainLogos = {...action.payload};
        },
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
