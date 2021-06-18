import React, { useEffect } from 'react';
import { AnyAction, createAsyncThunk, createSlice, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { Network } from 'ferrum-plumbing';
import { useSelector, useDispatch } from 'react-redux';
import { ChainEventStatus, ChainEventBase, inject, } from 'types';
import { AppState } from '../store/AppState';

const FETCH_TIMEOUT: number = 1000 * 11;

export interface ChainEventItemProps {
    network: Network;
    id: string;
    children: any;
    initialStatus: ChainEventStatus;
    eventType: string;
    updater: (item: ChainEventBase, dispatch: Dispatch<AnyAction>) => Promise<ChainEventBase>;
}

export const chainEventsSlice = createSlice({
    name: 'ChainEvents',
    initialState: {} as {[k: string]: ChainEventBase},
    reducers: {
        watchEvent: (state, action) => {
            console.log('WATCH CALLED!', action)
            if (!state[action.payload.id]) {
               state[action.payload.id] = action.payload;
            }
        },
        unwatchEvent: (state, action) => {
            console.log('UNWATCH CALLED!', action)
            if (!!state[action.payload.id]) {
                delete state[action.payload.id];
            }
        },
        eventUpdated: (state, action) => {
            console.log('UPDATING ACTION', action.payload.id)
            state[action.payload.id] = action.payload;
        },
    },
});

const refreshPendingThunk = createAsyncThunk('data/refreshPending', async (payload: {}, thunk) => {
    const state = thunk.getState() as AppState<any,any,any>;
    // Only applies to the fully signed in and initialized state...
    if (!state.data.init.initialized || !state.connection.account.user?.userId) { return; }
    const we = state.data.watchEvents;
    const items = Object.values(we);
    console.log('WATCHING ', {we})
    // Group by event type..
    items.forEach(async et => {
        const eventItem = et;
        const res = await (eventItem as any).updater(eventItem, thunk.dispatch);
        console.log('UPDATED EVENT', {res});
        if (!!res) {
            if (res.status !== 'pending') {
                console.log('UNWATCHING', {res});
                thunk.dispatch(chainEventsSlice.actions.unwatchEvent(res));
            } else {
                thunk.dispatch(chainEventsSlice.actions.eventUpdated(res));
            }
        }
    });
});

const init: any = {};

function kickOff(dispatch: any) {
    if (!!init.init) {
        return;
    }
    init.init = true;
    // Periodically ping
    if (window) {
        window.setInterval(() => {
            dispatch(refreshPendingThunk({}));
        }, FETCH_TIMEOUT);
    }
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
        st => {
            return st.data.watchEvents[props.id]
        });
    const dispatch = useDispatch();
    const {network, id, initialStatus, updater} = props;
    useEffect(() => {
        if ((initialStatus === '' || initialStatus === 'pending') && !!network && !!id) {
            dispatch(chainEventsSlice.actions.watchEvent({network, id: id, updater}));
        }
        // if (myEvent && (myEvent?.status !== 'pending' && myEvent?.status !== ''
        //         && myEvent?.status !== undefined)) {
        //     dispatch(chainEventsSlice.actions.unwatchEvent({id: id}))
        // }
    }, [network, id, initialStatus]);
    useEffect(() => {
        kickOff(dispatch);
    }, []);
    return props.children;
}