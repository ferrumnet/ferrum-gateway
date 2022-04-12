import Web3 from "web3";
import inputs from "./bridgeCronInputs.json";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { scheduleJob } from "node-schedule";
import { connect } from "mongoose";
import moment from "moment";
import {
  Injectable,
  LongRunningScheduler,
  MetricsService,
  Networks,
} from "ferrum-plumbing";
import { TransactionModel } from "../models/transaction";
const IERC20_json_1 = require("./erc20.json");

require("dotenv").config();

export class NetworkTransactionWatcher implements Injectable {
  networksCache = {};
  withdrawSignedEventdHash: string;
  allowTargetEventdHash: string;
  setFeeEventdHash: string;
  removeLiquidityEventdHash: string;
  addLiquidityEventHash: string;
  bridgeSwapEventHash: string;
  transferBySignatureEventHash: string;
  symbol: string;
  decimal: string;

  networksBlockCache = {
    RINKEBY: {
      backLimit: 36000,
      lastToBlock: undefined,
    },
    ETHEREUM: {
      backLimit: 36000,
      lastToBlock: undefined,
    },
    POLYGON: {
      backLimit: 1000,
      lastToBlock: undefined,
    },
    MUMBAI_TESTNET: {
      backLimit: 1000,
      lastToBlock: undefined,
    },
    BSC_TESTNET: {
      backLimit: 5000,
      lastToBlock: undefined,
    },
    BSC: {
      backLimit: 5000,
      lastToBlock: undefined,
    },
    AVAX_TESTNET:{
      backLimit: 5000,
      lastToBlock: undefined,
    },
    MOON_MOONBASE:{
      backLimit: 5000,
      lastToBlock: undefined,
    },
    AVAX_MAINNET:{
      backLimit: 5000,
      lastToBlock: undefined,
    },
    MOON_MOONRIVER:{
      backLimit: 5000,
      lastToBlock: undefined,
    },
    FTM_TESTNET:{
      backLimit: 5000,
      lastToBlock: undefined,
    },
    HARMONY_TESTNET_0:{
      backLimit: 5000,
      lastToBlock: undefined,
    },
    SHIDEN_TESTNET:{
      backLimit: 5000,
      lastToBlock: undefined,
    },
    SHIDEN_MAINNET:{
      backLimit: 5000,
      lastToBlock: undefined,
    }
  };

  options = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  constructor(
    private metricsService: MetricsService,
    private scheduler: LongRunningScheduler // private helper: EthereumSmartContractHelper
  ) {
    this.networksCache = {
      RINKEBY: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_RINKEBY)
      ),
      ETHEREUM: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_ETHEREUM)
      ),
      POLYGON: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_POLYGON)
      ),
      MUMBAI_TESTNET: new Web3(
        new Web3.providers.HttpProvider(
          process.env.WEB3_PROVIDER_MUMBAI_TESTNET
        )
      ),
      BSC_TESTNET: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_BSC_TESTNET)
      ),
      BSC: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_BSC)
      ),
      AVAX_TESTNET: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_AVAX_TESTNET)
      ),
      MOON_MOONBASE: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_MOON_MOONBASE)
      ),
      AVAX_MAINNET: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_AVAX_MAINNET)
      ),
      MOON_MOONRIVER: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_MOON_MOONRIVER)
      ),
      FTM_TESTNET: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_FTM_TESTNET)
      ),
      HARMONY_TESTNET_0: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_HARMONY_TESTNET_0)
      ),
      SHIDEN_TESTNET: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_SHIDEN_TESTNET)
      ),
      SHIDEN_MAINNET: new Web3(
        new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_SHIDEN_MAINNET)
      )
    };

    this.withdrawSignedEventdHash = Web3.utils.sha3(
      "WithdrawSigned(address,address,uint256,bytes32,bytes)"
    );
    this.allowTargetEventdHash = Web3.utils.sha3(
      "AllowTarget(address, uint256, address)"
    );
    this.setFeeEventdHash = Web3.utils.sha3("SetFee(address,uint256)");
    this.removeLiquidityEventdHash = Web3.utils.sha3(
      "BridgeLiquidityRemoved(address,address,uint256)"
    );
    this.addLiquidityEventHash = Web3.utils.sha3(
      "BridgeLiquidityAdded(address,address,uint256)"
    );
    this.bridgeSwapEventHash = Web3.utils.sha3(
      "BridgeSwap(address,address,uint256,address,address,uint256)"
    );
    this.transferBySignatureEventHash = Web3.utils.sha3(
      "TransferBySignature(address,address,address,uint256,uint256)"
    );
    connect(process.env.MONGODB_URL, this.options).then(async () => {
      console.log("Connected to MongoDB");
    });
    this.run = this.run.bind(this);
  }

  async run() {
    this.processNetworkTransactions();
  }
  async processNetworkTransactions() {
    scheduleJob("*/30 * * * * *", async () => {
      try {
        const web3ProvidersList = await this.getWeb3Providers();
        for (const provider of web3ProvidersList) {
          let web3 = this.networksCache[`${provider}`];
          let currentBlock = await web3.eth.getBlockNumber();
          let blockTimestamp = await web3.eth.getBlock(currentBlock);
          let date = moment(new Date(blockTimestamp.timestamp * 1000)).format(
            "MM-DD-YYYY"
          );
          const NetworkNameByChainId = Networks.for(provider).chainId;
          let fromBlock = await this.getfromBlockNumber(provider, currentBlock);
          console.log(provider, fromBlock, currentBlock);
          if (fromBlock > 0) {
            const web3ProviderLogs = await web3.eth.getPastLogs({
              fromBlock: fromBlock,
              toBlock: currentBlock,
              address: process.env.CONTRACT_ADDRESS,
            });
            console.log(
              provider,
              fromBlock,
              currentBlock,
              web3ProviderLogs.length
            );
            this.metricsService.count(`fromBlock.${provider}`, fromBlock);
            this.metricsService.count(`currentBlock.${provider}`, currentBlock);
            this.metricsService.count(
              `totalLogs.${provider}`,
              web3ProviderLogs.length
            );
            await this.proccessNetworkLogs(
              web3ProviderLogs,
              provider,
              date,
              NetworkNameByChainId
            );
          }
          await this.updateToBlockNumer(currentBlock, provider);
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  }

  async getfromBlockNumber(network: String, currentBlock: number) {
    let lastToBlock = this.networksBlockCache[`${network}`].lastToBlock;
    if (!lastToBlock) {
      lastToBlock =
        currentBlock - this.networksBlockCache[`${network}`].backLimit;
    }
    return lastToBlock;
  }

  async updateToBlockNumer(toBlock: number, network: String) {
    this.networksBlockCache[`${network}`].lastToBlock = toBlock;
  }

  async getWeb3Providers() {
    return [
      "RINKEBY",
      "ETHEREUM",
      "POLYGON",
      "MUMBAI_TESTNET",
      "BSC",
      "BSC_TESTNET",
      "AVAX_TESTNET",
      "MOON_MOONBASE",
      "AVAX_MAINNET",
      "MOON_MOONRIVER",
      "FTM_TESTNET",
      "HARMONY_TESTNET_0",
      "SHIDEN_TESTNET",
      "SHIDEN_MAINNET"

    ];
  }

  async proccessNetworkLogs(
    logs: any,
    network: string,
    date: string,
    sent: string
  ) {
    let web3 = this.networksCache[`${network}`];
    for (let log of logs) {
      const transactionReceipt = await web3.eth.getTransactionReceipt(
        log.transactionHash
      );
      if (transactionReceipt) {
        for (let log of transactionReceipt.logs) {
          log = await this.parseLog(log, network);
        }
        await TransactionModel.findOneAndUpdate(
          {
            transactionHash: transactionReceipt.transactionHash,
          },
          {
            ...transactionReceipt,
            network: network,
            date,
            sent,
            symbol: this.symbol,
            decimal: this.decimal,
          },
          { upsert: true }
        );
      }
    }
  }

  async parseLog(log: any, network: string) {
    let web3 = this.networksCache[`${network}`];
    try {
      if (log?.topics?.length) {
        if (log.topics[0] === this.bridgeSwapEventHash) {
          // console.log("swap");
          const BridgeSwapdecodeLog = await web3.eth.abi.decodeLog(
            inputs.bridgeSwapInputs,
            log.data,
            log.topics.slice(1)
          );
          log.decodeBy = this.bridgeSwapEventHash;
          log.decodeFor = "BridgeSwapdecodeLog";
          log.decodedLog = BridgeSwapdecodeLog;
          // console.log(BridgeSwapdecodeLog);
          const currency = `${network}:${BridgeSwapdecodeLog.token.toLowerCase()}`;
          let symbolAndDecimal = await this.symbolAndDecimal(currency);
          this.symbol = symbolAndDecimal.symbol;
          this.decimal = symbolAndDecimal.decimal;
        } else if (log.topics[0] === this.transferBySignatureEventHash) {
          // console.log("transfer");
          const transferBySignaturedecodeLog = await web3.eth.abi.decodeLog(
            inputs.transferBySignatureInputs,
            log.data,
            log.topics.slice(1)
          );
          log.decodeBy = this.transferBySignatureEventHash;
          log.decodeFor = "transferBySignaturedecodeLog";
          log.decodedLog = transferBySignaturedecodeLog;
          const currency = `${network}:${transferBySignaturedecodeLog.token.toLowerCase()}`;
          let symbolAndDecimal = await this.symbolAndDecimal(currency);
          this.symbol = symbolAndDecimal.symbol;
          this.decimal = symbolAndDecimal.decimal;
          // console.log(transferBySignaturedecodeLog);
        } else if (log.topics[0] === this.addLiquidityEventHash) {
          // console.log("Add Liquidity");
          const bridgeLiquidityAddedLog = await web3.eth.abi.decodeLog(
            inputs.bridgeLiquidityAddedInputs,
            log.data,
            log.topics.slice(1)
          );
          log.decodeBy = this.addLiquidityEventHash;
          log.decodeFor = "bridgeLiquidityAddedLog";
          log.decodedLog = bridgeLiquidityAddedLog;
          const currency = `${network}:${bridgeLiquidityAddedLog.token.toLowerCase()}`;
          let symbolAndDecimal = await this.symbolAndDecimal(currency);
          this.symbol = symbolAndDecimal.symbol;
          this.decimal = symbolAndDecimal.decimal;
          // console.log(bridgeLiquidityAddedLog);
        } else if (log.topics[0] === this.removeLiquidityEventdHash) {
          // console.log("Remove Liquidity");
          const bridgeLiquidityRemovesLog = await web3.eth.abi.decodeLog(
            inputs.bridgeLiquidityRemovedInputs,
            log.data,
            log.topics.slice(1)
          );
          log.decodeBy = this.removeLiquidityEventdHash;
          log.decodeFor = "bridgeLiquidityRemovesLog";
          log.decodedLog = bridgeLiquidityRemovesLog;
          const currency = `${network}:${bridgeLiquidityRemovesLog.token.toLowerCase()}`;
          let symbolAndDecimal = await this.symbolAndDecimal(currency);
          this.symbol = symbolAndDecimal.symbol;
          this.decimal = symbolAndDecimal.decimal;
          // console.log(bridgeLiquidityRemovesLog);
        } else if (log.topics[0] === this.setFeeEventdHash) {
          // console.log("Set Fee");
        } else if (log.topics[0] === this.allowTargetEventdHash) {
          // console.log("Allow Target");
        } else if (log.topics[0] === this.withdrawSignedEventdHash) {
          // console.log("Withdraw Signed");
          const withdrawSignedEventdHash = await web3.eth.abi.decodeLog(
            inputs.withdrawSignedVerify,
            log.data,
            log.topics.slice(1)
          );
          log.decodeBy = this.removeLiquidityEventdHash;
          log.decodeFor = "withdrawSignedVerify";
          log.decodedLog = withdrawSignedEventdHash;
          const currency = `${network}:${withdrawSignedEventdHash.token.toLowerCase()}`;
          let symbolAndDecimal = await this.symbolAndDecimal(currency);
          this.symbol = symbolAndDecimal.symbol;
          this.decimal = symbolAndDecimal.decimal;
        } else {
          // console.log("different");
        }
      } else {
        // console.log("topic null");
      }
    } catch (e) {
      console.log(e.message);
    }
    return log;
  }

  async symbolAndDecimal(currency) {
    const [network, token] =
      EthereumSmartContractHelper.parseCurrency(currency);
    const tokenCon = this.erc20(network, token);
    const symbol = await tokenCon.methods.symbol().call();
    const decimal = await tokenCon.methods.decimals().call();
    return { symbol, decimal };
  }
  erc20(network, token) {
    const web3 = this.networksCache[`${network}`];
    return new web3.eth.Contract(IERC20_json_1, token);
  }
  __name__() {
    return "NetworkTransactionWatcher";
  }
}
