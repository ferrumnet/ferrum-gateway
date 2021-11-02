import React, {useContext} from 'react';
import {ThemeContext, Theme} from 'unifyre-react-helper';
import { PlusOutlined } from '@ant-design/icons';

export function AddTokenToMetamask({tokenData}) {
    const theme = useContext(ThemeContext);
    const styles = themedStyles(theme);
	const currency = (tokenData || {}).currency;
	if (!currency) {
		return (<span>Cannot add to MetaMask. No token</span>)
	}
    //todo fix for tokendata
	return (
		<p style={styles.point}
			onClick={()=> addToken(tokenData)}>
			<PlusOutlined className="btn btn-pri"
				style={{color: `${theme.get(Theme.Colors.textColor)}` || "#52c41a",fontSize: '12px',padding: '5px'}}
			/> 
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

async function addToken(tokenChainData) {
    console.log(tokenChainData,'tokenChain')
    //@ts-ignore
	let ethereum = window.ethereum;
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
            type: 'ERC20',
            options: {
                address: tokenChainData.address, 
                symbol: tokenChainData.symbol,
                decimals: tokenChainData.decimals,
                image: tokenChainData.logoURI,
            },
            },
        });
    } catch (e) {
		console.error('Add token', e);
    }
}
