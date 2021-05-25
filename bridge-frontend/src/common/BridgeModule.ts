import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';
import { BridgeClient } from '../clients/BridgeClient';
import { Dispatch } from "redux";
import { AnyAction } from '@reduxjs/toolkit';
import { PairAddressService } from '../pairUtils/PairAddressService';
import { PairAddressSignatureVerifyre } from '../pairUtils/PairAddressSignatureVerifyer';
import { Connect, CurrencyList } from 'unifyre-extension-web3-retrofit';
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
            c.register(PairAddressService, c => new PairAddressService(c.get(PairAddressService),c.get(Connect)));
            c.register(PairAddressSignatureVerifyre, c => new PairAddressSignatureVerifyre());

        } finally {
            this.configured = true;
        }
    }

}