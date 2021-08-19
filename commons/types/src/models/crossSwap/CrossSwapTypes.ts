import { NetworkedConfig } from "../bridge/TokenBridgeTypes";
import { TokenDetails } from "../chain/ChainTypes";

export type SwapProtocol = string;

export interface SwapProtocolInfo {
	network: string;
	id: SwapProtocol;
	title: string;
	img: string;
}

export const TESTNET_PROTOCOLS: { [k: string]: SwapProtocolInfo[] } = {
	'RINKEBY': [{ network: 'RINKEBY', id: 'RINKEBY:UNISWAP_V2', title: 'Uniswap V2', img: '' }],
	'MUMBAI_TESTNET': [{ network: 'MUMBAI_TESTNET', id: 'MUMBAI_TESTNET:POLYGON_QUICKSWAP', title: 'Quick Swap', img: '' }],
	'BSC_TESTNET': [{ network: 'BSC_TESTNET', id: 'BSC_TESTNET:PANCAKESWAP_V2', title: 'Pancake Swap', img: '' }],
}

export const DEFAULT_SWAP_PROTOCOLS: NetworkedConfig<SwapProtocol[]> = {
	'RINKEBY': ['RINKEBY:UNISWAP_V2'],
	'BSC_TESTNET': ['BSC_TESTNET:PANCAKE'],
	'MUMBAI_TESTNET': ['MUMBAI_TESTNET:QUICK_SWAP'],
	'ETHEREUM': ['ETHEREUM:UNISWAP_V2'],
	'BSC': ['BSC:PANCAKESWAP_V2'],
	'POLYGON': ['POLYGON:POLYGON_QUICKSWAP'],
}

export interface SwapQuoteProtocol {
	network: string;
	protocol: SwapProtocol;
	protocolInfo: SwapProtocolInfo;
	fromCurrency: string;
	toCurrency: string;
	part: number;
}

export interface SwapQuote {
	fromNetwork: string;
	toNetwork: string;
	fromToken: TokenDetails;
	toToken: TokenDetails;
	fromTokenAmount: string;
	toTokenAmount: string;
	protocols: SwapQuoteProtocol[];
	bridge?: CrossChainBridgeQuote;
}

export type CrossSwapStatus = 'none' | 'signed' | 'executed';

export interface CrossSwapRequestStatus {
	status: CrossSwapStatus;
}

export interface CrossSwapRequest {
	creationTime: number;
	userAddress: string;
	targetAddress: string;
	network: string;
	transactionId: string;
	fromCurrency: string;
	toCurrency: string;
	amountIn: string;
	throughCurrency: string;
	targetThroughCurrency: string;
	fromProtocol: SwapProtocol;
	toProtocol: SwapProtocol;
	status: CrossSwapRequestStatus;
}

export interface SwapProtocolsPerNetwork {
	[key: string]: string[];
}

export const SupportedSwapProtocols: SwapProtocolsPerNetwork = {
	'ETHEREUM': ['UNISWAP_V2'],
	'RINKEBY': ['UNISWAP_V2'],
	'POLYGON': [],
	'MUMBAI_TESTNET': ['QUICKSWAP'],
	'BSC': [],
	'BSC_TESTNET': ['PANCAKESWAP'],
};

export interface CrossChainBridgeQuote {
	from: TokenDetails;
	to: TokenDetails;
	amountIn: string;
	amountOut: string;
	fee: string;
}

export interface BridgeV12Contracts {
	bridge: string;
	router: string;
	staking: string;
}