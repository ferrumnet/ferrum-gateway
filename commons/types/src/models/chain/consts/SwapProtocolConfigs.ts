
export interface SwapProtocolContracts {
	router: string;
	weth: string;
	usd: string;
}

type SwapProtocolConfig = { [k: string]: SwapProtocolContracts };

export const SwapProtocolConfigs: SwapProtocolConfig = {
	'ETHEREUM:UNISWAP_V2': {
		router: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
		weth: 'ETHEREUM:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		usd: 'ETHEREUM:0xdac17f958d2ee523a2206206994597c13d831ec7',
	},
	'RINKEBY:UNISWAP_V2': {
		router: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
		weth: 'RINKEBY:0xc778417e063141139fce010982780140aa0cd5ab',
		usd: 'RINKEBY:0xd92e713d051c37ebb2561803a3b5fbabc4962431',
	},
	'BSC_TESTNET:CAKE': {
		router: '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3',
		weth: '',
		usd: '',
	},
}
