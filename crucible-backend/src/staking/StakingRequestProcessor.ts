import { HttpRequestData, HttpRequestProcessor } from "aws-lambda-helper";
import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { StakingService } from "./StakingService";

export class StakingRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
	__name__() { return 'StakingRequestProcessor'; }

  constructor(private svc: StakingService) {
    super();

    this.registerProcessor("stakeInfo", (req) => this.stakeInfo(req));

    this.registerProcessor("userStakeInfo", (req, userId) => this.userStakeInfo(req, userId!));

    this.registerProcessor("stakeGetTransaction", (req, userId) =>
			this.stakeGetTransaction(req, userId));

    this.registerProcessor("withdrawGetTransaction", (req, userId) =>
			this.withdrawGetTransaction(req, userId));

    this.registerProcessor("takeRewardsGetTransaction", (req, userId) =>
			this.takeRewardsGetTransaction(req, userId!));
	}

	async stakeInfo(req: HttpRequestData): Promise<any> {
		const {network, stakeType, stakeId} = req.data;
		ValidationUtils.allRequired(['network', 'stakeType', 'stakeId'], req.data);
		return this.svc.stakeInfo(network, stakeType, stakeId);
	}

	async userStakeInfo(req: HttpRequestData, userId: string): Promise<any> {
		const {network, stakeType, stakeId} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired(['network', 'stakeType', 'stakeId'], req.data);
		return this.svc.userStakeInfo(userId, network, stakeType, stakeId);
	}

	async stakeGetTransaction(req: HttpRequestData, userId: string): Promise<any> {
		const {stakeType, stakeId, currency, amount} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired(['stakeType', 'stakeId', 'currency', 'amount'], req.data);
		return this.svc.stakeGetTransaction(userId, stakeType, stakeId, currency, amount);
	}

	async withdrawGetTransaction(req: HttpRequestData, userId: string): Promise<any> {
		const {stakeType, stakeId, currency, amount} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired(['stakeType', 'stakeId', 'currency', 'amount'], req.data);
		return this.svc.withdrawGetTransaction(userId, stakeType, stakeId, currency, amount);
	}

	async takeRewardsGetTransaction(req: HttpRequestData, userId: string): Promise<any> {
		const {network, stakeType, stakeId} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired(['network', 'stakeType', 'stakeId'], req.data);
		return this.svc.takeRewardsGetTransaction(userId, network, stakeType, stakeId);
	}
}
