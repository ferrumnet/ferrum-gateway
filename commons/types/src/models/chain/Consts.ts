import { NetworkedConfig } from "../bridge/TokenBridgeTypes";

export const BRIDGE_NETWORKS = ['ETHEREUM', 'RINKEBY', 'RINKEBY', 'BSC', 'BSC_TESTNET', 'POLYGON', 'MUMBAI_TESTNET', 'AVAX_TESTNET','AVAX_MAINNET','MOON_MOONRIVER'];

export const FRM: {[k: string]: [string, string,string]} = {
    'ETHEREUM': ['ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c', 'FRM','ETHEREUM'],
    'RINKEBY': ['RINKEBY:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM','RINKEBY'],
    'POLYGON': ['POLYGON:0xd99bafe5031cc8b345cb2e8c80135991f12d7130', 'FRM','MATIC'],
    'BSC_TESTNET': ['BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM','BSC_TESTNET'],
    'MUMBAI_TESTNET': ['MUMBAI_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM','MUMBAI_TESTNET'],
    'AVAX_TESTNET': ['AVAX_TESTNET:0xd401a6140885fcDBD240426603696E2E7Ff2de46', 'AFRM','AVAX_TESTNET'],
    'MOON_MOONBASE':['MOON_MOONBASE:0xd401a6140885fcDBD240426603696E2E7Ff2de46','AFRM','MOON_MOONBASE']
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
    'POLYGON': ['active', 'Polygon (Matic)', 'mainnet'],
    'MUMBAI_TESTNET': ['active', 'Matic testnet', 'testnet'],
    'AVAX_TESTNET':['active', 'Avax testnet','testnet'],
    'AVAX_MAINNET':['active','Avax mainnet','mainnet'],
    'MOON_MOONRIVER':['active','Moon moonriver','mainnet'],
    'MOON_MOONBASE':['active','Moon moonbase','testnet']

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

const chainContent = (chainId:string, chainName:string, name:string,
    symbol:string, decimals:number, rpcUrls: string[], blockExplorerUrls: string[]) => ({
    "chainId": chainId,
    "chainName": chainName,
    "nativeCurrency":
        {
            name: name,
            symbol: symbol,
            decimals: decimals
        },
    "rpcUrls": rpcUrls,
    "blockExplorerUrls": blockExplorerUrls,
})

export const TokenInfo = {
    "RINKEBY:0xfe00ee6f00dd7ed533157f6250656b4e007e7179" : {
        tokenAddress: '0xFe00EE6F00dD7ed533157f6250656B4E007E7179',
        tokenSymbol: 'FRM',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/8251/small/frm.png?1563777564',
        type: 'ERC20'
    },
    "BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179" : {
        tokenAddress: '0xFe00EE6F00dD7ed533157f6250656B4E007E7179',
        tokenSymbol: 'FRM',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/8251/small/frm.png?1563777564',
        type: 'ERC20'
    },
    "MUMBAI_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179" : {
        tokenAddress: '0xFe00EE6F00dD7ed533157f6250656B4E007E7179',
        tokenSymbol: 'FRM',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/8251/small/frm.png?1563777564',
        type: 'ERC20'
    },
    "MUMBAI_TESTNET:0xc7b58945a08aa90f6db6440fb0bcc22fb45e6e98" : {
        tokenAddress: '0xc7b58945a08aa90f6db6440fb0bcc22fb45e6e98',
        tokenSymbol: 'RVF',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/14728/small/7.png?1618414105',
        type: 'ERC20'
    },
    "ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c" : {
        tokenAddress: '0xe5caef4af8780e59df925470b050fb23c43ca68c',
        tokenSymbol: 'FRM',
        tokenDecimals: 6,
        tokenImage:'https://assets.coingecko.com/coins/images/8251/small/frm.png?1563777564',
        type: 'ERC20'
    },
    "POLYGON:0xd99bafe5031cc8b345cb2e8c80135991f12d7130" : {
        tokenAddress: '0xd99bafe5031cc8b345cb2e8c80135991f12d7130',
        tokenSymbol: 'FRM',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/8251/small/frm.png?1563777564',
        type: 'ERC20'
    },
    "ETHEREUM:0xdc8af07a7861bedd104b8093ae3e9376fc8596d2" : {
        tokenAddress: '0xdc8af07a7861bedd104b8093ae3e9376fc8596d2',
        tokenSymbol: 'RVF',
        tokenDecimals: 18,
        tokenImage:'https://etherscan.io/token/images/rocketvault_32.png',
        type: 'ERC20'
    },
    "POLYGON:0x2ce13e4199443fdfff531abb30c9b6594446bbc7" : {
        tokenAddress: '0x2ce13e4199443fdfff531abb30c9b6594446bbc7',
        tokenSymbol: 'RVF',
        tokenDecimals: 18,
        tokenImage:'https://etherscan.io/token/images/rocketvault_32.png',
        type: 'ERC20'
	},
    "BSC_TESTNET:0x532197ec38756b9956190b845d99b4b0a88e4ca9" : {
        tokenAddress: '0x532197ec38756b9956190b845d99b4b0a88e4ca9',
        tokenSymbol: 'PAID',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/13761/small/PAID.png?1612493556',
        type: 'ERC20'
    },
    "RINKEBY:0xe1de1dc4de074e9c8bbf5e2d66cfdb4f0b2cb61a" : {
        tokenAddress: '0xe1de1dc4de074e9c8bbf5e2d66cfdb4f0b2cb61a',
        tokenSymbol: 'PAID',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/13761/small/PAID.png?1612493556',
        type: 'ERC20'
    },
    "ETHEREUM:0x1614f18fc94f47967a3fbe5ffcd46d4e7da3d787" : {
        tokenAddress: '0x1614f18fc94f47967a3fbe5ffcd46d4e7da3d787',
        tokenSymbol: 'PAID',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/13761/small/PAID.png?1612493556',
        type: 'ERC20'
    },
    "BSC:0xad86d0e9764ba90ddd68747d64bffbd79879a238" : {
        tokenAddress: '0xad86d0e9764ba90ddd68747d64bffbd79879a238',
        tokenSymbol: 'PAID',
        tokenDecimals: 18,
        tokenImage:'https://assets.coingecko.com/coins/images/13761/small/PAID.png?1612493556',
        type: 'ERC20'
    },
    "AVAX_TESTNET:0xeB2C7A8409840C0Fc35a3230cd6e81b4F27b3aAC":{
        tokenAddress:'0xeB2C7A8409840C0Fc35a3230cd6e81b4F27b3aAC',
        tokenSymbol:'AFRM',
        tokenDecimal:'18',
        tokenImage:'',
        type:'ERC20'
    },
    "MOON_MOONBASE:0x5600bbe2a0ff23d5d07286a933b89348030b0993":{
        tokenAddress:'0x5600bbe2a0ff23d5d07286a933b89348030b0993',
        tokenSymbol:'AFRM',
        tokenDecimal:'18',
        tokenImage:'',
        type:'ERC20'
    }
} as any;

export const chainData = {
    'ETHEREUM': chainContent('0x1',
    'Ethereum Mainnet', 'ETH','ETH',
    1,['https://mainnet.infura.io/v3/'], ['https://etherscan.io/']),
    'RINKEBY': chainContent('0x4',
    'Rinkeby Test Network', 'ETH','ETH',
    4,['https://rinkeby.infura.io/v3/'], ['https://rinkeby.etherscan.io/']),
    'BSC_TESTNET': chainContent('0x61',
    'BSC Testnet', 'BNB','BNB',
    18,['https://data-seed-prebsc-1-s1.binance.org:8545/'],['https://explorer.binance.org/smart-testnet/']),
    'BSC': chainContent('0x38',
    'Binance Smart Chain', 'BNB','BNB',
    18,['https://bsc-dataseed.binance.org/'],['https://bscscan.com/']),
    'POLYGON': chainContent('0x89',
    'Polygon (Matic)', 'MATIC','MATIC', 18,
	['https://rpc-mainnet.maticvigil.com/'],['https://ploygonscan.com/']),
    'MUMBAI_TESTNET': chainContent('0x13881',
    'Matic (Mumbai) testnet', 'MATIC','MATIC',
    18,['https://rpc-mumbai.maticvigil.com/'],['https://mumbai.polygonscan.com/']),
    'SOLANA': chainContent('0x38',
    'Binance Smart Chain', 'BNB','BNB',
    18, ['https://bsc-dataseed.binance.org/'],['https://bscscan.com/']),
    'AVAX_TESTNET': chainContent('0xA869',
    'Avax testnet', 'AVAX','AVAX',
    43113,[' https://api.avax-test.network/ext/bc/C/rpc'],['https://testnet.snowtrace.io/']),
    'AVAX_MAINNET': chainContent('0xA86A',
    'Avax mainnet', 'AVAX','AVAX',
    43114,['https://api.avax.network/ext/bc/C/rpc'],['https://snowtrace.io/']),
    'MOON_MOONRIVER': chainContent('0x505',
    'Moon moonriver', 'MOVR','MOVR',
    1285,['https://rpc.moonriver.moonbeam.network'],['https://moonriver.moonscan.io/']),
    'MOON_MOONBASE': chainContent('0x507',
    'Moon moonbase', 'DEV','DEV',
    1287,['https://rpc.testnet.moonbeam.network'],['https://moonbase.moonscan.io/']),
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
    'AVAX_TESTNET':['AVAX_TESTNET:AVAX','AVAX'],
    'AVAX_MAINNET':['AVAX_MAINNET:AVAX','AVAX'],
    'MOON_MOONRIVER':['MOON_MOONRIVER:MOVR','MOVR'],
    'MOON_MOONBASE':['MOON_MOONBASE:DEV','DEV']
};

export const WETH: NetworkedConfig<string> = {
	'RINKEBY': 'RINKEBY:0xc778417e063141139fce010982780140aa0cd5ab',
	'ETHEREUM': 'ETHEREUM:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	'BSC': 'BSC:0xae13d989dac2f0debff460ac112a837c89baa7cd',
	'POLYGON': 'POLYGON:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
}

export const USD_PAIR: NetworkedConfig<string> = {
	'RINKEBY': 'RINKEBY:0xd92e713d051c37ebb2561803a3b5fbabc4962431',
	'ETHEREUM': 'ETHEREUM:0xdac17f958d2ee523a2206206994597c13d831ec7',
	'BSC': 'BSC:0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
	'POLYGON': 'POLYGON:0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // PoS USDT
}

export const ONE_INCH_ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const BridgeContractVersions = {
	V1_0: '000.003',
	V1_2: '001.200',
}

export const BridgeContractNames = {
	V1_0: 'FERRUM_TOKEN_BRIDGE_POOL',
	V1_2: 'FERRUM_TOKEN_BRIDGE_POOL',
}

export const TRANSACTION_MINIMUM_CONFIRMATION = {
    'RINKEBY': 1,
    'DEFAULT': 3
}
