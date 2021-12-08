import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { HttpRequestProcessor } from "types";
import { TokenBridgeService } from "../TokenBridgeService";
import { BridgeNodesRemoteAccessService } from "./BridgeNodesRemoteAccessService";

export class BridgeNodesRemoteAccessRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
    constructor(
      private svc: BridgeNodesRemoteAccessService,
      private publicSvc: TokenBridgeService,
    ) {
        super();

        this.registerProcessorAuth('registerWithdrawItem', async (req, auth) => {
          ValidationUtils.isTrue(!!auth.hmacPublicKey, 'Unauthorized');
          return await this.svc.registerWithdrawItem(auth.hmacPublicKey, req.data);
        });

        this.registerProcessorAuth('registerWithdrawItemHashVerification', async (req, auth) => {
          ValidationUtils.isTrue(!!auth.ecdsaAddress, 'Unauthorized');
          ValidationUtils.allRequired(['receiveNetwork', 'receiveTransactionId', 'hash',
            'signature', 'signatrueCreationTime'], req.data);
          return await this.svc.registerWithdrawItemHashVerification(auth.ecdsaAddress,
            req.data.receiveNetwork, req.data.receiveTransactionId, req.data.hash,
            req.data.signature, req.data.signatrueCreationTime);
        });

        this.registerProcessorAuth('getPendingWithdrawItems', async (req, auth) => {
          ValidationUtils.isTrue(!!auth.ecdsaAddress, 'Unauthorized');
          ValidationUtils.allRequired(['schemaVersion', 'network'], req.data);
          return await this.svc.getPendingWithdrawItems(
            req.data.schemaVersion, req.data.network);
        });

        this.registerProcessorAuth('getPendingSwapTxIds', async (req, auth) => {
          ValidationUtils.isTrue(!!auth.hmacPublicKey, 'Unauthorized');
          return await this.publicSvc.getPendingSwapTxIds(req.data.network);
        })
    }

    __name__(): string { return 'BridgeNodesRemoteAccessRequestProcessor'; }
}