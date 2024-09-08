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

    this.registerProcessor("withdrawStakeGetTransaction", (req, userId) =>
			this.withdrawGetTransaction(req, userId));

    this.registerProcessor("takeRewardsGetTransaction", (req, userId) =>
			this.takeRewardsGetTransaction(req, userId!));
	}

	async stakeInfo(req: HttpRequestData): Promise<any> {
		const {network, stakeType, stakeId,stakingAddress} = req.data;
		ValidationUtils.allRequired({network, stakeType, stakeId,stakingAddress});
		return this.svc.stakeInfo(network, stakeType, stakeId,stakingAddress);
	}

	async userStakeInfo(req: HttpRequestData, userId: string): Promise<any> {
		const {network, stakeType, stakeId,stakingAddress} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired({network, stakeType, stakeId,stakingAddress});
		return this.svc.userStakeInfo(userId, network, stakeType, stakeId,stakingAddress);
	}

	async stakeGetTransaction(req: HttpRequestData, userId: string): Promise<any> {
		const {stakeType, stakeId, currency, amount,stakingAddress} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired({stakeType, stakeId, currency, amount,stakingAddress});
		return this.svc.stakeGetTransaction(userId, stakeType, stakeId, currency, amount,stakingAddress);
	}

	async withdrawGetTransaction(req: HttpRequestData, userId: string): Promise<any> {
		const {stakeType, stakeId, currency, amount,stakingAddress} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired({stakeType, stakeId, currency, amount,stakingAddress});
		return this.svc.withdrawGetTransaction(userId, stakeType, stakeId, currency, amount,stakingAddress);
	}

	async takeRewardsGetTransaction(req: HttpRequestData, userId: string): Promise<any> {
		const {network, stakeType, stakeId,stakingAddress} = req.data;
		ValidationUtils.isTrue(!!userId, 'Not signed in to the backend');
		ValidationUtils.allRequired({network, stakeType, stakeId,stakingAddress});
		return this.svc.takeRewardsGetTransaction(userId, network, stakeType, stakeId,stakingAddress);
	}
}
