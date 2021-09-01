import { Injectable, HexString, Networks, LocalCache } from 'ferrum-plumbing';
import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { Token, TokenAmount, Trade,
    TradeType, Route, Percent, Router, Pair,
    CurrencyAmount, Currency, TradeOptions } from '@uniswap/sdk'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { abi as IUniswapV2Pair} from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { Big } from 'big.js';
import { toWei } from './Common';
import { ETH, SWAP_PROTOCOL_ROUTERS, WETH, } from 'types';
const Helper = EthereumSmartContractHelper;

/**
 * TODO: Move to aws-lambda-helper...
 */
export class UniswapV2Client implements Injectable {
    private cache: LocalCache = new LocalCache();
    constructor(
        private helper: EthereumSmartContractHelper,
    ) {
    }

    __name__() { return 'UniswapV2Client'; }

    async pairAddress(cur1: string, cur2: string): Promise<string> {
        return Pair.getAddress(await this.tok(cur1), await this.tok(cur2));
    }

    /**
     * This function won't cache the data. Make sure to cache the price on the interface
     * with timeout to avoid unnecessary calls to provider.
     */
    async price(curs: [string, string][]) {
        return (await this.routes(curs)).midPrice;
    }

    async amountOut(cur1: string, cur2: string, amountIn: string) {
        const t = await this.trade(cur1, cur2, 'buy', amountIn);
		console.log('Execution price', t.executionPrice.toSignificant(6));
		const amountOut = t.outputAmount.toSignificant(6);
		console.log('Amount out is for ', amountOut, 'and ', amountIn);
		return this.helper.amountToHuman(cur2, 
			new Big(t.executionPrice.toFixed()).times(new Big(amountIn)).toFixed());
    }

    private async pair(cur1: string, cur2: string) {
        const pairAddr = await this.pairAddress(cur1, cur2);
        const [network, _] = Helper.parseCurrency(cur1);
		const contract = await this.pairContract(network, pairAddr);
		const res = await contract.methods.getReserves().call();
		const reserves0 = res.reserve0;
		const reserves1 = res.reserve1;
		const token1 = await this.tok(cur1);
		const token2 = await this.tok(cur2);
		const balances = token1.sortsBefore(token2) ? [reserves0, reserves1] : [reserves1, reserves0];
		return new Pair(new TokenAmount(token1, balances[0]), new TokenAmount(token2, balances[1]));
    }

	private async router(network: string, contractAddress: string) {
        const web3 = this.helper.web3(network);
        return new web3.Contract(IUniswapV2Router02ABI as any, contractAddress);
	}

	private async pairContract(network: string, pairAddress: string) {
        const web3 = this.helper.web3(network);
        return new web3.Contract(IUniswapV2Pair as any, pairAddress);
	}

    private async routes(curs: [string, string][]) {
		const pairs: Pair[] = [];
		for (const curp of curs) {
        	pairs.push(await this.pair(curp[0], curp[1]));
		}
        return new Route(pairs, await this.uniCur(curs[0][0]),
			await this.uniCur(curs[curs.length - 1][1]));
    }

    private async route(cur1: string, cur2: string) {
		return this.routes([[cur1, cur2]]);
    }

    private async uniCur(cur: string): Promise<Currency> {
        const [net, _] = Helper.parseCurrency(cur);
        if (ETH[net][0] === cur) {
            return Currency.ETHER;
        }
        return this.tok(cur);
    }

    private async uniCurAmount(cur: string, amount: string): Promise<CurrencyAmount> {
        const [net, _] = Helper.parseCurrency(cur);
        if (ETH[net][0] === cur) {
            const amountBig = toWei(amount);
            return CurrencyAmount.ether(amountBig);
        }
        const amountBig = await this.helper.amountToHuman(cur, amount);
        return new TokenAmount(await this.tok(cur), amountBig);
    }


    // async buy(currency: string, base: string, amount: string, slippagePct: number, to: string) {
    //     const [network, _] = Helper.parseCurrency(currency);
    //     const t = await this.trade(base, currency, 'buy', amount);
    //     const slippageTolerance = new Percent((slippagePct * 100).toFixed(0), '10000');
    //     const tradeOptions = {
    //         allowedSlippage: slippageTolerance,
    //         ttl: DEFAULT_TTL,
    //         recipient: to,
    //     } as TradeOptions;
    //     const swapPars = Router.swapCallParameters(t, tradeOptions);
    //     return this.execOnRouter(network, swapPars, to);
    // }

    // async sell(currency: string, base: string, amount: string, slippagePct: number, to: string) {
    //     // When we buy amount in is exact
    //     const [network, _] = Helper.parseCurrency(currency);
    //     const t = await this.trade(currency, base, 'sell', amount);
    //     const slippageTolerance = new Percent((slippagePct * 100).toFixed(0), '10000');
    //     const tradeOptions = {
    //         allowedSlippage: slippageTolerance,
    //         ttl: DEFAULT_TTL,
    //         recipient: to,
    //     } as TradeOptions;
    //     const swapPars = Router.swapCallParameters(t, tradeOptions);
    //     return this.execOnRouter(network, swapPars, to);
    // }

    async trade(curIn: string, curOut: string, tType: 'buy' | 'sell', amount: string) {
        const r = await this.route(curIn, curOut);
        const relevantCurrency = tType === 'sell' ? curIn : curOut;
        const tokA = await this.uniCurAmount(relevantCurrency, amount);
        return new Trade(r, tokA, tType === 'sell' ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT);
    }

    // function addLiquidityETH(
    //     address token,
    //     uint amountTokenDesired,
    //     uint amountTokenMin,
    //     uint amountETHMin,
    //     address to,
    //     uint deadline
    //   ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    async addLiquidityEth(from: string, currency: string,
            amountDesired: string, amountMin: string, ethDesired: string, ethMin: string,
            deadline: number = Date.now() + 1500,) {
        const [network, token] = Helper.parseCurrency(currency);
        const pars = {
            methodName: 'addLiquidityETH',
            args: [
            token, 
            await this.helper.amountToMachine(currency, amountDesired), // uint amountTokenDesired
            await this.helper.amountToMachine(currency, amountMin), // uint amountTokenMin
            toWei(ethMin),   // uint amountETHMin
            from, 
            deadline, 
            ],
            value: toWei(ethDesired),
        }
        return await this.execOnRouter(network, pars, from);
    }

    async removeLiquidity(from: string, currencyA: string, currencyB: string,
            liquidity: string, amountAMin: string, amountBMin: string,
            deadline: number = Date.now() + 1500,) {
        // Deadline for adding liquidity = now + 25 minutes
        const [netA, tokenA] = Helper.parseCurrency(currencyA);
        const pars = {
            methodName: 'removeLiquidity',
            args: [
            tokenA, 
            Helper.parseCurrency(currencyB)[1],
            toWei(liquidity),
            await this.helper.amountToMachine(currencyA, amountAMin),
            await this.helper.amountToMachine(currencyB, amountBMin),
            from, 
            deadline, 
            ],
        }
        return await this.execOnRouter(netA, pars, from);
    }

    async removeLiquidityEth(from: string, currency: string,
        liquidity: string, amountTokenMin: string, amountETHMin: string,
            deadline: number = Date.now() + 1500,) {
        const [network, token] = Helper.parseCurrency(currency);
        const pars = {
            methodName: 'removeLiquidityETH',
            args: [
            token, 
            toWei(liquidity),
            await this.helper.amountToMachine(currency, amountTokenMin),
            toWei(amountETHMin),
            from, 
            deadline, 
            ],
        }
        return await this.execOnRouter(network, pars, from);
    }

    async execOnRouter(network: string, pars: any, from: string, useThisGas?: number): Promise<[HexString, number]> {
        const contract = this.routerContract(network);
        const { methodName, args, value } = pars;
        const method = contract.methods[methodName](...args);
        const gasEstimate = useThisGas || await method.estimateGas({
            from,
            ...(value ? { value } : {})});
        console.log('execOnRouter: Estimated gas', gasEstimate);
        return [method.encodeAbi(), gasEstimate];
    }

    private routerContract(protocol: string) {
		const [network, _] = EthereumSmartContractHelper.parseCurrency(protocol);
        const web3 = this.helper.web3(network);
        return new web3.Contract(IUniswapV2Router02ABI as any, SWAP_PROTOCOL_ROUTERS[protocol]);
    }

    private async getToken(currency: string): Promise<Token> {
		return this.cache.getAsync(`UNIV2_TOK_${currency}`, async () => {
			const decimals = await this.helper.decimals(currency);
			const symbol = await this.helper.symbol(currency);
			const [network, tokenAddress] = Helper.parseCurrency(currency);
			return new Token(
				Networks.for(network).chainId,
				tokenAddress,
				decimals,
				symbol,
				symbol);
		});
    }

    /**
     * Return the cached token, or WETH if currency is ETH.
     */
    private async tok(currency: string) {
        const [net, _] = Helper.parseCurrency(currency);
        if (currency === ETH[net][0]) {
            return this.getToken(WETH[net]);
        }
		return this.getToken(currency);
    }
}