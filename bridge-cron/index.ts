import Web3 from "web3";
import schedule from "node-schedule";
import { Schema, model, connect, Document } from 'mongoose';
import { LocalCache } from "ferrum-plumbing";
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

// 3. Create a Model.
const TransactionModel = model('Transaction', transactionsSchema);


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
})
