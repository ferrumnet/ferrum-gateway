import { FCard, FContainer } from "ferrum-design-system";
import moment from "moment";
import { QuantumPortalRemoteTransactoin } from "qp-explorer-commons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { inject, Utils } from "types";
import { QpAppState } from "../common/QpAppState";
import { QpExplorerClient } from "../QpExplorerClient";
import { CHAIN_LOGO, MultiLinePair, Pair } from "./Pair";

export function Transaction(props: {}) {
  const { txid } = useParams() as any;
  const network = Utils.getQueryparam("network");
  const init = useSelector<QpAppState, boolean>(
    (state) => state.data.init.initialized
  );
  const tx = useSelector<
    QpAppState,
    QuantumPortalRemoteTransactoin | undefined
  >((state) => state.data.state.selectedTransaction);
  const dispatch = useDispatch();
  useEffect(() => {
    if (network && txid && init) {
      const client = inject<QpExplorerClient>(QpExplorerClient);
      client
        .tx(dispatch, network, txid)
        .catch((e) => console.error("Error getting tx ", network, txid, e));
    }
  }, [txid, network, init]);
  if (!tx) {
    return (
      <>
        <h1>Transaction not found</h1>
      </>
    );
  }
  const sourceChainLogo = CHAIN_LOGO[tx.networkId];
  const minedChainLogo = CHAIN_LOGO[tx.remoteNetworkId];
  return (
    <>
      <FContainer width={700}>
        <FCard>
          <Pair
            itemKey={"Time"}
            value={moment.unix(tx.timestamp).toLocaleString()}
          />
          <Pair itemKey={"Block"} value={tx.blockHash} />
          <Pair itemKey={"Hash"} value={tx.hash} />
          <Pair itemKey={"Initiated on Network"} value={tx.networkId} />
          <Pair itemKey={"Mined on Network"} value={tx.remoteNetworkId} />
          <Pair
            itemKey={<span>From {sourceChainLogo}</span>}
            value={tx.sourceMsgSender}
            linkTo={`/address/${(tx.sourceMsgSender || '').toLowerCase()}`}
          />
          <Pair
            itemKey={<span>To {minedChainLogo}</span>}
            value={tx.remoteContract}
            linkTo={`/address/${(tx.remoteContract || '').toLowerCase()}`}
          />
          <Pair
            itemKey={<span>Benficiary {sourceChainLogo}</span>}
            value={tx.sourceBeneficiary}
            linkTo={`/address/${(tx.sourceBeneficiary || '').toLowerCase()}`}
          />
          <Pair
            itemKey={<span>Token {sourceChainLogo}</span>}
            value={tx.tokenId}
          />
          <Pair
            itemKey={<span>Amount transferred {sourceChainLogo}</span>}
            value={`${tx.amountDisplay} ${tx.tokenSymbol || ""}`}
          />
          <Pair
            itemKey={<span>Gas {sourceChainLogo}</span>}
            value={`${tx.gas} FRM`}
          />
          <MultiLinePair itemKey={"method"} value={tx.method} />
        </FCard>
      </FContainer>
    </>
  );
}
