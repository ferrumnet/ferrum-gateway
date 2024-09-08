import { HttpRequestData, HttpRequestProcessor } from "aws-lambda-helper";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { GovernanceService } from "./GovernanceService";

export class GovernanceRequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
  constructor(private svc: GovernanceService) {
    super();

    this.registerProcessor("listContracts",
			(req) => this.svc.listContracts());
		
		this.registerProcessor('contractById',
			(req) => this.contractById(req));

		this.registerProcessor('archiveTransaction',
			(req, userId) => this.archiveTransaction(req, userId));

		this.registerProcessor('proposeTransaction',
			(req, userId) => this.proposeTransaction(req, userId));

		this.registerProcessor('addSignature',
			(req, userId) => this.addSignature(req, userId));

    this.registerProcessor("listTransactions",
			(req, userId) => this.listTransactions(req, userId));

    this.registerProcessor("getSubscription",
			(req, userId) => this.getSubscription(req, userId));

    this.registerProcessor("submitRequestGetTransaction",
			(req, userId) => this.submitRequestGetTransaction(req, userId));

    this.registerProcessor("updateTransacionsForRequest",
			(req, userId) => this.updateTransacionsForRequest(req, userId));
  }

  __name__() {
    return "GovernanceRequestProcessor";
  }

  async contractById(req: HttpRequestData) {
    const { network, contractAddress, id } = req.data;
    ValidationUtils.allRequired({ network, contractAddress, id });
    return this.svc.contractById(network, contractAddress, id);
  }

  async archiveTransaction(req: HttpRequestData, userId: string) {
    const { requestId, signature, } = req.data;
    ValidationUtils.allRequired({ requestId, signature, });
    return this.svc.archiveTransaction(userId, requestId, signature);
  }

  async proposeTransaction(req: HttpRequestData, userId: string) {
    const { 
			network,
			contractAddress,
			governanceContractId,
			method,
			args,
      metadata,
			signature,
	} = req.data;
    ValidationUtils.allRequired({ 
			network,
			contractAddress,
			governanceContractId,
			method,
			args,
      metadata,
			signature,
	});
    return this.svc.proposeTransaction(network, contractAddress, governanceContractId, method, args, metadata, userId, signature);
  }

  async addSignature(req: HttpRequestData, userId: string) {
    const { requestId, signature, metadata} = req.data;
    ValidationUtils.allRequired({ requestId, signature, metadata});
    return this.svc.addSignature(userId, requestId, signature, metadata);
  }

  async listTransactions(req: HttpRequestData, userId: string) {
    const { network, contractAddress } = req.data;
    ValidationUtils.allRequired({ network, contractAddress });
    return this.svc.listTransactions(network, contractAddress);
  }

  async getSubscription(req: HttpRequestData, userId: string) {
    const { network, contractAddress } = req.data;
    ValidationUtils.allRequired({ network, contractAddress });
    return this.svc.getSubscription(network, contractAddress, userId);
  }

  async submitRequestGetTransaction(req: HttpRequestData, userId: string) {
    const { requestId } = req.data;
    ValidationUtils.allRequired({ requestId });
    return this.svc.submitRequestGetTransaction(userId, requestId);
  }

  async updateTransacionsForRequest(req: HttpRequestData, userId: string) {
    const { requestId, transactionId } = req.data;
    ValidationUtils.allRequired({ requestId, transactionId });
    return this.svc.updateTransacionsForRequest(requestId, transactionId);
  }
}
