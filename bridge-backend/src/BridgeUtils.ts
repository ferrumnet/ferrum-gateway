import { HexString } from 'ferrum-plumbing';
import Web3 from 'web3';
import { Eth } from 'web3-eth';
import { PayBySignatureData } from 'types';
import {ValidationUtils} from "ferrum-plumbing";
import axios from "axios";

const NAME = "FERRUM_TOKEN_BRIDGE_POOL";
const VERSION = "000.004";

export function domainSeparator(eth: Eth, netId: number, contractAddress: HexString) {
    const hashedName = Web3.utils.keccak256(Web3.utils.utf8ToHex(NAME));
    const hashedVersion = Web3.utils.keccak256(Web3.utils.utf8ToHex(VERSION));
    const typeHash = Web3.utils.keccak256(
        Web3.utils.utf8ToHex("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"));

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

export function produceSignatureWithdrawHash(eth: Eth,
        netId: number,
        contractAddress: HexString,
        token: HexString,
        payee: HexString,
        amountInt: string,
        swapTxId: string): PayBySignatureData {
	// TODO: Try the sig utils
    const methodHash = Web3.utils.keccak256(
        Web3.utils.utf8ToHex('WithdrawSigned(address token,address payee,uint256 amount,bytes32 salt)'));

    const params = ['bytes32', 'address', 'address', 'uint256', 'bytes32'];
    const structure = eth.abi.encodeParameters(params,
		[methodHash, token, payee, amountInt, swapTxId]);
    const structureHash = Web3.utils.keccak256(structure);
    const ds = domainSeparator(eth, netId, contractAddress);
    const hash = Web3.utils.soliditySha3("\x19\x01", ds, structureHash);
    return {
		contractName: NAME,
		contractVersion: VERSION,
		contractAddress: contractAddress,
        amount: amountInt,
        payee,
        signatures: [],
        token,
        swapTxId,
		sourceChainId: 0,
		toToken: '',
		hash,
    } as PayBySignatureData;
}

export async function produceSignatureNonEvmWithdrawHash(
    eth: Eth,
    netId: number,
    contractAddress: HexString,
    token: HexString,
    payee: HexString,
    amount: string,
    swapTxId: string,
    walletAddress: string
  ) {
    const response = await axios.post("http://127.0.0.1:3000/create-evm-swap-signature", {
      tokenAddress: token,
      payee: walletAddress,
      salt: swapTxId.replace("0x", ""),
      chainId: netId,
      amount,
    });
    const message = response.data;
    const privateKey = getEnv("PROCESSOR_PRIVATE_KEY_CLEAN_TEXT");
    const sign = eth.accounts.sign(message, privateKey);
    // const recovery = eth.accounts.recover(sign.message, sign.signature);
    // console.log({ recovery });
    return {
      contractName: NAME,
      contractVersion: VERSION,
      contractAddress: contractAddress,
      amount: amount,
      payee: walletAddress,
      signature: sign.signature,
      signatures: [],
      token,
      swapTxId: swapTxId.substring(0, 40),
      sourceChainId: 0,
      toToken: "",
      hash: sign.message,
      messageHash: sign.messageHash,
    };
  }

export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}

export function randomSalt() {
    return Web3.utils.randomHex(32);
}