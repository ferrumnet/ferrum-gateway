import React,{useEffect, useState} from 'react';
// @ts-ignore
import { Page } from 'component-library';
import { Route, Switch } from 'react-router-dom';
import { BridgeAppState } from '../../common/BridgeAppState';
import { useDispatch, useSelector } from 'react-redux';
import './../../app.scss'
import { createSlice,AnyAction } from '@reduxjs/toolkit';
import { Theme as FulentTheme, useTheme } from '@fluentui/react-theme-provider';
//@ts-ignore
import { Theme, ThemeConstantProvider,WebdefaultLightThemeConstantsBuilder} from 'unifyre-react-helper';
import { inject } from 'types';
import { BridgeClient } from "./../../clients/BridgeClient";
import { Dispatch } from "redux";
import { getGroupIdFromHref } from './../../common/Utils';
import { loadThemeForGroup } from './../../common/themeLoader';
import { WaitingComponent } from '../../components/WebWaiting';
import { CommonActions,addAction } from './../../common/Actions';
import { MainPage } from './../Main/Main';
import { SwapPage } from './../Swap';
import { LiquidityPage } from './../Liquidity'
import { AppAccountState } from 'common-containers';
 import {
    GeneralPageLayout
    // @ts-ignore
} from 'component-library';

import { Provider as FluentProvider, teamsTheme } from '@fluentui/react-northstar';
import { ThemeContext } from 'unifyre-react-helper';
import { ConnectBar } from './../../connect/ConnectBar';
import { ReponsivePageWrapperDispatch, ReponsivePageWrapperProps } from './../../components/PageWrapperTypes';
import { openPanelHandler } from './../Swap'
import { useHistory } from 'react-router';
import { Badge } from 'antd';
import {SidePanelProps} from './../../components/SidePanel';
import { SidePane } from './../../components/SidePanel';

interface DashboardState {
    initialized: boolean,
    isHome: boolean,
    isPaired: boolean,
    connected: boolean,
    customTheme?: any;
    userWithdrawalItems: any[],
    panelOpen: boolean,
    groupId: string,
    filter: string,
    selectedToken: string,
    initializeError?: string,
    dataLoaded: boolean
}

function _loadTheme(themeVariables: FulentTheme, customTheme: any) {
    const themeConstants = WebdefaultLightThemeConstantsBuilder(themeVariables)
      .set(Theme.Colors.bkgShade0, '#F6F5F7')
      .set(Theme.Colors.bkgShade1, themeVariables.palette.neutralLight)
      .set(Theme.Colors.bkgShade2, themeVariables.palette.neutralLighter)
      .set(Theme.Colors.bkgShade3, themeVariables.palette.neutralQuaternary)
      .set(Theme.Colors.bkgShade4, themeVariables.palette.neutralTertiary)
      .set(Theme.Colors.textColor, 'black')
      .set(Theme.Colors.themeNavBkg, '#F6F5F7')
      .set(Theme.Spaces.line, themeVariables.spacing.l1)
      .set(Theme.Spaces.screenMarginHorizontal, themeVariables.spacing.s2)
      .set(Theme.Spaces.screenMarginVertical, themeVariables.spacing.s2)
      .set(Theme.Spaces.gap, themeVariables.spacing.l1)
      .set(Theme.Text.pSize, themeVariables.fonts.small.fontSize as number)
      .set(Theme.Text.h1Size, themeVariables.fonts.xLarge.fontSize as number)
      .set(Theme.Text.h2Size, themeVariables.fonts.large.fontSize as number)
      .set(Theme.Text.h3Size, themeVariables.fonts.medium.fontSize as number)
      .set(Theme.Text.h4Size, themeVariables.fonts.smallPlus.fontSize as number)
      .set(Theme.Text.linkColor, themeVariables.semanticColors.actionLink)
      .set(Theme.Text.numberDownColor, themeVariables.semanticColors.errorText)
      .set(Theme.Font.main, themeVariables.fonts.medium.fontFamily! as string)
      .set(Theme.Input.inputTextColor, themeVariables.semanticColors.inputText)
      .set(Theme.Input.inputBackground, themeVariables.semanticColors.inputBackground)
      .set(Theme.Input.inputTextSize, themeVariables.fonts.medium.fontSize as number)
      .set(Theme.Button.btnPrimary, themeVariables.semanticColors.primaryButtonBackground)
      .set(Theme.Button.btnPrimaryTextColor, themeVariables.semanticColors.primaryButtonText)
      .set(Theme.Button.btnBorderRadius, themeVariables.spacing.s2)
      .set(Theme.Button.btnPadding, themeVariables.spacing.s1)
      .set(Theme.Button.btnHighlight, themeVariables.semanticColors.primaryButtonBackground)
      .set(Theme.Button.btnHighlightTextColor, themeVariables.semanticColors.primaryButtonText)
      .set(Theme.Button.inverseBtnPrimary, themeVariables.semanticColors.menuBackground)
      .set(Theme.Button.inverseBtnPrimaryTextColor, themeVariables.semanticColors.menuItemText)
      .set(Theme.Logo.logo, customTheme?.mainLogo || 'https://staking.ferrum.network/static/media/logo.44e552d9.png')
      .set(Theme.Logo.logoHeight, customTheme?.logoHeight || -1)
      .build();
    return new ThemeConstantProvider('web3-theme', themeConstants);
  }

export interface DashboardContentProps {
    initialized: boolean,
    isHome: boolean,
    isPaired: boolean,
    connected: boolean,
    customTheme?: any;
    userWithdrawalItems: any[],
    panelOpen: boolean,
    groupId: string,
    filter: string,
    initializeError?: string,
    dataLoaded: boolean
}

export const DashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        filter: 'all',
        initialized: false,
        isHome: false,
        isPaired: false,
        connected: false,
        userWithdrawalItems: [],
        panelOpen: false,
        groupId: '',
        initializeError: '',
        dataLoaded: false
    } as DashboardContentProps,
    reducers: {
        initializeError: (state,action) => {            
            const {initError} = action.payload;
            state.initializeError = initError;
            state.dataLoaded = true;
        },
        initializing: (state,action) => {
            state.initializeError = '';
            state.dataLoaded = true;
        },
        dataFetched: (state,action) => {
            state.dataLoaded = true
        },
        
    },
    extraReducers: {
    },
});

const Actions = DashboardSlice.actions;

export async function onBridgeLoad(dispatch: Dispatch<AnyAction>) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
        dispatch(Actions.dataFetched({}));
        const client = inject<BridgeClient>(BridgeClient);
        const groupId = getGroupIdFromHref();
        if (!groupId) {
            dispatch(Actions.initializeError({initError: 'No group ID'}));
            return;
        }
        const groupInfo = await client.loadGroupInfo(dispatch, groupId!);
        if (!groupInfo) {
            dispatch(Actions.initializeError({initError: 'Invalid group Info'}));
            return;
        }else{
            await client.signInToServer(dispatch)
            loadThemeForGroup(groupInfo.themeVariables);
            return;
        }
    } catch (error) {
        dispatch(Actions.initializeError({initError: 'Network Error'}));
        return;
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

const intializing = (dispatch: Dispatch<AnyAction>) => {
    dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
}


function stateToProps(appState: BridgeAppState,userAccounts: AppAccountState): DashboardContentProps {
    const state = (appState.ui.dashboard || {}) as DashboardState;
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {};
    return {
        ...state,
        initializeError: state.initializeError,
        network: address.network,
        selectedToken: state.selectedToken,
        addresses: addr,
        dataLoaded: state.dataLoaded
    } as DashboardContentProps;
}

export interface DashboardProps {
    initialized: boolean,
    isHome: boolean,
    isPaired: boolean,
    connected: boolean,
    customTheme?: any;
    userWithdrawalItems: any[],
    panelOpen: boolean,
    groupId: string,
    filter: string,
    initializeError?: string,

}

export function ResponsivePageWrapper(props: ReponsivePageWrapperProps&ReponsivePageWrapperDispatch) {
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const panelOpen =  useSelector<BridgeAppState, boolean>(state => state.ui.swapPage.panelOpen);

    const handleDismiss = () => {
        openPanelHandler(dispatch)
        setOpen(false);
    }
    const withdrawalsProps =  useSelector<BridgeAppState, SidePanelProps>(state => state.ui.sidePanel);
    let unUsedItems = withdrawalsProps.userWithdrawalItems.filter(e=>e.used === '').length;

    const bridgeItems = (
        <>
            <div onClick={()=>setOpen(!open)}>
                My Withdrawals 
                <span>
                    <Badge
                        className="site-badge-count-109"
                        count={unUsedItems || 0}
                        style={{ backgroundColor: '#52c41a' }}
                    />
                </span>
            </div>
            <div onClick={()=>history.push('./')}>
                My Pair
            </div>
        </>
    );
    return (
        <>
           <ThemeContext.Provider value={props.theme}>
                <FluentProvider theme={teamsTheme}>
                <GeneralPageLayout
                        top={
                            <ConnectBar
                                additionalOptions={
                                    <>
                                        {bridgeItems}
                                    </>
                                }
                            />
                        }
                        middle={
                            <>
                                {props.children}
                                <SidePane
                                    isOpen={open||panelOpen}
                                    dismissPanel={handleDismiss}
                                />
                            </>
                        }
                    >
                </GeneralPageLayout>
                </FluentProvider>
            </ThemeContext.Provider>
        </>
    );
}

export function Dashboard() {
    const dispatch = useDispatch();
    const themeVariables = useTheme();
    const userAccounts =  useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const stateData = useSelector<BridgeAppState, DashboardContentProps>(appS => stateToProps(appS,userAccounts));
    const theme = _loadTheme(themeVariables, stateData.customTheme);
    const styles = themedStyles(theme);
    const initError = useSelector<BridgeAppState, string | undefined>(state => state.data.init.initError);
    const appInitialized = useSelector<BridgeAppState, any>(appS => appS.data.init.initialized);
    const groupInfo = useSelector<BridgeAppState, any>(appS => appS.data.state.groupInfo);

    const handleCon = async () => {
        await onBridgeLoad(dispatch).catch(console.error)

    }
    useEffect(() => {
        if(!appInitialized && !stateData.dataLoaded){
            intializing(dispatch)
        }
        if(appInitialized && !stateData.dataLoaded){
            handleCon()
            dispatch(Actions.dataFetched({}));
        }
    })

    if (appInitialized && !stateData.initializeError && stateData.dataLoaded) {
        return (
            <ResponsivePageWrapper
                theme={theme}
            >
              <Page>
                  <div style={styles.projectTitle}>
                      Welcome to the <span style={styles.emphaisize}>{groupInfo.projectTitle}</span> Token Bridge.
                  </div>
                  <div style={styles.container}>
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
                  </div>
              </Page>
              <WaitingComponent/>
          </ResponsivePageWrapper>
        )
    }

    const fatalErrorComp = (
        (!!initError || !!stateData.initializeError) ? (
            <>
            <Page>
                    <h3>Error loading the application</h3><br />
                    <p>{initError || stateData.initializeError }</p>
                </Page>
            </>
        ) : (
            <Page>
                <h3>Connecting...</h3><br />
            </Page>
        )
    )

    return (
        <>
            <Page>
                {fatalErrorComp}
            </Page> 
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
    container: {
        position: "relative" as "relative"
    },
    headerStyles: {
        color: theme.get(Theme.Colors.textColor),
    },
    projectTitle: {
        textAlign: "center" as "center",
        fontSize: '25px',
        letterSpacing: 0.5,
        marginBottom: '1rem',
        marginTop: '1rem'
    },
    emphaisize: {
        fontWeight: 600
    }
  });
  
