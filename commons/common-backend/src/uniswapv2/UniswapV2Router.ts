import { abi as IUniswapV2Router01ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router01.json";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { CurrencyValue, SwapProtocolConfigs, Utils } from "types";
import { SwapProtocol } from "types";

export class UniswapV2Router implements Injectable {
	constructor(
		private helper: EthereumSmartContractHelper,
	) {}

	__name__() { return 'UniswapV2Router'; }

	async getAmountsOut(protocol: SwapProtocol,
		amountIn: string, routes: string[]): Promise<CurrencyValue[]> {
		const amountInInt = await this.helper.amountToMachine(routes[0], amountIn);
		const router = this.router(protocol);
		const tokens = routes.map(r => Utils.parseCurrency(r)[1]);
		const amountsOut = await router.methods.getAmountsOut(amountInInt, tokens).call();
		ValidationUtils.isTrue(!!amountsOut, 'No response from getAmountsOut');
		ValidationUtils.isTrue(!!amountsOut.length, 'Empty response from getAmountsOut');
		ValidationUtils.isTrue(amountsOut.length == routes.length,
			'Wrong size response from getAmountsOut');
		const res: CurrencyValue[] = [];
		for(let i=0; i<routes.length; i++) {
			res.push({
				currency: routes[i],
				value: await this.helper.amountToHuman(routes[i], amountsOut[i]),
			} as CurrencyValue)
		}
		return res;
	}

	private router(protocol: SwapProtocol) {
		const [network,] = Utils.parseCurrency(protocol);
		const web3 = this.helper.web3(network);
		const contractAddress = SwapProtocolConfigs[protocol]?.router;
		ValidationUtils.isTrue(!!contractAddress, `${protocol} has no router defined`);
		return new web3.Contract(IUniswapV2Router01ABI as any, contractAddress);
	}
}
