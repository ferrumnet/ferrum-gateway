import moment from "moment";
import { QuantumPortalMinedBlock, QuantumPortalRemoteTransactoin } from "qp-explorer-commons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Utils } from "types";
import { QpAppState } from "../common/QpAppState";
import { CHAIN_LOGO } from "./Pair";

function TransactionItem(props: {
    remoteNetwork: string,
    localNetwork: string,
    hash: string,
    timestamp: number,
    remoteMsgSender: string,
    localContract: string,
}) {
    const timeForm = moment.unix(props.timestamp).fromNow();
    return (
    <div className="tx-item-container">
        <div className="tx0item-p0">
            {CHAIN_LOGO[props.remoteNetwork]} {' => '} {CHAIN_LOGO[props.localNetwork]}
        </div>
        <div className="tx-item-p1">
            <Link to={`/tx/${props.hash}?network=${props.localNetwork}`}><span>{Utils.shorten(props.hash)}</span></Link><br/>
            <span><small>{timeForm}</small></span>
        </div>
        <div className="tx-item-p2">
            <span><b>From: </b>{Utils.shorten(props.remoteMsgSender)}</span> <br/>
            <span><b>To: </b>{Utils.shorten(props.localContract)}</span>
        </div>
    </div>
    );
}

function BlockItem(props: {
    remoteNetwork: string,
    localNetwork: string,
    hash: string,
    timestamp: number,
    nonce: string,
    txCount: string,
}) {
    const timeForm = moment.unix(props.timestamp).fromNow();
    return (
    <div className="tx-item-container">
        <div className="tx0item-p0">
            {CHAIN_LOGO[props.remoteNetwork]} {' => '} {CHAIN_LOGO[props.localNetwork]}
        </div>
        <div className="tx-item-p1">
            <Link to={`/block/${props.hash}?network=${props.localNetwork}`}><span>{Utils.shorten(props.hash)}</span></Link><br/>
            <span><small>{timeForm}</small></span>
        </div>
        <div className="tx-item-p2">
            <span><b>Nonce: </b>{Utils.shorten(props.nonce)}</span> <br/>
            <span><b>Transactions: </b>{Utils.shorten(props.txCount)}</span>
        </div>
    </div>
    );
}


export function RecentBlocksAndTxs(props: {}) {
    const recentBlocks = useSelector<QpAppState, QuantumPortalMinedBlock[]>(state => state.data.state.recentBlocks);
    const recentTxs = useSelector<QpAppState, QuantumPortalRemoteTransactoin[]>(state => state.data.state.recentTransactions);
    return (
        <>
            <div className="block-txs-container">
                <div className="block-txs-left">
                    <h3>Recent Blocks</h3>
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
                </div>
                <div className="block-txs-right">
                    <h3>Recent Transactions</h3>
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
                </div>
            </div>
        </>
    );
}