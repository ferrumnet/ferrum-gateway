import { AuthenticationProvider, Injectable, JsonRpcRequest, Logger, LoggerFactory } from 'ferrum-plumbing';
import { HmacAuthProvider } from "aws-lambda-helper/dist/security/HmacAuthProvider";
import { EcdsaAuthProvider } from "aws-lambda-helper/dist/security/EcdsaAuthProvider";
import { SwapTx, UserBridgeWithdrawableBalanceItem } from 'types';
import fetch from 'cross-fetch';
import { NodeErrorHandling } from '../node/common/NodeErrorHandling';

export class BridgeNodesRemoteAccessClient implements Injectable {
    protected log: Logger;
    constructor(
        protected endpoint: string,
        logFac: LoggerFactory,
    ) {
        this.log = logFac.getLogger(BridgeNodesRemoteAccessClient);
    }

    __name__(): string {
        return 'BridgeNodesRemoteAccessClient';
    }

    async registerWithdrawItem(
        apiPublicKey: string,
        apiSecretKey: string,
        wi: UserBridgeWithdrawableBalanceItem) {
        const req = {
            command: 'registerWithdrawItem',
            data: wi,
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new HmacAuthProvider(
            '', // this.endpoint,
            body,
            Date.now(),
            apiSecretKey,
            apiPublicKey);
        return await this.api(body, auth);
    }

    async getWithdrawItemTransactionIds(
        apiPublicKey: string,
        apiSecretKey: string,
        schemaVersion: string,
        network: string,
        lookBackMillis: number): Promise<string[]> {
        const req = {
            command: 'getWithdrawItemTransactionIds',
            data: {
                schemaVersion,
                network,
                lookBackMillis,
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new HmacAuthProvider(
            '', // this.endpoint,
            body,
            Date.now(),
            apiSecretKey,
            apiPublicKey);
        return await this.api(body, auth);
    }

    async getPendingSwapTxIds(
        apiPublicKey: string,
        apiSecretKey: string,
        network: string): Promise<SwapTx[]> {
        const req = {
            command: 'getPendingSwapTxIds',
            data: {network},
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new HmacAuthProvider(
            '', // this.endpoint,
            body,
            Date.now(),
            apiSecretKey,
            apiPublicKey);
        return await this.api(body, auth);
    }

    async registerWithdrawItemHashVerification(
      privateKey: string,
      signer: string,
      receiveNetwork: string,
      receiveTransactionId: string,
      hash: string,
      signature: string,
      signatrueCreationTime: number,
    ) {
        const req = {
            command: 'registerWithdrawItemHashVerification',
            data: {
                signer,
                receiveNetwork,
                receiveTransactionId,
                hash,
                signature,
                signatrueCreationTime,
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new EcdsaAuthProvider(
            '',
            body,
            Date.now(),
            privateKey,
        );
        return await this.api(body, auth);
    }

    async getPendingWithdrawItems(
        privateKey: string,
        schemaVersion: string,
        network: string,): Promise<UserBridgeWithdrawableBalanceItem[]> {
        const req = {
            command: 'getPendingWithdrawItems',
            data: {
                schemaVersion,
                network,
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new EcdsaAuthProvider(
            '',
            body,
            Date.now(),
            privateKey,
        );
        return await this.api(body, auth);
    }

    async getPendingWithdrawItemById(
        privateKey: string,
        schemaVersion: string,
        network: string,
        receiveTransactionId: string,): Promise<UserBridgeWithdrawableBalanceItem|undefined> {
        const req = {
            command: 'getPendingWithdrawItemById',
            data: {
                schemaVersion,
                network,
                receiveTransactionId,
            },
            params: [],
        } as JsonRpcRequest;
        const body = JSON.stringify(req);
        const auth = new EcdsaAuthProvider(
            '',
            body,
            Date.now(),
            privateKey,
        );
        return await this.api(body, auth);
    }

    protected async api(body: string, auth: AuthenticationProvider) {
        const authHead = auth.asHeader();
        try {
            const res = await fetch(this.endpoint, {
                    method: 'POST',
                    mode: 'cors',
                    body,
                    headers: {
                            'Content-Type': 'application/json',
                            [authHead.key]: authHead.value,
                    },
            });
            const resText = await res.text();
            // console.log('FETCH - IN: ', this.endpoint, body);
            // console.log('FETCH - OUT: ', resText);
            if (Math.round(res.status / 100) === 2) {
                    return resText ? JSON.parse(resText) : undefined;
            }
            const error = resText;
            let jerror: any;
            try {
                    jerror = JSON.parse(error);
            } catch (e) { }
            if (!NodeErrorHandling.ignorableMsg(error)) {
                this.log.error('Server returned an error when calling ' + body + JSON.stringify({
                        status: res.status, statusText: res.statusText, error}), new Error());
            }
            throw new Error(jerror?.error ? jerror.error : error);
        } catch (e) {
            if (!NodeErrorHandling.ignorable(e as Error)) {
                this.log.error('Error calling api with ' + body + ' : ' + (e as Error).toString());
            }
            throw e;
        }
    }
}