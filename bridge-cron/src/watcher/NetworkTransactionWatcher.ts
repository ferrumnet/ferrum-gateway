import Web3 from "web3";
import inputs from "./bridgeCronInputs.json";
import { scheduleJob } from "node-schedule";
import { connect } from "mongoose";
import moment from "moment";
import {
  Injectable,
  LongRunningScheduler,
  MetricsService,
} from "ferrum-plumbing";
import { TransactionModel } from "../models/transaction";

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
  };

  options = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  constructor(
    private metricsService: MetricsService,
    private scheduler: LongRunningScheduler
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
          console.log("provider", provider);
          let web3 = this.networksCache[`${provider}`];
          let currentBlock = await web3.eth.getBlockNumber();
          let blockTimestamp = await web3.eth.getBlock(currentBlock);
          let age = moment(new Date(blockTimestamp.timestamp * 1000));
          let start = moment(Date.now());
          let duration = moment.duration(start.diff(age));
          let days = duration.asDays().toFixed();
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
            await this.proccessNetworkLogs(web3ProviderLogs, provider, days);
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
    ];
  }

  async proccessNetworkLogs(logs: any, network: string, age) {
    let web3 = this.networksCache[`${network}`];
    for (let log of logs) {
      const transactionReceipt = await web3.eth.getTransactionReceipt(
        log.transactionHash
      );
      if (transactionReceipt) {
        for (let log of transactionReceipt.logs) {
          log = await this.parseLog(log, network);
        }
        // console.log(transactionReceipt);
        await TransactionModel.findOneAndUpdate(
          {
            transactionHash: transactionReceipt.transactionHash,
          },
          {
            ...transactionReceipt,
            network: network,
            age,
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
            log.topics
          );
          log.decodeBy = this.bridgeSwapEventHash;
          log.decodeFor = "BridgeSwapdecodeLog";
          log.decodedLog = BridgeSwapdecodeLog;
          // console.log(BridgeSwapdecodeLog);
        } else if (log.topics[0] === this.transferBySignatureEventHash) {
          // console.log("transfer");
          const transferBySignaturedecodeLog = await web3.eth.abi.decodeLog(
            inputs.transferBySignatureInputs,
            log.data,
            log.topics
          );
          log.decodeBy = this.transferBySignatureEventHash;
          log.decodeFor = "transferBySignaturedecodeLog";
          log.decodedLog = transferBySignaturedecodeLog;
          // console.log(transferBySignaturedecodeLog);
        } else if (log.topics[0] === this.addLiquidityEventHash) {
          // console.log("Add Liquidity");
          const bridgeLiquidityAddedLog = await web3.eth.abi.decodeLog(
            inputs.bridgeLiquidityAddedInputs,
            log.data,
            log.topics
          );
          log.decodeBy = this.addLiquidityEventHash;
          log.decodeFor = "bridgeLiquidityAddedLog";
          log.decodedLog = bridgeLiquidityAddedLog;
          // console.log(bridgeLiquidityAddedLog);
        } else if (log.topics[0] === this.removeLiquidityEventdHash) {
          // console.log("Remove Liquidity");
          const bridgeLiquidityRemovesLog = await web3.eth.abi.decodeLog(
            inputs.bridgeLiquidityRemovedInputs,
            log.data,
            log.topics
          );
          log.decodeBy = this.removeLiquidityEventdHash;
          log.decodeFor = "bridgeLiquidityRemovesLog";
          log.decodedLog = bridgeLiquidityRemovesLog;
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
            log.topics
          );
          log.decodeBy = this.removeLiquidityEventdHash;
          log.decodeFor = "withdrawSignedVerify";
          log.decodedLog = withdrawSignedEventdHash;
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
  __name__() {
    return "NetworkTransactionWatcher";
  }
}
