/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  CrucibleTokenDeployer,
  CrucibleTokenDeployerInterface,
} from "../CrucibleTokenDeployer";

const _abi = [
  {
    inputs: [],
    name: "parameters",
    outputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "feeOnTransferX10000",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "feeOnWithdrawX10000",
        type: "uint64",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class CrucibleTokenDeployer__factory {
  static readonly abi = _abi;
  static createInterface(): CrucibleTokenDeployerInterface {
    return new utils.Interface(_abi) as CrucibleTokenDeployerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CrucibleTokenDeployer {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as CrucibleTokenDeployer;
  }
}
