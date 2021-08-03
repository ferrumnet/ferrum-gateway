import { ValidationUtils } from "ferrum-plumbing";
import { argv } from "process";
import { processOneTx, processOneWay } from "./BridgeProcessor";
console.log('Starting ');

argv[2] = 'ETHEREUM';
argv[3] = '0xdb38951e24ea6d9ea4cf419e447de8a60f85173cf1cbff2a93da3ad0736e9447';

const net = argv[2];
// const net = 'RINKEBY';
// const net = 'MUMBAI_TESTNET';
// const net = 'BSC_TESTNET';
if (!net) {
    console.log('Syntax error: include network as an argument');
} else {
	const txId = argv[3];
	if (!!txId) {
		if (txId === '--all') {
    		processOneWay(net, true).catch(console.error);
		} else {
    		processOneTx(net, txId).catch(console.error);
		}
	} else {
    	processOneWay(net, false).catch(console.error);
	}
}
