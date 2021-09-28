import { Injectable} from "ferrum-plumbing";
import Web3 from "web3";
import { connect } from 'mongoose';
import { TransactionModel } from '../models/transaction'
import inputs from "../bridgeCronInputs.json"
require('dotenv').config();

let networksCache = {
  RINKEBY: new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_RINKEBY)),
  RINKEBY_WSS : new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/1129bcc9a4c549ee9d5a6d98ad40133e'))
}
let networksBlockCache = {
  RINKEBY: {
    backLimit: 36000,
    lastToBlock : undefined
  }
}

const options = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const withdrawSignedEventdHash = Web3.utils.sha3('WithdrawSigned(address,address,uint256,bytes32,bytes)');
const allowTargetEventdHash = Web3.utils.sha3('AllowTarget(address, uint256, address)');
const setFeeEventdHash = Web3.utils.sha3('SetFee(address,uint256)');
const removeLiquidityEventdHash = Web3.utils.sha3('BridgeLiquidityRemoved(address,address,uint256)');
const addLiquidityEventHash = Web3.utils.sha3('BridgeLiquidityAdded(address,address,uint256)');
const bridgeSwapEventHash = Web3.utils.sha3('BridgeSwap(address,address,uint256,address,address,uint256)');
const transferBySignatureEventHash = Web3.utils.sha3('TransferBySignature(address,address,address,uint256,uint256)');

export class NetworkTransactionWatcher implements Injectable {
  constructor() {
    this.run = this.run.bind(this);
  }

  async run() {
    connect(process.env.MONGODB_URL, options).then(async () => {
      console.log('Connected to MongoDB');
    });  
    const web3ProvidersList = await this.getWeb3Providers();
    console.log('provider',web3ProvidersList)
    web3ProvidersList.forEach(async (provider) => {
        let web3 = networksCache[`${provider}`];
        const currentBlock = await web3.eth.getBlockNumber();
        let fromBlock:any = this.getfromBlockNumber(provider, currentBlock);
        console.log(provider, fromBlock, currentBlock)
        if (fromBlock > 0) {
          const web3ProviderLogs = await web3.eth.getPastLogs({ fromBlock: fromBlock, toBlock: currentBlock, address: process.env.CONTRACT_ADDRESS })
          console.log(provider, fromBlock, currentBlock,web3ProviderLogs.length)
          this.proccessNetworkLogs(web3ProviderLogs, provider);
        }
        this.updateToBlockNumer(currentBlock, provider);
      })
    }

    async getfromBlockNumber ( network: String, currentBlock: number ){
      let lastToBlock = networksBlockCache[`${network}`].lastToBlock;
      if (!lastToBlock) {
        lastToBlock = currentBlock - networksBlockCache[`${network}`].backLimit;
      }
      return lastToBlock;
    }
  
    async updateToBlockNumer (toBlock:number,network:String) {
      networksBlockCache[`${network}`].lastToBlock = toBlock;
  }
  
    async getWeb3Providers () {
      return ['RINKEBY'];
    };

    async proccessNetworkLogs (logs:any,network:string) {
      let web3 = networksCache[`${network}`];
      logs.forEach(async (log) => {
        await web3.eth.getTransactionReceipt(log.transactionHash, async (err, result) => {
          if (err) console.log('Error')
          if (result) {
            await TransactionModel.findOne({ transactionHash: 1 }, async function (err, data) {
              if (!err && !data) {
                const transaction = new TransactionModel(result);
                await transaction.save();
                result.logs.forEach(async (log:any) => {
                 try {
                  if(log?.topics?.length){
                    if(log.topics[0] === bridgeSwapEventHash){
                      console.log("swap")
                      const BridgeSwapdecodeLog = await web3.eth.abi.decodeLog(inputs.bridgeSwapInputs,log.data,log.topics);
                      console.log(BridgeSwapdecodeLog)
                    } else if (log.topics[0] === transferBySignatureEventHash){
                      console.log("transfer")
                      const transferBySignaturedecodeLog = await web3.eth.abi.decodeLog(inputs.transferBySignatureInputs,log.data,log.topics);
                      console.log(transferBySignaturedecodeLog)
                    } else if (log.topics[0] === addLiquidityEventHash) {
                      console.log("Add Liquidity")
                      const bridgeLiquidityAddedLog = await web3.eth.abi.decodeLog(inputs.bridgeLiquidityAddedInputs,log.data,log.topics);
                      console.log(bridgeLiquidityAddedLog)
                    } else if (log.topics[0] === removeLiquidityEventdHash) {
                      console.log("Remove Liquidity")
                      const bridgeLiquidityRemovesLog = await web3.eth.abi.decodeLog(inputs.bridgeLiquidityRemovedInputs,log.data,log.topics);
                      console.log(bridgeLiquidityRemovesLog)
                    } else if (log.topics[0] === setFeeEventdHash) {
                      console.log("Set Fee")
                    } else if (log.topics[0] === allowTargetEventdHash) {
                      console.log("Allow Target")
                    } else if (log.topics[0] === withdrawSignedEventdHash) {
                      console.log("Withdraw Signed")
                    } else {
                      console.log("different")
                    }
                  } else{
                    console.log("topic null")
                  }
                } catch (e){
                    console.log(e);
                  }
                })
              }
            })
          }
        })
      });
    }
    __name__() { return 'NetworkTransactionWatcher'; }
}