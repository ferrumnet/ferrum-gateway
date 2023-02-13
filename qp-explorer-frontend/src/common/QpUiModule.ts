import { ApiClient, reConnect } from 'common-containers';
import { StandaloneClient } from 'common-containers/dist/clients/StandaloneClient';
import { StandaloneErc20 } from 'common-containers/dist/clients/StandaloneErc20';
import { GitHubConstants } from 'common-containers/dist/clients/GitHubConstants';
import { Container, Module } from 'ferrum-plumbing';
import { QpMinerClient } from '../pages/examples/qpMinerStake/QpMinerClient';
import { QpExplorerClient } from '../QpExplorerClient';
import { QP_CONTRACT_CONFIG } from './Consts';
import { UnifyreExtensionKitClient } from "unifyre-extension-sdk";
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
        } finally {
            this.configured = true;
        }
    }
}