import { UserBridgeWithdrawableBalanceItem } from 'types';
import { NodeUtils } from './NodeUtils';
import * as TestTransactions from './TestTransactions.json';

function expectTransaction(wi: UserBridgeWithdrawableBalanceItem) {
    const hash = NodeUtils.bridgeV1Hash(wi);
    const salt = NodeUtils.bridgeV1Salt(wi);
    expect(wi.payBySig.hash).toBe(hash);
    expect(wi.payBySig.swapTxId).toBe(salt);
}

test('all v1 hashes and signatures match', () => {
    const txs = TestTransactions as UserBridgeWithdrawableBalanceItem[];
    txs.forEach(expectTransaction);
});