import { FCard, FContainer } from "ferrum-design-system";
import { QuantumPortalAccount, QuantumPortalAccountBalance, QuantumPortalContractAccount, QuantumPortalRemoteTransactoin } from "qp-explorer-commons";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { inject, Utils } from "types";
import { QpAppState } from "../common/QpAppState";
import { QpExplorerClient } from "../QpExplorerClient";
import { ContractInteractionReader } from "./ContractInteractionReader";
import { ContractInteractionWriter, getConnectedNetwork } from "./ContractInteractionWriter";
import { MultiLinePair, Pair } from "./Pair";
import { TransactionItem } from "./RecentBlocksAndTxs";

export function Address(props: {}) {
  const { address } = useParams() as any;
  const init = useSelector<QpAppState, boolean>(
    (state) => state.data.init.initialized
  );
  const account = useSelector<
    QpAppState,
    QuantumPortalAccount | undefined
  >((state) => state.data.state.selectedAddress?.account);
  const balances = useSelector<
    QpAppState,
    QuantumPortalAccountBalance[] | undefined
  >((state) => state.data.state.selectedAddress?.balances) || [];
  const transactions = useSelector<
    QpAppState,
    QuantumPortalRemoteTransactoin[] | undefined
  >((state) => state.data.state.selectedAddress?.transactions) || [];
  const connectedNetwork = useSelector<QpAppState, string|undefined>(getConnectedNetwork);

  const dispatch = useDispatch();
  useEffect(() => {
    if (address && init) {
      const client = inject<QpExplorerClient>(QpExplorerClient);
      client
        .account(dispatch, address)
        .catch((e) => console.error("Error getting account ", address, e));
    }
  }, [address, init]);
  if (!account) {
    return (
      <>
        <h1>Address not found</h1>
      </>
    );
  }
  const nets = Object.keys(account.contract);
  return (
    <>
      <FContainer width={700}>
        <FCard>
          <Pair
            itemKey={"Address"}
            value={address}
          />
          {
            balances.map((b, i) => (
              <Pair key={i} itemKey={`Balance (${Utils.parseCurrency(b.tokenId)[0]}) - ${b.symbol}`} value={b.balanceDisplay} />
            ))
          }
          <Pair itemKey={"Is contract"} value={account.isContract ? 'true' : 'false'} />
          {account.isContract && (
            nets.map((k: string, i: number) => {
              const co: QuantumPortalContractAccount = (account as any).contractObjects[account.contract[k].contractId];
              return (
              <React.Fragment key={i}>
                <MultiLinePair itemKey={"Contract Metadata"} value={co?.metadata} />
                <MultiLinePair itemKey={"Contract ABI"} value={JSON.stringify(co?.abi)} />
                <MultiLinePair itemKey={"Contract Code"} value={co?.code} />
              </React.Fragment>)
            })
          )}
        </FCard>
        <div> &nbsp; </div>
        <h2>Transactions</h2>
        <FCard>
            {transactions.map((t, i) => (
              <TransactionItem
                key={i}
                remoteNetwork={t.remoteNetworkId}
                localNetwork={t.networkId}
                hash={t.hash}
                timestamp={t.timestamp}
                remoteMsgSender={t.sourceMsgSender}
                localContract={t.remoteContract}
              />
            ))}
        </FCard>
        {account.isContract && 
          nets.map((net, i) =>  
            (
              <>
              <div> &nbsp; </div>
              <h2>Contract [{net}{connectedNetwork === net ? ' - connected': ''}]</h2>
              <ContractInteractionReader network={net} />
              <ContractInteractionWriter network={net} />
              </>
            ))
          }
      </FContainer>
    </>
  );
}

