import { HttpRequestProcessor, HttpRequestData } from "types";
import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { CrucibeService } from "./CrucibleService";

export class CrucibleRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
  private cache = new LocalCache();
  constructor(private svc: CrucibeService) {
    super();

    this.registerProcessor("getAllocation", (req) => this.getAllocation(req));

    this.registerProcessor("depositGetTransaction", (req, userId) =>
      this.depositGetTransaction(req, userId!)
    );

    this.registerProcessor("depositPublicGetTransaction", (req, userId) =>
      this.depositPublicGetTransaction(req, userId!)
    );

    this.registerProcessor("getCrucible", (req) => this.getCrucible(req));

		this.registerProcessor('getAllCruciblesFromDb', req =>
			this.svc.getAllCruciblesFromDb(req.data.network));

    this.registerProcessor("getUserCrucibleInfo",
		(req, userId) => this.svc.getUserCrucibleInfo(req.data.crucible, userId));

    this.registerProcessor("remainingFromCap", (req) =>
      this.remainingFromCap(req)
    );

    this.registerProcessor("withdrawGetTransaction", (req, userId) =>
      this.withdrawGetTransaction(req, userId)
    );

    this.registerProcessor("deployGetTransaction", (req, userId) =>
      this.deployGetTransaction(req, userId)
    );

    this.registerProcessor("depositAddLiquidityAndStake", (req, userId) =>
      this.depositAddLiquidityAndStake(req, userId)
    );

    this.registerProcessor("stakeForGetTransaction", (req, userId) =>
      this.stakeForGetTransaction(req, userId)
    );
  }

  __name__() {
    return "CrucibleRequestProcessor";
  }

  async getAllocation(req: HttpRequestData) {
    const { crucible, userAddress } = req.data;
    ValidationUtils.isTrue(!!crucible, "crucible must be provided");
    ValidationUtils.isTrue(!!userAddress, "userAddress must be provided");
    return await this.cache.getAsync(
      `ALLOC:${crucible}:${userAddress}`,
      async () => this.svc.getAllocations(crucible, userAddress)
    );
  }

  async depositGetTransaction(req: HttpRequestData, userId: string) {
    const { currency, crucible, amount } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    ValidationUtils.isTrue(!!currency, "currency must be provided");
    ValidationUtils.isTrue(!!crucible, "crucible must be provided");
    ValidationUtils.isTrue(!!amount, "amount must be provided");
    return this.svc.depositGetTransaction(currency, crucible, amount, userId);
  }

  async depositPublicGetTransaction(req: HttpRequestData, userId: string) {
    const { currency, crucible, amount } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    ValidationUtils.isTrue(!!currency, "currency must be provided");
    ValidationUtils.isTrue(!!crucible, "crucible must be provided");
    ValidationUtils.isTrue(!!amount, "amount must be provided");
    return this.svc.depositPublicGetTransaction(
      currency,
      crucible,
      amount,
      userId
    );
  }

  async withdrawGetTransaction(req: HttpRequestData, userId: string) {
    const { currency, crucible, amount } = req.data;
    ValidationUtils.isTrue(!!userId, "user must be signed in");
    ValidationUtils.isTrue(!!currency, "currency must be provided");
    ValidationUtils.isTrue(!!crucible, "crucible must be provided");
    ValidationUtils.isTrue(!!amount, "amount must be provided");
    return this.svc.withdrawGetTransaction(currency, crucible, amount, userId);
  }

  async deployGetTransaction(req: HttpRequestData, userId: string) {
    ValidationUtils.allRequired(
      ["baseCurrency", "feeOnTransfer", "feeOnWithdraw"],
      req
    );
    const { baseCurrency, feeOnTransfer, feeOnWithdraw } = req.data;
    return this.svc.deployGetTransaction(
      userId,
      baseCurrency,
      feeOnTransfer,
      feeOnWithdraw
    );
  }

  async depositAddLiquidityAndStake(req: HttpRequestData, userId: string) {
    ValidationUtils.allRequired(
      [
        "baseCurrency",
        "targetCurrency",
        "baseAmount",
        "targetAmount",
        "crucible",
        "dealine",
      ],
      req
    );
    const {
      baseCurrency,
      targetCurrency,
      baseAmount,
      targetAmount,
      crucible,
      dealine,
    } = req.data;
    return this.svc.depositAddLiquidityAndStake(
      userId,
      baseCurrency,
      targetCurrency,
      baseAmount,
      targetAmount,
      crucible,
      dealine
    );
  }

  async stakeForGetTransaction(req: HttpRequestData, userId: string) {
    ValidationUtils.allRequired(["currency", "stake", "amount"], req);
    const { currency, stake, amount } = req.data;
    return this.svc.stakeForGetTransaction(userId, currency, stake, amount);
  }

  async remainingFromCap(req: HttpRequestData) {
    const { crucible } = req.data;
    ValidationUtils.isTrue(!!crucible, "crucible must be provided");
    return this.svc.remainingFromCap(crucible);
  }

  async getCrucible(req: HttpRequestData) {
    const { crucible } = req.data;
    ValidationUtils.isTrue(!!crucible, "crucible must be provided");
    return this.svc.getCrucibleInfo(crucible);
  }
}
