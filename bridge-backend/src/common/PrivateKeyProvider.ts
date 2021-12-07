import { DoubleEncryptiedSecret } from "aws-lambda-helper/dist/security/DoubleEncryptionService";
import { CreateNewAddressFactory } from "ferrum-chain-clients";
import { Network, Injectable, ValidationUtils, HexString } from "ferrum-plumbing";
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
        if (!this.address) {
            const addr = await new CreateNewAddressFactory()
                .create('ETHEREUM').addressFromSk(this.privateKey());
            ValidationUtils.isTrue(!!addr && !!addr.address, 'Error getting the address from sk');
            this._address = addr.address;
        }
        return this._address!;
    }

    sign(msg: HexString): HexString {
        return Ecdsa.sign(this.privateKey(), msg);
    }

    overridePrivateKey(sk: string) {
        this._localPrivateKey = sk;
    }
}