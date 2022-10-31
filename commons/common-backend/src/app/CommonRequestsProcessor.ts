import { HttpRequestProcessor, UnifyreBackendProxyService } from "aws-lambda-helper";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { CommonTokenServices } from "../contracts/CommonTokenServices";
import { AppConfig } from "./AppConfig";

export class CommonRequestsProcessor extends HttpRequestProcessor implements Injectable {
    constructor(
        private uniBack: UnifyreBackendProxyService,
        private commonTokenServices: CommonTokenServices,
        ) {
        super();

        this.registerProcessor('signInUsingAddress', async req => {
          const { userAddress } = req.data;
          ValidationUtils.isTrue(!!userAddress, '"userAddress" is required');
          const unsecureSession = await this.uniBack.newSession(
            userAddress,
            "24h"
          );
          return { unsecureSession };
        });

        this.registerProcessor('backendConfig', async req => {
          return AppConfig.instance().constants();
        });

        this.registerProcessor('approveAllocationGetTransaction', req => {
            const { userAddress, contractAddress, currency, amount } = req.data;
            ValidationUtils.isTrue(!!userAddress, '"userAddress" must be provided');
            ValidationUtils.isTrue(
                !!contractAddress,
                '"contractAddress" must be provided'
            );
            ValidationUtils.isTrue(!!currency, '"currency" must be provided');
            ValidationUtils.isTrue(!!amount, '"amount" must be provided');
            return this.commonTokenServices.approveGetTransaction(
                userAddress,
                contractAddress,
                currency,
                amount
            );
        });

        this.registerProcessor('getContractAllocation', req => {
          const { userAddress, contractAddress, currency } = req.data;
          ValidationUtils.isTrue(!!userAddress, '"userAddress" must be provided');
          ValidationUtils.isTrue(
            !!contractAddress,
            '"contractAddress" must be provided'
          );
          ValidationUtils.isTrue(!!currency, '"currency" must be provided');
          return this.commonTokenServices.allocation(
            userAddress,
            contractAddress,
            currency
          );
        });
    }

    __name__(): string {
        return 'CommonRequestsProcessor';
    }
}