import { HttpRequestProcessor,HttpRequestData } from "types";
import { Injectable, LocalCache, ValidationUtils } from "ferrum-plumbing";
import { CrucibeService } from "./CrucibleService";

export class CrucibleRequestProcessor extends HttpRequestProcessor implements Injectable {
	private cache = new LocalCache();
    constructor(
		private svc: CrucibeService,
    ){
        super()

        this.registerProcessor('getAllocation',
            (req) => this.getAllocation(req));

        this.registerProcessor('depositGetTransaction',
            (req, userId) => this.depositGetTransaction(req, userId!));

        this.registerProcessor('depositPublicGetTransaction',
            (req, userId) => this.depositPublicGetTransaction(req, userId!));

        this.registerProcessor('getCrucible',
            (req) => this.getCrucible(req));

        this.registerProcessor('remainingFromCap',
            (req) => this.remainingFromCap(req));

        this.registerProcessor('withdrawGetTransaction',
            (req, userId) => this.withdrawGetTransaction(req, userId));

		this.registerProcessor('deployGetTransaction',
			(req, userId) => this.deployGetTransaction(req, userId));

		this.registerProcessor('depositAddLiquidityAndStake',
			(req, userId) => this.depositAddLiquidityAndStake(req, userId));

		this.registerProcessor('stakeForGetTransaction',
			(req, userId) => this.stakeForGetTransaction(req, userId));
    }

    __name__() { return 'CrucibleRequestProcessor'; }
  
    async getAllocation(req: HttpRequestData) {
        const {
            network, crucible, userAddress
        } = req.data;
        ValidationUtils.isTrue(!!network, 'network must be provided');
        ValidationUtils.isTrue(!!crucible, 'crucible must be provided');
        ValidationUtils.isTrue(!!userAddress, 'userAddress must be provided');
        return await this.cache.getAsync(`ALLOC:${network}:${crucible}:${userAddress}`,
			async () => this.svc.getAllocation(network, crucible, userAddress));
    }

    async depositGetTransaction(req: HttpRequestData, userId: string) {
        const {
            network, currency, crucible, amount,
        } = req.data;
        ValidationUtils.isTrue(!!userId, 'user must be signed in');
        ValidationUtils.isTrue(!!network, 'network must be provided');
        ValidationUtils.isTrue(!!currency, 'currency must be provided');
        ValidationUtils.isTrue(!!crucible, 'crucible must be provided');
        ValidationUtils.isTrue(!!amount, 'amount must be provided');
        return this.svc.depositGetTransaction(network, currency, crucible, amount, userId);
    }

    async depositPublicGetTransaction(req: HttpRequestData, userId: string) {
        const {
            network, currency, crucible, amount,
        } = req.data;
        ValidationUtils.isTrue(!!userId, 'user must be signed in');
        ValidationUtils.isTrue(!!network, 'network must be provided');
        ValidationUtils.isTrue(!!currency, 'currency must be provided');
        ValidationUtils.isTrue(!!crucible, 'crucible must be provided');
        ValidationUtils.isTrue(!!amount, 'amount must be provided');
        return this.svc.depositPublicGetTransaction(network, currency, crucible, amount, userId);
	}

	async withdrawGetTransaction(req: HttpRequestData, userId: string) {
        const {
            network, currency, crucible, amount,
        } = req.data;
        ValidationUtils.isTrue(!!userId, 'user must be signed in');
        ValidationUtils.isTrue(!!network, 'network must be provided');
        ValidationUtils.isTrue(!!currency, 'currency must be provided');
        ValidationUtils.isTrue(!!crucible, 'crucible must be provided');
        ValidationUtils.isTrue(!!amount, 'amount must be provided');
        return this.svc.withdrawGetTransaction(currency, crucible, amount, userId);
	}

	async deployGetTransaction(req: HttpRequestData, userId: string) {
		ValidationUtils.allRequired(['baseCurrency', 'feeOnTransfer', 'feeOnWithdraw',], req);
        const {
			baseCurrency,
			feeOnTransfer,
			feeOnWithdraw,
        } = req.data;
        return this.svc.deployGetTransaction(userId, baseCurrency, feeOnTransfer, feeOnWithdraw);
	}

    async depositAddLiquidityAndStake(req: HttpRequestData, userId: string) {
		ValidationUtils.allRequired(
			['baseCurrency',
			'targetCurrency',
			'baseAmount',
			'targetAmount',
			'crucible',
			'dealine'], req);
        const {baseCurrency,
			targetCurrency,
			baseAmount,
			targetAmount,
			crucible,
			dealine} = req.data;
        return this.svc.depositAddLiquidityAndStake(
			userId,
			baseCurrency,
			targetCurrency,
			baseAmount,
			targetAmount,
			crucible,
			dealine);
	}

    async stakeForGetTransaction(req: HttpRequestData, userId: string) {
		ValidationUtils.allRequired(
			['currency',
			'stake',
			'amount'], req);
        const {currency,
			stake,
			amount } = req.data;
        return this.svc.stakeForGetTransaction(
			userId,
			currency,
			stake,
			amount);
	}

    async remainingFromCap(req: HttpRequestData) {
        const {
            network, crucible,
        } = req.data;
        ValidationUtils.isTrue(!!network, 'network must be provided');
        ValidationUtils.isTrue(!!crucible, 'crucible must be provided');
        return this.svc.remainingFromCap(network, crucible);
	}
	
	async getCrucible(req: HttpRequestData) {
        const {
            network, crucible,
        } = req.data;
        ValidationUtils.isTrue(!!network, 'network must be provided');
        ValidationUtils.isTrue(!!crucible, 'crucible must be provided');
        return this.svc.getCrucibleInfo(network, crucible);
	}
}