import {
    UnifyreBackendProxyModule,
    UnifyreBackendProxyService,
} from 'aws-lambda-helper';
import {HttpHandler} from "./HttpHandler";
import { Container, Module, } from "ferrum-plumbing";
import { BasicHandlerFunction } from 'aws-lambda-helper/dist/http/BasicHandlerFunction';
import { BridgeRequestProcessor } from "bridge-backend/src/BridgeRequestProcessor";
import { BridgeModule } from "bridge-backend";
import { CommonBackendModule } from 'common-backend';

export class GatewayModule implements Module {
    async configAsync(container: Container) {
        await container.registerModule(new CommonBackendModule());
        await container.registerModule(
            new UnifyreBackendProxyModule('DUMMY', 'asd', // stakingAppConfig.authRandomKey,
                '',));
        
        container.registerSingleton('LambdaHttpHandler',
                c => new HttpHandler(
                    c.get(UnifyreBackendProxyService),
                    c.get(BridgeRequestProcessor),
					c.get('MultiChainConfig'),
                    ));
        // Registering other modules at the end, in case they had to initialize database...
        await container.registerModule(new BridgeModule());
    }
}

const handlerClass = new BasicHandlerFunction(new GatewayModule());

export const handler = handlerClass.handler;
