import { ValidationUtils } from "ferrum-plumbing";
import { argv } from "process";
import { processOneTx, processOneWay } from "./BridgeProcessor";
console.log('Starting ');

// const argv = ['0', '0', 'RINKEBY', '0x8b2efe5656e4f011ca8fa6a7a29047932404ad6ae15dad5ce8fbf0361bfc8920'];

const net = argv[2];
// const net = 'RINKEBY';
// const net = 'MUMBAI_TESTNET';
// const net = 'BSC_TESTNET';
// const net = 'POLYGON';
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