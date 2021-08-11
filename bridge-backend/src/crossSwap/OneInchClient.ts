import { Injectable, LocalCache, Networks, ValidationUtils } from "ferrum-plumbing";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Fetcher, FetcherError } from 'common-backend';
import { TokenDetails, SwapProtocol, SwapQuote, SwapQuoteProtocol, SwapProtocolInfo, TESTNET_PROTOCOLS } from "types";

interface OneInchQuoteRequest {
	"fromToken": {
	  "symbol": string,
	  "name": string,
	  "address": string,
	  "decimals": number,
	  "logoURI": string,
	},
	"toToken": {
	  "symbol": string,
	  "name": string,
	  "address": string,
	  "decimals": number,
	  "logoURI": string
	},
	"toTokenAmount": string,         // result amount of toToken in minimal divisible units
	"fromTokenAmount": string,       // input amount of fromToken in minimal divisible units
	"protocols": [                     // route
	  {
		"name": string,              
		"part": number,
		"fromTokenAddress": string,
		"toTokenAddress": string
	  }
	],
	"estimatedGas": number                // rough estimated amount of gas limit for used protocols
}

const QUOTE_API_BASE = 'https://api.1inch.exchange/v3.0/{CHAIN_ID}/quote';
const PROTOCOLS_API_BASE = 'https://api.1inch.exchange/v3.0/{CHAIN_ID}/protocols/images';

function _protocol(nodes: any[]): any[] {
	const rv = [];
	for(const node of nodes) {
		if (!Array.isArray(node)) {
			rv.push(node);
		} else {
			const rvs = _protocol(node);
			rvs.forEach(r => rv.push(r));
		}
	}

	return rv;
}

function flattenProtocols(quote: OneInchQuoteRequest) {
	const ps = quote.protocols as any[];
	const protocols:{
		"name": string,              
		"part": number,
		"fromTokenAddress": string,
		"toTokenAddress": string
	  }[] = [];
	  let nodes: any[] = [];
	  quote.protocols = _protocol(quote.protocols) as any;
	  return quote;
}

export class OneInchClient implements Injectable {
	private cache = new LocalCache();
	constructor(
		private helper: EthereumSmartContractHelper,
	) { }

	__name__() { return 'OneInchClient'; }

	async quote(
		fromCurrency: string,
		toCurrency: string,
		amountIn: string,
		protocols: SwapProtocol[],
	): Promise<SwapQuote> {
		ValidationUtils.isTrue(!!fromCurrency, 'fromCurrency must be provided');
		ValidationUtils.isTrue(!!toCurrency, 'toCurrency must be provided');
		ValidationUtils.isTrue(!!amountIn, 'amountIn must be provided');
		const amountInBig = await this.helper.amountToMachine(fromCurrency, amountIn);
		const [fromNet, fromToken] = EthereumSmartContractHelper.parseCurrency(fromCurrency);
		const [toNet, toToken] = EthereumSmartContractHelper.parseCurrency(toCurrency);
		ValidationUtils.isTrue(fromNet === toNet, 'From and to networks must be the same');
		const chainId = Networks.for(fromNet).chainId.toString();
		const protocolList = await this.protocols(fromNet);
		const protocolSet = new Set<string>(protocolList.map(pl => pl.id));
		ValidationUtils.isTrue(!protocols.find(p => !protocolSet.has(p)), 'Some protocol not supported for network');

		ValidationUtils.isTrue(protocols.length === 1, 'Only one protocol supported for this version!');

		protocols = protocols.map(p => p.split(':')[1]);
		try {
			const url = `${QUOTE_API_BASE.replace('{CHAIN_ID}', chainId)}?fromTokenAddress=${fromToken}` + 
				`&toTokenAddress=${toToken}&amount=${amountInBig}&protocols=${protocols.join(',')}`;
			let res: OneInchQuoteRequest = await new Fetcher().fetch<OneInchQuoteRequest>(
				url, { headers: {'Content-Type': 'application/json'}, });
			console.log('CALLING ', url)
			ValidationUtils.isTrue(!!res?.fromToken?.address, 'Could not get quote');
			res = flattenProtocols(res);
			const resFromCurrency = `${fromNet}:${(res.fromToken?.address || '').toLowerCase()}`;
			const resToCurrency = `${toNet}:${(res.toToken?.address || '').toLowerCase()}`;
			return {
				fromNetwork: fromNet,
				toNetwork: toNet,
				fromToken: {
					chainId: Number(chainId),
					address: res.fromToken.address,
					currency: resFromCurrency,
					decimals: res.fromToken.decimals,
					logoURI: res.fromToken.logoURI,
					name: res.fromToken.name,
					symbol: res.fromToken.symbol,
				} as TokenDetails,
				toToken: {
					chainId: Number(chainId),
					address: res.toToken.address,
					currency: resToCurrency,
					decimals: res.toToken.decimals,
					logoURI: res.toToken.logoURI,
					name: res.toToken.name,
					symbol: res.toToken.symbol,
				} as TokenDetails,
				fromTokenAmount: await this.helper.amountToHuman(resFromCurrency, res.fromTokenAmount),
				toTokenAmount: await this.helper.amountToHuman(resToCurrency, res.toTokenAmount),
				protocols: res.protocols.map(p => ({
					fromCurrency: `${fromNet}:${(p.fromTokenAddress || '').toLowerCase()}`,
					network: fromNet,
					part: p.part,
					protocol: `${fromNet}:${p.name}`,
					toCurrency: `${toNet}:${(p.toTokenAddress || '').toLowerCase()}`,
					protocolInfo: protocolList.find(prot => prot.id === p.name),
				} as SwapQuoteProtocol)),
			} as SwapQuote;
		} catch (e) {
			if (e instanceof FetcherError) {
				const err = e as FetcherError;
				console.log('Error when calling quote ', err, err.error);
				if (err.error) {
					throw new FetcherError(err.error?.message, err);
				}
				
			}
			throw (e);
		}
	}

	async protocols(network: string): Promise<SwapProtocolInfo[]> {
		ValidationUtils.isTrue(!!network, 'network must be provided');
		return this.cache.getAsync<SwapProtocolInfo[]>(`PROTOCOLS_${network}`, async () => {
			const net = Networks.for(network);
			if (net.testnet) { return TESTNET_PROTOCOLS[network]; }
			const chainId = net.chainId.toString();
			const res = await new Fetcher().fetch<{protocols: SwapProtocolInfo[]}>(
				`${PROTOCOLS_API_BASE.replace('{CHAIN_ID}', chainId)}`, {
				headers: {'Content-Type': 'application/json'},
			});
			ValidationUtils.isTrue(!!(res?.protocols || []).length, 'Error getting protocols. Nothing returned from API');
			return res.protocols.map((p: SwapProtocolInfo) => ({
				...p,
				network,
				id: `${network}:${p.id}`,
			}));
		});
	}
}