import { AnyAction } from "@reduxjs/toolkit";
import { Injectable } from "ferrum-plumbing";
import { Dispatch } from "redux";

export interface PersistentAction {
	__save: boolean;
}

export class PersistentState {
	static _instance: PersistentState;
	static instance() {
		if (!PersistentState._instance) {
			PersistentState._instance = new PersistentState();
		}
		return PersistentState._instance;
	}

	save(key: string, data: any) {
		try {
			localStorage.setItem(key, JSON.stringify(data));
		} catch (e) {
			console.error('Error saving to local storage ', key);
		}
	}

	load<T>(key: string): T|undefined {
		try {
			const rv = localStorage.getItem(key);
			if (rv) {
				return JSON.parse(rv);
			}
		} catch (e) {
			console.error('Error loading from local storage ', key);
		}
	}

	loadAll(): any {
		try {
			const rv: any = {};
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (k) {
					rv[k] = localStorage.getItem(k);
				}
			}
			return rv;
		} catch {
			return {};
		}
	}

	dispatchAll(dispatch: Dispatch<AnyAction>) {
		const all = this.loadAll();
		Object.keys(all).forEach(k => dispatch({type: k, payload: all[k]}));
	}
}

export const PersistentStateMiddleware = (store: any) => (next: any) => (action: AnyAction) => {
	try {
		if (action?.payload?.__save) {
			PersistentState.instance().save(action.type, action.payload);
		}
		return next(action)
	} catch (err) {
		// goble
	}
}
function Dispatch<T>() {
	throw new Error("Function not implemented.");
}
