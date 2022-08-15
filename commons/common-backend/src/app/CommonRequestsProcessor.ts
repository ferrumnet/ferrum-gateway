import { HttpRequestProcessor, UnifyreBackendProxyService } from "aws-lambda-helper";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { AppConfig } from "./AppConfig";

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

        this.registerProcessor('backendConfig', async req => {
          return AppConfig.instance().constants();
        })
    }

    __name__(): string {
        return 'CommonRequestsProcessor';
    }
}