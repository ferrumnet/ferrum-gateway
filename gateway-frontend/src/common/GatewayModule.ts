import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';
import { GatewayProjectClient } from '../clients/GatewayProjectClient';

export class GatewayModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.register(GatewayProjectClient, c => new GatewayProjectClient(c.get(ApiClient)));
        } finally {
            this.configured = true;
        }
    }
}