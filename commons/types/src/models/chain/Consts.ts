
export const FRM: {[k: string]: [string, string]} = {
    'ETHEREUM': ['ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c', 'FRM'],
    'RINKEBY': ['RINKEBY:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM'],
    'BSC_TESTNET': ['BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179', 'FRM'],
};

export const supportedNetworks= {
    'ETHEREUM': 'active',
    'RINKEBY': 'active',
    'BSC_TESTNET': 'active',
    'MATIC': 'inactive',
    'SOLANA': 'inactive'
};

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

export const chainData = {
    'ETHEREUM': chainContent('0x1',
    'Ethereum Mainnet', 'ETH','ETH',
    1,'https://mainnet.infura.io/v3/undefined/','https://etherscan.io/'),
    'RINKEBY': chainContent('0x4',
    'Rinkeby Test Network', 'ETH','ETH',
    4,'https://rinkeby.infura.io/v3/undefined/','https://rinkeby.etherscan.io/'),
    'BSC_TESTNET': chainContent('0x61',
    'BSC Testnet', 'BNB','BNB',
    97,'https://data-seed-prebsc-1-s1.binance.org:8545/','https://explorer.binance.org/smart-testnet/'),
    'BSC': chainContent('0x38',
    'Binance Smart Chain', 'BNB','BNB',
    18,'https://bsc-dataseed.binance.org/','https://bscscan.com/'),
    'MATIC': chainContent('0x38',
    'Binance Smart Chain', 'BNB','BNB',
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
};