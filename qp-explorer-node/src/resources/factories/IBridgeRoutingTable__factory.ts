/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IBridgeRoutingTable,
  IBridgeRoutingTableInterface,
} from "../IBridgeRoutingTable";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sourceToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "targetChainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "targetToken",
        type: "address",
      },
    ],
    name: "verifyRoute",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "withdrawConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "targetToken",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "feeX10000",
            type: "uint64",
          },
          {
            internalType: "uint16",
            name: "groupId",
            type: "uint16",
          },
          {
            internalType: "uint8",
            name: "noFee",
            type: "uint8",
          },
        ],
        internalType: "struct IBridgeRoutingTable.TokenWithdrawConfig",
        name: "config",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IBridgeRoutingTable__factory {
  static readonly abi = _abi;
  static createInterface(): IBridgeRoutingTableInterface {
    return new utils.Interface(_abi) as IBridgeRoutingTableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBridgeRoutingTable {
    return new Contract(address, _abi, signerOrProvider) as IBridgeRoutingTable;
  }
}
