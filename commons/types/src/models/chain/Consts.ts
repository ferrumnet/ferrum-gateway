import { Networks } from "ferrum-plumbing";
import { Utils } from "src";
import { NetworkedConfig } from "../bridge/TokenBridgeTypes";

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

export function supportedNetworks(): { [k: string]: NetworkDropdown} {
	const rv = {} as any;
	(Utils.getBackendConstants()?.bridgeNetworks || []).forEach((b: string) => {
		const n = Networks.for(b);
		rv[b] = {
			key: n.id,
			active: true,
			display: n.displayName,
			mainnet: !n.testnet,
		} as NetworkDropdown;
	});
	return rv;
}

export const FRMX: {[k: string]: [string, string]} = {
    'ETHEREUM': ['ETHEREUM:0xf6832EA221ebFDc2363729721A146E6745354b14', 'FRMX'],
};

export const WETH: NetworkedConfig<string> = {
	'RINKEBY': 'RINKEBY:0xc778417e063141139fce010982780140aa0cd5ab',
	'ETHEREUM': 'ETHEREUM:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	'BSC': 'BSC:0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
	'BSC_TESTNET': 'BSC_TESTNET:0xae13d989dac2f0debff460ac112a837c89baa7cd',
	'POLYGON': 'POLYGON:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
}

export const ETH: NetworkedConfig<string> = {
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
