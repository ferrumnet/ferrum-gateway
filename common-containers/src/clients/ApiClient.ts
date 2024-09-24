import { Injectable, JsonRpcRequest, Network, NetworkedConfig, ValidationUtils } from "ferrum-plumbing";
import { addressForUser } from "../store/AppState";
import { AppUserProfile } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import fetch from 'cross-fetch';
import { logError, ChainEventBase, UserContractAllocation, TokenDetails, ChainLogos, Utils, BackendConstants } from "types";
import { CustomTransactionCallRequest, UnifyreExtensionKitClient } from "unifyre-extension-sdk";
import Web3 from 'web3'

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
		const res = await this.networkOverrides(requests, '');
        const requestId = await this.sendTransactionAsync( res, {currency, amount, userAddress, contractAddress})
		// const requestId = await this.client.sendTransactionAsync(this.network! as any, res,
		// 	{currency, amount, userAddress, contractAddress});

		ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
        if (!requestId) return ''
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

	private getGasFees = async (network: number) => {
        const response = await fetch(`https://api-gateway-v1.stage.svcs.ferrumnetwork.io/api/v1/gasFees/${network}`)
        if (response.status == 200) {
            const res = await response.json()
            return res.body.gasFees
        }
        return null;
    }


	private networkOverrides = async (transactions: any[], network?: string) => {
        const networks = {
            "ETHEREUM_ARBITRUM": {
                maxFeePerGas: 200000000,
                maxPriorityFeePerGas: 100000000,
                gas: 3500000000,
                gasLimit: 4000000
            },
            "BSC": {
                maxFeePerGas: 3500000000,
                maxPriorityFeePerGas: 3500000000,
                gas: 3500000000,
                gasLimit: 2000000
            },
            "ETHEREUM": {
                maxFeePerGas:1000000000,
                maxPriorityFeePerGas: 650000000,
                gas: 550000000,
                gasLimit: 759900
            }
        }

		const networksMap = {
            "ETHEREUM_ARBITRUM": 42161,
            "BSC": 56,
            "ETHEREUM": 1,
            "POLYGON_MAINNET": 137,
            "POLYGON": 137,
            "AVAX_MAINNET": 43114,
            "AVAX": 43114,
        }

        const res = await Promise.all(transactions.map(
            async (e: any) => {
                
                const network = (e.currency.split(':') || [])[0]
                const chainId = networksMap[network as keyof typeof networksMap]
                //@ts-ignore
                const gasOverride = networks[network as any]
                const gasRes = await this.getGasFees(chainId)
                console.log(network, chainId)
                if (chainId && gasRes) {
                    const gasFee = {
                        gas: gasOverride?.gas,
                        gasLimit: Number(gasRes.gasLimit),
                        maxFeePerGas: Number(gasRes.maxFeePerGas) * 1000000000,
                        maxPriorityFeePerGas: Number(gasRes.maxPriorityFeePerGas) * 1000000000,
                    }
                    e.gas = gasFee;
                    console.log(e, 'ee')
                    return e
                }else {
                    if(network && gasOverride) {
                        e.gas = gasOverride
                        return e
                    }else {
                        return e
                    }
                }               
            }
        ))

        return res;
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

    async sendTransactionAsync(
        payload: any[],
        info: any
    ) {
        try {
            const tx_payload = payload.map(e => {
                return {
                    from: e.from,
                    to: e.contract,
                    data: e.data,
                    value: e.amount ? Web3?.utils.toHex(e.amount) : e.amount
                }
            })
            const txHash = await (window as any).ethereum.request({
                method: "eth_sendTransaction",
                params: tx_payload
            })
            
            if (txHash) {
                return txHash + '|' + JSON.stringify(info || '')
            }
            return ''
        } catch (error) {
        }
    }
}