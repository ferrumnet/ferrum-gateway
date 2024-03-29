/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ICrucibleToken,
  ICrucibleTokenInterface,
} from "../ICrucibleToken";

const _abi = [
  {
    inputs: [],
    name: "baseToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "enum ICrucibleToken.OverrideState",
        name: "overrideType",
        type: "uint8",
      },
      {
        internalType: "uint64",
        name: "newFeeX10000",
        type: "uint64",
      },
    ],
    name: "overrideFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ICrucibleToken__factory {
  static readonly abi = _abi;
  static createInterface(): ICrucibleTokenInterface {
    return new utils.Interface(_abi) as ICrucibleTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICrucibleToken {
    return new Contract(address, _abi, signerOrProvider) as ICrucibleToken;
  }
}
