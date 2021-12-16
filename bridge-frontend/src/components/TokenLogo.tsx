import React from 'react';
import { useSelector } from 'react-redux';
import { TokenDetails } from 'types';
import { BridgeAppState } from '../common/BridgeAppState';

export function TokenLogo(props: {currency: string}) {
    const tokenLists: {[k: string]: TokenDetails} = useSelector<BridgeAppState>(state => state.data.tokenList?.lookup) || {} as any;
    const token: TokenDetails = tokenLists[props.currency] || {};
    return (
        <img className='token-logo' src={token.logoURI} />
    );
}