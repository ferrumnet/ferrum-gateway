import { HttpRequestProcessor, UnifyreBackendProxyService } from "aws-lambda-helper";
import { Injectable, ValidationUtils } from "ferrum-plumbing";

export class CommonRequestsProcessor extends HttpRequestProcessor implements Injectable {
    constructor(
        private uniBack: UnifyreBackendProxyService,) {
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
    }

    __name__(): string {
        return 'CommonRequestsProcessor';
    }
}