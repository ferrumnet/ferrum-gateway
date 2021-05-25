//@ts-ignore
import { Theme } from 'unifyre-react-helper';
import { Route, Switch } from 'react-router-dom';
import { MainPage } from './../Main/Main';
import { SwapPage } from './../Swap';
import { LiquidityPage } from './../Liquidity';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Dispatch } from "redux";
import { AnyAction } from '@reduxjs/toolkit';
import { CommonActions,addAction } from './../../common/Actions';
import { inject } from 'types';
import { Utils } from './../../common/Utils';
import { BridgeClient } from "./../../clients/BridgeClient";
import {Actions} from './Dashboard';
import { WaitingComponent } from '../../components/WebWaiting';

interface DashboardState {
}

async function initialize(dispatch: Dispatch<AnyAction>) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
    }finally {
    }
}

export function DashboardContent(props: {}) {
    const dispatch = useDispatch();

    useEffect(()=>{
        initialize(dispatch)
    },[])

    // show pending init...
    return (
        <>
        <Switch>
                <Route path='/:gid/liquidity'>
                    <LiquidityPage/>
                </Route>
                <Route path='/:gid/swap'>
                    <SwapPage/>
                </Route>
                <Route path='/:gid/'>
                    <MainPage/>
                </Route>
                <Route path='/'>
                    <MainPage/>
                </Route>
            </Switch>
            <WaitingComponent/>
        </>

    );
}

//@ts-ignore
const themedStyles = (theme) => ({
    inputStyle:  {
        root: [
          {
            color: theme.get(Theme.Button.btnPrimaryTextColor),
            height: '40px',
          }
        ]
    },
    headerStyles: {
        color: theme.get(Theme.Colors.textColor),
    }
});
