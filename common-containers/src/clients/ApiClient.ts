import { Injectable, JsonRpcRequest, Network, NetworkedConfig, ValidationUtils } from "ferrum-plumbing";
import { addressForUser } from "../store/AppState";
import { AppUserProfile } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import fetch from 'cross-fetch';
import { logError, ChainEventBase, UserContractAllocation, TokenDetails, ChainLogos, Utils, BackendConstants } from "types";
import { CustomTransactionCallRequest, UnifyreExtensionKitClient } from "unifyre-extension-sdk";

export class ApiClient implements Injectable {
    private jwtToken: string = '';
    private address: string = '';
    private network: string = '';
    constructor(private baseUrl: string,
        public client: UnifyreExtensionKitClient
		) { }

    __name__() { return 'ApiClient'; }
    
    async signInToServer(userProfile: AppUserProfile): Promise<AppUserProfile|undefined> {
        ValidationUtils.isTrue(!!userProfile, '"userProfile" must be provided');
        const address = addressForUser(userProfile);
        ValidationUtils.isTrue(!!address, 'User must have a valid "address"');
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

	async getUserEvents(application: string) {
        ValidationUtils.isTrue(!!this.getAddress(), 'must be signed in');
        ValidationUtils.isTrue(!!application, 'application must be provided');
        const res = await this.api({
            command: 'getUserEvents', data: {userAddress: this.getAddress(), application}, params: [] } as JsonRpcRequest);
        return res;
	}

    async updateChainEvents(eventType: string, events: {network: Network, id: string}[]):
    Promise<ChainEventBase> {
        ValidationUtils.isTrue(!!this.getAddress(), 'must be signed in');
        const res = await this.api({
            command: 'updateChainEvents', data: {eventType, events}, params: [] } as JsonRpcRequest);
        return res;
    }

    async updateChainEvent(event: ChainEventBase):
    Promise<ChainEventBase> {
        ValidationUtils.isTrue(!!this.getAddress(), 'must be signed in');
        const res = await this.api({
            command: 'updateChainEvent', data: {event}, params: [] } as JsonRpcRequest);
        return res;
    }

    async loadBackendConstants(): Promise<{providers: NetworkedConfig<string>, constants: BackendConstants}> {
        let { providers, constants } = (await this.api({
            command: 'getBackendConstants', data: {},
            params: []}as JsonRpcRequest)) as { providers: any, constants: BackendConstants } || {};
        if (!providers) {
            throw new Error('getHttpProviders returned empty');
        }
		if (!!constants) {
			Utils.initConstants(constants);
		}
        return {providers, constants};
    }

	async getContractAllocation(userAddress: string, contractAddress: string, currency: string)
	: Promise<UserContractAllocation> {
		return this.api({
            command: 'getContractAllocation', data: {userAddress, contractAddress, currency},
			params: [] } as JsonRpcRequest);
	}

	async setContractAllocation(userAddress: string, contractAddress: string, currency: string, amount?: string)
	: Promise<string> {
		const requests = await this.api({
			command: 'approveAllocationGetTransaction',
			data: {currency, amount: amount || '1', userAddress, contractAddress}, params: [] } as JsonRpcRequest);
		console.log('REQ ISO ', requests)
		ValidationUtils.isTrue(!!requests && !!requests.length, 'Error calling approve. No requests');
		console.log('About to submit request', {requests});
		const requestId = await this.client.sendTransactionAsync(this.network! as any, requests,
			{currency, amount, userAddress, contractAddress});

		ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
		return requestId.split('|')[0]; // Convert the requestId to transction Id. TODO: Do this a better way
	}

	async chainLogos(): Promise<{[n: string]: ChainLogos}> {
		try {
			return await this.api({command: 'chainLogos', data: {}, params: [] } as JsonRpcRequest);
		} catch (e) {
			console.error('Error getting chainLogos ', e);
			return {};
		}
	}

	async tokenList(): Promise<TokenDetails[]> {
		try {
			return await this.api({command: 'tokenList', data: {}, params: [] } as JsonRpcRequest);
		} catch (e) {
			console.error('Error getting tokenList ', e);
			return [];
		}
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
					logError('Error calling api with ' + JSON.stringify(req), (e as Error));
					throw e;
			}
	}

	async runServerTransaction(
		fun: () => Promise<CustomTransactionCallRequest>,
	) {
		ValidationUtils.isTrue(!!this.network, 'Not commected to a network');
		const res = await fun();
		ValidationUtils.isTrue(!!res, 'Error calling deposit. No requests');
		const requestId = await this.client.sendTransactionAsync(this.network as Network, [res], {});
		ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
		const txId = requestId.split('|')[0];
		console.log('Deposit generated tx id ', txId);
		return txId;
	}
}