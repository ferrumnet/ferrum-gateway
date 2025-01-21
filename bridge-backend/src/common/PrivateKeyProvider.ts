import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";
import { CreateNewAddressFactory } from "ferrum-chain-clients";
import { Injectable, ValidationUtils, HexString } from "ferrum-plumbing";
import { ethers } from "ethers";
import { Ecdsa } from "ferrum-crypto";

export class PrivateKeyProvider implements Injectable {
    private _address?: string;
    private _localPrivateKey: string;
    constructor(
		private doubleEncryptedData: DoubleEncryptiedSecret,
    ) {
    }

    __name__(): string { return 'PrivateKeyProvider'; }

    privateKey(): string {
        return this._localPrivateKey || this.doubleEncryptedData.secret();
    }

    async address(): Promise<string> {
        if (!this._address) {
            const addr = await new CreateNewAddressFactory()
                .create('ETHEREUM').addressFromSk(this.privateKey());
            ValidationUtils.isTrue(!!addr && !!addr.address, 'Error getting the address from sk');
            this._address = addr.address;
        }
        return this._address!;
    }

    sign(msg: HexString): HexString {
        let k = new ethers.utils.SigningKey(Buffer.from(this.privateKey().replace("0x", ""), 'hex'));
        const sig = k.signDigest(Buffer.from(msg, 'hex'));
        return sig.r.replace("0x", "") + sig.s.replace("0x", "") + sig.v.toString(16);
        // return Ecdsa.sign(this.privateKey(), msg);
    }

    overridePrivateKey(sk: string) {
        this._localPrivateKey = sk;
    }
}