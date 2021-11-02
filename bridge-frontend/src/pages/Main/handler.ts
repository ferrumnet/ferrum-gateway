import { AnyAction, Dispatch } from "redux";
import { inject, chainData, TokenInfo } from 'types';
import { BridgeClient } from "./../../clients/BridgeClient";
import { ValidationUtils } from "ferrum-plumbing";
import { Connect } from 'unifyre-extension-web3-retrofit';
import { CommonActions,addAction } from './../../common/Actions';
import { Actions } from './Main';
import { AddressDetails } from "unifyre-extension-sdk/dist/client/model/AppUserProfile";
import { UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { connectSlice } from "common-containers";

// TODO: Move to a common project
export const changeNetwork = async (dispatch: Dispatch<AnyAction>,
		network:string) => {
    try {
        //@ts-ignore
        let ethereum = window.ethereum;
        // @ts-ignore
        if (window.ethereum) {
            //@ts-ignore
            const data = [chainData[network]]
            /* eslint-disable */
            const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data})
        }else{
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message:'Switch Network unavaialable, manually switch network on metamask' }));
        }
    } catch (e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message:'Switch Network unavaialable on Browser, manually switch network on metamask' }));
    } finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}


export const moveArrayItemForward = (arr:any[],params:string) : any => {
    const Item = params && arr.filter(item => (item.currency.split(':')[1]) === params  || (item.symbol=== params))[0];
    if (!Item) return
    const orderedItem = arr.filter(item => ((item.currency.split(':')[1]) !== params)  && (item.symbol != params));
    (params && Item) && orderedItem?.unshift(Item);
    return (orderedItem) && orderedItem
}

export const checkIfParamsExists = (arr:any[],params:string,prop:string) : any => {
    const Item = (arr.filter(item => item[prop] === params) || [])[0];
    return Item
}

export const executeWithdraw = async (dispatch: Dispatch<AnyAction>,item:string,
    success:(network:string, tx:string, txCurrency: string) => void,
	error:(v:string)=>void,setStatus:(v:number)=>void) => {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'swap' }));
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        dispatch(Actions.activeWithdrawSuccess({value: true}))
        const items = await sc.getUserWithdrawItems(dispatch,network);
        if(items && items.withdrawableBalanceItems.length > 0){
            const findMatch = items.withdrawableBalanceItems.find(e =>
					e.receiveTransactionId === item);
            if(!!findMatch) {
                const res = await sc.withdraw(dispatch, findMatch, network);
                if(!!res && !!res[0]){
                    success(network, res[1], findMatch!.sendCurrency);
                    dispatch(Actions.resetSwap({}))
                    setStatus(1)
                    await sc.getUserWithdrawItems(dispatch,network);
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
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message }));
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

export const initialise = (dispatch:Dispatch<AnyAction>) => {
    dispatch(addAction(CommonActions.WAITING, { source: 'dashboard' }));
}

export const onSwap = async (
    dispatch:Dispatch<AnyAction>,
    amount:string,
    balance:string,
    currency:string,
    targetCurrency: string,
    v: (v:string)=>void,
	y: (v:string)=>void,
    network:String,
	destnetwork:string,
    setStatus:(v:number)=>void,
    availableLiquidity:string,
    ) => {
    try {
		ValidationUtils.isTrue(!(Number(balance) < Number(amount) ),'Not enough balance for this transaction');
        ValidationUtils.isTrue(!(Number(amount) > (Number(availableLiquidity) - 1) ),'Not enough Liquidity available on destination network');
        dispatch(addAction(CommonActions.WAITING, { source: 'swap' }));
        dispatch(addAction(CommonActions.RESET_ERROR, {message: '' }));
        const client = inject<BridgeClient>(BridgeClient);        
       
        ValidationUtils.isTrue((destnetwork != network),'Destination network cannot be the same as the source network');

        const res = await client.swap(dispatch,currency, amount, targetCurrency);
       
        if( res?.status === 'success'){
			y('Swap Successful, Kindly View Withdrawal Items for item checkout.');
			dispatch(Actions.swapSuccess({message: res.status,swapId: res.txId, itemId: res.itemId,
                destNetwork:destnetwork,swapWithdrawCurrency:targetCurrency,destnetwork }));
			return;
            // if(allowanceRequired){
            //     const allowance = await client.checkAllowance(dispatch,currency,'5', targetNet);
            //     if(allowance){
            //         y('Approval Successful, You can now go on to swap your transaction.');
            //         dispatch(Actions.checkAllowance({value: false}))
            //         dispatch(Actions.resetPair({}));

            //     }
            //     return;
            // }else{
            // }
        }
        v('Transaction Rejected')
    }catch(e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    }finally {
        const sc = inject<BridgeClient>(BridgeClient);
        await sc.getUserWithdrawItems(dispatch,currency);  
       	dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
}

export const updateData= async (dispatch:Dispatch<AnyAction>) => {
    try {
        const client = inject<UnifyreExtensionWeb3Client>(UnifyreExtensionWeb3Client);
        const userProfile = await client.getUserProfile();
        const Actions = connectSlice.actions;
        dispatch(Actions.connectionSucceeded({userProfile}))
    } catch (e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message }));
    }finally {
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    }
}

export const resetNetworks = (activeNetworks:string[],network:string) =>{
   const index = activeNetworks.findIndex((e,index)=> (e === network));
   if(index===(activeNetworks.length - 1)){
       return activeNetworks[index-1] 
   }else{
       return activeNetworks[index+1] 
   }
}

// export const onDestinationNetworkChanged = async (
//     dispatch: Dispatch<AnyAction>,v:NetworkDropdown) => {
//     //to do: better fix for other tokens implementation
//     try {
//         dispatch(Actions.destNetworkChanged({value: v.key}));
//         await vrf.getAvailableLiquidity(dispatch,v.key,FRM[v.key][0])
//     } catch (e) {
// 		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
//     }
   
// }

export const startSwap = (dispatch: Dispatch<AnyAction>,
    history:any,groupId:String) => {
    history.push((groupId ? `/${groupId}` : '') + '/swap');
}

export const manageLiquidity = (dispatch: Dispatch<AnyAction>,
    history:any,groupId:String) => {
    history.push((groupId ? `/${groupId}` : '') + '/liquidity');
}

// export const resetPair = (dispatch: Dispatch<AnyAction>) => {
//     dispatch(Actions.resetPair({}));
// }

export const reconnect = async (dispatch: Dispatch<AnyAction>,v:string,addr?: AddressDetails[],
    defaultCurrency?:string,destNetwork?:any)  => {
    try {
        dispatch(Actions.resetDestNetwork({value:(destNetwork||[])[0]?.key}));
        dispatch(Actions.reconnected({}))
        // await fetchSourceCurrencies(dispatch,v,addr,true,defaultCurrency,destNetwork[0].key);
        dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
    } catch (e) {
        dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as any).message || '' }));

    }finally{
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        await sc.getUserWithdrawItems(dispatch,network);
       dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }));
    }
    
}

export const connect = async (dispatch: Dispatch<AnyAction>,showNotiModal?: (v:boolean)=>void,unused?:number)  => {
    try {
        dispatch(addAction(CommonActions.WAITING, { source: 'loadGroupInfo' }));
        const client = inject<BridgeClient>(BridgeClient);
        await client.signInToServer(dispatch);
        //dispatch(addAction(CommonActions.WAITING_DONE, { source: 'loadGroupInfo' }));
        return;
    } catch (e) {
        if(!!(e as Error).message){
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
        }
    }finally{
        if(unused! > 0){
            setTimeout(()=> {if(showNotiModal) showNotiModal(true)}
            ,4000)
        }
       
    }
}

export const checkifItemIsCreated = async (dispatch: Dispatch<AnyAction>,itemId:string) => {
    try {
        const sc = inject<BridgeClient>(BridgeClient);
        const connect = inject<Connect>(Connect);
        const network = connect.network() as any;
        const items = await sc.getUserWithdrawItems(dispatch,network);
        if(items && items.withdrawableBalanceItems.length > 0){
            const findMatch = items.withdrawableBalanceItems.filter((e:any)=>e.receiveTransactionId === itemId);
            if(findMatch.length > 0){
                return 'created'
            }
        }
        return '';
    }catch(e) {
		dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
    }finally {
       dispatch(addAction(CommonActions.WAITING_DONE, { source: 'dashboard' }))
    }
};

export const openPanelHandler = (dispatch: Dispatch<AnyAction>) => {
};

