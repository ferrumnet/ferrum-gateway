import { HexString, ValidationUtils } from 'ferrum-plumbing';
import Web3 from 'web3';
import { Eth } from 'web3-eth';
// @ts-ignore
import {ecsign, toRpcSig, fromRpcSig, ecrecover, privateToAddress, publicToAddress} from 'ethereumjs-util';
import { ethers } from 'ethers';

const abi = ethers.utils.defaultAbiCoder;

export interface Eip712Params {
    contractName: string;
    contractVersion: string;
    method: string;
    args: { type: string, name: string, value: string }[],
    hash?: HexString;
    signature?: HexString;
}

export function domainSeparator(eth: Eth,
        contractName: string,
        contractVersion: string,
        netId: number,
        contractAddress: HexString) {
    const hashedName = Web3.utils.keccak256(Web3.utils.utf8ToHex(contractName));
    const hashedVersion = Web3.utils.keccak256(Web3.utils.utf8ToHex(contractVersion));
    const typeHash = Web3.utils.keccak256(
        Web3.utils.utf8ToHex("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"));

		console.log('Domain separator',"EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)", typeHash)
    return Web3.utils.keccak256(
        eth.abi.encodeParameters(
            ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
            [typeHash, hashedName, hashedVersion, netId, contractAddress]
        )
    );
}

export function fixSig(sig: HexString) {
    const rs = sig.substring(0, sig.length - 2);
    let v = sig.substring(sig.length - 2);
    if (v === '00' || v ==='37' || v === '25') {
        v = '1b'
        } else if (v === '01' || v === '38' || v === '26') {
        v = '1c'
    }
    return rs+v;
}

export function produceSignature(
        eth: Eth,
        netId: number,
        contractAddress: HexString,
        eipParams: Eip712Params): Eip712Params {
    const methodSig = `${eipParams.method}(${eipParams.args.map(p => `${p.type} ${p.name}`).join(',')})`
    const methodHash = Web3.utils.keccak256(Web3.utils.utf8ToHex(methodSig));
    // const methodHash = Web3.utils.keccak256(
    //     Web3.utils.utf8ToHex('WithdrawSigned(address token, address payee,uint256 amount,bytes32 salt)'));

    // ['bytes32', 'address', 'address', 'uint256', 'bytes32'];
    const params = ['bytes32'].concat(eipParams.args.map(p => p.type));
    const structure = eth.abi.encodeParameters(params, [methodHash, ...eipParams.args.map(p => p.value)]);
    const structureHash = Web3.utils.keccak256(structure);
    const ds = domainSeparator(eth, eipParams.contractName, eipParams.contractVersion, netId, contractAddress);
    const hash = Web3.utils.soliditySha3("\x19\x01", ds, structureHash) as HexString;
		// console.log(' ALL PARMS FOR SIGN ', {
		// 	methodSig,
		// 	methodHash,
		// 	structure,
		// 	structureHash,
		// 	ds,
		// 	hash
		// })
    return {...eipParams, hash, signature: ''};
}

export function verifySignature(hash: HexString, userAddress: string, signature: HexString) {
	const sig = fromRpcSig(Buffer.from(signature.replace('0x', ''), 'hex'));
	const pub = ecrecover(Buffer.from(hash, 'hex'), sig.v, sig.r, sig.s);
	const addr  = `0x${publicToAddress(pub).toString('hex').toLowerCase()}`;
	ValidationUtils.isTrue(userAddress.toLowerCase() === addr, 'Invalid signature');
}

export function randomSalt() {
    return Web3.utils.randomHex(32);
}

export async function signWithPrivateKey(
	privateKey: HexString,
	hash: HexString,
) {
	const sigP2 = ecsign(
		Buffer.from(hash!.replace('0x',''), 'hex'),
		Buffer.from(privateKey.replace('0x',''), 'hex'),);
	return fixSig(toRpcSig(sigP2.v, sigP2.r, sigP2.s));
}

export function privateKeyToAddress(sk: HexString): string {
	return '0x' + privateToAddress(Buffer.from(sk.replace('0x',''), 'hex')).toString('hex');
}

export function multiSigToBytes(signatures: string[]) {
	return abi.encode(['bytes[]'], [signatures]);
}