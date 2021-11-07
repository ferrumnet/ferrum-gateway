import React,{Dispatch, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../store/AppState';
import {ChainEventBase, inject} from 'types';
import { ChainEventItem } from './ChainEventItem';
import { ApiClient } from '../clients/ApiClient';
import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface TransactionListProps {
	eventIsRelevant: (p: ChainEventBase) => boolean;
	eventView: (props: {event: ChainEventBase}) => any;
}

interface TransactionViewSummary {
	pendingCount: number;
	total: number;
}

export interface TransactionViewSummaryProps {
	summary: TransactionViewSummary;
}

const defaultSummary = {
	pendingCount: 0, total: 0,
} as TransactionViewSummary;

interface TransactionSummaryProps {
	network: string;
	eventIsRelevant: (p: ChainEventBase) => boolean;
	summaryView: (props: {summary: TransactionViewSummary}) => any;
}

async function txUpdater(eventItem: ChainEventBase, dispatch: Dispatch<AnyAction>) {
	const ei = { ...eventItem } as any;
	delete ei.updater;
	const api = inject<ApiClient>(ApiClient);
	const upE = await api.updateChainEvent(ei);
	if (upE) {
		dispatch(transactionListSlice.actions.transactionUpdated(upE));
		return upE;
	}
	return eventItem;
}

const loadUserTransactions = createAsyncThunk('', async (payload: {application: string}, ctx) => {
	const {application} = payload;
	try {
		const client = inject<ApiClient>(ApiClient);
		console.log('PRE-PRE PRE LOADED TXS:');
		const txs = await client.getUserEvents(application) as ChainEventBase[];
		console.log('PRE-PRE LOADED TXS:', txs);
		if (txs) {
			txs.sort((t1, t2) => (t1.createdAt || t1.lastUpdate) > (t2.createdAt || t2.lastUpdate) ? 1 : -1);
			console.log('PRE LOADED TXS:', txs);
			ctx.dispatch(transactionListSlice.actions.transactionsLoaded({transactions: txs}));
		}
	} catch (e) {
		console.error('Error loading user transactions', {application, error: e});
	}
});

export const transactionListSlice = createSlice({
	name: 'transactionListSlice',
	initialState: [] as ChainEventBase[],
	reducers: {
		transactionsLoaded: (state, action) => {
			console.log('LOADED TXS:', action.payload);
			action.payload.transactions.forEach((t: any) => state.push(t));
		},
		transactionUpdated: (state, action) => {
			const tx = action.payload as ChainEventBase;
			const idx = state.findIndex(t => t.id === tx.id);
			if (idx >= 0) {
				state[idx] = tx;
			}
		},
		addTransaction: (state, action) => {
			const tx = action.payload as ChainEventBase;
			state.unshift(tx);
		}
	}
});

export function TransactionListProvider(props: { application: string }) {
	const dispatch = useDispatch();
	const userId = useSelector((state: AppState<any, any, any>) => state?.connection?.account?.user?.userId);
	const {application} = props;
	useEffect(() => {
		if (userId) {
			dispatch(loadUserTransactions({application}));
		}
	}, [userId, application]);
	return (<></>);
}

export function TransactionSummary(props: TransactionSummaryProps) {
	const allEvents = useSelector((state: AppState<any, any, any>) => state?.data?.transactions) || [];
	const events = allEvents.filter(e => e.network === props.network && props.eventIsRelevant(e)); 
	const pendingCount = events.filter(e => e.status === 'pending').length;
	console.log('All events vs relevant', allEvents.length, events.length, props.network);
	if (!props.network) {
		console.log('NO NETWORK!');
		return (
			<props.summaryView summary={defaultSummary} />
		);
	}
	const summary = {
		pendingCount,
		total: events.length,
	} as TransactionViewSummary;
	console.log('SUMMARY', summary)
	return (
		<>
		<props.summaryView summary={summary} />
		</>
	);
}

export function TransactionList(props: TransactionListProps) {
	const events = useSelector((state: AppState<any, any, any>) => state?.data?.transactions) || [];
	return (
		<>
		{events.filter(e => props.eventIsRelevant(e)).map((e, i) => (
			<ChainEventItem 
				network={e.network}
				id={e.id}
				initialStatus={e.status}
				eventType={e.eventType}
				event={e}
				updater={txUpdater}
			>
				<props.eventView event={e} key={i} />
			</ChainEventItem>
		))}
		</>
	);
}