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
    const { id } = req.data;
    ValidationUtils.isTrue(!!id, "id must be provided");
    return this.svc.contractById(id);
  }

  async archiveTransaction(req: HttpRequestData, userId: string) {
    const { requestId, signature, } = req.data;
    ValidationUtils.allRequired(['requestId', 'signature'], req.data);
    return this.svc.archiveTransaction(userId, requestId, signature);
  }

  async proposeTransaction(req: HttpRequestData, userId: string) {
    const { 
			network,
			contractAddress,
			governanceContractId,
			method,
			args,
			signature,
	} = req.data;
    ValidationUtils.allRequired([
			'network',
			'contractAddress',
			'governanceContractId',
			'method',
			'args',
			'signature',], req.data);
    return this.svc.proposeTransaction(network, contractAddress, governanceContractId, method, args, userId, signature);
  }

  async addSignature(req: HttpRequestData, userId: string) {
    const { requestId, signature} = req.data;
    ValidationUtils.allRequired(['requestId', 'signature'], req.data);
    return this.svc.addSignature(userId, requestId, signature);
  }

  async listTransactions(req: HttpRequestData, userId: string) {
    const { network, contractAddress } = req.data;
    ValidationUtils.allRequired(['network', 'contractAddress'], req.data);
    return this.svc.listTransactions(userId, network, contractAddress);
  }

  async getSubscription(req: HttpRequestData, userId: string) {
    const { network, contractAddress } = req.data;
    ValidationUtils.allRequired(['network', 'contractAddress'], req.data);
    return this.svc.getSubscription(network, contractAddress, userId);
  }

  async submitRequestGetTransaction(req: HttpRequestData, userId: string) {
    const { requestId } = req.data;
    ValidationUtils.allRequired(['requestId'], req.data);
    return this.svc.submitRequestGetTransaction(userId, requestId);
  }

  async updateTransacionsForRequest(req: HttpRequestData, userId: string) {
    const { requestId, transactionId } = req.data;
    ValidationUtils.allRequired(['requestId'], req.data);
    return this.svc.updateTransacionsForRequest(requestId, transactionId);
  }
}
