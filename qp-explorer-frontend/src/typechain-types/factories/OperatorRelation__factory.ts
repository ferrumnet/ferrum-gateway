/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  OperatorRelation,
  OperatorRelationInterface,
} from "../OperatorRelation";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "nodeOperator",
        type: "address",
      },
    ],
    name: "NodeOperatorAssigned",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "toOp",
        type: "address",
      },
    ],
    name: "assignOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "delegateLookup",
    outputs: [
      {
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "deleted",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "getDelegateForOperator",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "delegate",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "deleted",
            type: "uint8",
          },
        ],
        internalType: "struct IOperatorRelation.Relationship",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nodeOperator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class OperatorRelation__factory {
  static readonly abi = _abi;
  static createInterface(): OperatorRelationInterface {
    return new utils.Interface(_abi) as OperatorRelationInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OperatorRelation {
    return new Contract(address, _abi, signerOrProvider) as OperatorRelation;
  }
}