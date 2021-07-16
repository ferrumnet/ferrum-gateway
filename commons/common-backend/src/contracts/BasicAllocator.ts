import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { HexString, ValidationUtils } from "ferrum-plumbing";
import { AllocationSignature, UserContractAllocation } from "types";
import { AllocatableContract } from "./AllocatableContract";

const ALLOC_FIELDS = [
	'network',
	'contractAddress',
	'methodSelector',
	'userAddress',
	'currecy',
	'allocation',
	'expirySeconds'
];

function parseAllocation(allocStr: string) {
	const alloc : UserContractAllocation = {} as any;
	allocStr.toLowerCase().split(',').forEach((v, i) => {
		// @ts-ignore
		alloc[ALLOC_FIELDS[i]] = v });;
	alloc.currency = alloc.currency?.indexOf(':') ?
		alloc.currency : `${alloc.network}:${alloc.currency}`;
	alloc.network = alloc.network?.toUpperCase();
	alloc.signature = {
		from: alloc.userAddress,
		to: alloc.userAddress,
	} as any as AllocationSignature;
	return alloc;
}

/**
 * Runs allocations based on a csv string.
 */
export class BasicAllocator {
	static EXPIRY_BUFFER_SEC = 300;
	constructor(
		private contract: AllocatableContract,
		private helper: EthereumSmartContractHelper,
	) {}

	async parse(allocCsv: string): Promise<UserContractAllocation[]> {
		return allocCsv.split('\n').map(parseAllocation).filter(Boolean);
	}

	async sign(
		allocator: string,
		contractName: string,
		contractVersion: string,
		allocation: UserContractAllocation,
		salt: string,
		signer: (msg: HexString) => Promise<HexString>):
	Promise<UserContractAllocation> {
		const allocationAmount = await this.helper.amountToMachine(allocation.currency, allocation.allocation);
		ValidationUtils.isTrue(
			allocation.expirySeconds > (Date.now() / 1000 - BasicAllocator.EXPIRY_BUFFER_SEC) ,
			'Allocation alerady expired or expiry is too close');
		const hash = await this.contract.produceHash(
			contractName,
			contractVersion,
			allocation.contractAddress,
			allocation.methodSelector,
			allocation.currency,
			allocation.userAddress,
			allocation.userAddress,
			allocationAmount,
			allocation.expirySeconds,
			salt,);
		ValidationUtils.isTrue(!!hash.hash, "Could not create allocation hash");
		const signature = await signer(hash.hash!);
		hash.signature = signature;
		allocation.signature = {
			allocator,
			from: allocation.userAddress,
			issuedAt: Date.now(),
			salt,
			signature,
			expirySeconds: allocation.expirySeconds,
			to: allocation.userAddress,
		} as AllocationSignature;
		return allocation;
	}
}