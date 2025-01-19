import { LambdaGlobalContext } from "aws-lambda-helper";
import { SimpleNode } from "./SimpleNode";
import { SimpleNodeModule } from "./SimpleNodeModule";
require('dotenv').config()

const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));

async function init() {
  const container = await LambdaGlobalContext.container();
  await container.registerModule(new SimpleNodeModule());
  return container.get<SimpleNode>(SimpleNode);
}

async function main() {
  const node = await init();
  while (true) {
    await node.processPending();
    await sleep(parseInt(process.env.LOOP_SECONDS || '10'));
  }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});