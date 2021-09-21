import Web3 from "web3";
import schedule from "node-schedule";
import { Schema, model, connect, Document } from 'mongoose';
import { LocalCache } from "ferrum-plumbing";
require('dotenv').config();
const GLOBAL_CACHE = new LocalCache();

let cacheMemory = [];

const options = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// 1. Create an interface representing a document in MongoDB.
interface Transactions {
  blockHash: String,
  blockNumber: Number,
  contractAddress: String,
  cumulativeGasUsed: Number,
  effectiveGasPrice: String,
  from: String,
  gasUsed: Number,
  logs: Array<Object>,
  logsBloom: String,
  status: Boolean,
  to: String,
  transactionHash: String,
  transactionIndex: Number,
  type: String,
}

// 2. Create a Schema corresponding to the document interface.
const transactionsSchema: Schema = new Schema <Document & Transactions>({
  transaction: { type: String },
  blockHash: { type: Number },
  blockNumber:{ type: Object },
  contractAddress: { type: String },
  cumulativeGasUsed: { type: Number },
  effectiveGasPrice: { type: String },
  from: { type: String },
  gasUsed: { type: Number },
  logs: { type: Array },
  logsBloom: { type: String },
  status: { type: Boolean },
  to: { type: String },
  transactionHash: { type: String },
  transactionIndex: { type: Number },
  type: { type: String },
});

// 3. Create a Model.
const TransactionModel = model('Transaction', transactionsSchema);

connect(process.env.MONGODB_URL, options).then(async () => {
  console.log('Connected to MongoDB');
  cacheMemory = await TransactionModel.find();
});

let networksCache = {
  RINKEBY: new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_RINKEBY)),
  RINKEBY_WSS : new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/1129bcc9a4c549ee9d5a6d98ad40133e'))
}
let networksBlockCache = {
  RINKEBY: {
    backLimit: 36000,
    lastToBlock : undefined
  }
}
const getfromBlockNumber = (network:String,currentBlock:number) => {
  let lastToBlock = networksBlockCache[`${network}`].lastToBlock;
  if (!lastToBlock) {
    lastToBlock = currentBlock - networksBlockCache[`${network}`].backLimit;
  }
  return lastToBlock;
}

const updateToBlockNumer = (toBlock:number,network:String) => {
  networksBlockCache[`${network}`].lastToBlock = toBlock;
}

const web3Providers = [process.env.WEB3_PROVIDER_RINKEBY]
const getWeb3Providers = async() => {
  return ['RINKEBY'];
};

const checkCacheForTransactionStatus = (transactionHash:string) => {
  if (cacheMemory?.length>0) {
    const element = cacheMemory.find((item) => item.transactionHash === transactionHash);
    if (element) {
      return element.status;
    }
  }
  return undefined;
}

const updateCacheForTransaction = (transaction: any) => {
  const elementIndex = cacheMemory.findIndex((item) => item.transactionHash === transaction.transactionHash);
  if (elementIndex >= 0) {
    cacheMemory[elementIndex] = transaction;
  } else {
    cacheMemory.push(transaction);
  }
}

const proccessNetworkLogs = async (logs:any,network:string) => {
  let web3 = networksCache[`${network}`];
  logs.forEach(async (log) => {
    const status = checkCacheForTransactionStatus(log.transactionHash);
      if (!status) {
        await web3.eth.getTransactionReceipt(log.transactionHash, async (err, result) => {
          if (err) console.log('Error')
          if (result) {
            await TransactionModel.findOne({ transactionHash: result.transactionHash }, async function (err, data) {
              if (!err && !data) {
                const transaction = new TransactionModel(result);
                await transaction.save();
                updateCacheForTransaction(transaction);
              }
            })
          }
        })
      }
    });
  
}

// const getPendingTransactions = async () => {
  
//   let RINKEBY_WSS = networksCache[`RINKEBY_WSS`];


//   RINKEBY_WSS.eth.subscribe(`pendingTransactions`, function (error, result) {
//     if (error)
//       console.log("Error: ", error);
//   }).on('data', async function (TxHash) {
//     try {
//       let RINKEBY = networksCache[`RINKEBY`];
//       let transaction = await RINKEBY.eth.getTransaction(TxHash);
//       console.log(transaction,'outer')
//       if (transaction?.to === "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877") {
//         console.log(transaction)
//         await RINKEBY.eth.getTransactionReceipt(transaction.hash, async (err, result) => {
//           if (err) console.log('Error')
//           if (result) {
//             console.log(result)
//             await TransactionModel.findOne({ transactionHash: result.transactionHash }, async function (err, data) {
//               if (!err && !data) {
//                 const transaction = new TransactionModel(result);
//                 await transaction.save();
//                 updateCacheForTransaction(transaction);
//               }
//             })
//           }
//         })
//         cacheMemory.push(transaction);

//       } else {
//         console.log("external")
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   });
// }

schedule.scheduleJob('*/15 * * * * *', async () => {

  const web3ProvidersList = await getWeb3Providers();

  console.log(cacheMemory.length, 'cache memory');
  // console.log(web3ProvidersList,"web3ProvidersList")
  
  web3ProvidersList.forEach(async (provider) => {
    console.log('provider', provider)
    let web3 = networksCache[`${provider}`];
    const currentBlock = await web3.eth.getBlockNumber();
    let fromBlock = getfromBlockNumber(provider, currentBlock);
    
    console.log(provider, fromBlock, currentBlock)
    
    if (fromBlock > 0) {
      const web3ProviderLogs = await web3.eth.getPastLogs({ fromBlock: fromBlock, toBlock: currentBlock, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
      proccessNetworkLogs(web3ProviderLogs, provider);
    }
    updateToBlockNumer(currentBlock, provider);
  })
})
