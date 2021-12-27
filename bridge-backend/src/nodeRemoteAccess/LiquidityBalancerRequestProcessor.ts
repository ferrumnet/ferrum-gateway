import { HttpRequestProcessor } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { BigUtils } from "types";
import { TokenBridgeService } from "../TokenBridgeService";

export class LiquidityBalancerRequestProcessor
    extends HttpRequestProcessor
    implements Injectable {
    constructor(
        private bridge: TokenBridgeService,
        private helper: EthereumSmartContractHelper,
    ) {
        super();

        this.registerProcessorAuth("getAvailableLiquidityForBalancer", async (req, auth) => {
            ValidationUtils.isTrue(!!auth.hmacPublicKey, "Unauthorized");
            ValidationUtils.allRequired(['currency', 'address'], req.data);
            const { currency, address } = req.data;
            const totalLiquidity = await this.bridge.getAvailableLiquidity(currency);
            const userLiquidity = await this.bridge.getLiquidity(address, currency);
            const [network, token] = EthereumSmartContractHelper.parseCurrency(currency);
            const userBalanceRaw = await this.helper.erc20(network, token).methods.balanceOf(address).call();
            return {
                userLiquidity: userLiquidity.liquidity,
                userBalance: await this.helper.amountToHuman(currency, (userBalanceRaw || '0').toString()),
                totalLiquidity: totalLiquidity.liquidity, 
            };
        });

        this.registerProcessorAuth("removeLiquidityTransactionForBalancer", async (req, auth) => {
            ValidationUtils.isTrue(!!auth.hmacPublicKey, "Unauthorized");
            ValidationUtils.allRequired(['currency', 'address', 'amount'], req.data);
            const { currency, address, amount } = req.data;
            const call = await this.bridge.removeLiquidityIfPossibleGetTransaction(
                address, currency, amount);
            const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
            call.gas.gasPrice = await this.gasPrice(network);
            return call;
        });

        this.registerProcessorAuth("addLiquidityTransactionForBalancer", async (req, auth) => {
            ValidationUtils.isTrue(!!auth.hmacPublicKey, "Unauthorized");
            ValidationUtils.allRequired(['currency', 'address', 'amount'], req.data);
            const { currency, address, amount } = req.data;
            const call = (await this.bridge.addLiquidityGetTransaction(
                address, currency, amount)).requests[0];
            const [network,] = EthereumSmartContractHelper.parseCurrency(currency);
            call.gas.gasPrice = await this.gasPrice(network);
            return call;
        });

        this.registerProcessorAuth("sendRawTransaction", async (req, auth) => {
            ValidationUtils.isTrue(!!auth.hmacPublicKey, "Unauthorized");
            ValidationUtils.allRequired(['network', 'transaction',], req.data);
            const { network, transaction } = req.data;
            const web3 = this.helper.web3(network);
            return await web3.sendSignedTransaction(transaction);
        });
    }

    __name__(): string { return 'LiquidityBalancerProcessor'; }

    private async gasPrice(network: string): Promise<string> {
        const web3 = this.helper.web3(network);
        const price = await web3.getGasPrice();
        return BigUtils.parseOrThrow(price, "gasPrice").times(1.5).round().toFixed();
    }
}