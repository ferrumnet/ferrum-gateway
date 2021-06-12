import { AnyAction, Dispatch } from "redux";
import { PairedAddress,SignedPairAddress,inject,chainData, inject2} from 'types';
import { BridgeClient } from "./../../clients/BridgeClient";
import { ValidationUtils } from "ferrum-plumbing";
import { PairAddressService } from './../../pairUtils/PairAddressService';
import {PairAddressSignatureVerifyre} from './../../pairUtils/PairAddressSignatureVerifyer';
import { Connect } from 'unifyre-extension-web3-retrofit';
import { CommonActions,addAction } from './../../common/Actions';
import { Actions } from './Main';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import {connectSlice} from "common-containers";
import {SidePanelSlice} from './../../components/SidePanel';

export const changeNetwork = async (dispatch: Dispatch<AnyAction>,network:string,v:string,addr?: AddressDetails[],) => {
    try {
        //@ts-ignore
        console.log(network,chainData[network]);
        //@ts-ignore
        let ethereum = window.ethereum;
        // @ts-ignore
        if (window.ethereum) {
            //@ts-ignore
            const data = [chainData[network]]
            /* eslint-disable */
            const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data})
            if (tx) {
                console.log(tx)
            }
        }
    } catch (e) {
        console.log(e,'======')
    }
}

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
            } else {
                dispatch(addAction(CommonActions.ERROR_OCCURED, {message: 'error occured' }));
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

export const executeWithdraw = async (dispatch: Dispatch<AnyAction>,item:string,
    success:(v:string,tx:string)=>void,error:(v:string)=>void,setStatus:(v:number)=>void) => {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'swap' }));
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const items = await sc.getUserWithdrawItems(dispatch,network);
        if(items && items.withdrawableBalanceItems.length > 0){
            const findMatch = items.withdrawableBalanceItems.filter((e:any)=>e.receiveTransactionId === item);
            if(findMatch.length > 0){
                const res:any = await sc.withdraw(dispatch,findMatch[0],network);
                if(!!res && !!res[0]){
                    success(network,res[1]);
                    dispatch(Actions.resetSwap({}))
                    setStatus(1)
                    return;
                }
            }else{
                error('Invalid Withdrawal');
                dispatch(Actions.resetSwap({}))
                setStatus(1)
                return;
            }
        }
        error('Withdrawal failed');
        dispatch(Actions.resetSwap({}))
    }catch(e) {
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
    allowanceRequired:boolean,showModal: () => void,network:String,destnetwork:string,setStatus:(v:number)=>void
    ) => {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'swap' }));
        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        const client = inject<BridgeClient>(BridgeClient);        
        if(allowanceRequired){
            ValidationUtils.isTrue(!(Number(balance) < 1 ),'Minimum of 0.5 token Balance required for approval');

        }else{
            ValidationUtils.isTrue(!(Number(balance) < Number(amount) ),'Not anough balance for this transaction');
        }
        ValidationUtils.isTrue((destnetwork != network),'Destination netowkr cannot be the same source networks');

        const res = await client.swap(dispatch,currency, amount, targetNet);
       
        if( res?.status === 'success'){
            if(allowanceRequired){
                const allowance = await client.checkAllowance(dispatch,currency,'5', targetNet);
                if(allowance){
                    y('Approval Successful, You can now go on to swap your transaction.');
                    dispatch(Actions.checkAllowance({value: false}))
                    dispatch(Actions.resetPair({}));

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
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message || '' }));
        }
    }finally {
        const sc = inject<BridgeClient>(BridgeClient);
        const res = await sc.getUserWithdrawItems(dispatch,currency);  
        if(res && res.withdrawableBalanceItems.length > 0){
            dispatch(SidePanelSlice.actions.widthdrawalItemsFetched({items: res.withdrawableBalanceItems}));
        }
       dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

export const updateData= async (dispatch:Dispatch<AnyAction>) => {
    try {
        const [connect,client] = inject2<Connect,UnifyreExtensionWeb3Client>(Connect,UnifyreExtensionWeb3Client);
        const network = connect.network() as any;
        const userProfile = await client.getUserProfile();
        const Actions = connectSlice.actions;
        dispatch(Actions.connectionSucceeded({userProfile}))
    } catch (error) {
        
    }
}

export const fetchSourceCurrencies = async (dispatch: Dispatch<AnyAction>,v:string,addr?: AddressDetails[]) => {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
        const vrf = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const res = await vrf.getSourceCurrencies(dispatch,network);
        let details = addr?.find(e=>e.symbol === v);
        dispatch(Actions.tokenSelected({value: v || addr![0].symbol,details:res[0]}));
        if(!!res){
            dispatch(Actions.fetchedSourceCurrencies({currencies:res}))
            dispatch(Actions.validateToken({value: true}))
            if(details){
                const allowance = await vrf.checkAllowance(dispatch,details.currency,'5', res[0].targetCurrency);
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

export const reconnect = async (dispatch: Dispatch<AnyAction>,v:string,addr?: AddressDetails[],
    showNotiModal?: (v:boolean)=>void,unused?:number)  => {
    try {
        const client = inject<BridgeClient>(BridgeClient);
        dispatch(Actions.reconnected({}))
        //@ts-ignore
        await client.signInToServer(dispatch);
        await fetchSourceCurrencies(dispatch,v,addr);
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
        if(showNotiModal && (unused! > 0)){
            showNotiModal(true)!
        }
    } catch (e) {
        dispatch(addAction(CommonActions.ERROR_OCCURED, {message: e.message || '' }));

    }finally{
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const res = await sc.getUserWithdrawItems(dispatch,network);
        if(res && res.withdrawableBalanceItems.length > 0){
            dispatch(SidePanelSlice.actions.widthdrawalItemsFetched({items: res.withdrawableBalanceItems}));
        }
       dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
    
}

export const connect = async (dispatch: Dispatch<AnyAction>,showNotiModal?: (v:boolean)=>void,unused?:number)  => {
    const client = inject<BridgeClient>(BridgeClient);
    try {
        await client.signInToServer(dispatch);
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
        return;
    } catch (error) {
        console.log(error,'errror');
    }finally{
        if(unused! > 0){
            setTimeout(()=> {if(showNotiModal) showNotiModal(true)}
            ,4000)
        }
       
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
        if(items && items.withdrawableBalanceItems.length > 0){
            dispatch(SidePanelSlice.actions.widthdrawalItemsFetched({items: items.withdrawableBalanceItems}));
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
       dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }))
    }
};

export const openPanelHandler = (dispatch: Dispatch<AnyAction>) => {
};

