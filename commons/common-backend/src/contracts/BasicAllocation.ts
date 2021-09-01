import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { AllocationSignature, UserContractAllocation } from "types";

const ALLOC_FIELDS = [
  "network",
  "contractAddress",
  "method",
  "userAddress",
  "currecy",
  "allocation",
  "expirySeconds",
];

function parseAllocation(allocStr: string): UserContractAllocation {
  const alloc: UserContractAllocation = {} as any;
	allocStr = allocStr.replace("\r", '');
  allocStr
    .toLowerCase()
    .split(",")
    .forEach((v, i) => {
			if (!!ALLOC_FIELDS[0] && ALLOC_FIELDS[0].toUpperCase() !== 'NETWORK') {
				// @ts-ignore
				alloc[ALLOC_FIELDS[i]] = v;
			}
    });
  alloc.currency = alloc.currency?.indexOf(":")
    ? alloc.currency
    : `${alloc.network}:${alloc.currency}`;
  alloc.network = alloc.network?.toUpperCase();
  alloc.signature = {
    from: alloc.userAddress,
    to: alloc.userAddress,
  } as any as AllocationSignature;
	alloc.expirySeconds = Number(alloc.expirySeconds);
	const now = Math.round(Date.now() / 1000);
	ValidationUtils.isTrue(alloc.expirySeconds > now && alloc.expirySeconds < (now + 3600 * 24 *60),
		`Invalid expiry: ${allocStr}`);
  return alloc;
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
    return allocCsv.split("\n").map(parseAllocation).filter(Boolean);
  }
}
