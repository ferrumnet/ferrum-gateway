/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { WithAdmin, WithAdminInterface } from "../WithAdmin";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
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
  {
    inputs: [],
    name: "owner",
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
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6103098061007e6000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063704b6c021461005c578063715018a6146100715780638da5cb5b14610079578063f2fde38b146100a2578063f851a440146100b5575b600080fd5b61006f61006a366004610270565b6100c8565b005b61006f61014f565b6000546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b61006f6100b0366004610270565b610185565b600154610086906001600160a01b031681565b6000546001600160a01b031633146100fb5760405162461bcd60e51b81526004016100f29061029e565b60405180910390fd5b600180546001600160a01b0319166001600160a01b0383169081179091556040519081527f8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c9060200160405180910390a150565b6000546001600160a01b031633146101795760405162461bcd60e51b81526004016100f29061029e565b6101836000610220565b565b6000546001600160a01b031633146101af5760405162461bcd60e51b81526004016100f29061029e565b6001600160a01b0381166102145760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016100f2565b61021d81610220565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600060208284031215610281578081fd5b81356001600160a01b0381168114610297578182fd5b9392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260408201526060019056fea26469706673582212205f4817e7ccb642e341ba3b887887308336a1086d391ac6ba620635dca194e29264736f6c63430008020033";

export class WithAdmin__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<WithAdmin> {
    return super.deploy(overrides || {}) as Promise<WithAdmin>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): WithAdmin {
    return super.attach(address) as WithAdmin;
  }
  connect(signer: Signer): WithAdmin__factory {
    return super.connect(signer) as WithAdmin__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WithAdminInterface {
    return new utils.Interface(_abi) as WithAdminInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WithAdmin {
    return new Contract(address, _abi, signerOrProvider) as WithAdmin;
  }
}