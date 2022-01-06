import {
  ChainClientFactory,
  ChainUtils,
} from "ferrum-chain-clients";
import {
	Container,
  Injectable,
  Logger,
  LoggerFactory,
  Network,
  ValidationUtils,
} from "ferrum-plumbing";
import { BridgeModule } from "./BridgeModule";
import { LambdaGlobalContext } from "aws-lambda-helper";
import { TokenBridgeService } from "./TokenBridgeService";
import { BridgeProcessorConfig } from "./BridgeProcessorTypes";
import { PayBySignatureData, UserBridgeWithdrawableBalanceItem } from "types";
import { BridgeConfigStorage } from "./BridgeConfigStorage";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { fixSig, produceSignatureWithdrawHash } from "./BridgeUtils";
import { toRpcSig } from "ethereumjs-util";
import { TokenBridgeContractClinet } from "./TokenBridgeContractClient";
import { BridgeSwapEvent } from "./common/TokenBridgeTypes";
import * as Eip712 from "web3-tools";
import { Networks } from "ferrum-plumbing/dist/models/types/Networks";
import { AppConfig, CommonBackendModule, WithDatabaseConfig } from "common-backend";
import Web3 from "web3";
import { HmacApiKeyStore } from "aws-lambda-helper/dist/security/HmacApiKeyStore";

export class BridgeProcessor implements Injectable {
  private log: Logger;
  constructor(
    private config: BridgeProcessorConfig,
    private chain: ChainClientFactory,
    private svc: TokenBridgeService,
    private bridgeContract: TokenBridgeContractClinet,
    private tokenConfig: BridgeConfigStorage,
    private helper: EthereumSmartContractHelper,
    private privateKey: string,
    private processorAddress: string,
    logFac: LoggerFactory
  ) {
    this.log = logFac.getLogger("BridgeProcessor");
  }

  __name__() {
    return "BridgeProcessor";
  }

  async processCrossChain(network: Network, noStop: boolean) {
    /**
     * Find all incoming transactions for the given network.
     * Get the sender details from mongo and verify the pair target.
     * Send tokens to their address.
     */
    const poolAddress = this.config.bridgeConfig.contractClient[network];
    ValidationUtils.isTrue(
      !!poolAddress,
      `No payer for ${network} is configured`
    );
    // const client = this.chain.forNetwork(network);

    const relevantTokens = await this.tokenConfig.getSourceCurrencies(network);
    ValidationUtils.isTrue(
      !!relevantTokens.length,
      `No relevent token found in config for ${network}`
    );
    try {
      console.log(
        relevantTokens.map((j: any) => j.sourceCurrency),
        "soucre currencies"
      );
      
      let incoming = (await this.bridgeContract.getSwapEvents(network)) || [];
      const swapTxs = await this.svc.getPendingSwapTxIds(network);
      const swapTxsIds = swapTxs.map((e: any) => e.id);
      let swapEvents = [];

			const txsFromChain = incoming.map((e) => e.transactionId);
      for (const tx of swapTxsIds) {
        if (!txsFromChain.includes(tx)) {
					try {
						const event = await this.bridgeContract.getSwapEventByTxId(
							network as Network,
							tx
						);
						swapEvents.push(event);
					} catch(e) {
						console.warn('Could not retrieve swap event for transaction: ', network, tx, e);
						await this.svc.failSwapTx(network, tx, e.toString());
					}
        }
      }

      console.log("Got icoming txs:", { ...incoming }, swapEvents);

      if (swapEvents.length > 0) {
        incoming = incoming.concat(swapEvents);
      }

      if (!incoming || !incoming.length) {
        this.log.info(
          "No recent transaction for address " + network + ":" + poolAddress
        );
        return;
      }

      for (const tx of incoming.reverse()) {
        this.log.info(`Processing transaction ${tx.transactionId}`);
        const [existed, _] = await this.processSingleTransaction(tx);
        await this.svc.updateProcessedSwapTxs(network, tx.transactionId);
        this.log.info(`Transaction ${tx.transactionId} processed.`);
        if (existed) {
          this.log.info(
            `Reached a transaction that was already processed: ${tx.transactionId}`
          );
          if (!noStop) {
            return;
          }
        }
      }
    } finally {
      await this.svc.close();
      await this.tokenConfig.close();
	    const c = await LambdaGlobalContext.container();
      await (c.get<HmacApiKeyStore>(HmacApiKeyStore) as any).close();

      console.log('All closed!!!')     
    }
  }

  async processOneTx(network: Network, txId: string) {
    /**
     * Find all incoming transactions for the given network.
     * Get the sender details from mongo and verify the pair target.
     * Send tokens to their address.
     */
    const poolAddress = this.config.bridgeConfig.contractClient[network];
    ValidationUtils.isTrue(
      !!poolAddress,
      `No payer for ${network} is configured`
    );
    try {
      const tx = await this.bridgeContract.getSwapEventByTxId(network, txId);
      this.log.info(`Processing transaction ${tx.transactionId}`);
      const [existed, _] = await this.processSingleTransaction(tx);
      if (existed) {
        this.log.info(
          `Reached a transaction that was already processed: ${tx.transactionId}`
        );
      }
    } finally {
      await this.svc.close();
      await this.tokenConfig.close();
    }
  }

  private async processSingleTransaction(
    event: BridgeSwapEvent
  ): Promise<[Boolean, UserBridgeWithdrawableBalanceItem?]> {
    try {
      ValidationUtils.isTrue(!!event.transactionId, "No transaction ID");
      let processed = await this.svc.getWithdrawItem(event.transactionId);
      if (!!processed) {
        return [true, processed];
      } else {
      }

      

      // Creating a new process option.
      // Find the relevant token config for the pair
      // Calculate the target amount
      const sourceNetwork = event.network;
      const sourceAddress = event.from;
      const targetAddress = event.targetAddress || event.from;
      const targetNetwork = event.targetNetwork;
      const sourcecurrency = `${sourceNetwork}:${ChainUtils.canonicalAddress(
        event.network,
        event.token
      )}`;
      const conf = await this.tokenConfig.tokenConfig(
        sourceNetwork,
        targetNetwork,
        sourcecurrency
      );
      
      const targetCurrency = `${targetNetwork}:${ChainUtils.canonicalAddress(
        event.targetNetwork as any,
        event.targetToken
      )}`;
      ValidationUtils.isTrue(
        !!conf &&
          conf.sourceCurrency === sourcecurrency &&
          conf.targetCurrency === targetCurrency,
        `No token config between ${JSON.stringify(
          sourcecurrency
        )} networks (target ${targetCurrency})`
      );

      // const sourceAmount = await this.helper.amountToMachine(sourcecurrency, event.amount);
      const targetAmount = await this.helper.amountToMachine(
        targetCurrency,
        event.amount
      );
      const salt = Web3.utils.keccak256(
        event.transactionId.toLocaleLowerCase()
      );
      const payBySig = await this.createSignedPayment(
        targetNetwork,
        targetAddress,
        targetCurrency,
        targetAmount,
        salt
      );
      
      processed = {
        id: payBySig.hash, // same as signedWithdrawHash
        timestamp: new Date().valueOf(),
        receiveNetwork: conf!.sourceNetwork,
        receiveCurrency: conf!.sourceCurrency,
        receiveTransactionId: event.transactionId,
        receiveAddress: sourceAddress,
        receiveAmount: event.amount,
        payBySig,

        sendNetwork: targetNetwork,
        sendAddress: targetAddress,
        sendTimestamp: new Date().valueOf(),
        sendCurrency: conf?.targetCurrency,
        sendAmount: event.amount,

        used: "",
        useTransactions: [],
      } as UserBridgeWithdrawableBalanceItem;
      
      await this.svc.withdrawSignedVerify(
        conf!.targetCurrency,
        targetAddress,
        targetAmount,
        payBySig.hash,
        '',
        payBySig.signatures[0].signature,
        this.processorAddress
      );
      console.log('withdrawsignedverify')
      await this.svc.newWithdrawItem(processed);
      return [true, processed];
    } catch (e) {
      this.log.error(
        `Error when processing transactions "${JSON.stringify(event)}": ${e}`
      );
      return [false, undefined];
    }
  }

  async createSignedPayment(
    network: string,
    address: string,
    currency: string,
    amountStr: string,
    salt: string
  ): Promise<PayBySignatureData> {
    const [_, token] = EthereumSmartContractHelper.parseCurrency(currency);
    const chainId = Networks.for(network).chainId;
    const payBySig = produceSignatureWithdrawHash(
      this.helper.web3(network),
      chainId,
      this.config.bridgeConfig.contractClient[network],
      token,
      address,
      amountStr,
      salt
    );

    

    const params = {
      contractName: "FERRUM_TOKEN_BRIDGE_POOL",
      contractVersion: "0.0.3",
      method: "WithdrawSigned",
      args: [
        { type: "address", name: "token", value: address },
        { type: "address", name: "payee", value: token },
        { type: "uint256", name: "amount", value: amountStr },
        { type: "bytes32", name: "salt", value: salt },
      ],
    } as Eip712.Eip712Params;

    const sig2 = Eip712.produceSignature(
      this.helper.web3(network),
      chainId,
      this.config.bridgeConfig.contractClient[network],
      params
    );

    // console.log("SIG 2 WAS ", sig2);
    // Create signature. TODO: Use a more secure method. Address manager is not secure enough.
    // E.g. Have an ecnrypted SK as ENV. Configure KMS to only work with a certain IP
    const sigP = await this.chain
      .forNetwork(network as any)
      .sign(this.privateKey, payBySig.hash.replace("0x", ""), true);
    const baseV = sigP.v - chainId * 2 - 8;
    //@ts-ignore
    const rpcSig = fixSig(
      toRpcSig(baseV, Buffer.from(sigP.r, "hex"), Buffer.from(sigP.s, "hex"), 1)
    );
    
    payBySig.signatures = [{ signature: rpcSig } as any];
    ValidationUtils.isTrue(
      !!payBySig.signatures[0].signature,
      `Error generating signature for ${{
        network,
        address,
        currency,
        amountStr,
      }}`
    );
    return payBySig;
  }
}

async function closeIfInitialized(c: Container, t: any) {
	try {
		console.log('Force closing ', t);
		await (c.get(t) as any).close();
	} catch (e) {
		console.error('Error force closing ', t, e);
	}
}

async function prepProcess() {
	const c = await LambdaGlobalContext.container();
	try {
    await AppConfig.instance().forChainProviders();
    await AppConfig.instance().fromSecret('', 'BRIDGE');
    await AppConfig.instance().fromSecret('', 'CRUCIBLE');
    await AppConfig.instance().fromSecret('', 'LEADERBOARD');
    await AppConfig.instance().fromSecret('', 'GOVERNANCE');
    AppConfig.instance().orElse('', () => ({
      database: {
        connectionString: AppConfig.env('MONGOOSE_CONNECTION_STRING')
      },
      cmkKeyId: AppConfig.env('CMK_KEY_ID'),
    }));
      
    await BridgeModule.configuration();
		await c.registerModule(new CommonBackendModule());
		await c.registerModule(new BridgeModule());
		return c.get<BridgeProcessor>(BridgeProcessor);
	} catch(e) {
		console.error('Error happened when initializing', e);
		await closeIfInitialized(c, TokenBridgeService);
		await closeIfInitialized(c, BridgeConfigStorage);
		return undefined;
	}
}

export async function processOneWay(network: string, noStop: boolean) {
  const processor = await prepProcess();
	if (processor) {
  	await processor.processCrossChain(network as any, noStop);
	}
}

export async function processOneTx(network: string, txId: string) {
  const processor = await prepProcess();
	if (processor) {
  	await processor.processOneTx(network as any, txId);
	}
}