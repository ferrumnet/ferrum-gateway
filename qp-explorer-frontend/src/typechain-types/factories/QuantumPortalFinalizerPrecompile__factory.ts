/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  QuantumPortalFinalizerPrecompile,
  QuantumPortalFinalizerPrecompileInterface,
} from "../QuantumPortalFinalizerPrecompile";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "finalizer",
        type: "address",
      },
    ],
    name: "registerFinalizer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "finalizer",
        type: "address",
      },
    ],
    name: "removeFinalizer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class QuantumPortalFinalizerPrecompile__factory {
  static readonly abi = _abi;
  static createInterface(): QuantumPortalFinalizerPrecompileInterface {
    return new utils.Interface(
      _abi
    ) as QuantumPortalFinalizerPrecompileInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): QuantumPortalFinalizerPrecompile {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as QuantumPortalFinalizerPrecompile;
  }
}