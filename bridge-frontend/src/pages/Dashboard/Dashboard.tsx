import React, { useEffect, useState, useContext } from 'react';
// @ts-ignore
import {
    Page, Row, Header, CnctButton, WithdrawlsButton,
    SwitchNetworkButton, AppContainer,
    ContentContainer, TokenBridge,
    // @ts-ignore
} from 'component-library';
import ThemeSelector from "../../ThemeSelector"
import { BridgeAppState, FilteredTokenDetails } from '../../common/BridgeAppState';
import { useDispatch, useSelector } from 'react-redux';
import './../../app.scss'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AnyAction, Dispatch } from "redux";
import { Theme as FulentTheme, useTheme } from '@fluentui/react-theme-provider';
import { Theme, ThemeContext, ThemeConstantProvider, WebdefaultLightThemeConstantsBuilder } from 'unifyre-react-helper';
import { inject, inject2, UserBridgeWithdrawableBalanceItem } from 'types';
import { BridgeClient } from "./../../clients/BridgeClient";
import { getGroupIdFromHref } from './../../common/Utils';
import { loadThemeForGroup } from './../../common/themeLoader';
import { CommonActions, addAction } from './../../common/Actions';
import { AppAccountState, connectSlice } from 'common-containers';
import { ConnectButtonWapper } from 'common-containers';
import { ReponsivePageWrapperDispatch, ReponsivePageWrapperProps, ThemeProps } from './../../components/PageWrapperTypes';
import { openPanelHandler } from './../Swap'
import { useHistory } from 'react-router';
import { SidePane } from './../../components/SidePanel';
import { changeNetwork } from "./../Main/handler"
import { ConnectBridge, SideBarContainer } from "./../Main/Main";
import { LiquidityPage } from "./../Liquidity";
import { WaitingComponent } from '../../components/WebWaiting';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { GlobalStyles } from "./../../theme/GlobalStyles";
import { useTheme as newThemeInitialization, themeMapper } from "./../../theme/useTheme";
import { ThemeProvider } from "styled-components";
import { CurrencyList, UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { History } from 'history';
import { Switch, Route } from 'react-router-dom';
import { setAllThemes, setToLS, removeFromLS, getFromLS } from "./../../storageUtils/storage";
import * as defaultTheme from "./../../theme/schema.json";
import { Alert } from 'antd';

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
    networks: string[],
    currencies: string[],
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
        networks: [],
        currencies: [],
    } as DashboardContentProps,
    reducers: {
        initializeError: (state, action) => {
            const { initError } = action.payload;
            state.initializeError = initError;
        },
        initializing: (state, action) => {
            state.initializeError = '';
        },
    },
    extraReducers: {
    },
});

const updateFilteredTokenList = createAsyncThunk('dashboard/FilterTokens',
    async (payload: { currencies: string[] }, ctx) => {
        // TODO: Move this to a reducer to speed up rendering
        const assets: FilteredTokenDetails = {};
        const state = ctx.getState() as BridgeAppState;
        const gid = new Set<string>(payload.currencies);
        state.data.tokenList.list.forEach(tl => {
            if (gid.has(tl.currency)) {
                assets[tl.currency] = tl;
            }
        });
        ctx.dispatch(addAction(CommonActions.FILTERED_TOKEN_LIST_UPDATED, assets));
    });

const Actions = DashboardSlice.actions;

export async function onBridgeLoad(dispatch: Dispatch<AnyAction>, history: History) {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
        const client = inject<BridgeClient>(BridgeClient);
        let groupId = getGroupIdFromHref();
        if (!groupId) {
            // window.location.href = '/frm'
            groupId = 'frm';
            history.replace('/frm');
            // dispatch(Actions.initializeError({initError: 'No group ID'}));
            // return;
        }
        const groupInfo = await client.loadGroupInfo(dispatch, groupId!);
        if (!groupInfo) {
            dispatch(Actions.initializeError({ initError: 'Invalid group Info' }));
            return;
        } else {
            await loadThemeForGroup(groupInfo.themeVariables);
            const mappedBridgeTheme = themeMapper(groupInfo.themeVariables)
            if (groupInfo) {
                setToLS('all-themes', { ...mappedBridgeTheme });
                setToLS(`${groupId}-all-themes`, { ...mappedBridgeTheme });
                //@ts-ignore
                setToLS('theme', { ...mappedBridgeTheme.data.light });
                //@ts-ignore
                setToLS(`${groupId}-theme`, { ...mappedBridgeTheme.data.light })
            } else {
                setAllThemes("all-themes", defaultTheme);
            }
            await client.getTokenConfigForCurrencies(dispatch, groupInfo!.bridgeCurrencies)
            if ((groupInfo.bridgeCurrencies || []).length) {
                // Update the filtered token list
                dispatch(updateFilteredTokenList({ currencies: groupInfo.bridgeCurrencies }) as any);
                const [cl, web3client] = inject2<CurrencyList, UnifyreExtensionWeb3Client>(CurrencyList, UnifyreExtensionWeb3Client);
                cl.set(groupInfo.bridgeCurrencies);
                try {
                    const userProfile = await await web3client.getUserProfile();
                    dispatch(connectSlice.actions.connectionSucceeded({ userProfile }));
                }
                catch (e) { console.error('Could not update user profile. ', e); }
            }
            return;
        }
    } catch (error) {
        console.error('Error initializing', error);
        dispatch(Actions.initializeError({ initError: 'Network Error' }));
        return;
    } finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

const intializing = (dispatch: Dispatch<AnyAction>) => {
    dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
}

function stateToProps(appState: BridgeAppState, userAccounts: AppAccountState): DashboardContentProps {
    const state = (appState.ui.dashboard || {}) as DashboardState;
    const addr = userAccounts?.user?.accountGroups[0]?.addresses || {};
    const address = addr[0] || {};
    const curs = appState.data.state.groupInfo?.bridgeCurrencies || [];
    return {
        ...state,
        initializeError: state.initializeError,
        network: address.network,
        selectedToken: state.selectedToken,
        addresses: addr,
        currencies: curs,
        networks: curs.map(c => c.split(':')[0]),
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

function ErrorBar(props: { error: string }) {
    return (
        <Row withPadding centered>
            <MessageBar
                messageBarType={MessageBarType.blocked}
                isMultiline={true}
                dismissButtonAriaLabel="Close"
                truncated={true}
                overflowButtonAriaLabel="See more"
                className={"alertFailColor"}
            >
                {props.error}
            </MessageBar>
        </Row>
    );
}

// Author Abdul Ahad
export function AppWraper(props: ReponsivePageWrapperProps & ReponsivePageWrapperDispatch) {

    const [open, setOpen] = useState(false);
    const [isLight, setIsLight] = useState(false);

    const history = useHistory();
    const inlineTheme = useContext(ThemeContext);
    const styles = themedStyles(inlineTheme);
    const dispatch = useDispatch();
    const panelOpen = useSelector<BridgeAppState, boolean>(state => state.ui.swapPage.panelOpen);
    const handleDismiss = () => {
        openPanelHandler(dispatch)
        setOpen(false);
    }
    const withdrawals = useSelector<BridgeAppState, UserBridgeWithdrawableBalanceItem[]>(
        state => state.data.state.balanceItems);
    const unusedItems = withdrawals.filter(e => e.used === '').length;
    const ConBot = <ConnectButtonWapper View={CnctButton} />
    const groupInfo = useSelector<BridgeAppState, any>(appS => appS.data.state.groupInfo);
    const switchRequest = useSelector<BridgeAppState, boolean>(state => state.ui.pairPage.isNetworkReverse);
    const network = useSelector<BridgeAppState, string>(state => state.ui.pairPage.destNetwork);
    const connected = useSelector<BridgeAppState, boolean>(state => !!state.connection.account?.user?.userId);
    const initError = useSelector<BridgeAppState, string | undefined>(state => state.data.state.error);
    const favicon = document.getElementById("dynfav"); // Accessing favicon element
    const titleText = document.getElementById("title"); // Accessing favicon element

    //@ts-ignore
    favicon.href = groupInfo.themeVariables?.faviconImg || groupInfo.themeVariables?.mainLogo;
    //@ts-ignore
    titleText.innerText = groupInfo.thethemeVariables?.projectTitle ? `${groupInfo.thethemeVariables?.projectTitle} Token Bridge` : 'Token Bridge';

    const error = (initError && initError != '' && initError != 'Make sure to initialize the web3 client such as Metamask') && (
        <div style={{
            ...styles.error
        }}
        >
            <ErrorBar error={initError || 'error'} />
        </div>

    );

    const bridgeItems = (
        <>
            <WithdrawlsButton customClasses="mr-3" count={unusedItems || 0} onClick={() => setOpen(!open)} />
        </>
    );

    const SwitchBtn = (
        <>
            {
                switchRequest && network != ('RINKEBY' || 'ETHEREUM') &&
                <SwitchNetworkButton customClasses="mr-3"
                    onClick={() => changeNetwork(dispatch, network)}
                />
            }
        </>
    )

    console.log(props?.tempTheme?.bannerMainMessage)
    return (
        <>
            <>

                {
                    (props?.tempTheme?.bannerMainMessage || props?.tempTheme?.bannerSubMessage || groupInfo.themeVariables?.bannerMainMessage) &&
                    <Alert
                        className="top-banner"
                        message={props?.tempTheme?.bannerMainMessage ? props?.tempTheme?.bannerMainMessage : groupInfo.themeVariables?.bannerMainMessage}
                        description={props?.tempTheme?.bannerSubMessage ? props?.tempTheme?.bannerSubMessage : groupInfo.themeVariables?.bannerSubMessage}
                        banner
                        closable
                    />
                }
            </>
            <Header
                ConnectButton={ConBot}
                WithdrawlsButton={bridgeItems}
                SwitchNetworkButton={SwitchBtn}
                ThemeSelector={
                    () => <ThemeSelector setter={props.setter}
                        newTheme={props.newTheme}
                        setIsLight={() => setIsLight(!isLight)}
                        group={groupInfo.groupId}
                        isLight={isLight} />
                }
                logo={props?.tempTheme?.mainLogo ? props?.tempTheme?.mainLogo : groupInfo.themeVariables?.mainLogo}
                altText={groupInfo.projectTitle}
            />
            <div className="mt-4 d-flex justify-content-center text-center">
                <div>
                    <h4 style={{ "marginBottom": "0em" }} className="text-center display-12 font-weight-bold">{groupInfo.projectTitle} Cross-Chain Token Bridge [BETA]</h4>
                </div>
            </div>

            {error}
            <AppContainer>
                <ContentContainer>
                    <div className="landing-page">
                        <Switch>
                            <Route path='/:gid/liquidity/:action'>
                                <LiquidityPage />
                            </Route>
                            <Route path='/:gid/'>
                                <div className="steps-wrapper">
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 mb-3">
                                            <SideBarContainer />
                                        </div>
                                        <div className="col-lg-8 col-md-8">
                                            <TokenBridge
                                                connected={connected}
                                                conBtn={ConBot}
                                                connect={onBridgeLoad}
                                                ConnectBridge={ConnectBridge}
                                                newTheme={props.newTheme}
                                                projectTitle={groupInfo.projectTitle}
                                            />
                                        </div>
                                        <SidePane
                                            isOpen={open || panelOpen}
                                            dismissPanel={handleDismiss}
                                        />
                                    </div>
                                </div>
                            </Route>
                        </Switch>
                        <WaitingComponent />
                    </div>
                </ContentContainer>
            </AppContainer>
        </>
    );
}

export function Dashboard(props: ThemeProps) {
    const dispatch = useDispatch();
    const themeVariables = useTheme();
    const userAccounts = useSelector<BridgeAppState, AppAccountState>(state => state.connection.account);
    const stateData = useSelector<BridgeAppState, DashboardContentProps>(appS => stateToProps(appS, userAccounts));
    const themes = _loadTheme(themeVariables, { ...stateData.customTheme });
    const initError = useSelector<BridgeAppState, string | undefined>(state => state.data.init.initError);
    const appInitialized = useSelector<BridgeAppState, any>(appS => appS.data.init.initialized);
    const groupInfoData = useSelector<BridgeAppState, any>(appS => appS.data.state.groupInfo);
    let { theme, setTheme, loadTheme } = newThemeInitialization(groupInfoData.groupId ? groupInfoData.groupId : null);
    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [newTheme] = useState();
    const history = useHistory();

    const handleCon = async () => {
        await onBridgeLoad(dispatch, history).catch(console.error)
    }

    useEffect(() => {
        if (groupInfoData.groupId) {
            const theme = loadTheme();
            setSelectedTheme(theme)
        }
    }, [groupInfoData.groupId]);

    useEffect(() => {
        if (!appInitialized) {
            intializing(dispatch)
        }
    }, [appInitialized]);

    useEffect(() => {
        if (appInitialized) {
            handleCon()
        }
    }, [appInitialized]);

    if (appInitialized && !stateData.initializeError) {
        console.log(selectedTheme);
        console.log(props.themeConfig.colors)
        return (
            <ThemeProvider theme={
                {
                    ...selectedTheme,
                    BgImage: props.themeConfig?.BgImage ?
                        props.themeConfig?.BgImage : selectedTheme.BgImage,
                    mainLogo: props.themeConfig.mainLogo,
                    colors: {
                        ...selectedTheme.colors,
                        mainHeaderColor: props.themeConfig?.colors?.mainHeaderColor ? props.themeConfig?.colors?.mainHeaderColor : selectedTheme.colors.mainHeaderColor,
                        stepsFinishBackgroundColor: props.themeConfig?.colors?.stepsFinishBackgroundColor ? props.themeConfig?.colors?.stepsFinishBackgroundColor : selectedTheme.colors.stepsFinishBackgroundColor,
                        stepsWaitBackgroundColor: props.themeConfig?.colors?.stepsWaitBackgroundColor ? props.themeConfig?.colors?.stepsWaitBackgroundColor : selectedTheme.colors.stepsWaitBackgroundColor,
                        stepsProgressBackgroundColor: props.themeConfig?.colors?.stepsProgressBackgroundColor ? props.themeConfig?.colors?.stepsProgressBackgroundColor : selectedTheme.colors.stepsProgressBackgroundColor,
                        button: props.themeConfig.button ?
                            { ...selectedTheme.colors.button, ...props.themeConfig.button } : selectedTheme.colors.button,
                        card: props.themeConfig.card ?
                            {
                                ...selectedTheme.colors.card,
                                cardPri:
                                    props.themeConfig.card.cardPri ?
                                        props.themeConfig.card.cardPri : selectedTheme.colors.card.cardPri,
                                cardTextPri:
                                    props.themeConfig.card.cardTextPri ?
                                        props.themeConfig.card.cardTextPri : selectedTheme.colors.card.cardTextPri,
                                cardSec:
                                    props.themeConfig.card.cardSec ?
                                        props.themeConfig.card.cardSec : selectedTheme.colors.card.cardSec,
                                cardTextSec:
                                    props.themeConfig.card.cardTextSec ?
                                        props.themeConfig.card.cardTextSec : selectedTheme.colors.card.cardTextSec,
                                cardBorderRadius:
                                    props.themeConfig.card.cardBorderRadius ?
                                        props.themeConfig.card.cardBorderRadius : selectedTheme.colors.card.cardBorderRadius,
                            } : selectedTheme.colors.card
                    }
                }
            }>
                <GlobalStyles />
                <AppWraper
                    theme={themes}
                    setter={(value: any) => setSelectedTheme(value)}
                    newTheme={newTheme}
                    tempTheme={props.themeConfig}
                >

                </AppWraper>
            </ThemeProvider>
        )
    }

    const fatalErrorComp = (
        (!!initError || !!stateData.initializeError) ? (
            <>
                <Page>
                    <h3>Error loading the application</h3><br />
                    <p>{initError || stateData.initializeError}</p>
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
    inputStyle: {
        root: [
            {
                color: theme.get(Theme.Button.btnPrimaryTextColor),
                height: '40px',
            }
        ]
    },
    errorContainer: {
        padding: '20px 5%'
    },
    error: {
        "display": "flex", "justifyContent": "center", width: "50%",
        margin: "0px auto", padding: '20px 5%'
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

