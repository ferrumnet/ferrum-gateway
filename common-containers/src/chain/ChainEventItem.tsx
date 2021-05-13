import React, { useEffect } from 'react';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Network } from 'ferrum-plumbing';
import { useSelector, useDispatch } from 'react-redux';
import { ChainEventStatus, ChainEventBase, inject, } from 'types';
import { AppState } from 'src/store/AppState';
import { ApiClient } from 'src/clients/ApiClient';

const FETCH_TIMEOUT: number = 1000 * 11;

export interface ChainEventItemProps {
    network: Network;
    id: string;
    children: any;
    initialStatus: ChainEventStatus;
    eventType: string;
}

export const chainEventsSlice = createSlice({
    name: 'ChainEvents',
    initialState: {} as {[k: string]: ChainEventBase},
    reducers: {
        watchEvent: (state, action) => {
            state[action.payload.id] = action.payload;
        },
        unwatchEvent: (state, action) => {
            delete state[action.payload.id];
        },
        eventUpdated: (state, action) => {
            state[action.payload.id] = action.payload;
        },
    },
});

const refreshPendingThunk = createAsyncThunk('data/refreshPending', async (payload: {}, thunk) => {
    const state = thunk.getState() as AppState<any,any,any>;
    // Only applies to the fully signed in and initialized state...
    if (!state.data.init.initialized || !state.connection.account.user?.userId) { return; }
    const we = state.data.watchEvents;
    const api = inject<ApiClient>(ApiClient);
    const items = Object.values(we);
    // Group by event type..
    const byEvTtpe: any = {};
    items.forEach(et => {
        // @ts-ignore
        et.id = et.eventId;
        byEvTtpe[et.eventType] = et;
    });
    const rv: ChainEventBase[] = [];
    for (const k of Object.keys(byEvTtpe)) {
        const res = await api.updateChainEvent(k, byEvTtpe[k]);
        if (!!res) { thunk.dispatch(chainEventsSlice.actions.eventUpdated(res)); }
    }
    return rv;
});

// Periodically ping
if (window) {
    window.setInterval(() => refreshPendingThunk({}), FETCH_TIMEOUT);
}

/**
 * This component will manage a watchable event. Wrap watchable events in this component.
 * It will call the bakend periodically to update the event status.
 * 
 * To watch for an event update listen to the following action:
 * - chainEventSclie.eventUpdated action
 * 
 * For example:
 *  <ChainEventItem id="0x..." network="ETHEREUM" initialState="" eventType="transaction">
 *     <TranscationViewer ... />
 *  </ChainEventItem>
 */
export function ChainEventItem(props: ChainEventItemProps) {
    const myEvent = useSelector<AppState<any, any, any>, ChainEventBase>(
        st => st.data.watchEvents[props.id]);
    const dispatch = useDispatch();
    const {network, id, initialStatus} = props;
    useEffect(() => {
        if ((initialStatus === '' || initialStatus === 'pending') && !!network && !!id) {
            dispatch(chainEventsSlice.actions.watchEvent({network, id: id, }))
        }
        if (myEvent && (myEvent?.status !== 'pending' && myEvent?.status !== '')) {
            dispatch(chainEventsSlice.actions.unwatchEvent({id: id}))
        }

    }, [myEvent, network, id, initialStatus]);
    return props.children;
}