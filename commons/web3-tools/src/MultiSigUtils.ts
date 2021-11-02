import { HexString } from "ferrum-plumbing";
import { multiSigToBytes, privateKeyToAddress } from "./Eip712Utils";
import { MultiSignable } from 'types';
import { signWithPrivateKey } from "./Eip712Utils";

export class MultiSigUtils {
	static async signWithPrivateKey<T extends MultiSignable>(privateKey: HexString, hash: HexString, sig: T): Promise<T> {
		const signer = privateKeyToAddress(privateKey);
		const signature = await signWithPrivateKey(privateKey, hash);
		return {...sig, signatures: [...sig.signatures, {
			creationTime: Date.now(),
			creator: signer,
			signature,
		}]};
	}

	static toBytes(sig: MultiSignable): HexString {
		return multiSigToBytes(sig.signatures.map(s => s.signature));
	}
}