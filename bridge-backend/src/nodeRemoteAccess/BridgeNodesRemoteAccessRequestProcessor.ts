import { AppConfig } from "common-backend";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { HttpRequestProcessor } from "types";
import { BridgeProcessorConfig } from "../BridgeProcessorTypes";
import { TokenBridgeService } from "../TokenBridgeService";
import { BridgeNodesRemoteAccessService } from "./BridgeNodesRemoteAccessService";

export class BridgeNodesRemoteAccessRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
  static async configuration() {
    AppConfig.instance().orElse(
      "",
      () =>
        ({
          blackListAdminSecret: AppConfig.env("BLACKLIST_ADMIN_SECRET"),
        } as BridgeProcessorConfig)
    );
  }

  constructor(
    private svc: BridgeNodesRemoteAccessService,
    private publicSvc: TokenBridgeService
  ) {
    super();

    this.registerProcessorAuth("registerWithdrawItem", async (req, auth) => {
      ValidationUtils.isTrue(!!auth.hmacPublicKey, "Unauthorized");
      return await this.svc.registerWithdrawItem(auth.hmacPublicKey, req.data);
    });

    this.registerProcessorAuth(
      "registerWithdrawItemHashVerification",
      async (req, auth) => {
        ValidationUtils.isTrue(!!auth.ecdsaAddress, "Unauthorized");
        ValidationUtils.allRequired(
          [
            "receiveNetwork",
            "receiveTransactionId",
            "hash",
            "signature",
            "signatrueCreationTime",
          ],
          req.data
        );
        return await this.svc.registerWithdrawItemHashVerification(
          auth.ecdsaAddress,
          req.data.receiveNetwork,
          req.data.receiveTransactionId,
          req.data.hash,
          req.data.signature,
          req.data.signatrueCreationTime
        );
      }
    );

    this.registerProcessorAuth("getPendingWithdrawItems", async (req, auth) => {
      ValidationUtils.isTrue(!!auth.ecdsaAddress, "Unauthorized");
      ValidationUtils.allRequired(["schemaVersion", "network"], req.data);
      return await this.svc.getPendingWithdrawItems(
        req.data.schemaVersion,
        req.data.network
      );
    });

    this.registerProcessorAuth(
      "getPendingWithdrawItemById",
      async (req, auth) => {
        ValidationUtils.isTrue(!!auth.ecdsaAddress, "Unauthorized");
        ValidationUtils.allRequired(
          ["schemaVersion", "network", "receiveTransactionId"],
          req.data
        );
        return await this.svc.getPendingWithdrawItemById(
          req.data.schemaVersion,
          req.data.network,
          req.data.receiveTransactionId
        );
      }
    );

    this.registerProcessorAuth(
      "getWithdrawItemTransactionIds",
      async (req, auth) => {
        ValidationUtils.isTrue(!!auth.hmacPublicKey, "Unauthorized");
        ValidationUtils.allRequired(["schemaVersion", "network"], req.data);
        return await this.svc.getWithdrawItemTransactionIds(
          req.data.schemaVersion,
          req.data.network,
          req.data.lookBackMillis
        );
      }
    );

    this.registerProcessorAuth("getPendingSwapTxIds", async (req, auth) => {
      ValidationUtils.isTrue(!!auth.hmacPublicKey, "Unauthorized");
      return await this.publicSvc.getPendingSwapTxIds(req.data.network);
    });

    this.registerProcessorAuth("blackListAddress", async (req, auth) => {
      const { address, adminSecret } = req.data;
      this.validateAdminSecret(adminSecret);
      ValidationUtils.isTrue(!!address, "address is required");
      return await this.svc.blackListAddress(address);
    });
  }

  __name__(): string {
    return "BridgeNodesRemoteAccessRequestProcessor";
  }

  validateAdminSecret(adminSeceret: string) {
    const theSecret =
      AppConfig.instance().get<BridgeProcessorConfig>().blackListAdminSecret;
    ValidationUtils.isTrue(!!theSecret, "No admin seceret is configured!");
    ValidationUtils.isTrue(
      adminSeceret === theSecret,
      "Unauthorized for admin"
    );
  }
}
