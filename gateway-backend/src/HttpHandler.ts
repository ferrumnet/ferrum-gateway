import {LambdaHttpRequest, LambdaHttpResponse, UnifyreBackendProxyService} from "aws-lambda-helper";
import {LambdaHttpHandler, LambdaHttpHandlerHelper } from "aws-lambda-helper/dist/HandlerFactory";
import {
    JsonRpcRequest,
    ValidationUtils
} from "ferrum-plumbing";
import { ChainEventBase } from 'types';
import { BridgeRequestProcessor } from "bridge-backend/src/BridgeRequestProcessor";

export class HttpHandler implements LambdaHttpHandler {
    // private adminHash: string;
    constructor(private uniBack: UnifyreBackendProxyService,
            private bridgeProcessor: BridgeRequestProcessor,// BridgeRequestProcessor,
        ) {
        // this.adminHash = Web3.utils.sha3('__ADMIN__' + this.adminSecret)!;
    }

    async handle(request: LambdaHttpRequest, context: any): Promise<LambdaHttpResponse> {
        let body: any = undefined;
        const req = JSON.parse(request.body || '{}') as JsonRpcRequest;
        const pre = LambdaHttpHandlerHelper.preProcess(request);
        if (pre.preFlight) {
            return pre.preFlight;
        }
        const jwtToken = pre.authToken;
        const userId = jwtToken ? (await this.uniBack.signInUsingToken(jwtToken)) : undefined;
        try {
            switch (req.command) {
                case 'signInUsingAddress':
                    let {userAddress} = req.data;
                    const unsecureSession = await this.uniBack.newSession(userAddress);
                    body = {unsecureSession};
                    break;
                case 'signInAdmin':
                    let {secret} = req.data;
                    const resp = await this.signInAdmin(secret);
                    body = {session: resp}
                    break;
                case 'updateChainEvents':
                    ValidationUtils.isTrue(!!userId, '"userId" os requried');
                    body = await this.updateChainEvents(userId, req);
                    break;
                case 'getHttpProviders':
                    body = {}; //this.networkConfig;
                    break;
                case 'getUserProjects':
                    ValidationUtils.isTrue(!!userId, 'User must be signed in');
                    body = await this.getUserProfile(req, userId);
                    break;
                case 'getProjects':
                    body = await this.getProjects(req);
                    break;
                case 'getProjectById':
                    body = await this.getProjectById(req, userId);
                    break;
                default:
                    let processor = this.bridgeProcessor.for(req.command);
                    if (!!processor) {
                        ValidationUtils.isTrue(!!userId, 'user must be signed in');
                        body = await processor(req,userId);
                    } else {
                        return {
                            body: JSON.stringify({error: 'bad request'}),
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                            },
                            isBase64Encoded: false,
                            statusCode: 401 as any,
                        } as LambdaHttpResponse;
                    }
            }
            return {
                body: JSON.stringify(body),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json',
                },
                isBase64Encoded: false,
                statusCode: 200,
            } as LambdaHttpResponse;
        } catch (e) {
            console.error('Error while calling API', req, e);
            return {
                body: JSON.stringify({error: e.toString()}),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json',
                },
                isBase64Encoded: false,
                statusCode: 501 as any,
            } as LambdaHttpResponse;
        }
    }

    async getProjectById(req: JsonRpcRequest, userId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getUserProfile(req: JsonRpcRequest, userId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getProjects(req: JsonRpcRequest): Promise<any> {
        throw new Error("Method not implemented.");
    }

    signInAdmin(secret?: string): undefined | string {
        // if(secret === this.adminSecret){
        //     return this.uniBack.newSession(this.adminHash);
        // }
        return
    }

    /**
     * This command is to monitor user events, for example, stake, unstake, etc.
     * General transactions such as approvals, can also be monitored and stored for the users
     * future reference. 
     */
    async updateChainEvents(userId: string, req: JsonRpcRequest): Promise<ChainEventBase> {
        const { eventType, events } = req.data;
        ValidationUtils.allRequired(['eventType', 'events'], req.data);
        switch(eventType) {
            case 'transaction':
                // TODO: Code to update a specific transaction, and save it back to database
            case 'stakeEvent':
                // TODO: Update the specific stake event...
            default:
                throw new Error('Unsupported event type ' + eventType);
        }
    }
}
