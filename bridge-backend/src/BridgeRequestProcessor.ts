import { HttpRequestProcessor } from "types";

export class BridgeRequestProcessor extends HttpRequestProcessor {
    constructor() {
        super()

        this.registerProcessor('withdrawSignedGetTransaction',
            req => this.withdrawSignedGetTransaction(req));
    }

    async withdrawSignedGetTransaction(req: HttpRequestData) {
        const {
            id
        } = req.data;
        return this.svc.withdrawSignedGetTransaction(id, req.userId);
    }
}