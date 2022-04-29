import { FCard, FContainer } from "ferrum-design-system";
import moment from "moment";
import { QuantumPortalRemoteTransactoin } from "qp-explorer-commons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { inject, Utils } from "types";
import { QpAppState } from "../common/QpAppState";
import { QpExplorerClient } from "../QpExplorerClient";
import { CHAIN_LOGO } from "./Pair";
import "./Pair.css";

export function TransactionDetailLine(props: {
  tx: QuantumPortalRemoteTransactoin;
}) {
  const { tx } = props;
  return (
    <div className="tx-line-container">
      <div className="tx-line-cell">
        {CHAIN_LOGO[tx.networkId]} {" =>"} {CHAIN_LOGO[tx.remoteNetworkId]}
      </div>
      <div className="tx-line-cell">
        <Link
          className={"pointer-cursor"}
          to={`/tx/${tx.hash}?network=${tx.remoteNetworkId}`}
        >
          <span>{Utils.shorten(tx.hash)}</span>
        </Link>
      </div>
      <div className="tx-line-cell">
        <span>{moment.unix(tx.timestamp).fromNow()}</span>
      </div>
      <div className="tx-line-cell">
        <span>{Utils.shorten(tx.sourceBeneficiary)}</span>
      </div>
      <div className="tx-line-cell">
        <span>{Utils.shorten(tx.sourceMsgSender)}</span>
      </div>
      <div className="tx-line-cell">
        <span>{Utils.shorten(tx.remoteContract)}</span>
      </div>
      <div className="tx-line-cell">
        <span>
          {tx.tokenSymbol} {tx.amountDisplay}
        </span>
      </div>
      <div className="tx-line-cell">
        <span>{tx.gas || ""}</span>
      </div>
    </div>
  );
}

export function TransactionsList(props: {}) {
  const { network, block } = Utils.getQueryparams();
  const init = useSelector<QpAppState, boolean>(
    (state) => state.data.init.initialized
  );
  const txs = useSelector<
    QpAppState,
    QuantumPortalRemoteTransactoin[] | undefined
  >((state) => state.data.state.selectedBlock?.transactions);
  const dispatch = useDispatch();
  useEffect(() => {
    if (network && block && init) {
      const client = inject<QpExplorerClient>(QpExplorerClient);
      client
        .blockByHash(dispatch, network, block)
        .catch((e) => console.error("Error getting block ", network, block, e));
    }
  }, [block, network, init]);
  if (!txs) {
    return (
      <>
        <h1>No transactions</h1>
      </>
    );
  }
  return (
    <>
      <FContainer width={1150}>
        <FCard className="tx-list-container f-mt-4">
          <div className="tx-list-header">
            <b>Latest Transactions</b>
          </div>
          <div className="tx-list-wrapper">
            {txs.map((tx, i) => (
              <TransactionDetailLine key={i} tx={tx} />
            ))}
          </div>
        </FCard>
      </FContainer>
    </>
  );
}
