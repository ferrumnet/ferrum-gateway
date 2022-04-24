import { HttpRequestProcessor, LambdaHttpHandler, LambdaHttpRequest, RequestProcessorFunction,
    RequestProcessorFunctionAuth, LambdaHttpHandlerHelper, LambdaHttpResponse, AuthTokenParser,
    } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LoggerFactory, JsonRpcRequest, } from "ferrum-plumbing";
import { QpExplorerNodeConfig } from "../QpExplorerNodeConfig";
import { QpExplorerService } from "./QpExplorerService";

export class QuantumPortalExplorerRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
    constructor(
        private svc: QpExplorerService,
    ) {
        super();
        this.registerProcessor('QpRecentBlocks', req =>
            this.svc.recentBlocks(req.data.page || 0, req.data.pageSize || 40));
        this.registerProcessor('QpRecentTxs', req => 
            this.svc.recentTxs(req.data.page || 0, req.data.pageSize || 40));
        this.registerProcessor('QpBlockByHash', req =>
            this.svc.blockByHash(req.data.network, req.data.blockHash));
        this.registerProcessor('QpBlockTxs', req =>
            this.svc.blockTxs(req.data.network, req.data.blockHash));
        this.registerProcessor('QpTx', req =>
            this.svc.tx(req.data.network, req.data.txId));
    }

    __name__(): string {
        return 'QuantumPortalExplorerRequestProcessor';
    }
}
