import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';

export class CrucibleModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.register(CrucibleClient, c => new CrucibleClient(c.get(ApiClient)));
        } finally {
            this.configured = true;
        }
    }
}