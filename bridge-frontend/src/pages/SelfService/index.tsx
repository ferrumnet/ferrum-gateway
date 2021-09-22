import React, { useState, useContext, useEffect } from "react";
import { ThemeContext, Theme } from "unifyre-react-helper";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { BridgeAppState, SwapTxStatus } from "../../common/BridgeAppState";
import { addressForUser } from "common-containers";
import { inject, inject3 } from "types";
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import {
  TextInput,
  //@ts-ignore
} from "component-library";
import { AnyAction, Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Gap,
  // @ts-ignore
} from "desktop-components-library";
import { supportedNetworks, NetworkDropdown } from "types";
import "antd/dist/antd.css";
import { BridgeClient } from "../../clients/BridgeClient";
import { addAction, CommonActions } from "../../common/Actions";
import { Card } from "react-bootstrap";
import { SearchButton } from "./liquidityActionButton";
import {
  UnifyreExtensionWeb3Client,
  Connect,
} from "unifyre-extension-web3-retrofit";
import { Dropdown } from "react-bootstrap";
import { changeNetwork } from "../Main/handler";
import { Timeline } from "antd";
import { SelfServiceState } from "../../common/BridgeAppState";

export interface SelfServiceProps extends SelfServiceState {
  symbol: string;
  amount: string;
  networkOptions?: NetworkDropdown[];
  reconnecting: boolean;
  txId: string;
  txStatus: SwapTxStatus;
}

async function logSwapTransaction(
  dispatch: Dispatch<AnyAction>,
  txId: string,
  network: string,
  success: (v: string) => void
) {
  try {
    dispatch(addAction(CommonActions.WAITING, { source: "loadGroupInfo" }));
    const client = inject<BridgeClient>(BridgeClient);
    await client.logSwapTransaction(txId, network);
    dispatch(Actions.txIdChanged({ tx: "" }));
    success(
      "Transaction successfully added to queue, will be processed shortly"
    );
  } catch (e) {
    dispatch(
      addAction(CommonActions.ERROR_OCCURED, {
        message: (e as Error).message || "",
      })
    );
  } finally {
    dispatch(
      addAction(CommonActions.WAITING_DONE, { source: "loadGroupInfo" })
    );
  }
}

async function getTransactionStatus(
  dispatch: Dispatch<AnyAction>,
  txId: string,
  network: string,
  onErrorMessage: (v: string) => void
) {
  try {
    dispatch(addAction(CommonActions.WAITING, { source: "loadGroupInfo" }));
    const client = inject<BridgeClient>(BridgeClient);
    const status = await client.checkTxStatus(dispatch, txId, network);
		console.log('STATUS WAS', status)
    if (!status || status === 'timedout') {
      onErrorMessage("Transaction was not found");
      dispatch(Actions.txIdChanged({ tx: "" }));
      return;
    }
    if (status === "successful") {
      // const block = await connect2
      //   .getProvider()!
      //   .web3()
      //   ?.eth.getBlock(t.blockHash);
      const item = await client.getWithdrawItem(dispatch, network, txId);
      console.log(status, "status", item);
      dispatch(
        Actions.updateTxStatus({
          field: "swap",
          value: status,
          time: 0, //block!.timestamp || t.timestamp,
        })
      );

      if (item && item?.id) {
        dispatch(
          Actions.updateTxStatus({
            field: "withdrawalItem",
            value: item.id,
            time: new Date(item.sendTimestamp).toString(),
            withdrawn: item.used === "completed",
          })
        );
        return;
      }
    } else if (status === "failed") {
      dispatch(
        Actions.updateTxStatus({
          field: "swap",
          value: "failed",
          time: 0, //block!.timestamp || t.timestamp,
        })
      );
    } else {
      dispatch(
        Actions.updateTxStatus({
          field: "swap",
          value: "pending",
          time: 0, //t.timestamp,
        })
      );
    }
  } catch (e) {
    dispatch(
      addAction(CommonActions.ERROR_OCCURED, {
        message: (e as Error).message || "",
      })
    );
  } finally {
    dispatch(
      addAction(CommonActions.WAITING_DONE, { source: "loadGroupInfo" })
    );
  }
}

function stateToProps(appState: BridgeAppState): SelfServiceProps {
  const state = appState.ui.selfServicePage;
  const bridgeCurrencies =
    appState.data.state.groupInfo?.bridgeCurrencies || ([] as any);
  const allNetworks = bridgeCurrencies.map((c) => c.split(":")[0]);
  const addr = addressForUser(appState.connection.account.user) || ({} as any);
  let address = addr[0] || {};
  const currentNetwork = supportedNetworks[address.network] || {};
  const networkOptions = Object.values(supportedNetworks).filter(
    (n) =>
      allNetworks.indexOf(n.key) >= 0 &&
      (!address.network || n.mainnet === currentNetwork.mainnet)
  );
  return {
    ...state,
    network: state.network || address.network,
    networkOptions,
    addresses: addr,
  } as any as SelfServiceProps;
}

export const selfServicePageSlice = createSlice({
  name: "swapPage",
  initialState: {
    network: "",
    txStatus: {
      swapStatus: "",
      swapTimeStamp: "",
      withdrawalItemStatus: "",
      withdrawalItemTimeStamp: "",
      withdrawn: false,
    },
  } as SelfServiceProps,
  reducers: {
    txIdChanged: (state, action) => {
      state.txId = action.payload.tx;
      state.txStatus = {
        swapStatus: "",
        swapTimeStamp: "",
        withdrawalItemStatus: "",
        withdrawalItemTimeStamp: "",
        withdrawn: false,
      };
    },
    updateTxStatus: (state, action) => {
      switch (action.payload.field) {
        case "swap":
          state.txStatus.swapStatus = action.payload.value;
          state.txStatus.swapTimeStamp = action.payload.time;
          return;
        case "withdrawalItem":
          state.txStatus.withdrawalItemStatus = action.payload.value;
          state.txStatus.withdrawalItemTimeStamp = action.payload.time;
          state.txStatus.withdrawn = action.payload.withdrawn;
          return;
        default:
          return;
      }
    },
    switchNetwork: (state, action) => {
      state.network = action.payload.value;
    },
    swapDetails: (state, action) => {},
  },
  extraReducers: (builder) => {},
});

const Actions = selfServicePageSlice.actions;

export function SelfServicePage() {
  const theme = useContext(ThemeContext);
  const styles = themedStyles(theme);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const pageProps = useSelector<BridgeAppState, SelfServiceProps>((state) =>
    stateToProps(state)
  );

  const onErrorMessage = async (v: string) => {
    addToast(v, { appearance: "error", autoDismiss: true });
  };

  const onSuccessMessage = async (v: string) => {
    addToast(v, { appearance: "success", autoDismiss: true });
  };
  console.log("PROPS", { pageProps });

  return (
    <div className="centered-body liquidity1" style={styles.maincontainer}>
      <Card className="text-center">
        <div>
          <div className="body-not-centered swap liquidity">
            <small className="text-vary-color mb-5 head">
              Manage Swap Transaction
              <hr className="mini-underline"></hr>
            </small>
          </div>
          <div style={styles.container}>
            <div className="pad-main-body">
              <div className="text-sec text-left">
                Enter Swap Transaction ID
              </div>
              <TextInput
                onChange={(v: any) =>
                  dispatch(Actions.txIdChanged({ tx: v.target.value }))
                }
                style={{ fontSize: "22px" }}
              />

              <div className="text-sec text-left">Transaction Network</div>
              <div className="content">
                <div>
                  <Dropdown className="assets-dropdown liquidity-dropdown">
                    <Dropdown.Toggle
                      variant="pri"
                      id="dropdown-basic"
                      className={""}
                    >
                      <span className={"bodyText"}>{pageProps.network}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {pageProps.networkOptions?.map((asset, index) => (
                        <Dropdown.Item
                          eventKey={index}
                          key={index}
                          onClick={() =>
                            dispatch(
                              Actions.switchNetwork({ value: asset.key })
                            )
                          }
                        >
                          <span>
                            <strong>{asset.key}</strong>
                          </span>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <Gap size="small" />
          <div className="centered">
          {pageProps.txStatus.swapStatus === "successful" &&
            pageProps.txId != "" && (
              <Timeline mode={"left"}>
                  <Timeline.Item 
                    label={
                      <p> 
                      </p>
                    }
                    color={
                      pageProps.txStatus.swapStatus === "successful"
                        ? "green"
                        : "#caa561"
                    }
                    >
                      {pageProps.txStatus.swapStatus === "successful"
                        ? <p>Transaction (Swap) Processed</p>
                        : pageProps.txStatus.swapStatus === "pending"
                        ? <p>Swap Processing</p>
                        : pageProps.txStatus.swapStatus === "failed"
                        ? <p>"Swap Failed</p>
                        : ""}
                  </Timeline.Item>      
                  {
                    <Timeline.Item 
                      color={(pageProps.txStatus.swapStatus === 'successful' && pageProps.txStatus.withdrawalItemStatus) ? "green" : '#caa561'}
                      label={pageProps.txStatus.withdrawalItemTimeStamp && <p>
                        {new Date(pageProps.txStatus.withdrawalItemTimeStamp).toLocaleString()}
                      </p>}>
                          {(pageProps.txStatus.swapStatus === 'successful' && pageProps.txStatus.withdrawalItemStatus) && <p>Withdrawal Item Generated</p>}
                          {
                              (pageProps.txStatus.swapStatus === 'successful' && !pageProps.txStatus.withdrawalItemStatus) && 
                              <div>
                                  <p>Withdrawal Item Not Generated</p>
                                  <SearchButton
                                      onclick = {()=>logSwapTransaction(dispatch,pageProps.txId,pageProps.network,onSuccessMessage)}                                        
                                      disabled={(pageProps.txId === '')}
                                      service={'logTx'}
                                      style={
                                          {
                                              "padding": "5px !important",
                                              "marginTop": "1px !important",
                                              "width": "50%",
                                              "margin": "0px"
                                          }
                                      }                    
                                  />
                              </div>
                          }
                    </Timeline.Item>
                  } 
                  {pageProps.txStatus.swapStatus === "successful" && pageProps.txStatus.withdrawalItemStatus && (
                      <Timeline.Item
                        color={
                          pageProps.txStatus.withdrawn ? "green" : "#caa561"
                        }
                      >
                        {pageProps.txStatus.withdrawn
                          ? <p>Swap Withdrawn</p>
                          : <p>Withdrawal generated and not withdrawn</p>
                        }
                      </Timeline.Item>
                    )
                  }      
              </Timeline>
            )}
          </div>
          <div className="liqu-details">
            {!(
              pageProps.txStatus.swapStatus === "successful" &&
              pageProps.txId != ""
            ) && (
              <SearchButton
                onclick={() =>
                  getTransactionStatus(
                    dispatch,
                    pageProps.txId,
                    pageProps.network,
                    onErrorMessage
                  )
                }
                disabled={pageProps.txId === ""}
                service={"search"}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

//@ts-ignore
const themedStyles = (theme) => ({
  container: {
    width: "100%",
    margin: "0px auto",
  },
  maincontainer: {
    width: "70%",
    margin: "0px auto",
  },
  btnCont: {
    width: "40%",
  },
  groupAddon: {
    display: "flex",
    position: "relative" as "relative",
  },
  addon: {
    position: "absolute" as "absolute",
    right: "5%",
    display: "flex",
    height: "40%",
    alignItems: "center" as "center",
    cursor: "pointer",
    top: "15px",
    padding: "10px",
  },
  btnStyle: {
    root: [
      {
        padding: "1.3rem 2.5rem",
        backgroundColor: theme.get(Theme.Button.btnPrimary),
        borderColor: theme.get(Theme.Button.btnPrimary) || "#ceaa69",
        color: theme.get(Theme.Button.btnPrimary),
        height: "40px",
      },
    ],
  },
  headerStyles: {
    color: theme.get(Theme.Colors.textColor),
  },
  textStyles: {
    color: theme.get(Theme.Colors.textColor),
  },
  optionColor: {
    backgroundColor: theme.get(Theme.Colors.bkgShade0),
  },
});
