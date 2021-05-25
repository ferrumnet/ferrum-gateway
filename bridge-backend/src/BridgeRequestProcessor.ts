import { HttpRequestProcessor,HttpRequestData } from "types";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, JsonRpcRequest, ValidationUtils } from "ferrum-plumbing";
import { TokenBridgeService } from "./TokenBridgeService";
import { BridgeConfigStorage } from './BridgeConfigStorage';

export class BridgeRequestProcessor extends HttpRequestProcessor implements Injectable {
    constructor(
        
    )
     {
        super()

        this.registerProcessor('withdrawSignedGetTransaction',
            req => this.withdrawSignedGetTransaction(req));
    }

    __name__() { return 'BridgeRequestProcessor'; }

    async withdrawSignedGetTransaction(req: HttpRequestData) {
        const {
            id
        } = req.data;
       // return this.svc.withdrawSignedGetTransaction(id, req.userId);
    }
}