
export interface HttpRequestData {
    command: string;
    data: any;
    userId?: string;
}

export type RequestProcessorFunction = (req: HttpRequestData, userId?:string) => Promise<any>
export type RequestProcessorMap = { [k: string]: RequestProcessorFunction };

export abstract class HttpRequestProcessor {
    private processor: RequestProcessorMap = {};
    protected registerProcessor(command: string, fun: RequestProcessorFunction) {
        this.processor[command] = fun;
    }

    for(command: string): RequestProcessorFunction|undefined {
        return this.processor[command];
    }
}