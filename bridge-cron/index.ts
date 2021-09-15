// export * from '../bridge-cron/src/node/BridgeNodeV12';
import Web3 from "web3";
import queue from "bull";
import schedule from "node-schedule";
import { Schema, model, connect } from 'mongoose';
import { BridgeNodeV12 } from "bridge-cron/src/node/BridgeNodeV12";
import { ConfigurableLogger, Container, ValidationUtils } from "ferrum-plumbing";
import { LambdaGlobalContext } from "aws-lambda-helper";
import { Lazy } from "types/dist/Lazy";
import { NodeModule } from "./src/node/NodeModule";
const containerLazy = Lazy.forAsync<Container>(async () => {
    const container = await LambdaGlobalContext.container();
    await container.registerModule(new NodeModule());
    return container;
});

async function init(twoFaId: string, twoFa: string): Promise<string> {
    ValidationUtils.isTrue(!!twoFaId, '"twoFaId" is required');
    ValidationUtils.isTrue(!!twoFa, '"twoFa" is required');
    const c = await containerLazy.getAsync();
    const node = c.get<BridgeNodeV12>(BridgeNodeV12);
    await node.init(twoFaId, twoFa);
    return 'done';
}
    // ValidationUtils.isTrue(!!"RINKEBY", '"network" is required');
    // const c = await containerLazy.getAsync();
    // const node = c.get<BridgeNodeV12>(BridgeNodeV12);
    // // await node.processFromHistory('RINKEBY');
    // const values = await node.processFromHistory('RINKEBY');
    // return 'Processed sucessfully';
    // syncForNetwork

// const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/498f412c002d42d8ba75293910cae6f8'));
// const block = await web3.eth.getBlockNumber();
// const contactInfo = new Contract("0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877", [], web3.givenProvider) as BridgePoolV12;
// const lookBackBlocks = 2000;
// const filter = contactInfo.filters.BridgeSwap();
// contactInfo.queryFilter(filter, block - lookBackBlocks, block)
// console.log(contactInfo);
// var contract1 = new web3.eth.Contract(abi, address, {gasPrice: '12345678', from: fromAddress});

// Set provider for all later instances to use
// Web3EthContract.setProvider('ws://localhost:8546');

// const contract = new Web3EthContract();
// contract.methods.somFunc().send()
// .on('receipt', function(){
    
// });

// const inputs = [
//    {
//         "indexed": false,
//         "internalType": "address",
//         "name": "from",
//         "type": "address"
//     }
// ];
const options = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
connect(process.env.MONGODB_URL, options).then(() => {
  console.log('Connected to MongoDB');
});

// 1. Create an interface representing a document in MongoDB.
// interface Ferrum {
//   data: object,
// }

// 2. Create a Schema corresponding to the document interface.
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
const RinkebyModel = model('Rinkeby', rinkebySchema);
const EthereumModel = model('Ethereum', ethereumSchema)
const testNetModel = model('Testnet', testNetSchema)

const myFirstQueue = new queue('rateLimited', {
    limiter: {
    max: 1000,
    duration: 30000
  }
});
schedule.scheduleJob('* */1 * * * *', async () => {
    const rinkebySet = new Set()
    let web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_RINKEBY));
    try {
        const rinkebyblockLogs = await web3.eth.getPastLogs({ fromBlock: 0, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
        console.log(`Size for "rinkebyblockLogs latest" is ${rinkebyblockLogs.length}`);
        rinkebyblockLogs.forEach((log) => {
            if(!rinkebySet.has(log.transactionHash))
                rinkebySet.add(log.transactionHash)
        })
        rinkebySet.forEach(async (tx: string) => {
            let job = await myFirstQueue.add(tx);
            myFirstQueue.process(async (job) => {
            return getRinkebyTransaction(job);
            });
            myFirstQueue.on('completed', (job, result) => {
                console.log(`Job completed with result ${result}`);
            })
            const getRinkebyTransaction = async(tx) => {
                await web3.eth.getTransaction(tx, async (err, result) => {
                // console.log(result,'rinkeby')
                if (err) console.log(err)
                if(result)
                await RinkebyModel.findOne({ 'rinkebyTransaction.hash' : result.hash }, async function (err, data) {
                    if (!err && !data) {
                        const transaction = new RinkebyModel({ rinkebyTransaction: result });
                        await transaction.save();
                    }
                })
            })
            }
        })
        console.log(`Size for "Rinkebylogs" is ${rinkebyblockLogs.length} and transactions ${rinkebySet.size}`);
    }
    catch (e) {
            console.log(`Exception is ${e}`);
    }
    const ethereumSet = new Set()
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_ETHEREUM));
    try {
        const ethereumBlockLogs = await web3.eth.getPastLogs({ fromBlock: 0, address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
        console.log(`Size for "ethereumBlockLogs latest" is ${ethereumBlockLogs.length}`);
        ethereumBlockLogs.forEach((log) => {
            if(!ethereumSet.has(log.transactionHash))
                ethereumSet.add(log.transactionHash)
        })
        ethereumSet.forEach(async (tx: string) => {
            let job = await myFirstQueue.add(tx);
            myFirstQueue.process(async (job) => {
            return getEthereumTransaction();
            });
            myFirstQueue.on('completed', (job, result) => {
                console.log(`Job completed with result ${result}`);
            })
            const getEthereumTransaction = async () => {
                await web3.eth.getTransaction(tx, async (err, result) => {
                // console.log(result,'ethereum')
                if (err) console.log(err)
                if(result)
                await EthereumModel.findOne({ 'ethereumTransaction.hash' : result.hash }, async function (err, data) {
                    if (!err && !data) {
                        const transaction = new EthereumModel({ ethereumTransaction: result });
                        await transaction.save();
                    }
                })
            })
            }
        })
        console.log(`Size for "ethereumBlocklogs" is ${ethereumBlockLogs.length} and transactions ${ethereumSet.size}`);
    }
    catch (e) {
        console.log(`Exception is ${e}`);
    }
    const testNetSet = new Set()
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_BSC_TESTNET));
    try {
        const testNetBlockLogs = await web3.eth.getPastLogs({ fromBlock: 0, toBlock: Math.ceil((await web3.eth.getBlockNumber())/3600), address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
        console.log(`Size for "testNetBlockLogs latest" is ${testNetBlockLogs.length}`);
            testNetBlockLogs.forEach((log) => {
            if(!testNetSet.has(log.transactionHash))
                testNetSet.add(log.transactionHash)
        })
        testNetSet.forEach(async (tx: string) => {
            let job = await myFirstQueue.add(tx);
            myFirstQueue.process(async (job) => {
            return getTestnetTransaction();
            });
            myFirstQueue.on('completed', (job, result) => {
                console.log(`Job completed with result ${result}`);
            })
            const getTestnetTransaction = async () => {
                await web3.eth.getTransaction(tx, async (err, result) => {
                // console.log(result,'testnet')
                if (err) console.log(err)
                if(result)
                await testNetModel.findOne({ 'Transaction.hash' : result.hash }, async function (err, data) {
                    if (!err && !data) {
                        const transaction = new testNetModel({ testNetTransaction: result });
                        await transaction.save();
                    }
                })
            })
            }
        })
        console.log(`Size for "testNetBlockLogs" is ${testNetBlockLogs.length} and transactions ${testNetSet.size}`);
    }
    catch (e) {
            console.log(`Exception is ${e}`);
    }
})