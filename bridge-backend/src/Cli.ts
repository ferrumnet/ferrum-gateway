import { ValidationUtils } from "ferrum-plumbing";
import { argv } from "process";
import { processFromFile, processOneTx, processOneWay } from "./BridgeProcessor";
import fs from 'fs';
console.log('Starting ');

// argv[2] = 'BSC';
// argv[3] = '--all';

// argv[2] = 'BSC';
argv[3] = '--offline';
argv[4] = '/tmp/test.csv';

// const net = argv[2];
const net = 'RINKEBY';
// const net = 'MUMBAI_TESTNET';
// const net = 'BSC_TESTNET';
if (!net) {
    console.log('Syntax error: include network as an argument');
} else {
	const txId = argv[3];
	if (!!txId) {
		if (txId === '--all') {
    		processOneWay(net, true).catch(console.error);
		} else if (txId === '--offline') {
				processFromFile(net, fs.readFileSync(argv[4]).toString());
		} else {
    		processOneTx(net, txId).catch(console.error);
		}
	} else {
    	processOneWay(net, false).catch(console.error);
	}
}
