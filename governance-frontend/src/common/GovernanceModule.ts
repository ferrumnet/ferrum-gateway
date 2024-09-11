import { Container, Module } from 'ferrum-plumbing';
import { ApiClient } from 'common-containers';
import { GovernanceClient } from '../GovernanceClient';
import { Connect } from 'unifyre-extension-web3-retrofit';
import { IronSafeClient } from '../pages/examples/IronSafe/IronSafeClient';
import { StandaloneClient } from 'common-containers/dist/clients/StandaloneClient';
import { CurrencyList } from 'unifyre-extension-web3-retrofit';

export class GovernanceModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.register(GovernanceClient,
							c => new GovernanceClient(c.get(ApiClient), c.get(Connect)));
            c.register(IronSafeClient,
                            c => new IronSafeClient(c.get(StandaloneClient)));
            await c.get<StandaloneClient>(StandaloneClient).loadBackendConstants();
	        const curList = c.get<CurrencyList>(CurrencyList);
            const curs = curList.get();
            curList.set([...curs, 'BASE_MAINNET:BASE']);
        } finally {
            this.configured = true;
        }
    }
}