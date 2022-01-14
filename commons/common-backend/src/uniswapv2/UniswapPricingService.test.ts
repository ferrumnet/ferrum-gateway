import { EthereumSmartContractHelper, Web3ProviderConfig } from "aws-lambda-helper/dist/blockchain";
import { ConsoleLogger, LoggerFactory } from "ferrum-plumbing";
import { OneInchClient } from "src";
import { UniswapPricingService } from "./UniswapPricingService";
import { UniswapV2Client } from "./UniswapV2Client";
import { UniswapV2Router } from "./UniswapV2Router";

const PROVIDERS = {
	'ETHEREUM': 'https://mainnet.infura.io/v3/6c3c8730cd504213bad96e77121a4c32',
} as Web3ProviderConfig;

const UNISWAP = 'ETHEREUM:UNISWAP_V2';

async function pricingSvc() {
	const hel = new EthereumSmartContractHelper(PROVIDERS);
	const logger = new LoggerFactory((name: string) => new ConsoleLogger(name))
	// const uni = new UniswapV2Client(hel);
	const con = new UniswapV2Router(hel);
	const oneInch = new OneInchClient(hel,logger)
	const svc = new UniswapPricingService(hel, con,oneInch);
	return svc;
}

test('renders learn react link', async function() {
	const svc = await pricingSvc();
	const frmxPriceEth = await svc.ethPrice(UNISWAP, 'ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c');
	console.log('Price for FRM/ETH: ', frmxPriceEth);
	const frmxPriceUsdt = await svc.usdPrice(UNISWAP, 'ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c');
	console.log('Price for FRM/USDT: ', frmxPriceUsdt);
	// const frmPriceUsdt = await svc.usdPrice(UNISWAP, 'ETHEREUM:0xe5caef4af8780e59df925470b050fb23c43ca68c');
	// console.log('Price for FRM/USDT: ', frmPriceUsdt);
});
