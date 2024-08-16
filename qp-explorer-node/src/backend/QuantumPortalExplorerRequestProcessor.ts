import { HttpRequestProcessor } from "aws-lambda-helper";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { QpNode } from "../node/QpNode";
import { QpExplorerService } from "./QpExplorerService";

export class QuantumPortalExplorerRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
    constructor(
        private svc: QpExplorerService,
        private nodeSvc: QpNode,
    ) {
        super();
        this.registerProcessor('getBackendConstants', () => ({
            providers: {}, constants: {
                bridgeNetworks: ['RINKEBY', 'BSC_TESTNET', 'AVAX_TESTNET', 'FERRUM_TESTNET']
            },
        }) as any);
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
        this.registerProcessor('QpAccount', req =>
            this.svc.account(req.data.address));
        this.registerProcessor('QpAccountTransactions', req =>
            this.svc.accountTransactions(req.data.address, req.data.page, req.data.pageSize));
        this.registerProcessor('QpAccountBalances', req =>
            this.svc.accountBalances(req.data.address));

        this.registerProcessor('CallMethodOnContract', req => {
            ValidationUtils.allRequired(req.data);
                // { network, contract, abi, method, args});
                // ['network', 'contract', 'abi', 'method', 'args'], req.data);
            return this.svc.callMethod(
            req.data.network, req.data.contract, req.data.abi, req.data.method, req.data.args)
        });
        this.registerProcessor('GetMethodTransactionOnContract', req => {
            ValidationUtils.allRequired(req.data);
                // ['network', 'contract', 'abi', 'method', 'args', 'userAddress'], req.data);
            return this.svc.methodGetTransaction(
            req.data.network, req.data.contract, req.data.abi, req.data.method, req.data.args, req.data.userAddress)
        });

        this.registerProcessor('registerQpContract', req => {
            ValidationUtils.allRequired(req.data);
                // ['networks', 'contractAddress'], req.data);
            ValidationUtils.allRequired(req.data.contract);
                // ['contractName', 'sourceName', 'abi', 'bytecode', 'deployedBytecode'], req.data.contract);
            return this.svc.registerQpContract(
                req.data.networks,
                req.data.contractAddress,
                req.data.contract,
            );
        });

        this.registerProcessor('nodeSync', req => {
            ValidationUtils.allRequired(req.data);
                // ['network', 'remoteNetwork'], req.data);
            return this.nodeSvc.process(req.data.network, req.data.remoteNetwork);
        });
    }

    __name__(): string {
        return 'QuantumPortalExplorerRequestProcessor';
    }
}
