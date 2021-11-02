import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';
import { GovernanceClient } from '../GovernanceClient';
import { Connect } from 'unifyre-extension-web3-retrofit';

export class GovernanceModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.register(GovernanceClient,
							c => new GovernanceClient(c.get(ApiClient), c.get(Connect)));
        } finally {
            this.configured = true;
        }
    }
}