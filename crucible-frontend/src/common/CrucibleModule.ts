import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';
import { CrucibleClient } from './CrucibleClient';
import { StakingClient } from '../staking/StakingClient';

export class CrucibleModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.registerSingleton(CrucibleClient, c => new CrucibleClient(c.get(ApiClient)));
            c.registerSingleton(StakingClient, c => new StakingClient(c.get(ApiClient)));
        } finally {
            this.configured = true;
        }
    }
}