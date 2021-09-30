import { Injectable, JsonRpcRequest, Network, ValidationUtils, sleep } from "ferrum-plumbing";
import { ApiClient } from 'common-containers';
import { AnyAction, Dispatch } from "redux";
import { UnifyreExtensionKitClient } from "unifyre-extension-sdk";
import { UserBridgeWithdrawableBalanceItem ,logError, SignedPairAddress, Utils, GroupInfo } from "types";
import { CommonActions,addAction } from './../common/Actions';

export const TokenBridgeClientActions = {
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    BRIDGE_ADDING_TRANSACTION_FAILED: 'BRIDGE_ADDING_TRANSACTION_FAILED',
    BRIDGE_BALANCE_ITEM_UPDATED: 'BRIDGE_BALANCE_ITEM_UPDATED',
    BRIDGE_BALANCE_ITEMS_RECEIVED: 'BRIDGE_BALANCE_ITEMS_RECEIVED',
    BRIDGE_LIQUIDITY_FOR_USER_LOADED: 'BRIDGE_LIQUIDITY_FOR_USER_LOADED',
    BRIDGE_LIQUIDITY_PAIRED_ADDRESS_RECEIVED: 'BRIDGE_LIQUIDITY_PAIRED_ADDRESS_RECEIVED',
    BRIDGE_REMOVE_LIQUIDITY_FAILED: 'BRIDGE_REMOVE_LIQUIDITY_FAILED',
    BRIDGE_SWAP_FAILED: 'BRIDGE_SWAP_FAILED',
    BRIDGE_ADD_LIQUIDITY_FAILED: 'BRIDGE_ADD_LIQUIDITY_FAILED',
    BRIDGE_AVAILABLE_LIQUIDITY_FOR_TOKEN: 'BRIDGE_AVAILABLE_LIQUIDITY_FOR_TOKEN',
    BRIDGE_LOAD_FAILED: 'BRIDGE_LOAD_FAILED',
    SOURCE_CURRENCIES_RECEIVED: 'SOURCE_CURRENCIES_RECEIVED',
    USER_AVAILABLE_LIQUIDITY_FOR_TOKEN: "USER_AVAILABLE_LIQUIDITY_FOR_TOKEN",
	TOKEN_CONFIG_LOADED: 'TOKEN_CONFIG_LOADED',
    SWAP_SUCCESS: 'SWAP_SUCCESS',
    GROUP_INFO_LOADED: 'GROUP_INFO_LOADED'
}

const Actions = TokenBridgeClientActions;

export class BridgeClient implements Injectable {
    private network?: Network;
    private userAddress?: string;

    constructor(
        private api: ApiClient,
        protected client: UnifyreExtensionKitClient
    ) { }

    public getUserAddress() {return this. userAddress;} // DO NOT USE

    __name__() { return 'BridgeClient'; }

    async signInToServer(dispatch: Dispatch<AnyAction>): Promise<any|undefined> {
        try {
            dispatch(addAction(CommonActions.WAITING, { source: 'signInUsingAddress' }));
            const userProfile = await this.client.getUserProfile();
            this.network = userProfile.accountGroups[0].addresses[0]?.network;
            this.userAddress = userProfile.accountGroups[0].addresses[0]?.address;
            await this.api.signInToServer(userProfile);
            this.loadDataAfterSignIn(dispatch,this.network);
            return {};
        } catch (e) {
            console.error('signInToServer', e)
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));

        }
    }

    protected async loadDataAfterSignIn(dispatch: Dispatch<AnyAction>,network:string) {
        await this.getUserWithdrawItems(dispatch, this.network!);
    }

    async loadGroupInfo(dispatch: Dispatch<AnyAction>, groupId: string): Promise<GroupInfo|undefined> {
        try {
            ValidationUtils.isTrue(!!groupId, '"groupId" must be provided');
            dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
            let groupInfo = (await this.api.api({
                command: 'getGroupInfo', data: {groupId},
                params: []}as JsonRpcRequest)) as any;
            if (!groupInfo) {
                return undefined;
            } 
            //doesn't work yet
            // const currencyLst = inject<CurrencyList>(CurrencyList);
            // currencyLst.set(groupInfo.defaultCurrency);          
            // //inject connect
            // //register default currency for project
            dispatch(addAction(CommonActions.GROUP_INFO_LOADED, groupInfo));
            return groupInfo;
        } catch (e) {
            logError('Error loading group info', e as Error);
            return;
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
        }
    }

    async getSourceCurrencies(dispatch: Dispatch<AnyAction>,network: string) {
        const res = await this.api.api({
            command: 'getSourceCurrencies', data: {network}, params: [] } as JsonRpcRequest);
        return res;
    }

    async getTokenConfig(dispatch: Dispatch<AnyAction>,network: string, destNetwork:string,sourceCurrency:string) {
        const res = await this.api.api({
            command: 'getTokenConfig', data: {network, destNetwork,sourceCurrency}, params: [] } as JsonRpcRequest);
        return res;
    }

    async getTokenConfigForCurrencies(dispatch: Dispatch<AnyAction>, currencies: string[]) {
        const currencyPairs = await this.api.api({
            command: 'tokenConfigForCurrencies', data: {currencies}, params: [] } as JsonRpcRequest);
		if (currencyPairs) {
			dispatch(addAction(Actions.TOKEN_CONFIG_LOADED, {currencyPairs}));
		}
        return currencyPairs;
    }

    async checkTxStatus(dispatch: Dispatch<AnyAction>,txId: string,sendNetwork: string) {
        try {
        const res = await this.api.api({
            command: 'GetSwapTransactionStatus', data: {tid: txId, sendNetwork, timestamp: Date.now()}, params: [] } as JsonRpcRequest);
        return res;
        } catch(e) {
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'getAvailableLiquidity' }));
        }
    }

    public async getAvailableLiquidity(dispatch: Dispatch<AnyAction>,
            targetNetwork: string,
            targetCurrency: string) {
        dispatch(addAction(CommonActions.WAITING, { source: 'getAvailableLiquidity' }));
        try {
            // Get the available liquidity for target network
            const res = await this.api.api({
                command: 'getAvaialableLiquidity', data: {userAddress: targetNetwork, currency: targetCurrency}, params: [] } as JsonRpcRequest);
            if(res) {
                const { liquidity } = res;
                dispatch(addAction(Actions.BRIDGE_AVAILABLE_LIQUIDITY_FOR_TOKEN,
					{liquidity, currency: targetCurrency}));
            }
        } catch(e) {
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'getAvailableLiquidity' }));
        }
    }

    
    public async getUserLiquidity(dispatch: Dispatch<AnyAction>,
        userAddress: string,
        currency: string) {
        dispatch(addAction(CommonActions.WAITING, { source: 'getAvailableLiquidity' }));
        try {
            // Get the available liquidity for target network
            const res = await this.api.api({
                command: 'getLiquidity', data: {userAddress, currency}, params: [] } as JsonRpcRequest);
            if(res){
                const { liquidity } = res;
                dispatch(addAction(Actions.USER_AVAILABLE_LIQUIDITY_FOR_TOKEN, 
					{liquidity, userAddress, currency}))
            }
            //dispatch(addAction(Actions.BRIDGE_AVAILABLE_LIQUIDITY_FOR_TOKEN, {liquidity}))
        } catch(e) {
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'getAvailableLiquidity' }));
        }
    }

    /**
     * Loads withdrawable balances for user. User can withdraw them one by one.
     */
    public async loadUserBridgeLiquidity(dispatch: Dispatch<AnyAction>,
            currency: string) {
        dispatch(addAction(CommonActions.WAITING, { source: 'loadUserBridgeLiquidity' }));
        try {
            dispatch(addAction(CommonActions.WAITING, { source: 'getAvailableLiquidity' }));
            // Get the liquidity from web3...
            const res = await this.api.api({
                command: 'getLiquidity', data: {userAddress: this.userAddress!, currency}, params: [] } as JsonRpcRequest);
            const { liquidity } = res;
            ValidationUtils.isTrue(!liquidity, 'Invalid liquidity received');
            dispatch(addAction(Actions.BRIDGE_LIQUIDITY_FOR_USER_LOADED, {liquidity}))
        } catch(e) {
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'withdrawableBalanceItemAddTransaction' }));
        }
    }

    public async withdraw(
        dispatch: Dispatch<AnyAction>,
        w: UserBridgeWithdrawableBalanceItem,
        network:Network
        ) {
        dispatch(addAction(CommonActions.WAITING, { source: 'withdraw' }));
        try {
            ValidationUtils.isTrue(network === w.sendNetwork, 
                `Connected to ${network} but the balance item can be claimed on ${w.sendNetwork}`);
            const res = await this.api.api({
                command: 'withdrawSignedGetTransaction', data: {id: w.receiveTransactionId}, params: [] } as JsonRpcRequest);
            ValidationUtils.isTrue(!!res, 'Error calling withdraw. No requests');
            const requestId = await this.client.sendTransactionAsync(network!, [res],
                {});
            ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
            const response = await this.client.getSendTransactionResponse(requestId);
            if (response.rejected) {
                throw new Error((response as any).reason || 'Request was rejected');
            }
            const txIds = (response.response || []).map(r => r.transactionId);
						// Sleep some time before adding tx.
						// TODO: This is a hack for quickly improving the situation with txs auto failing.
						// This needs a proper fix from backend side.
						await sleep(15 * 1000);
            dispatch(addAction(CommonActions.WAITING, { source: 'withdrawableBalanceItemAddTransaction' }));
            await this.withdrawableBalanceItemUpdateTransaction(dispatch, w.receiveTransactionId, txIds[0]);
            return ['success',txIds[0]];
        } catch(e) {
            dispatch(addAction(CommonActions.ERROR_OCCURED, {
                message: (e as Error).message || '' }));
            dispatch(addAction(Actions.BRIDGE_SWAP_FAILED, {
                message: (e as Error).message || '' }));
                console.error('withdraw', e);
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'withdrawableBalanceItemAddTransaction' }));
        }
    }

    public async updateWithdrawItemPendingTransactions(dispatch: Dispatch<any>, id: string):
    Promise<UserBridgeWithdrawableBalanceItem> {
        const withdrawableBalanceItem = await this.api.api({
            command: 'updateWithdrawItemPendingTransactions', data: {id}, params: [] } as JsonRpcRequest);
        ValidationUtils.isTrue(!!withdrawableBalanceItem, 'Error updating balance item');
		dispatch(addAction(Actions.BRIDGE_BALANCE_ITEM_UPDATED, withdrawableBalanceItem))
		// TODO: Check if the updated balance item, is changed to completed.
		// at this point we know something should have happened to the balance. 
		// Get the balance and dispatch it to udpate the state.
        return withdrawableBalanceItem;
    }

    public async withdrawableBalanceItemUpdateTransaction(dispatch: Dispatch<AnyAction>,
        id: string,
        transactionId: string) {
        try {
            const res = await this.api.api({
                command: 'updateWithdrawItemAddTransaction',
                data: {id, transactionId}, params: [] } as JsonRpcRequest);
            const { withdrawableBalanceItem } = res;
            ValidationUtils.isTrue(!withdrawableBalanceItem, 'Error updating balance item');
            dispatch(addAction(Actions.BRIDGE_BALANCE_ITEM_UPDATED, {withdrawableBalanceItem}))
        } catch(e) {
            dispatch(addAction(Actions.BRIDGE_ADDING_TRANSACTION_FAILED, {
                message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'withdrawableBalanceItemAddTransaction' }));
        }
    }

    /**
     * Loads liquidity added by user
     */
     async updateUserPairedAddress(pair: SignedPairAddress) {
        const res = await this.api.api({
            command: 'updateUserPairedAddress', data: {pair}, params: [] } as JsonRpcRequest);
        return res;
    }

    /**
     * Loads liquidity added by user
     */
     async unpairUserPairedAddress(dispatch: Dispatch<AnyAction>, pair: SignedPairAddress) {
        const res = await this.api.api({
            command: 'unpairUserPairedAddress', data: {pair}, params: [] } as JsonRpcRequest);
        return res;
    }

    async getUserWithdrawItems(dispatch: Dispatch<AnyAction>, network: string):
		Promise<{withdrawableBalanceItems: UserBridgeWithdrawableBalanceItem[]}> {
        try {
            const res = await this.api.api({command: 'getUserWithdrawItems', data: { network }, params: [] } as JsonRpcRequest);
			if (!!res && res.withdrawableBalanceItems) {
				dispatch(addAction(Actions.BRIDGE_BALANCE_ITEMS_RECEIVED, res.withdrawableBalanceItems));
			}
            return res;
        } catch(e) {
			return {withdrawableBalanceItems: []};
        } finally {
          //dispatch(addAction(CommonActions.WAITING_DONE, { source: 'withdrawableBalanceItemAddTransaction' }));
        }
    }

    async getWithdrawItem(dispatch: Dispatch<AnyAction>, network: string, txId: string):
		Promise<UserBridgeWithdrawableBalanceItem|undefined> {
			return await this.api.api({command: 'getWithdrawItem', data: {
				network, receiveTransactionId: txId }, params: [] } as JsonRpcRequest);
    }

    public async addLiquidity(
        dispatch: Dispatch<AnyAction>,
        currency: string,
        amount: string,
        ) {
        dispatch(addAction(CommonActions.WAITING, { source: 'signInToServer' }));
        try {
            const res = await this.api.api({
                command: 'addLiquidityGetTransaction',
                data: {currency, amount}, params: [] } as JsonRpcRequest);
            const { isApprove, requests } = res;
            ValidationUtils.isTrue(!!requests && !!requests.length, 'Error calling add liquidity. No requests');
            console.log('About to submit request', {requests});
            const requestId = await this.client.sendTransactionAsync(this.network!, requests,
                {currency, amount, action: isApprove ? 'approve' : 'addLiquidity'});
            ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
            await this.processRequest(dispatch, requestId);
            return {
                "status":'success',
                "txId": requestId.split('|')[0],
            };
        } catch(e) {
            dispatch(addAction(Actions.BRIDGE_ADD_LIQUIDITY_FAILED, {
                message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'withdrawableBalanceItemAddTransaction' }));
        }
    }

    public async removeLiquidity(
        dispatch: Dispatch<AnyAction>,
        currency: string,
        amount: string,
        ) {
        dispatch(addAction(CommonActions.WAITING, { source: 'signInToServer' }));
        try {
            const res = await this.api.api({
                command: 'removeLiquidityIfPossibleGetTransaction',
                data: {currency, amount}, params: [] } as JsonRpcRequest);
            ValidationUtils.isTrue(!!res, 'Error calling remove liquidity. No requests');
            const requestId = await this.client.sendTransactionAsync(this.network!, [res],
                {currency, amount, action: 'removeLiquidity'});
            ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
            await this.processRequest(dispatch, requestId);
            return {
                "status":'success',
                "txId": requestId.split('|')[0],
            };
        } catch(e) {
            dispatch(addAction(Actions.BRIDGE_REMOVE_LIQUIDITY_FAILED, {
                message: (e as Error).message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'removeLiquidity' }));
        }
    }

    /**
     * Logs a swap transactions
     */
     async logSwapTransaction(txId:string, network:string) {
        const res = await this.api.api({
            command: 'logSwapTransaction', data: {txId,network}, params: [] } as JsonRpcRequest);
        return res;
    }

    public async swap(
        dispatch: Dispatch<AnyAction>,
        currency: string,
        amount: string,
        targetCurrency: string,
        ) {
        try {
            dispatch(addAction(CommonActions.WAITING, { source: 'swapGetTransaction' }));
            //console.log(targetCurrency,'targetCurrency',currency);    
			const sourceNetwork = Utils.parseCurrency(currency);
			const targetNetwork = Utils.parseCurrency(targetCurrency);
			ValidationUtils.isTrue(sourceNetwork !== targetNetwork, 'Source and target networks cannot be the same');
            const res = await this.api.api({
                command: 'swapGetTransaction',
                data: {currency, amount, targetCurrency}, params: [] } as JsonRpcRequest);
            const { isApprove, requests } = res;
            ValidationUtils.isTrue(!!requests && !!requests.length, 'Error calling swap. No requests');
            const requestId = await this.client.sendTransactionAsync(this.network!, requests,
                {currency, amount, targetCurrency, action: isApprove ? 'approve' : 'swap'});
            ValidationUtils.isTrue(!!requestId, 'Could not submit transaction.');
            const response = await this.processRequest(dispatch, requestId);
            if(response) await this.logSwapTransaction(requestId.split('|')[0],sourceNetwork[0]);           
            return {
                "status":'success',
                "txId": requestId.split('|')[0],
                "itemId": response
            };
        } catch(e) {
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
            // dispatch(addAction(Actions.BRIDGE_SWAP_FAILED, {
            //     message: e.message || '' }));
        } finally {
           // dispatch(addAction(CommonActions.WAITING_DONE, { source: 'withdrawableBalanceItemAddTransaction' }));
        }
    }

    async processRequest(dispatch: Dispatch<AnyAction>, 
        requestId: string) {
        try {
            dispatch(addAction(CommonActions.WAITING, { source: 'processRequest' }));
            const response = await this.client.getSendTransactionResponse(requestId);
            if (response.rejected) {
                throw new Error((response as any).reason || 'Request was rejected');
            }
            const txIds = (response.response || []).map((r:any) => r.transactionId);
            const payload = response.requestPayload || {};
            const { action } = payload;
            // const res = await this.api({
            //     command: 'bridgeProcessTransaction', data: {amount, eventType: action, txIds},
            //     params: []}as JsonRpcRequest) as {stakeEvent?: StakeEvent};
            // ValidationUtils.isTrue(!!stakeEvent, 'Error while getting the transaction! Your stake might have been executed. Please check etherscan for a pending stake transation');
            // dispatch(addAction(Actions.USER_STAKE_EVENTS_UPDATED, { updatedEvents: [stakeEvent] }));
            // dispatch(addAction(CommonActions.CONTINUATION_DATA_RECEIVED, {action,
            //     mainTxId: txIds[0]}));
            return txIds[0];
        } catch(e) {
            logError('Error processRequest', e as Error);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: 'Could send a request. ' + (e as Error).message || '' }));

            //dispatch(addAction(CommonActions.CONTINUATION_DATA_FAILED, {message: 'Could send a request. ' + e.message || '' }));
        } finally {
            dispatch(addAction(CommonActions.WAITING_DONE, { source: 'processRequest' }));
        }
    }
}