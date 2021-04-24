import { Injectable, JsonRpcRequest, ValidationUtils } from "ferrum-plumbing";
import { addressForUser } from "../store/AppState";
import { AppUserProfile } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import fetch from 'cross-fetch';
import { logError } from "types";

export class ApiClient implements Injectable {
    private jwtToken: string = '';
    private address: string = '';
    private network: string = '';
    constructor(private baseUrl: string) { }

    __name__() { return 'ApiClient'; }
    
    async signInToServer(userProfile: AppUserProfile): Promise<AppUserProfile|undefined> {
        ValidationUtils.isTrue(!!userProfile, '"userProfile" must be provided');
        const address = addressForUser(userProfile);
        ValidationUtils.isTrue(!!address, 'User must have a valid "address"');
        console.log('GETTING USER PROF')
        const userAddress = address!.address;
        const network = address!.network;
        const res = await this.api({
            command: 'signInUsingAddress', data: {userAddress}, params: [] } as JsonRpcRequest);
        const { unsecureSession } = res;
        if (!unsecureSession) {
            throw new Error('Could not connect to backend');
        }
        this.address = userAddress;
        this.network = network;
        this.jwtToken = unsecureSession;
        return res;
    }

    getNetwork() { return this.network; }
    getAddress() { return this.address; }

    async loadHttpProviders(): Promise<any> {
        let providers = (await this.api({
            command: 'getHttpProviders', data: {},
            params: []}as JsonRpcRequest)) as any;
        if (!providers) {
            throw new Error('getHttpProviders returned empty');
        }
        return providers;
    }

    async api(req: JsonRpcRequest): Promise<any> {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(req),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.jwtToken}`
                },
            });
            const resText = await res.text();
            if (Math.round(res.status / 100) === 2) {
                return resText ? JSON.parse(resText) : undefined;
            }
            const error = resText;
            let jerror: any;
            try {
                jerror = JSON.parse(error);
            } catch (e) { }
            logError('Server returned an error when calling ' + req + JSON.stringify({
                status: res.status, statusText: res.statusText, error}), new Error());
            throw new Error(jerror?.error ? jerror.error : error);
        } catch (e) {
            logError('Error calling api with ' + JSON.stringify(req), e);
            throw e;
        }
    }
}