/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  QuantumPortalFeeConverterDirect,
  QuantumPortalFeeConverterDirectInterface,
} from "../QuantumPortalFeeConverterDirect";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
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
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    name: "feePerByte",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "feeTokenPriceList",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "localChainGasTokenPriceX128",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
    name: "qpFeeToken",
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
        internalType: "uint256[]",
        name: "chainIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "pricesX128",
        type: "uint256[]",
      },
    ],
    name: "setChainGasTokenPriceX128",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "targetChainId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
    ],
    name: "targetChainFixedFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "targetChainId",
        type: "uint256",
      },
    ],
    name: "targetChainGasTokenPriceX128",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fpb",
        type: "uint256",
      },
    ],
    name: "updateFeePerByte",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50338061003757604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b61004081610046565b50610096565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6108e6806100a56000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80638da5cb5b11610097578063f2fde38b11610066578063f2fde38b146101da578063f60bbe2a146101ed578063f851a440146101f6578063ffa1ad741461020957600080fd5b80638da5cb5b1461019b578063aa6fff73146101ac578063c25cddbe146101b4578063d78edac4146101c757600080fd5b8063673a7e28116100d3578063673a7e281461013d578063704b6c0214610160578063715018a6146101735780638452bd0c1461017b57600080fd5b80632ee43e62146100fa5780635e6c8c6c1461012a57806361f456c41461013f575b600080fd5b60025461010d906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61013d610138366004610652565b61023a565b005b61015261014d36600461066b565b6102a3565b604051908152602001610121565b61013d61016e36600461068d565b61032b565b61013d610387565b610152610189366004610652565b60046020526000908152604090205481565b6000546001600160a01b031661010d565b610152610399565b6101526101c2366004610652565b6103c0565b61013d6101d5366004610771565b6103d4565b61013d6101e836600461068d565b61052b565b61015260035481565b60015461010d906001600160a01b031681565b61022d60405180604001604052806005815260200164302e302e3160d81b81525081565b604051610121919061081b565b6001546001600160a01b031633148061025d57506000546001600160a01b031633145b61029e5760405162461bcd60e51b815260206004820152600d60248201526c2ba09d103737ba1030b236b4b760991b60448201526064015b60405180910390fd5b600355565b600082815260046020526040812054806000036102c15750600160801b5b6102f86040518060400160405280601481526020017343414c43494e472046454520504552204259544560601b8152508286610569565b600354600160801b9061030b858461082e565b610315919061082e565b61031f9190610853565b9150505b92915050565b565b6103336105b0565b600180546001600160a01b0319166001600160a01b0383169081179091556040519081527f8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c9060200160405180910390a150565b61038f6105b0565b61032960006105dd565b466000908152600460205260408120548082036103bb57600160801b91505090565b919050565b600081815260046020526040812054610323565b6001546001600160a01b03163314806103f757506000546001600160a01b031633145b6104335760405162461bcd60e51b815260206004820152600d60248201526c2ba09d103737ba1030b236b4b760991b6044820152606401610295565b805182511461047a5760405162461bcd60e51b815260206004820152601360248201527251504643443a20496e76616c6964206172677360681b6044820152606401610295565b60005b825181101561052657600082828151811061049a5761049a610875565b60200260200101519050806000036104eb5760405162461bcd60e51b815260206004820152601460248201527351504643443a207072696365206973207a65726f60601b6044820152606401610295565b806004600086858151811061050257610502610875565b6020908102919091018101518252810191909152604001600020555060010161047d565b505050565b6105336105b0565b6001600160a01b03811661055d57604051631e4fbdf760e01b815260006004820152602401610295565b610566816105dd565b50565b6105268383836040516024016105819392919061088b565b60408051601f198184030181529190526020810180516001600160e01b031663ca47c4eb60e01b17905261062d565b6000546001600160a01b031633146103295760405163118cdaa760e01b8152336004820152602401610295565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6105668160006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b60006020828403121561066457600080fd5b5035919050565b6000806040838503121561067e57600080fd5b50508035926020909101359150565b60006020828403121561069f57600080fd5b81356001600160a01b03811681146106b657600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126106e457600080fd5b8135602067ffffffffffffffff80831115610701576107016106bd565b8260051b604051601f19603f83011681018181108482111715610726576107266106bd565b604052938452602081870181019490810192508785111561074657600080fd5b6020870191505b848210156107665781358352918301919083019061074d565b979650505050505050565b6000806040838503121561078457600080fd5b823567ffffffffffffffff8082111561079c57600080fd5b6107a8868387016106d3565b935060208501359150808211156107be57600080fd5b506107cb858286016106d3565b9150509250929050565b6000815180845260005b818110156107fb576020818501810151868301820152016107df565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006106b660208301846107d5565b808202811582820484141761032357634e487b7160e01b600052601160045260246000fd5b60008261087057634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052603260045260246000fd5b60608152600061089e60608301866107d5565b6020830194909452506040015291905056fea2646970667358221220d0a2866113dc9473f4f3620af81c3207f36db4fa215f170bfed49ae59714caae64736f6c63430008180033";

export class QuantumPortalFeeConverterDirect__factory extends ContractFactory {
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
  ): Promise<QuantumPortalFeeConverterDirect> {
    return super.deploy(
      overrides || {}
    ) as Promise<QuantumPortalFeeConverterDirect>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): QuantumPortalFeeConverterDirect {
    return super.attach(address) as QuantumPortalFeeConverterDirect;
  }
  connect(signer: Signer): QuantumPortalFeeConverterDirect__factory {
    return super.connect(signer) as QuantumPortalFeeConverterDirect__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): QuantumPortalFeeConverterDirectInterface {
    return new utils.Interface(
      _abi
    ) as QuantumPortalFeeConverterDirectInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): QuantumPortalFeeConverterDirect {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as QuantumPortalFeeConverterDirect;
  }
}