// export * from '../bridge-cron/src/node/BridgeNodeV12';
import schedule from "node-schedule";
import { BridgeNodeV12 } from "../bridge-cron/src/node/BridgeNodeV12";
import { Container, ValidationUtils } from "ferrum-plumbing";
import { LambdaGlobalContext } from "aws-lambda-helper";
import { Lazy } from "types/dist/Lazy";
import { NodeModule } from "./src/node/NodeModule";
const containerLazy = Lazy.forAsync<Container>(async () => {
    const container = await LambdaGlobalContext.container();
    await container.registerModule(new NodeModule());
    return container;
});

schedule.scheduleJob('*/10 * * * * *', async () => {
    ValidationUtils.isTrue(!!"RINKEBY", '"network" is required');
    const c = await containerLazy.getAsync();
    const node = c.get<BridgeNodeV12>(BridgeNodeV12);
    await node.processFromHistory('RINKEBY');
    // const values = await node.processFromHistory('RINKEBY');
    // return 'Processed sucessfully';
    // syncForNetwork
    console.log('schedule')
});

// console.log("hello world")

