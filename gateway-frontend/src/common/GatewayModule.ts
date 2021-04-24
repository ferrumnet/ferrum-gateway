import { Container, Module } from 'ferrum-plumbing';

export class GatewayModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            console.log('MODULE CALLED!')
        } finally {
            this.configured = true;
        }
    }
}