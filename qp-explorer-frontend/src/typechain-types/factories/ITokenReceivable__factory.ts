/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ITokenReceivable,
  ITokenReceivableInterface,
} from "../ITokenReceivable";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "syncInventory",
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
];

export class ITokenReceivable__factory {
  static readonly abi = _abi;
  static createInterface(): ITokenReceivableInterface {
    return new utils.Interface(_abi) as ITokenReceivableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITokenReceivable {
    return new Contract(address, _abi, signerOrProvider) as ITokenReceivable;
  }
}
