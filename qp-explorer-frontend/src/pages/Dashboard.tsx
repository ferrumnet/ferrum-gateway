import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { inject } from "types";
import { Route, Switch } from "react-router";
import {
  Page,
  Header,
  CnctButton,
  AppContainer,
  ContentContainer,
  // @ts-ignore
} from "component-library";
import { ConnectButtonWapper } from "common-containers";
// import { WaitingComponent } from '../common/WebWaiting';
import "../app.scss";
import { ThemeProvider } from "styled-components";
import { QpAppState } from "../common/QpAppState";
import { QpExplorerClient } from "../QpExplorerClient";
import { DefaultTheme } from "../common/DefaultTheme";
import { GlobalStyles } from "../common/GlobalStyles";
import { RecentBlocksAndTxs } from "./RecentBlocksAndTxs";
import { Transaction } from "./Transaction";
import { TransactionsList } from "./TransactionsList";
import { Block } from "./Block";
import {
  FLayout,
  FMain,
  FContainer,
  FHeader,
  FButton,
  FItem,
} from "ferrum-design-system";

const initializeDashboardThunk = createAsyncThunk(
  "crucible/init",
  async (payload: {}, ctx) => {
    const client = inject<QpExplorerClient>(QpExplorerClient);
    const recentBlocksF = client.recentBlocks(ctx.dispatch, 0, 40);
    const recentTxsF = client.recentTxs(ctx.dispatch, 0, 40);
    // Load recent blocks and transactions
    await Promise.all([recentBlocksF, recentTxsF]);
  }
);

export function Dashboard(props: {}) {
  const initError = useSelector<QpAppState, string | undefined>(
    (state) => state.data.init.initError
  );
  const initialized = useSelector<QpAppState, boolean>(
    (state) => state.data.init.initialized
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (initialized) {
      dispatch(initializeDashboardThunk({}));
    }
  }, [initialized]);
  // const ConBot = ;

  const header = (
    <>
      <FHeader
        showLogo={true}
        // headerLogo={
        //   "https://ferrum.network/wp-content/uploads/2021/05/image-1.png"
        // }
        titleText={"Quantum Portal Explorer"}
      >
        <FItem align="right" display={"flex"}>
          <ConnectButtonWapper View={CnctButton} />
        </FItem>
      </FHeader>
      {/* <Header>
      ConnectButton={ConBot}
      WithdrawlsButton={<></>}
      SwitchNetworkButton={<></>}
      ThemeSelector={() => <></>}
      //     () => <ThemeSelector setter={props.setter}
      //         newTheme={props.newTheme}
      //         setIsLight={() => setIsLight(!isLight)}
      //         group={groupInfo.groupId}
      //         isLight={isLight} />
      // }
      logo={"https://ferrum.network/wp-content/uploads/2021/05/image-1.png"}
      altText={"Quantum Portal Explorer"}
      /> */}
    </>
  );
  return (
    <>
      {!!initError ? (
        <Page>
          <h3>Error loading the application</h3>
          <br />
          <p>{initError}</p>
        </Page>
      ) : (
        <>
          <FLayout FsiderLayoutState={true} themeBuilder={false}>
            {/* <ThemeProvider theme={DefaultTheme}> */}
            {/* <GlobalStyles /> */}
            <FMain>
              {header}
              <FContainer className="fluid">
                <AppContainer>
                  {/* <ContentContainer> */}
                  {/* <div className="landing-page"> */}
                  <Switch>
                    <Route path="/block/:hash">
                      <Block />
                    </Route>
                    <Route path="/txs">
                      <TransactionsList />
                    </Route>
                    <Route path="/tx/:txid">
                      <Transaction />
                    </Route>
                    <Route>
                      <RecentBlocksAndTxs />
                    </Route>
                  </Switch>
                  {/* <WaitingComponent /> */}
                  {/* </div> */}
                  {/* </ContentContainer> */}
                </AppContainer>
              </FContainer>
            </FMain>
            {/* </ThemeProvider> */}
          </FLayout>
        </>
      )}
    </>
  );
}
