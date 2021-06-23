
export const FRM: {[k: string]: [string, string,string]} = {
    'ETHEREUM': ['ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c', 'FRM','ETHEREUM'],
    'RINKEBY': ['RINKEBY:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM','RINKEBY'],
    'POLYGON': ['POLYGON:0xd99bafe5031cc8b345cb2e8c80135991f12d7130', 'FRM','MATIC'],
    'BSC_TESTNET': ['BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM','BSC_TESTNET'],
    'MUMBAI_TESTNET': ['MUMBAI_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM','MUMBAI_TESTNET'],
};

export interface NetworkDropdown {
	key: string;
	display: string;
	active: boolean;
	mainnet: boolean;
}

const _supportedNetworks: any = {
    'ETHEREUM': ['active', 'Ethereum', 'mainnet'],
    'RINKEBY': ['active', 'Rinkeby testnet', 'testnet'],
    'BSC_TESTNET': ['active', 'BSC testnet', 'testnet'],
    'BSC': ['active', 'BSC', 'mainnet'],
    'POLYGON': ['active', 'Polugon (Matic)', 'mainnet'],
    'MUMBAI_TESTNET': ['active', 'Matic testnet', 'testnet'],
    'SOLANA': ['inactive', 'Solana', 'mainnet']
};

// TODO: Directly write the constants
export const supportedNetworks: { [k: string]: NetworkDropdown } = {}
Object.keys(_supportedNetworks).forEach(k => {
	const [a, d, m] = _supportedNetworks[k];
	supportedNetworks[k] = {
		key: k, active: a === 'active',
		display: d,
		mainnet: m === 'mainnet'}
})

const chainContent = (chainId:string,chainName:string,name:string,
    symbol:string,decimals:number,rpcUrls:string,blockExplorerUrls:string) => ({
    "chainId": chainId,
    "chainName": chainName,
    "nativeCurrency":
        {
            name: name,
            symbol: symbol,
            decimals: decimals
        },
    "rpcUrls": [rpcUrls],
    "blockExplorerUrls": [blockExplorerUrls],
})

export const tokenData = {
    "FRM" : {
        tokenAddress: '0xFe00EE6F00dD7ed533157f6250656B4E007E7179',
        tokenSymbol: 'FRM',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/8251/small/frm.png?1563777564',
        type: 'ERC20'
    }
}

export const chainData = {
    'ETHEREUM': chainContent('0x1',
    'Ethereum Mainnet', 'ETH','ETH',
    1,'https://mainnet.infura.io/v3/undefined/','https://etherscan.io/'),
    'RINKEBY': chainContent('0x4',
    'Rinkeby Test Network', 'ETH','ETH',
    4,'https://rinkeby.infura.io/v3/undefined/','https://rinkeby.etherscan.io/'),
    'BSC_TESTNET': chainContent('0x61',
    'BSC Testnet', 'BNB','BNB',
    18,'https://data-seed-prebsc-1-s1.binance.org:8545/','https://explorer.binance.org/smart-testnet/'),
    'BSC': chainContent('0x38',
    'Binance Smart Chain', 'BNB','BNB',
    18,'https://bsc-dataseed.binance.org/','https://bscscan.com/'),
    'POLYGON': chainContent('0x89',
    'Polugon (Matic)', 'MATIC','MATIC',
    18,'https://bsc-dataseed.binance.org/','https://polygonscan.com/'),
    'MUMBAI_TESTNET': chainContent('0x13881',
    'Matic (Mumbai) testnet', 'MATIC','MATIC',
    18,'https://bsc-dataseed.binance.org/','https://bscscan.com/'),
    'SOLANA': chainContent('0x38',
    'Binance Smart Chain', 'BNB','BNB',
    18,'https://bsc-dataseed.binance.org/','https://bscscan.com/'),
}



export const FRMX: {[k: string]: [string, string]} = {
    'ETHEREUM': ['ETHEREUM:0xf6832EA221ebFDc2363729721A146E6745354b14', 'FRMX'],
};

export const ETH: {[k: string]: [string, string]} = {
    'ETHEREUM': ['ETHEREUM:ETH', 'ETH'],
    'RINKEBY': ['RINKEBY:ETH', 'ETH'],
    'BSC_TESTNET': ['BSC_TESTNET:BNB', 'BNB'],
    'BSC': ['BSC:BNB', 'BNB'],
    'POLYGON': ['POLYGON:MATIC', 'MATIC'],
    'MUMBAI_TESTNET': ['MUMBAI_TESTNET:MATIC', 'MATIC'],
};