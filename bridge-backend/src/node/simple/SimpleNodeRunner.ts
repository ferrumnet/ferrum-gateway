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

// async function runTest() {
//   const node = await init();
//   await node.processSingleTransactionById('ETHEREUM', '0x2815d33c6c01bb3811523d41c63a080114105f6a4179588a5da5a051050d6830')
//   // await node.processSingleTransactionById('ETHEREUM', '0x9a01cc6fee8df84a42027405a63fd751f290babcf928e05f0f34411d41139f78')

//   // await node.processSingleTransactionById('ETHEREUM', '0xfcfc6b24188cbd6def631604e3c488f447510cc4615a17bb9a40c024ba853669')
//   // generates arb:0x9ba2d4cab56610f1f556ca37e3c93dbd7f30f1652981e4e6fdeade3f9b94cfe8
  
//   // await node.processSingleTransactionById('BSC', '0x32755b4c850d523b8eb0b80e601cfdb9559e0d734e495fff35d2ca1dac7a6e2e')
//   process.exit(0);
// }

async function main() {
  const node = await init();
  while (true) {
    await node.processPending();
    await sleep(parseInt(process.env.LOOP_SECONDS || '10'));
  }
}

// runTest().catch(e => {
//     console.error(e);
//     process.exit(1);
// });

main().catch(e => {
    console.error(e);
    process.exit(1);
});