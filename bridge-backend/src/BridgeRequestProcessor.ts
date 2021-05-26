import { HttpRequestProcessor,HttpRequestData } from "types";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { TokenBridgeService } from "./TokenBridgeService";
import { BridgeConfigStorage } from './BridgeConfigStorage';

export class BridgeRequestProcessor extends HttpRequestProcessor implements Injectable {
    constructor(
        private svc: TokenBridgeService,
        private bgs: BridgeConfigStorage
    ){
        super()

        this.registerProcessor('withdrawSignedGetTransaction',
            req => this.withdrawSignedGetTransaction(req,req.userId));

        this.registerProcessor('addLiquidityGetTransaction',
            req => this.addLiquidityGetTransaction(req,req.userId!));
        
        this.registerProcessor('removeLiquidityIfPossibleGetTransaction',
            req => this.removeLiquidityIfPossibleGetTransaction(req,req.userId!));
        
        this.registerProcessor('getUserPairedAddress',
            req => this.getUserPairedAddress(req,req.userId!));
        
        this.registerProcessor('getAvaialableLiquidity',
            req => this.getAvailableLiquidity(req));
        
        this.registerProcessor('getTokenAllowance',
            req => this.getLiquidity(req));
        
        this.registerProcessor('getTokenAllowance',
            req => this.getUserWithdrawItems(req,req.userId!));
        
        this.registerProcessor('updateWithdrawItemAddTransaction',
            req => this.updateWithdrawItemAddTransaction(req));
        
        this.registerProcessor('updateUserPairedAddress',
            req => this.updateUserPairedAddress(req));
        
        this.registerProcessor('unpairUserPairedAddress',
            req => this.unpairUserPairedAddress(req));
        
        this.registerProcessor('swapGetTransaction',
            req => this.swapGetTransaction(req,req.userId));
        
        this.registerProcessor('getSourceCurrencies',
            req => this.bgs.getSourceCurrencies(req.data.network));
        
        this.registerProcessor('getGroupInfo',
            req => this.getGroupInfo(req.data.groupId));

    }

    __name__() { return 'BridgeRequestProcessor'; }

  
    async removeLiquidityIfPossibleGetTransaction(req: HttpRequestData, userId: string) {
        const {
            currency, amount
        } = req.data;
        ValidationUtils.isTrue(!!currency, "'currency' must be provided");
        ValidationUtils.isTrue(!!amount, "'amount must be provided");
        return this.svc.removeLiquidityIfPossibleGetTransaction(userId, currency, amount);
    }

    async getLiquidity(req: HttpRequestData) {
        const {
            currency, userAddress
        } = req.data;
        ValidationUtils.isTrue(!!currency, "'currency' must be provided");
        ValidationUtils.isTrue(!!userAddress, "'addres' must be provided");
        return this.svc.getLiquidity(userAddress, currency);
    }

    async getGroupInfo(groupId:string) {
        console.log(this.svc);
        return this.svc.getGroupInfo(groupId);
    }

    async getTokenAllowance(req: HttpRequestData) {
        const {
            currency, userAddress
        } = req.data;
        ValidationUtils.isTrue(!!currency, "'currency' must be provided");
        ValidationUtils.isTrue(!!userAddress, "'addres' must be provided");
        return this.svc.getTokenAllowance(userAddress, currency);
    }

    async getAvailableLiquidity(req: HttpRequestData) {
        const {
            currency, userAddress
        } = req.data;
        ValidationUtils.isTrue(!!currency, "'currency' must be provided");
        ValidationUtils.isTrue(!!userAddress, "'addres' must be provided");
        return this.svc.getAvailableLiquidity(currency);
    }


    async getUserWithdrawItems(req: HttpRequestData, userId: string) {
        const {
            network,
        } = req.data;
        ValidationUtils.isTrue(!!network, "'network' must be provided");
        const items = await this.svc.getUserWithdrawItems(network, userId.toLowerCase());
        return { 'withdrawableBalanceItems': items};
    }

    async updateWithdrawItemAddTransaction(req: HttpRequestData) {
        const {
            id, transactionId,
        } = req.data;
        ValidationUtils.isTrue(!!id, "'id' must be provided");
        ValidationUtils.isTrue(!!transactionId, "'transactionId' must be provided");
        return this.svc.updateWithdrawItemAddTransaction(id, transactionId);
    }

    async getSwapTransactionStatus(req: HttpRequestData) {
        const {
            tid,sendNetwork,timestamp
        } = req.data;
        ValidationUtils.isTrue(!!tid, "tid not found.");
        ValidationUtils.isTrue(!!sendNetwork, "sendNetwork not found.");
        ValidationUtils.isTrue(!!timestamp, "timestamp not found.");
        return this.svc.getSwapTransactionStatus(tid,sendNetwork,timestamp);
    }

    async updateUserPairedAddress(req: HttpRequestData) {
        const {
            pair
        } = req.data;
        ValidationUtils.isTrue(!!pair, "'pair' must be provided");
        return this.svc.updateUserPairedAddress(pair);
    }

    async unpairUserPairedAddress(req: HttpRequestData) {
        const {
            pair
        } = req.data;
        ValidationUtils.isTrue(!!pair, "'pair' must be provided");
        return this.svc.unpairUserPairedAddress(pair);
    }

    async getUserPairedAddress(req: HttpRequestData, userId: string) {
        const {
            network
        } = req.data;
        ValidationUtils.isTrue(!!network, "'network' must be provided");
        return { pairedAddress: await this.svc.getUserPairedAddress(network, userId) };
    }

    async addLiquidityGetTransaction(req: HttpRequestData, userId: string) {
        const {
            currency, amount
        } = req.data;
        ValidationUtils.isTrue(!!currency, "'currency' must be provided");
        ValidationUtils.isTrue(!!amount, "'amount must be provided");
        return this.svc.addLiquidityGetTransaction(userId, currency, amount);
    }

    async withdrawSignedGetTransaction(req: HttpRequestData, userId: string) {
        console.log(req)
        const {
            id
        } = req.data;
        return this.svc.withdrawSignedGetTransaction(id, userId);
    }

    async swapGetTransaction(req: HttpRequestData, userId: string) {
        const {
            currency, amount, targetCurrency
        } = req.data;
        return this.svc.swapGetTransaction(userId, currency, amount, targetCurrency);
    }
}