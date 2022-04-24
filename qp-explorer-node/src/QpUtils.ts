import { ValidationUtils } from "ferrum-plumbing";
import { QuantumPortalRemoteTransactoin } from "qp-explorer-commons";
import { Utils } from "types";
import { Eth } from "web3-eth";
import { soliditySha3 } from 'web3-utils';

export class QpUtils {
  static eth = new Eth();
  static txHash(tx: QuantumPortalRemoteTransactoin): string {
    const [_, token] = !!tx.tokenId ? Utils.parseCurrency(tx.tokenId) : [,];
    const encoded = QpUtils.eth.abi.encodeParameters([
        'address',
        'address',
        'address',
        'address',
        'uint256',
        'bytes',
        'uint256',
    ], [
        tx.remoteContract,
        tx.sourceMsgSender,
        tx.sourceBeneficiary,
        token || Utils.ZERO_ADDRESS,
        tx.amountRaw || '0',
        tx.method || '0x',
        tx.gas || '0',
    ]);
    return soliditySha3(Utils.add0x(encoded));
  }
}
