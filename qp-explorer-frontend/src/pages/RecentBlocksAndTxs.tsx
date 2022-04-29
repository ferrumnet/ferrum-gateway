import moment from "moment";
import {
  QuantumPortalMinedBlock,
  QuantumPortalRemoteTransactoin,
} from "qp-explorer-commons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Utils } from "types";
import { QpAppState } from "../common/QpAppState";
import { CHAIN_LOGO } from "./Pair";
import {
  FCard,
  FContainer,
  FGrid,
  FGridItem,
  FTruncateText,
} from "ferrum-design-system";

function TransactionItem(props: {
  remoteNetwork: string;
  localNetwork: string;
  hash: string;
  timestamp: number;
  remoteMsgSender: string;
  localContract: string;
}) {
  const timeForm = moment.unix(props.timestamp).fromNow();
  return (
    <div className="tx-item-container f-ml-6 f-mt-1">
      <div className="tx0item-p0">
        {CHAIN_LOGO[props.remoteNetwork]} {" => "}{" "}
        {CHAIN_LOGO[props.localNetwork]}
      </div>
      <div className="tx-item-p1">
        <Link to={`/tx/${props.hash}?network=${props.localNetwork}`}>
          {/* <span>{Utils.shorten(props.hash)}</span> */}
          <FTruncateText
            text={props.hash}
            style={{ color: "rgb(225 175 84 / 50%)" }}
          />
        </Link>

        <span>
          <small>{timeForm}</small>
        </span>
      </div>
      <div className="tx-item-p2">
        <span>
          <b>From: </b>
          {Utils.shorten(props.remoteMsgSender)}
        </span>{" "}
        <br />
        <span>
          <b>To: </b>
          {Utils.shorten(props.localContract)}
        </span>
      </div>
    </div>
  );
}

function BlockItem(props: {
  remoteNetwork: string;
  localNetwork: string;
  hash: string;
  timestamp: number;
  nonce: string;
  txCount: string;
}) {
  const timeForm = moment.unix(props.timestamp).fromNow();
  return (
    <FContainer width={900}>
      <div className="tx-item-container f-ml-10 f-mt-1">
        <div className="tx0item-p0">
          {CHAIN_LOGO[props.remoteNetwork]} {" => "}{" "}
          {CHAIN_LOGO[props.localNetwork]}
        </div>
        <div className="tx-item-p1">
          <Link
            className={"pointer-cursor"}
            to={`/block/${props.hash}?network=${props.localNetwork}`}
          >
            <FTruncateText text={props.hash} />
            {/* <span>{Utils.shorten(props.hash)}</span> */}
          </Link>

          <span>
            <small>{timeForm}</small>
          </span>
        </div>
        <div className="tx-item-p2">
          <span>
            <b>Nonce: </b>
            {Utils.shorten(props.nonce)}
          </span>{" "}
          <br />
          <span>
            <b>Transactions: </b>
            {Utils.shorten(props.txCount)}
          </span>
        </div>
      </div>
    </FContainer>
  );
}

export function RecentBlocksAndTxs(props: {}) {
  const recentBlocks = useSelector<QpAppState, QuantumPortalMinedBlock[]>(
    (state) => state.data.state.recentBlocks
  );
  const recentTxs = useSelector<QpAppState, QuantumPortalRemoteTransactoin[]>(
    (state) => state.data.state.recentTransactions
  );
  return (
    <>
      {/* <FCard variant={"primary"} className="f-mt-4"> */}
      <FContainer width={900}>
        <FGrid className="f-mt-4">
          <FGridItem size={[12, 12, 12]} className="text-center">
            <FCard variant={"primary"}>
              <h2 className="f-mb-2">Recent Blocks</h2>
              {recentBlocks.map((b, i) => (
                <BlockItem
                  key={i}
                  remoteNetwork={b.remoteNetworkId}
                  localNetwork={b.networkId}
                  hash={b.blockHash}
                  timestamp={b.timestamp}
                  nonce={b.nonce.toString()}
                  txCount={b.transactionCount.toString()}
                />
              ))}
            </FCard>
          </FGridItem>
          <br />
          <FGridItem size={[12, 12, 12]} className="text-center f-mt-4">
            <FCard variant={"primary"}>
              <h2 className="f-mb-2">Recent Transactions</h2>
              {recentTxs.map((t, i) => (
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
          </FGridItem>
        </FGrid>
      </FContainer>
      {/* </FCard> */}
    </>
  );
}
