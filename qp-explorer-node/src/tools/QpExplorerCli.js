const fs = require('fs');

function assure(j, fs) {
  for (f of fs) {
    if (!j[f]) {
      console.log(`No field ${f} found!`);

      throw new Error(`No field ${f} found`);
    }
  }
}

async function registerContract(url, networks, contractAddress, jsonFile) {
  console.log(`RegisterContract(${url}, ${networks}, ${jsonFile})`);
  const js = JSON.parse(fs.readFileSync(jsonFile));
  assure(js, ['contractName', 'sourceName', 'abi', 'bytecode', 'deployedBytecode']);
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      command: 'registerQpContract',
      data: {
        networks,
        contractAddress,
        contract: js,
      }
    }),
  });
  console.log('Fetched...');
}

const url = process.argv[2];
const file = process.argv[3];
const networks = process.argv[4].replace(' ','').split(',');
const address = process.argv[5];
console.log('SYNTAX:');
console.log('node ./tools/QpExplorerCli.js <backend url> <contract file> <networks> ')
if (!file) {
  throw new Error('File must be provided')
}
if (!networks) {
  throw new Error('Networks must be provided')
}
if (!url) {
  throw new Error('Url must be provided')
}
if (!address) {
  throw new Error('Address must be provided')
}

registerContract(url, networks, address, file).catch(console.error)