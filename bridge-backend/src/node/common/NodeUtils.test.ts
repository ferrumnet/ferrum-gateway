import { UserBridgeWithdrawableBalanceItem } from 'types';
import { NodeUtils } from './NodeUtils';
import TestTransactions from './TestTransactions.json';

function expectTransaction(wi: UserBridgeWithdrawableBalanceItem) {
    const hash = NodeUtils.bridgeV1Hash(wi);
    const salt = NodeUtils.bridgeV1Salt(wi);
    expect(wi.payBySig.swapTxId || (wi.payBySig as any).salt).toBe(salt);
    expect(wi.payBySig.hash).toBe(hash);
}

test('all v1 hashes and signatures match', () => {
    const txs = TestTransactions as any[] as UserBridgeWithdrawableBalanceItem[];
    txs.forEach(expectTransaction);
});