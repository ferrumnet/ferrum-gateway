import { HttpRequestProcessor, LambdaHttpHandler, LambdaHttpRequest, RequestProcessorFunction,
    RequestProcessorFunctionAuth, LambdaHttpHandlerHelper, LambdaHttpResponse, AuthTokenParser,
    } from "aws-lambda-helper";
import { Injectable, LoggerFactory, JsonRpcRequest, Logger, } from "ferrum-plumbing";


export class CommonRpcHttpHandler implements LambdaHttpHandler, Injectable {
    log: Logger;
    constructor(
        private reqPros: HttpRequestProcessor[],
        private authToken: AuthTokenParser,
        logFac: LoggerFactory,
    ) {
        this.log = logFac.getLogger(CommonRpcHttpHandler);
    }

    __name__(): string { return 'CommonRpcHttpHandler'; }

    async handle(
        request: LambdaHttpRequest,
        context: any
    ): Promise<LambdaHttpResponse> {
        let body: any = undefined;
        const req = JSON.parse(request.body || "{}") as JsonRpcRequest;
        const pre = LambdaHttpHandlerHelper.preProcess(request);
        if (pre.preFlight) {
            return pre.preFlight;
        }
        try {
            const auth = await this.authToken.authTokens(request);
            let processor: RequestProcessorFunction|undefined;
            for(let reqPro of this.reqPros) {
                processor = reqPro.for(req.command);
                if (!!processor) {
                    break;
                }
            }
            let processorAuth: RequestProcessorFunctionAuth|undefined;
            for(let reqPro of this.reqPros) {
                processorAuth = reqPro.forAuth(req.command);
                if (!!processorAuth) {
                    break;
                }
            }

            if (!!processor) {
                body = await processor(req, auth.userId, );
            } else if (!!processorAuth) {
                body = await processorAuth(req, auth);
            } else {
                return {
                    body: JSON.stringify({ error: "bad request" }),
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                    },
                    isBase64Encoded: false,
                    statusCode: 401 as any,
                } as LambdaHttpResponse;
            }

            return {
                body: JSON.stringify(body),
                headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json",
                },
                isBase64Encoded: false,
                statusCode: 200,
            } as LambdaHttpResponse;
        } catch (e) {
            this.log.error(`Error while calling API. Req: \n${JSON.stringify(req)}\n and Error: \n ${(e as Error).toString}`);
            return {
                body: JSON.stringify({ error: (e as Error).toString() }),
                headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json",
                },
                isBase64Encoded: false,
                statusCode: 501 as any,
            } as LambdaHttpResponse;
        }
    }
}