import { Network, Injectable } from "ferrum-plumbing";
import { PairAddressUtils } from "./common/PairAddressUtils";
import { SignedPairAddress } from "types";

export class PairAddressSignatureVerifyre implements Injectable {
    constructor() {
    }

    __name__() { return 'PairAddressSignatureVerifyre'; }

    verify(pairWithSignature: SignedPairAddress) {
        return  this.verify1(pairWithSignature) && this.verify2(pairWithSignature);
    }

    verify1(pairWithSignature: SignedPairAddress) {
        return PairAddressUtils.verifyPairSignatureForNetwork(pairWithSignature.pair.network1 as Network,
                pairWithSignature.pair, pairWithSignature.signature1);
    }

    verify2(pairWithSignature: SignedPairAddress) {
        return PairAddressUtils.verifyPairSignatureForNetwork(pairWithSignature.pair.network2 as Network,
                pairWithSignature.pair, pairWithSignature.signature2);
    }
}