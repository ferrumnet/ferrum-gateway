import React, {useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { PlusOutlined } from '@ant-design/icons';
import { TokenInfo } from 'types';

export function AddTokenToMetamask({currency,tokenData}) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
	return (
		<p style={styles.point} onClick={()=> addToken(currency,tokenData)}>
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

async function addToken(currency,tokenData) {
    //@ts-ignore
	let ethereum = window.ethereum;
    try {
		const tokenChainData = tokenData || TokenInfo[currency];
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
