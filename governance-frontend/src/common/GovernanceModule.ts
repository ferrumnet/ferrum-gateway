import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';
import { GovernanceClient } from '../GovernanceClient';

export class GovernanceModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.register(GovernanceClient, c => new GovernanceClient(c.get(ApiClient)));
        } finally {
            this.configured = true;
        }
    }
}