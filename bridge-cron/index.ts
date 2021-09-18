// export * from '../bridge-cron/src/node/BridgeNodeV12';
import Web3 from "web3";
import schedule from "node-schedule";
import { Schema, model, connect, Document } from 'mongoose';
import { Injectable, LocalCache } from "ferrum-plumbing";
require('dotenv').config();
const GLOBAL_CACHE = new LocalCache();


const options = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
connect(process.env.MONGODB_URL, options).then(async () => {
  console.log('Connected to MongoDB');
});

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
const rinkebySchema = new Schema ({
  rinkebyTransaction: { type: Object, required: true }
});
const ethereumSchema = new Schema ({
  ethereumTransaction: { type: Object, required: true }
});
const testNetSchema = new Schema ({
  testNetTransaction: { type: Object, required: true }
});

// 3. Create a Model.
const TransactionModel = model('Transaction', transactionsSchema);
// const RinkebyModel = model('Rinkeby', rinkebySchema)
// const EthereumModel = model('Ethereum', ethereumSchema)
// const testNetModel = model('Testnet', testNetSchema)


const getPreviousTransactions = async() => {
  const key = "getPreviousTransactions";
  return await GLOBAL_CACHE.getAsync(
    key,
    async () => {
        const res = await TransactionModel.find().exec();
      if (res) {
        return res.map((r) => r.toJSON());
      }
    },
  );
};

const web3Providers = [process.env.WEB3_PROVIDER_RINKEBY,process.env.WEB3_PROVIDER_ETHEREUM]
const getWeb3Providers = async() => {
  const key = "getWeb3Providers";
  return await GLOBAL_CACHE.getAsync(
    key,
      async () => {
        return web3Providers.map((r) => r);
    },
  );
};

let count = 0;
schedule.scheduleJob('1 * * * * *', async () => {
  let pendingTransaction = [];
  const pendingTransactionList = await getPreviousTransactions();
  const web3ProvidersList = await getWeb3Providers();
  // console.log(web3ProvidersList)
  console.log(pendingTransactionList.length)
  if (pendingTransactionList.length) {
    pendingTransactionList.forEach((tx: any) => {
  web3ProvidersList.forEach(async (provider) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(provider));
    // await web3.eth.getPendingTransactions((err, result) => {
    //   if(err) console.log(err,'Error')
    //   if (result) {
    //     result.forEach((tx) => {
    //       console.log(tx)
    //       tx.to === '0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877'? pendingTransaction.push(tx.hash): null
    //     });
    //   }
    // })
    const currentBlock = await web3.eth.getBlockNumber()
    const web3ProviderLogs = await web3.eth.getPastLogs({ fromBlock: 1, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
    web3ProviderLogs.forEach(async (log) => {
      if (log.transactionHash !== tx.transactionHash) {
        await web3.eth.getTransactionReceipt(log.transactionHash, async (err, result) => {
          if (err) console.log('Error')
          if (result) {
            await TransactionModel.findOne({ transactionHash: result.transactionHash }, async function (err, data) {
              // if (data) {
              //         await Object.assign(data, result);
              //     } else     
              if (!err && !data) {
                      const transaction = new TransactionModel(result);
                      await transaction.save();
                GLOBAL_CACHE.set('getPreviousTransactions', transaction)
                const transactionList = await getPreviousTransactions();
                      console.log(transactionList.length,'length')
                  }
              })
          }
        })
      }
    });
  })
  })
  }
  
  // const rinkebySet = new Set()
  // const ethereumSet = new Set()
  // const polygonSet = new Set()
  // // const transactionsSet = new Set()
  // // let web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_RINKEBY));
  // let currentRinkebyBlock = await web3Rinkeby.eth.getBlockNumber();
  // let currentEthereumBlock = await web3Ethereum.eth.getBlockNumber();
  // const rinkebyblockLogs = await web3Rinkeby.eth.getPastLogs({ fromBlock: 0, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
  // const ethereumblockLogs = await web3Ethereum.eth.getPastLogs({ fromBlock: 0, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
  // // const polygonblockLogs = await web3Polygon.eth.getPastLogs({ fromBlock: 0, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
  // console.log(`Size for "rinkebyblockLogs length" is ${rinkebyblockLogs.length}`);
  // console.log(`Size for "etherumblockLogs length" is ${ethereumblockLogs.length}`);
  // // console.log(`Size for "polygonblockLogs length" is ${polygonblockLogs.length}`);
  // const transactionsLogs = [...rinkebyblockLogs, ...ethereumblockLogs]
  // console.log(`Size for "transactionsLogs length" is ${transactionsLogs.length}`);
  // rinkebyblockLogs.forEach((log) => {
  //     if (!rinkebySet.has(log.transactionHash)) {
  //         rinkebySet.add(log.transactionHash)
  //     }
  // })
  // rinkebySet.forEach(async (tx: string) => {
  //     await web3Rinkeby.eth.getTransactionReceipt(tx, async (err, result) => {
  //         if (err) console.log(err, 'Error')
  //         if (result) {
  //             await TransactionModel.findOne({ transactionHash: result.transactionHash }, async function (err, data) {
  //                 if (data.status !== result.status) {
  //                     await Object.assign(data, result);
  //                 } else if (!err && !data) {
  //                     const transaction = new TransactionModel(result);
  //                     await transaction.save();
  //                 }
  //             })
  //         }
  //     })
  // })
  // ethereumblockLogs.forEach((log) => {
  //     if (!ethereumSet.has(log.transactionHash)) {
  //         ethereumSet.add(log.transactionHash)
  //     }
  // })
  // ethereumSet.forEach(async (tx: string) => {
  //     await web3Ethereum.eth.getTransactionReceipt(tx, async (err, result) => {
  //         if (err) console.log(err, 'Error')
  //         if (result) {
  //             await TransactionModel.findOne({ transactionHash: result.transactionHash }, async function (err, data) {
  //                 if (data.status !== result.status) {
  //                     await Object.assign(data, result);
  //                 } else if (!err && !data) {
  //                     const transaction = new TransactionModel(result);
  //                     await transaction.save();
  //                 }
  //             })
  //         }
  //     })
  // })
  //     polygonblockLogs.forEach((log) => {
  //         if (!polygonSet.has(log.transactionHash)) {
  //             polygonSet.add(log.transactionHash)
  //         }
  //     })
  //     polygonSet.forEach(async (tx: string) => {
  //         await web3Polygon.eth.getTransactionReceipt(tx, async (err, result) => {
  //             if (err) console.log(err, 'Error')
  //             if (result)
  //                 await TransactionModel.findOne({ transactionHash: result.transactionHash }, async function (err, data) {
  //                     if (!err && !data) {
  //                         const transaction = new TransactionModel(result);
  //                         await transaction.save();
  //                     }
  //                 })
  //         })
  //     })
  // console.log(`Size for "Rinkebylogs" is ${rinkebyblockLogs.length} and transactions ${rinkebySet.size}`);
  // console.log(`Size for "ethereumblockLogs" is ${ethereumblockLogs.length} and transactions ${ethereumSet.size}`);
      // console.log(`Size for "polygonblockLogs" is ${polygonblockLogs.length} and transactions ${polygonSet.size}`);
  // const ethereumSet = new Set()
  // web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_ETHEREUM));
  // try {
  //     const ethereumBlockLogs = await web3.eth.getPastLogs({ fromBlock: 0, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
  //     console.log(`Size for "ethereumBlockLogs latest" is ${ethereumBlockLogs.length}`);
  //     ethereumBlockLogs.forEach((log) => {
  //         if(!ethereumSet.has(log.transactionHash))
  //             ethereumSet.add(log.transactionHash)
  //     })
  //     ethereumSet.forEach(async (tx: string) => {
  //         await web3.eth.getTransactionReceipt(tx, async (err, result) => {
  //         if (err) console.log(err)
  //         if(result)
  //             await TransactionModel.findOne({ 'ethereumTransaction.transactionHash' : result.transactionHash }, async function (err, data) {
  //                 if (!err && !data) {
  //                     const transaction = new TransactionModel({ ethereumTransaction: result });
  //                     await transaction.save();
  //                 }
  //             })
  //         })
  //     })
  //     console.log(`Size for "ethereumBlocklogs" is ${ethereumBlockLogs.length} and transactions ${ethereumSet.size}`);
  // }
  // catch (e) {
  //     console.log(`Exception is ${e}`);
  // }
  // const testNetSet = new Set()
  // web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_BSC_TESTNET));
  // try {
  //     const testNetBlockLogs = await web3.eth.getPastLogs({ fromBlock: 0, toBlock: Math.ceil((await web3.eth.getBlockNumber())/3600), address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
  //     console.log(`Size for "testNetBlockLogs latest" is ${testNetBlockLogs.length}`);
  //         testNetBlockLogs.forEach((log) => {
  //         if(!testNetSet.has(log.transactionHash))
  //             testNetSet.add(log.transactionHash)
  //     })
  //     testNetSet.forEach(async (tx: string) => {
  //             await web3.eth.getTransactionReceipt(tx, async (err, result) => {
  //             // console.log(result,'testnet')
  //             if (err) console.log(err)
  //             if(result)
  //             await TransactionModel.findOne({ 'Transaction.transactionHash' : result.transactionHash }, async function (err, data) {
  //                 if (!err && !data) {
  //                     const transaction = new TransactionModel({ testNetTransaction: result });
  //                     await transaction.save();
  //                 }
  //             })
  //         })
  //     })
  //     console.log(`Size for "testNetBlockLogs" is ${testNetBlockLogs.length} and transactions ${testNetSet.size}`);
  // }
  // catch (e) {
  //         console.log(`Exception is ${e}`);
  // }
})

// { 'rinkebyTransaction.hash' : '0x391eab2a368197a88b7273c617adf90eb785bee472df51e3ff003b8380c97fa0'}

// Error: Returned error: daily request count exceeded, request rate limited
//     at Object.ErrorResponse (F:\xislabs\ferrum-gateway\node_modules\web3-core-helpers\lib\errors.js:28:19)
//     at F:\xislabs\ferrum-gateway\node_modules\web3-core-requestmanager\lib\index.js:302:36
//     at XMLHttpRequest.request.onreadystatechange (F:\xislabs\ferrum-gateway\node_modules\web3-providers-http\lib\index.js:98:13)
//     at XMLHttpRequestEventTarget.dispatchEvent (F:\xislabs\ferrum-gateway\node_modules\xhr2-cookies\xml-http-request-event-target.ts:44:13)
//     at XMLHttpRequest._setReadyState (F:\xislabs\ferrum-gateway\node_modules\xhr2-cookies\xml-http-request.ts:219:8)
//     at XMLHttpRequest._onHttpResponseEnd (F:\xislabs\ferrum-gateway\node_modules\xhr2-cookies\xml-http-request.ts:345:8)
//     at IncomingMessage.<anonymous> (F:\xislabs\ferrum-gateway\node_modules\xhr2-cookies\xml-http-request.ts:311:39)
//     at IncomingMessage.emit (events.js:388:22)
//     at IncomingMessage.emit (domain.js:470:12)
//     at endReadableNT (internal/streams/readable.js:1336:12)
//     at processTicksAndRejections (internal/process/task_queues.js:82:21) {
//   data: {
//     rate: {
//       allowed_rps: 1,
//       backoff_seconds: 30,
//       current_rps: 23.666666666666668
//     },
//     see: 'https://infura.io/dashboard'
//   }
// }


// const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/498f412c002d42d8ba75293910cae6f8'));
// const block = await web3.eth.getBlockNumber();
