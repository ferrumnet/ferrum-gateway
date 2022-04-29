import { ApiClient } from 'common-containers';
import { Container, Module } from 'ferrum-plumbing';
import { QpExplorerClient } from '../QpExplorerClient';

export class QpUiModule implements Module {
    private configured: boolean = false;
    async configAsync(c: Container): Promise<void> {
        if (this.configured) { return; }
        try {
            c.registerSingleton(QpExplorerClient, c => new QpExplorerClient(c.get(ApiClient)));
        } finally {
            this.configured = true;
        }
    }
}