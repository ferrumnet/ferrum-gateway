import { combineReducers } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { AppUserState, AppGlobalState } from "./LeaderboardAppState";
export const uiReducer = combineReducers({});
export function userReducer(
  state: AppUserState = {
    allocations: {} as any,
    userProjects: {} as any,
    AppAccountState: {} as any,
  },
  action: AnyAction
) {
  console.log(action)
  return state;
}
export function dataReducer(
  state: AppGlobalState = {
    initialized: false,
    waiting: false,
  },
  action: AnyAction
) {
  switch(action.type){
    case "init/init/fulfilled":
      console.log("yesssssssssssssssssssssssssssssss")
      return {...state,initialized:true};
    default:
      return state;
  }
}
