// export * from '../bridge-cron/src/node/BridgeNodeV12';
import Web3 from "web3";
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

const inputs = [
   {
        "indexed": false,
        "internalType": "address",
        "name": "from",
        "type": "address"
    }
];
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
const schema = new Schema({
  data: { type: Array, required: true },
});

// 3. Create a Model.
const FerrumModel = model('Ferrum', schema);

schedule.scheduleJob('*/20 * * * * *', async () => {
    
    const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/498f412c002d42d8ba75293910cae6f8'));
    
    const block = await web3.eth.getBlockNumber();
    try {
        const blockLogs = await web3.eth.getPastLogs({ fromBlock: Math.ceil(100000/3600), address: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877" })
        console.log(`Size for "latest" is ${blockLogs.length}`);
        const doc = new FerrumModel({data: blockLogs});
        await doc.save();
        // const decodedParameters = web3.eth.abi.decodeParameters(blockLogs, data);
    }
    catch (e) {
            console.log(`Exception is ${e}`);
    }
        // console.log(`Size for "pending" is ${blockLogs2.length}`);


    // blockLogs.forEach((tx, index) => {
        // console.log(tx)
        // console.log(web3.eth.abi.decodeLog(inputs,tx.data,[]),index)
    // })
    
    // console.log(totalTransactions)
    // const getblock = await web3.eth.getBlock(block)
    // console.log(getblock)

    // const contactInfo = new Contract("0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877", [], web3.givenProvider) as BridgePoolV12;
    // const lookBackBlocks = 2000;
    // const filter = {};
    // const result = await contactInfo.queryFilter({}, block - 100, block);
    // console.log(result);
    // console.log(contactInfo);
    // web3.eth.getTransaction('0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877', (err, tx) => {
    
    //     console.log(err,'error')
    // })
    // console.log('schedule')
// web3.eth.getTransactionFromBlock('0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877',2).then(console.log)
    
});

// console.log("hello world")

