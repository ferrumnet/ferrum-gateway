import React, {useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { PlusOutlined } from '@ant-design/icons';
import { TokenInfo } from 'types';

export function AddTokenToMetamask({currency,tokenData}) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
    console.log(currency,'currencyreenenenen');
    const tokenChainData = TokenInfo[currency] || {};
    //todo fix for tokendata
	return (
		<p style={styles.point} onClick={()=> tokenChainData.tokenImage ? addToken(currency,tokenChainData) :  console.log(currency,'currencyreenenenen',tokenChainData)}>
			<PlusOutlined className="btn btn-pri" style={{color: `${theme.get(Theme.Colors.textColor)}` || "#52c41a",fontSize: '12px',padding: '5px'}}/> 
			<span>Add Token to MetaMask</span>
		</p>
	);
}

const themedStyles = (theme) => ({
    point:{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
});

async function addToken(currency,tokenChainData) {
    console.log(tokenChainData,'tokenChain')
    //@ts-ignore
	let ethereum = window.ethereum;
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
            type: tokenChainData.type,
            options: {
                address: tokenChainData.tokenAddress, 
                symbol: tokenChainData.tokenSymbol,
                decimals: tokenChainData.tokenDecimals,
                image: tokenChainData.tokenImage
            },
            },
        });
    } catch (e) {
		console.error('Add token', e);
    }
}
