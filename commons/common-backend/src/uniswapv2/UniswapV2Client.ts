import { Injectable, LocalCache, ValidationUtils, HexString, Networks } from 'ferrum-plumbing';
import { EthereumSmartContractHelper } from 'aws-lambda-helper/dist/blockchain';
import { Token, TokenAmount, Trade,
    TradeType, Route, Percent, Router, Pair,
    CurrencyAmount, Currency, TradeOptions } from '@uniswap/sdk'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { abi as IUniswapV2Pair} from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { abi as TokenABI } from '@uniswap/v2-core/build/IERC20.json';
import { Big } from 'big.js';
import { toWei } from './Common';
import { ETH, SWAP_PROTOCOL_ROUTERS, WETH, } from 'types';
const Helper = EthereumSmartContractHelper;

const TWO_TO_128 = new Big('340282366920938463463374607431768211456');
export const DEFAULT_TTL = 360;

function getContract(web3: any, address: string, ABI: any) {
    if (address === '0x') {
      throw Error(`Invalid 'address' parameter '${address}'.`)
    }
  
    return new web3.Contract(ABI, address);
}

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

    async registerToken(currency: string) {
        const decimals = await this.helper.decimals(currency);
        const symbol = await this.helper.symbol(currency);
        const [network, tokenAddress] = Helper.parseCurrency(currency);
        const token = new Token(
            Networks.for(network).chainId,
            tokenAddress,
            decimals,
            symbol,
            symbol);
        this.cache.set('UNIV2_TOK_' + currency, token);
    }

    pairAddress(cur1: string, cur2: string): string {
        return Pair.getAddress(this.tok(cur1), this.tok(cur2));
    }

    async userBalance(currency: string, userAddress: string): Promise<string> {
        const [network, tokenAddress] = Helper.parseCurrency(currency);
        const contract = getContract(this.helper.web3(network), tokenAddress, TokenABI);
        const res = await contract.methods.balanceOf(userAddress).call();
        return this.helper.amountToHuman(currency, res);
    }

    async totalSupply(currency: string): Promise<string> {
        const [network, tokenAddress] = Helper.parseCurrency(currency);
        const contract = getContract(this.helper.web3(network), tokenAddress, TokenABI);
        const res = await contract.methods.totalSupply().call();
        return this.helper.amountToHuman(currency, res);
    }

    /**
     * This function won't cache the data. Make sure to cache the price on the interface
     * with timeout to avoid unnecessary calls to provider.
     */
    async price(cur1: string, cur2: string) {
        return (await this.route(cur2, cur1, false)).midPrice;
    }

    async amountOut(cur1: string, cur2: string, amountIn: string) {
        const t = await this.trade(cur1, cur2, 'buy', amountIn);
		console.log('Execution price', t.executionPrice.toSignificant(6));
		const amountOut = t.outputAmount.toSignificant(6);
		console.log('Amount out is for ', amountOut, 'and ', amountIn);
		return this.helper.amountToHuman(cur2, 
			new Big(t.executionPrice.toFixed()).times(new Big(amountIn)).toFixed());
    }

    async allowRouter(protocol: string, currency: string, from: string, useThisGas: number): Promise<[HexString, number]> {
		const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
		const uniV2Router = SWAP_PROTOCOL_ROUTERS[protocol];
        return this.helper.approve(currency, from, TWO_TO_128, uniV2Router, useThisGas);
    }

    private async pair(cur1: string, cur2: string, useCache: boolean) {
        const pairAddr = this.pairAddress(cur1, cur2);
        const [network, _] = Helper.parseCurrency(cur1);
        const k = 'UNIV2_PAIR_' + pairAddr;
        let curP = this.cache.get(k);
        if (!curP || !useCache) {
            const contract = getContract(this.helper.web3(network), pairAddr, IUniswapV2Pair);
            const res = await contract.methods.getReserves().call();
            const reserves0 = res.reserve0;
            const reserves1 = res.reserve1;
            const token1 = this.tok(cur1);
            const token2 = this.tok(cur2);
            const balances = token1.sortsBefore(token2) ? [reserves0, reserves1] : [reserves1, reserves0];
            curP = new Pair(new TokenAmount(token1, balances[0]), new TokenAmount(token2, balances[1]));
            this.cache.set(k, curP);
        }
        return curP;
    }

    private async route(cur1: string, cur2: string, useCache: boolean) {
        // If one side is eth?
        const [network1, _] = Helper.parseCurrency(cur1);
        const [network2, __] = Helper.parseCurrency(cur1);
        ValidationUtils.isTrue(network1 === network2, 'Network mismatch for Route');
        const pair = await this.pair(cur1, cur2, useCache);
        return new Route([pair], this.uniCur(cur1), this.uniCur(cur2));
    }

    private uniCur(cur: string): Currency {
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
        return new TokenAmount(this.tok(cur), amountBig);
    }


    async buy(currency: string, base: string, amount: string, slippagePct: number, to: string) {
        const [network, _] = Helper.parseCurrency(currency);
        const t = await this.trade(base, currency, 'buy', amount);
        const slippageTolerance = new Percent((slippagePct * 100).toFixed(0), '10000');
        const tradeOptions = {
            allowedSlippage: slippageTolerance,
            ttl: DEFAULT_TTL,
            recipient: to,
        } as TradeOptions;
        const swapPars = Router.swapCallParameters(t, tradeOptions);
        return this.execOnRouter(network, swapPars, to);
    }

    async sell(currency: string, base: string, amount: string, slippagePct: number, to: string) {
        // When we buy amount in is exact
        const [network, _] = Helper.parseCurrency(currency);
        const t = await this.trade(currency, base, 'sell', amount);
        const slippageTolerance = new Percent((slippagePct * 100).toFixed(0), '10000');
        const tradeOptions = {
            allowedSlippage: slippageTolerance,
            ttl: DEFAULT_TTL,
            recipient: to,
        } as TradeOptions;
        const swapPars = Router.swapCallParameters(t, tradeOptions);
        return this.execOnRouter(network, swapPars, to);
    }

    async trade(curIn: string, curOut: string, tType: 'buy' | 'sell', amount: string) {
        const r = await this.route(curIn, curOut, false);
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

    /**
     * Return the cached token, or WETH if currency is ETH.
     */
    private tok(currency: string) {
        const [net, _] = Helper.parseCurrency(currency);
        if (currency === ETH[net][0]) {
            return WETH[net];
        }
        const t = this.cache.get('UNIV2_TOK_'+currency);
        ValidationUtils.isTrue(!!t, `Token "${currency} not registered`);
        return t;
    }
}