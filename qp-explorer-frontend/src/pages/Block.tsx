import { FCard, FContainer } from "ferrum-design-system";
import moment from "moment";
import {
  QuantumPortalMinedBlock,
  QuantumPortalRemoteTransactoin,
} from "qp-explorer-commons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { inject, Utils } from "types";
import { QpAppState } from "../common/QpAppState";
import { QpExplorerClient } from "../QpExplorerClient";
import { Pair } from "./Pair";

export function Block(props: {}) {
  const { hash } = useParams() as any;
  const { network } = Utils.getQueryparams();
  const init = useSelector<QpAppState, boolean>(
    (state) => state.data.init.initialized
  );
  const block = useSelector<QpAppState, QuantumPortalMinedBlock | undefined>(
    (state) => state.data.state.selectedBlock?.block
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (network && hash && init) {
      const client = inject<QpExplorerClient>(QpExplorerClient);
      client
        .blockByHash(dispatch, network, hash)
        .catch((e) => console.error("Error getting block ", network, block, e));
    }
  }, [hash, network, init]);
  if (!block) {
    return (
      <>
        <h1>Block not found</h1>
      </>
    );
  }
  return (
    <FContainer width={700}>
      <FCard variant={"primary"} className={"f-mt-5"}>
        <Pair
          itemKey={"Time"}
          value={moment.unix(block.timestamp).toLocaleString()}
        />
        <Pair itemKey={"Hash"} value={block.blockHash} />
        <Pair
          itemKey={"Transactions"}
          value={`${block.transactionCount} transactions`}
          linkTo={`/txs?network=${block.networkId}&block=${block.blockHash}`}
        />
        <Pair itemKey={"Source network"} value={block.remoteNetworkId} />
        <Pair itemKey={"Mined on network"} value={block.networkId} />
        <Pair itemKey={"Block number (nonce)"} value={block.nonce.toString()} />
        <Pair itemKey={"Finalized"} value={(!!block.finalization).toString()} />
      </FCard>
    </FContainer>
  );
}
