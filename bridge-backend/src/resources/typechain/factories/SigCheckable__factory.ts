/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { SigCheckable, SigCheckableInterface } from "../SigCheckable";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "usedHashes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class SigCheckable__factory {
  static readonly abi = _abi;
  static createInterface(): SigCheckableInterface {
    return new utils.Interface(_abi) as SigCheckableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SigCheckable {
    return new Contract(address, _abi, signerOrProvider) as SigCheckable;
  }
}
