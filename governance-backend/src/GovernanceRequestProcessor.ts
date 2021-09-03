import { HttpRequestProcessor, HttpRequestData } from "types";
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
}
