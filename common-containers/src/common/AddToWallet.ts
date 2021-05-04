
export function addErc20ToWallet(address: string, symbol: string, decimals: number, image: string) {
    // @ts-ignore
    web3.currentProvider.sendAsync({
        method:'wallet_watchAsset',
        params: { type: 'ERC20', options: { address, symbol, decimals,image }}}
    );
}