import { AnyAction, Dispatch } from "redux";
import { PairedAddress,SignedPairAddress,CHAIN_ID_FOR_NETWORK,inject,IocModule, supportedNetworks } from 'types';
import { BridgeClient } from "./../../clients/BridgeClient";
import { ValidationUtils } from "ferrum-plumbing";
import { PairAddressService } from './../../pairUtils/PairAddressService';
import {PairAddressSignatureVerifyre} from './../../pairUtils/PairAddressSignatureVerifyer';
import { Connect, CurrencyList } from 'unifyre-extension-web3-retrofit';
import { CommonActions,addAction } from './../../common/Actions';
import { Actions } from './Main';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";

export const unPairAddresses = async (dispatch: Dispatch<AnyAction>,pair: SignedPairAddress) => {
    try {
        const tb = inject<BridgeClient>(BridgeClient);
        const res = await tb.unpairUserPairedAddress(dispatch,pair)
        if(!!res){
            dispatch(Actions.resetPair({}));
            const resp = await tb.signInToServer(dispatch);
            if (resp) {
                const connect = inject<Connect>(Connect);
                const network = connect.network() as any;
                const addr = connect.account()!;
                dispatch(Actions.bridgeInitSuccess({data: res,address1: addr,network1: network}));
                // ownProps.con()
            } else {
                dispatch(addAction(CommonActions.ERROR_OCCURED, {message: 'error occured' }));

               // dispatch(addAction(Actions.BRIDGE_INIT_FAILED, { message: intl('fatal-error-details') }));
            }
            
        }
    } catch(e) {
        if(!!e.message){
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message }));
        }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

export const onAddressChanged = (dispatch: Dispatch<AnyAction>,v:string) => {
    dispatch(Actions.onAddressChanged({value:v}))
}

export const signFirstPairAddress = async (dispatch: Dispatch<AnyAction>,
    pairedAddress: PairedAddress,
    ) => {
    try {
        const vrf = inject<BridgeClient>(BridgeClient);
        const sc = inject<PairAddressService>(PairAddressService);
        ValidationUtils.isTrue(!(pairedAddress.network1 === pairedAddress.network2),'base and destination network cannot be the same');
        const res = await sc.signPairAddress1(pairedAddress);
        let SignedPair = {
            pair: pairedAddress,
            signature1: res.split('|')[0],
        } as  SignedPairAddress
        const response = await vrf.updateUserPairedAddress(SignedPair);
        if(!!response){
            dispatch(Actions.addBaseAddressSignature({sign: res,pair: pairedAddress}))
        }
    } catch(e) {
            if(!!e.message){
                dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message }));
            }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}


export const onSwap = async (
    dispatch:Dispatch<AnyAction>,
    amount:string,balance:string,currency:string,targetNet: string,
    v: (v:string)=>void,y: (v:string)=>void,
    allowanceRequired:boolean,showModal: () => void,network:String,destnetwork:string,
    ) => {
    try {
        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        dispatch(addAction(CommonActions.WAITING, { source: 'swap' }));
        const client = inject<BridgeClient>(BridgeClient);        
        ValidationUtils.isTrue(!(Number(balance) < Number(amount) ),'Not anough balance for this transaction');
        ValidationUtils.isTrue((destnetwork != network),'Destination netowkr cannot be the same source networks');

        const res = await client.swap(dispatch,currency, amount, targetNet);
       
        if( res?.status === 'success'){
            if(allowanceRequired){
                const allowance = await client.checkAllowance(dispatch,currency,'5', targetNet);
                if(allowance){
                    y('Approval Successful, You can now go on to swap your transaction.');
                    dispatch(Actions.checkAllowance({value: false}))
                }
                return;
            }else{
                y('Swap Successful, Kindly View Withdrawal Items for item checkout.');
                dispatch(Actions.swapSuccess({message: res.status,swapId: res.txId, itemId: res.itemId }));
                return;
            }
        }
        v('error occured')
    }catch(e) {
        if(!!e.message){
            console.log(e.message);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message || '' }));
        }
    }finally {
        const sc = inject<BridgeClient>(BridgeClient);
        const res = await sc.getUserWithdrawItems(dispatch,currency);  
       dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}


export const fetchSourceCurrencies = async (dispatch: Dispatch<AnyAction>,v:string,addr?: AddressDetails[]) => {
    try {
        const vrf = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const res = await vrf.getSourceCurrencies(dispatch,network);
        let details = addr?.find(e=>e.symbol === v);
        dispatch(Actions.tokenSelected({value: v || addr![0].symbol,details:res[0]}));
        console.log(details,'detailsss',v);

        if(!!res){
            dispatch(Actions.fetchedSourceCurrencies({currencies:res}))
            dispatch(Actions.validateToken({value: true}))
            if(details){
                const allowance = await vrf.checkAllowance(dispatch,details.currency,'5', res[0].targetCurrency);
                console.log(allowance,'alaoowowo')
                dispatch(Actions.checkAllowance({value: allowance}))
                dispatch(Actions.tokenSelected({value: v || addr![0].symbol,details:res[0]}));
                let TokenAllowed = res?.find((e:any)=> (e.sourceCurrency === details?.currency||e.targetCurrency === details?.currency));
                if(TokenAllowed){
                    await vrf.getAvailableLiquidity(dispatch,details?.address, details?.currency) 
                    return;
                }
                dispatch(Actions.validateToken({value: false}))
                ValidationUtils.isTrue(!!TokenAllowed,'Selected Token not supported');
            }
        }
    } catch(e) {
            if(!!e.message){
                dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message }));
            }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

export const onDestinationNetworkChanged = (
    dispatch: Dispatch<AnyAction>,v:string) => {
    dispatch(Actions.onDestinationNetworkChanged({value:v}))
}

export const pairAddresses = (dispatch: Dispatch<AnyAction>,
    network:string,address: string
    ) => {
    dispatch(Actions.pairAddresses({network,address}))
}

export const signSecondPairAddress = async (dispatch: Dispatch<AnyAction>,
    pairedAddress: PairedAddress,baseSign: string
    ) => {
    try {
        const vrf = inject<BridgeClient>(BridgeClient);
        const sc = inject<PairAddressService>(PairAddressService);
        const vrfy = inject<PairAddressSignatureVerifyre>(PairAddressSignatureVerifyre);
        ValidationUtils.isTrue(!(pairedAddress.network1 === pairedAddress.network2),'base and destination network cannot be the same');
        const res = await sc.signPairAddress2(pairedAddress);
        let SignedPair = {
            pair: pairedAddress,
            signature2: res.split('|')[0],
            signature1: baseSign.split('|')[0],
        } as  SignedPairAddress
        const response = await vrfy.verify(SignedPair);
        const rs = await vrf.updateUserPairedAddress(SignedPair);
        if(!!response && !!rs){
            dispatch(Actions.addDestAddressSignature({sign: res}))

        }
    } catch(e) {
            if(!!e.message){
                dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message || '' }));
            }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

export const startSwap = (dispatch: Dispatch<AnyAction>,
    history:any,groupId:String) => {
    history.push((groupId ? `/${groupId}` : '') + '/swap');
}

export const manageLiquidity = (dispatch: Dispatch<AnyAction>,
    history:any,groupId:String) => {
    history.push((groupId ? `/${groupId}` : '') + '/liquidity');
}

export const resetPair = (dispatch: Dispatch<AnyAction>) => {
    dispatch(Actions.resetPair({}));
}

export const reconnect = async (dispatch: Dispatch<AnyAction>,v:string,addr?: AddressDetails[])  => {
    const client = inject<BridgeClient>(BridgeClient);
    dispatch(Actions.reconnected({}))
    //@ts-ignore
    await client.signInToServer(dispatch);
    await fetchSourceCurrencies(dispatch,v,addr);
    dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
}

export const connect = async (dispatch: Dispatch<AnyAction>)  => {
    const client = inject<BridgeClient>(BridgeClient);
    try {
        await client.signInToServer(dispatch);
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
        return;
    } catch (error) {
        console.log(error,'errror');
    }
}


export const checkTxStatus = async (dispatch: Dispatch<AnyAction>,txId:string,sendNetwork:string,timestamp:number) => {
    try {
        const sc = inject<BridgeClient>(BridgeClient);
        const res = await sc.checkTxStatus(dispatch,txId,sendNetwork,timestamp);
        if(res){
            return res;
        }
        return '';
    }catch(e) {
        if(!!e.message){
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message || '' }));
        }
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
};


export const checkifItemIsCreated = async (dispatch: Dispatch<AnyAction>,itemId:string) => {
    try {
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const items = await sc.getUserWithdrawItems(dispatch,network);
        if(items.withdrawableBalanceItems.length > 0){
            const findMatch = items.withdrawableBalanceItems.filter((e:any)=>e.receiveTransactionId === itemId);
            if(findMatch.length > 0){
                return 'created'
            }
        }
        return '';
    }catch(e) {
        if(!!e.message){
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message || '' }));
        }
        
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
};

export const openPanelHandler = (dispatch: Dispatch<AnyAction>) => {
};

