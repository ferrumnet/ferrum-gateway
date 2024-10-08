/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BatchCall, BatchCallInterface } from "../BatchCall";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes",
      },
    ],
    name: "CallFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bytes[]",
        name: "calls",
        type: "bytes[]",
      },
    ],
    name: "batchCall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610302806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063f456fa4014610030575b600080fd5b61004361003e366004610137565b610045565b005b60005b8181101561013157600080856001600160a01b031685858581811061006f5761006f6101cb565b905060200281019061008191906101e1565b60405161008f92919061022f565b6000604051808303816000865af19150503d80600081146100cc576040519150601f19603f3d011682016040523d82523d6000602084013e6100d1565b606091505b50915091508161012757858585858181106100ee576100ee6101cb565b905060200281019061010091906101e1565b83604051630881f24f60e31b815260040161011e949392919061023f565b60405180910390fd5b5050600101610048565b50505050565b60008060006040848603121561014c57600080fd5b83356001600160a01b038116811461016357600080fd5b9250602084013567ffffffffffffffff8082111561018057600080fd5b818601915086601f83011261019457600080fd5b8135818111156101a357600080fd5b8760208260051b85010111156101b857600080fd5b6020830194508093505050509250925092565b634e487b7160e01b600052603260045260246000fd5b6000808335601e198436030181126101f857600080fd5b83018035915067ffffffffffffffff82111561021357600080fd5b60200191503681900382131561022857600080fd5b9250929050565b8183823760009101908152919050565b60018060a01b0385168152600060206060602084015284606084015284866080850137600060808685010152601f1980601f87011684016080858203016040860152855180608083015260005b818110156102a85787810185015183820160a00152840161028c565b50600060a0828401015260a083601f8301168301019450505050509594505050505056fea2646970667358221220c873ca037563084a8b2dead97640048d28b06d0fffba45dba36bd14a7d623eec64736f6c63430008180033";

export class BatchCall__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BatchCall> {
    return super.deploy(overrides || {}) as Promise<BatchCall>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BatchCall {
    return super.attach(address) as BatchCall;
  }
  connect(signer: Signer): BatchCall__factory {
    return super.connect(signer) as BatchCall__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BatchCallInterface {
    return new utils.Interface(_abi) as BatchCallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BatchCall {
    return new Contract(address, _abi, signerOrProvider) as BatchCall;
  }
}
