import { Injectable, JsonRpcRequest, LocalCache, Network, NetworkedConfig, panick, ValidationUtils } from "ferrum-plumbing";
import { BackendConstants } from "types/dist/models/BackendConstants";
import { logError, Utils } from "types/dist/Utils";
import { AppUserProfile } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { UnifyreExtensionKitClient } from "unifyre-extension-sdk/dist/client/UnifyreExtensionKitClient";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk/dist/common/model/Types";
import { addressForUser } from "../store/AppState";
import { PopulatedTransaction } from 'ethers';
import { Provider, JsonRpcProvider,  } from "@ethersproject/providers";

export interface StandaloneRequestProcessor {
    processor(methodName: string): (req: JsonRpcRequest) => Promise<any>|undefined;
}

export interface GlobalConstants {
    get(): Promise<{ providers: NetworkedConfig<string>, constants: BackendConstants} >;
}

/** 
 * Standalone client, is a replacement for the ApiClient, without backend calls.
 * Our goal is to get to the point where by replacing the ApiClient, with this
 * standalone client, we will be able to make our applications, run directly
 * from browser, and get completely hosted on IPFS.
 **/
export class StandaloneClient implements Injectable {
    private userProfile: AppUserProfile|undefined;
    private address: string = '';
    private network: string = '';
    private providers: NetworkedConfig<string> = {};
    private cache = new LocalCache();
    constructor(
        private requestProcessors: StandaloneRequestProcessor[],
        private globalConstants: GlobalConstants,
        public client: UnifyreExtensionKitClient,
    ) {}
    __name__(): string { return 'StandaloneClient'; }

    getNetwork() { return this.network; }
    getAddress() { return this.address; }
    getProviders() { return this.providers; }

    /**
     * Method for compatibility with ApiClient
     */
    async signInToServer(userProfile: AppUserProfile): Promise<AppUserProfile|undefined> {
        console.log('******* YES CALLED HERE')
        this.userProfile = userProfile;
        const address = addressForUser(userProfile)
        this.address = address!.address;
        this.network = address!.network; 
        return this.userProfile;
    }

    ethersProvider(network: string): Provider {
        ValidationUtils.isTrue(!!network, '"network" is required');
        const p = this.cache.get(network);
        if (!!p) {
            return p;
        }
        const provider = new JsonRpcProvider(this.providers[network] || panick(`No rpc provider is configured for network "${network}"`) as any);
        ValidationUtils.isTrue(!!provider, `Error creating JsonRpcProvider for network "${network}"`);
        this.cache.set(network, provider);
        return provider
    }

    async loadBackendConstants(): Promise<{providers: NetworkedConfig<string>, constants: BackendConstants}> {
        const {providers, constants} = await this.globalConstants.get();
		if (!!constants) {
			Utils.initConstants(constants);
		}
        this.providers = providers;
        return {providers, constants};
    }

    async api(req: JsonRpcRequest): Promise<any> {
        try {
            const processor = this.requestProcessors.map(p => p.processor(req.command)).find(Boolean);
            ValidationUtils.isTrue(!!processor, `No processor was found for RPC command ${req.command}`);
            return await processor!(req);
        } catch (e) {
            logError('Error calling api with ' + JSON.stringify(req), (e as Error));
            throw e;
        }
	}

    async runPopulatedTransaction(t: PopulatedTransaction) {
		ValidationUtils.isTrue(!!this.network, 'Not commected to a network');
		const call = StandaloneClient.populatedTransactionToCallRequest(t);
		const requestId = await this.client.sendTransactionAsync(this.network as Network, [call], {});
		ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
		const txId = requestId.split('|')[0];
		console.log('Generated tx id ', txId);
		return txId;
    }
    
	async runServerTransaction(
		fun: () => Promise<CustomTransactionCallRequest>,
	) {
		ValidationUtils.isTrue(!!this.network, 'Not commected to a network');
		const res = await fun();
		ValidationUtils.isTrue(!!res, 'Error calling server transaction. No requests');
		const requestId = await this.client.sendTransactionAsync(this.network as Network, [res], {});
		ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
		const txId = requestId.split('|')[0];
		console.log('Generated tx id ', txId);
		return txId;
	}

    static populatedTransactionToCallRequest(t: PopulatedTransaction): CustomTransactionCallRequest {
		ValidationUtils.isTrue(!!t, 'no transaction provided');
		return {
			amount: '',
            gas: {} as any,
			// gas: {
			// 	gasLimit: (t.gasLimit || '').toString(),
			// 	gasPrice: (t.gasPrice || '').toString(),
			// } as any,
			contract: t.to,
			currency: '',
			data: t.data,
			from: t.from,
			description: ``,
			nonce: t.nonce,
			value: t.value,
		} as CustomTransactionCallRequest;
    }
}