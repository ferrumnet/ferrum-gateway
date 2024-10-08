import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { AllocationSignature, UserContractAllocation } from "types";

const ALLOC_FIELDS = [
  "network",
  "contractAddress",
  "method",
  "userAddress",
  "crucible",
  "allocation",
  "expirySeconds",
];

function parseAllocation(allocStr: string): UserContractAllocation | undefined {
  const alloc: UserContractAllocation = {} as any;
	allocStr = allocStr.replace("\r", '');
	const values = allocStr.split(",");
	values.forEach((v, i) => {
			if (values[0] !== 'NETWORK') {
				// @ts-ignore
				alloc[ALLOC_FIELDS[i]] = v;
			}
    });
  alloc.currency = alloc.currency?.indexOf(":")
    ? alloc.currency
    : `${alloc.network}:${alloc.currency}`;
  alloc.network = (alloc.network || '').toUpperCase();
	alloc.contractAddress = (alloc.contractAddress || '').toLowerCase();
	alloc.method = (alloc.method || '').toUpperCase();
	alloc.userAddress = (alloc.userAddress || '').toLowerCase();
	alloc.currency = `${alloc.network}:${(alloc as any).crucible}`;
  alloc.signature = {
    from: alloc.userAddress,
    to: alloc.userAddress,
  } as any as AllocationSignature;
	alloc.expirySeconds = Number(alloc.expirySeconds);
	const now = Math.round(Date.now() / 1000);
	const expired = alloc.expirySeconds < now; // || (now + 3600 * 24 *60)
  return expired ? alloc : undefined;
}

function validateAllocation(alloc: UserContractAllocation) {
	// TODO: Validate the allocation
}

/**
 * Runs allocations based on a csv string.
 */
export class BasicAllocation implements Injectable {
  static EXPIRY_BUFFER_SEC = 300;
  constructor(
    private helper: EthereumSmartContractHelper
  ) {}

  __name__() {
    return "BasicAllocation";
  }

  async parse(allocCsv: string): Promise<UserContractAllocation[]> {
    return allocCsv.split("\n").map(parseAllocation).filter(Boolean).map(v => v!);
  }
}
