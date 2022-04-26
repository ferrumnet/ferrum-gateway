import { Networks } from 'ferrum-plumbing';
import Web3 from 'web3'

// TODO: Move to a common project
export const changeNetwork = async (network:string) => {
    try {
        const net = Networks.for(network);
        //@ts-ignore
        let ethereum = window.ethereum;
        // @ts-ignore
        if (window.ethereum) {
            const chainId= net.chainId
            const hexChainId = chainId.toString(16);
            //@ts-ignore
            const tx = await ethereum.request({method: 'wallet_switchEthereumChain', params:[ {"chainId": `0x${hexChainId}`}]});
            return tx;
        }
    } catch (e) {
        try{
            //try legacy request as temporary fallback, to be removed once wallet_switchEthereumChain is stable
            //@ts-ignore
            let ethereum = window.ethereum;
            const net = Networks.for(network);
            console.log('seitch data',net)
            const data = [ {
                "chainId": Web3.utils.toHex(net.chainId),
                "chainName": net.displayName,
                "nativeCurrency":
                    {
                        name: net.baseSymbol,
                        symbol: net.baseSymbol,
                        decimals: 18
                    },
                "rpcUrls": [net.defaultRpcEndpoint],
                "blockExplorerUrls": [net.explorer],
            }]
            /* eslint-disable */
            const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data})
            return tx
        }catch(e){
            return ''
        }
    }
}