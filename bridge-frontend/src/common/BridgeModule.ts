import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';
import { BridgeClient } from '../clients/BridgeClient';
import { PairAddressService } from '../pairUtils/PairAddressService';
import { PairAddressSignatureVerifyre } from '../pairUtils/PairAddressSignatureVerifyer';
import { Connect } from 'unifyre-extension-web3-retrofit';
import { UnifyreExtensionKitClient } from "unifyre-extension-sdk";

export class BridgeModule implements Module {
    private configured: boolean = false;
    private static _container: Container;

    async configAsync(c: Container): Promise<void> {        
        if (this.configured) { return; }
        try {
            c.register(BridgeClient, c => new BridgeClient(
                c.get(ApiClient),c.get(UnifyreExtensionKitClient)
            ));
            c.register(PairAddressService, c => new PairAddressService(c.get(UnifyreExtensionKitClient),c.get(Connect)));
            c.register(PairAddressSignatureVerifyre, c => new PairAddressSignatureVerifyre());

        } finally {
            this.configured = true;
        }
    }

}