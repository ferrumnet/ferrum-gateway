import React, {useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { PlusOutlined } from '@ant-design/icons';
import { TokenInfo } from 'types';

export function AddTokenToMetamask({currency}) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
	return (
		<p style={styles.point} onClick={()=> addToken(currency)}>
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

async function addToken(currency) {
    //@ts-ignore
	let ethereum = window.ethereum;
    try {
		const tokenData = TokenInfo[currency];
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
            type: tokenData.type,
            options: {
                address: tokenData.tokenAddress, 
                symbol: tokenData.tokenSymbol,
                decimals: tokenData.tokenDecimals,
                image: tokenData.tokenImage
            },
            },
        });
    } catch (e) {
		console.error('Add token', e);
    }
}
