import Web3 from "web3";

import schedule from "node-schedule";

import { Schema, model, connect, Document } from 'mongoose';

import { LocalCache } from "ferrum-plumbing";

import { Console } from "console";



require('dotenv').config();

const GLOBAL_CACHE = new LocalCache();




const options = {

  useCreateIndex: true,

  useFindAndModify: false,

  useNewUrlParser: true,

  useUnifiedTopology: true,

}



let networksCache = {

  RINKEBY: new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_RINKEBY)),

  RINKEBY_WSS : new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/1129bcc9a4c549ee9d5a6d98ad40133e'))

}



let networksBlockCache = {

  RINKEBY: {

    backLimit: 36000,

    lastToBlock : undefined

  }

}



// 1. Create an interface representing a document in MongoDB.

interface Transactions {

  blockHash: String,

  blockNumber: Number,

  contractAddress: String,

  cumulativeGasUsed: Number,

  effectiveGasPrice: String,

  from: String,

  gasUsed: Number,

  logs: Array<Object>,

  logsBloom: String,

  status: Boolean,

  to: String,

  transactionHash: String,

  transactionIndex: Number,

  type: String,

}



// 2. Create a Schema corresponding to the document interface.

const transactionsSchema: Schema = new Schema <Document & Transactions>({

  transaction: { type: String },

  blockHash: { type: Number },

  blockNumber:{ type: Object },

  contractAddress: { type: String },

  cumulativeGasUsed: { type: Number },

  effectiveGasPrice: { type: String },

  from: { type: String },

  gasUsed: { type: Number },

  logs: { type: Array },

  logsBloom: { type: String },

  status: { type: Boolean },

  to: { type: String },

  transactionHash: { type: String },

  transactionIndex: { type: Number },

  type: { type: String },

});



// 3. Create a Model.

const TransactionModel = model('Transaction', transactionsSchema);



// 4. Create db connection and fetch existing transaction

connect(process.env.MONGODB_URL, options).then(async () => {

  console.log('Connected to MongoDB');

  // cacheMemory = await TransactionModel.find();

});




const getfromBlockNumber = (network:String,currentBlock:number) => {

  let lastToBlock = networksBlockCache[`${network}`].lastToBlock;

  if (!lastToBlock) {

    lastToBlock = currentBlock - networksBlockCache[`${network}`].backLimit;

  }

  return lastToBlock;

}



const updateToBlockNumer = (toBlock:number,network:String) => {

  networksBlockCache[`${network}`].lastToBlock = toBlock;

}




const getWeb3Providers = async() => {

  return ['RINKEBY'];

};


const withdrawSignedEventdHash = Web3.utils.sha3('WithdrawSigned(address,address,uint256,bytes32,bytes)');

const allowTargetEventdHash = Web3.utils.sha3('AllowTarget(address, uint256, address)');

const setFeeEventdHash = Web3.utils.sha3('SetFee(address,uint256)');

const removeLiquidityEventdHash = Web3.utils.sha3('BridgeLiquidityRemoved(address,address,uint256)');

const addLiquidityEventHash	 = Web3.utils.sha3('BridgeLiquidityAdded(address,address,uint256)');
 
const bridgeSwapEventHash = Web3.utils.sha3('BridgeSwap(address,address,uint256,address,address,uint256)');

const transferBySignatureEventHash = Web3.utils.sha3('TransferBySignature(address,address,address,uint256,uint256)')



console.log(withdrawSignedEventdHash, 'withdrawSignedEventdHash');

console.log(allowTargetEventdHash, 'allowTargetEventdHash');

console.log(setFeeEventdHash, 'setFeeEventdHash');

console.log(removeLiquidityEventdHash,'removeLiquidityEventdHash');

console.log(addLiquidityEventHash,'addLiquidityEventHash');

console.log(bridgeSwapEventHash,'bridgeSwapEventHash');

console.log(transferBySignatureEventHash,'transferBySignatureEventHash');



const proccessNetworkLogs = async (logs:any,network:string) => {

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

          const testABI = [

          {

            "indexed": false,

            "internalType": "address",

            "name": "signer",

            "type": "address"

          },

          {

            "indexed": false,

            "internalType": "address",

            "name": "receiver",

            "type": "address"

          },

          {

            "indexed": false,

            "internalType": "address",

            "name": "token",

            "type": "address"

          },

          {

            "indexed": false,

            "internalType": "uint256",

            "name": "amount",

            "type": "uint256"

          },

          {

            "indexed": false,

            "internalType": "uint256",

            "name": "fee",

            "type": "uint256"

          }

        ]



        if(log?.topics?.length){

          if(log.topics[0] === bridgeSwapEventHash){

            console.log("swap")
            
            const bridgeSwapInputs = [
              {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "token",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "targetNetwork",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "targetToken",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "targetAddrdess",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ]

            const BridgeSwapdecodeLog = await web3.eth.abi.decodeLog(bridgeSwapInputs,log.data,log.topics);

             console.log(BridgeSwapdecodeLog)

          } else if (log.topics[0] === transferBySignatureEventHash){

            console.log("transfer")
            
            const transferBySignatureInputs = [
              {
                "indexed": false,
                "internalType": "address",
                "name": "signer",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "receiver",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
              }
            ]

            const transferBySignaturedecodeLog = await web3.eth.abi.decodeLog(transferBySignatureInputs,log.data,log.topics);

             console.log(transferBySignaturedecodeLog)

          } else if (log.topics[0] === addLiquidityEventHash) {

            console.log("Add Liquidity")

            const bridgeLiquidityAddedInputs = [
              {
                "indexed": false,
                "internalType": "address",
                "name": "actor",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ]

            const bridgeLiquidityAddedLog = await web3.eth.abi.decodeLog(bridgeLiquidityAddedInputs,log.data,log.topics);

             console.log(bridgeLiquidityAddedLog)

          } else if (log.topics[0] === removeLiquidityEventdHash) {

            console.log("Remove Liquidity")

            const bridgeLiquidityRemovedInputs = [
              {
                "indexed": false,
                "internalType": "address",
                "name": "actor",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ]

            const bridgeLiquidityRemovesLog = await web3.eth.abi.decodeLog(bridgeLiquidityRemovedInputs,log.data,log.topics);

             console.log(bridgeLiquidityRemovesLog)

          
          } else if (log.topics[0] === setFeeEventdHash) {

            console.log("Set Fee")
            
          } else if (log.topics[0] === allowTargetEventdHash) {

            console.log("Allow Target")
            
          } else if (log.topics[0] === withdrawSignedEventdHash) {

            console.log("Withdraw Signed")
            
          }
          else {

            console.log("different")

          }

        }else{

          console.log("topic null")

        }



        // const decodeLog = await web3.eth.abi.decodeLog(testABI,log.data,log.topics);

        // console.log(decodeLog)



                  }

                  catch (e){

                    console.log(e);

                  }

                })

              }

            })

          }

        })

    });

  

}



// const getPendingTransactions = async () => {

  

//   let RINKEBY_WSS = networksCache[`RINKEBY_WSS`];




//   RINKEBY_WSS.eth.subscribe(`pendingTransactions`, function (error, result) {

//     if (error)

//       console.log("Error: ", error);

//   }).on('data', async function (TxHash) {

//     try {

//       let RINKEBY = networksCache[`RINKEBY`];

//       let transaction = await RINKEBY.eth.getTransaction(TxHash);

//       console.log(transaction,'outer')

//       if (transaction?.to === "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877") {

//         console.log(transaction)

//         await RINKEBY.eth.getTransactionReceipt(transaction.hash, async (err, result) => {

//           if (err) console.log('Error')

//           if (result) {

//             console.log(result)

//             await TransactionModel.findOne({ transactionHash: result.transactionHash }, async function (err, data) {

//               if (!err && !data) {

//                 const transaction = new TransactionModel(result);

//                 await transaction.save();

//                 updateCacheForTransaction(transaction);

//               }

//             })

//           }

//         })

//         cacheMemory.push(transaction);



//       } else {

//         console.log("external")

//       }

//     } catch (error) {

//       console.log(error)

//     }

//   });

// }



schedule.scheduleJob('*/15 * * * * *', async () => {



  const web3ProvidersList = await getWeb3Providers();



  // console.log(cacheMemory.length, 'cache memory');

  // console.log(web3ProvidersList,"web3ProvidersList")

  

  web3ProvidersList.forEach(async (provider) => {

    // console.log('provider', provider)

    let web3 = networksCache[`${provider}`];

    const currentBlock = await web3.eth.getBlockNumber();

    let fromBlock = getfromBlockNumber(provider, currentBlock);

    

    console.log(provider, fromBlock, currentBlock)

    

    if (fromBlock > 0) {

      const web3ProviderLogs = await web3.eth.getPastLogs({ fromBlock: fromBlock, toBlock: currentBlock, address: process.env.CONTRACT_ADDRESS })

      console.log(provider, fromBlock, currentBlock,web3ProviderLogs.length)

      proccessNetworkLogs(web3ProviderLogs, provider);

    }

    updateToBlockNumer(currentBlock, provider);

  })



})