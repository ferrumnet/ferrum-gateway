import { ApiClient, reConnect } from 'common-containers';
import { StandaloneClient } from 'common-containers/dist/clients/StandaloneClient';
import { StandaloneErc20 } from 'common-containers/dist/clients/StandaloneErc20';
import { CurrencyList } from 'unifyre-extension-web3-retrofit';
import { Container, Module } from 'ferrum-plumbing';
import { QpMinerClient } from '../pages/examples/qpMinerStake/QpMinerClient';

import { QpExplorerClient } from '../QpExplorerClient';
import { QP_CONTRACT_CONFIG } from './Consts';
import { Utils } from 'types';

export class QpUiModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.registerSingleton(QpExplorerClient, c => new QpExplorerClient(c.get(ApiClient)));

            c.registerSingleton(QpMinerClient, c => new QpMinerClient(c.get(StandaloneClient), c.get(StandaloneErc20), QP_CONTRACT_CONFIG));
            await c.get<StandaloneClient>(StandaloneClient).loadBackendConstants();
            console.log('Const', Utils.getBackendConstants());
            const curList = c.get<CurrencyList>(CurrencyList);
            const curs = curList.get();
            curList.set([...curs, 'BASE_MAINNET:BASE']);
        } finally {
            this.configured = true;
        }
    }
}