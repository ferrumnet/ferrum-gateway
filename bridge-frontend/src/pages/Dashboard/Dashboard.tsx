import React,{useEffect} from 'react';
// @ts-ignore
import { Page } from 'component-library';
import { DashboardContent } from './DashboardContent';
import { BridgeAppState } from '../../common/BridgeAppState';
import { useDispatch, useSelector } from 'react-redux';
import './../../app.scss'
import { createSlice,AnyAction } from '@reduxjs/toolkit';
import { Theme as FulentTheme, useTheme } from '@fluentui/react-theme-provider';
//@ts-ignore
import { Theme, ThemeConstantProvider, WebdefaultDarkThemeConstantsBuilder } from 'unifyre-react-helper';
import { inject,IocModule } from 'types';
import { BridgeClient } from "./../../clients/BridgeClient";
import { Dispatch } from "redux";
import { Utils } from './../../common/Utils';
import { loadThemeForGroup } from './../../common/themeLoader';
import { WebPageWrapper } from '../../components/WebPageWrapper';
import { WaitingComponent } from '../../components/WebWaiting';
import { CommonActions,addAction } from './../../common/Actions';

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
    initializeError?: string,
    dataLoaded: boolean
}

function _loadTheme(themeVariables: FulentTheme, customTheme: any) {
    const themeConstants = WebdefaultDarkThemeConstantsBuilder(themeVariables)
      .set(Theme.Colors.bkgShade0, themeVariables.semanticColors.bodyBackground)
      .set(Theme.Colors.bkgShade1, themeVariables.palette.neutralLight)
      .set(Theme.Colors.bkgShade2, themeVariables.palette.neutralLighter)
      .set(Theme.Colors.bkgShade3, themeVariables.palette.neutralQuaternary)
      .set(Theme.Colors.bkgShade4, themeVariables.palette.neutralTertiary)
      .set(Theme.Colors.textColor, themeVariables.semanticColors.bodyText)
      .set(Theme.Colors.themeNavBkg, themeVariables.semanticColors.bodyStandoutBackground)
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

export async function onBridgeLoad(dispatch: Dispatch<AnyAction>) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
        const client = inject<BridgeClient>(BridgeClient);
        dispatch(Actions.initializing({}));
        const groupId = Utils.getGroupIdFromHref();
        if (!groupId) {
            dispatch(Actions.initializeError({initError: 'No group ID'}));
            return;
        }
        const groupInfo = await client.loadGroupInfo(dispatch, groupId!);
        if (!groupInfo) {
            dispatch(Actions.initializeError({initError: 'Invalid group Info'}));
            return;
        }else{
            const data = await client.signInToServer(dispatch)
            loadThemeForGroup(groupInfo.themeVariables);
            dispatch(Actions.dataFetched({}));
            return;
        }
    } catch (error) {
        console.log(error)
        return;

    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
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

export const Actions = DashboardSlice.actions;

function stateToProps(appState: BridgeAppState): DashboardContentProps {
    const state = (appState.ui.dashboard || {}) as DashboardState;
    return {
        ...state,
        initializeError: state.initializeError,
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
    initializeError?: string
}

export function Dashboard() {
    const dispatch = useDispatch();
    const themeVariables = useTheme();
    const stateData = useSelector<BridgeAppState, DashboardContentProps>(appS => stateToProps(appS));
    const theme = _loadTheme(themeVariables, stateData.customTheme);
    const initError = useSelector<BridgeAppState, string | undefined>(state => state.data.init.initError);
    const appInitialized = useSelector<BridgeAppState, any>(appS => appS.data.init.initialized);
    const connected =  useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);

    const handleCon = async () => {
        await onBridgeLoad(dispatch).catch(console.error)

    }
    useEffect(() => {
        if(appInitialized && !stateData.dataLoaded && connected){
            handleCon()
        }
    })
    
    return (
        <>

            {(!!initError || !!stateData.initializeError) ? (
                <Page>
                    <h3>Error loading the application</h3><br />
                    <p>{initError || stateData.initializeError }</p>
                </Page>
            ):(
                <WebPageWrapper
                  mode={'web3'}
                  theme={theme}
                  container={stateData.initialized ? IocModule.container() : undefined}
                  authError={stateData.initializeError}
                >
                    <Page>
                        <DashboardContent/>
                    </Page>
                    <WaitingComponent/>
                </WebPageWrapper>
            ) }
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
  
