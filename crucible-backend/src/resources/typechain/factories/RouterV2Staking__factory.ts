/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RouterV2Staking,
  RouterV2StakingInterface,
} from "../RouterV2Staking";

const _abi = [
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
    inputs: [
      {
        internalType: "enum Staking.StakeType",
        name: "sType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "rewardToken",
        type: "address",
      },
    ],
    name: "addReward",
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
    inputs: [],
    name: "openEndedStakeContract",
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
        name: "staking",
        type: "address",
      },
    ],
    name: "setOpenEndedStakeContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "staking",
        type: "address",
      },
    ],
    name: "setTimedStakeContract",
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
        internalType: "enum Staking.StakeType",
        name: "sType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stake",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "enum Staking.StakeType",
        name: "sType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "allocation",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "allocatorSignature",
        type: "bytes",
      },
    ],
    name: "stakeWithAllocation",
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
    inputs: [],
    name: "timedStakeContract",
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
  "0x608060405234801561001057600080fd5b5061002161001c610026565b61002a565b61007a565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b61137d806100896000396000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c8063af3d905a11610076578063f2fde38b1161005b578063f2fde38b1461014c578063fb6d7c4f1461015f578063fc42841714610167576100be565b8063af3d905a14610126578063c10950b014610139576100be565b80635f44c99c116100a75780635f44c99c14610101578063715018a6146101145780638da5cb5b1461011e576100be565b80632f916b7f146100c357806359007d18146100e1575b600080fd5b6100cb61017a565b6040516100d89190610e82565b60405180910390f35b6100f46100ef366004610cd0565b610189565b6040516100d891906112fd565b6100f461010f366004610dfe565b61036d565b61011c610484565b005b6100cb6104cf565b61011c610134366004610c98565b6104de565b61011c610147366004610c98565b61059b565b61011c61015a366004610c98565b610658565b6100cb6106c9565b6100f4610175366004610d1e565b6106d8565b6001546001600160a01b031681565b60006001600160a01b0385166101ba5760405162461bcd60e51b81526004016101b1906111c4565b60405180910390fd5b6001600160a01b0383166101e05760405162461bcd60e51b81526004016101b1906111fb565b816101fd5760405162461bcd60e51b81526004016101b19061107c565b6000610208856108bf565b90506000816001600160a01b031663ef3e8828866040518263ffffffff1660e01b81526004016102389190610e82565b602060405180830381600087803b15801561025257600080fd5b505af1158015610266573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061028a9190610cb4565b90506001600160a01b0381166102b25760405162461bcd60e51b81526004016101b190611158565b6102c76001600160a01b0382163384876109fc565b6040517fb1cb72180000000000000000000000000000000000000000000000000000000081526001600160a01b0383169063b1cb721890610310908a9089903390600401610eb0565b602060405180830381600087803b15801561032a57600080fd5b505af115801561033e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103629190610e4e565b979650505050505050565b60006001600160a01b0384166103955760405162461bcd60e51b81526004016101b1906111c4565b6001600160a01b038216600114156103bf5760405162461bcd60e51b81526004016101b1906110ea565b60006103ca866108bf565b90506103e16001600160a01b0384163383876109fc565b6040517f40b47e1a0000000000000000000000000000000000000000000000000000000081526001600160a01b038216906340b47e1a906104289088908790600401610e96565b602060405180830381600087803b15801561044257600080fd5b505af1158015610456573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061047a9190610e4e565b9695505050505050565b61048c610a87565b6001600160a01b031661049d6104cf565b6001600160a01b0316146104c35760405162461bcd60e51b81526004016101b19061118f565b6104cd6000610a8b565b565b6000546001600160a01b031690565b6104e6610a87565b6001600160a01b03166104f76104cf565b6001600160a01b03161461051d5760405162461bcd60e51b81526004016101b19061118f565b6001546001600160a01b0316156105465760405162461bcd60e51b81526004016101b190611269565b6001600160a01b03811661056c5760405162461bcd60e51b81526004016101b190610f8b565b6002805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6105a3610a87565b6001600160a01b03166105b46104cf565b6001600160a01b0316146105da5760405162461bcd60e51b81526004016101b19061118f565b6001546001600160a01b0316156106035760405162461bcd60e51b81526004016101b190611269565b6001600160a01b0381166106295760405162461bcd60e51b81526004016101b190610f8b565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b610660610a87565b6001600160a01b03166106716104cf565b6001600160a01b0316146106975760405162461bcd60e51b81526004016101b19061118f565b6001600160a01b0381166106bd5760405162461bcd60e51b81526004016101b190610fc2565b6106c681610a8b565b50565b6002546001600160a01b031681565b60006001600160a01b0389166107005760405162461bcd60e51b81526004016101b1906111c4565b6001600160a01b0387166107265760405162461bcd60e51b81526004016101b1906111fb565b856107435760405162461bcd60e51b81526004016101b19061107c565b600061074e896108bf565b90506000816001600160a01b031663ef3e88288a6040518263ffffffff1660e01b815260040161077e9190610e82565b602060405180830381600087803b15801561079857600080fd5b505af11580156107ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107d09190610cb4565b90506001600160a01b0381166107f85760405162461bcd60e51b81526004016101b190611158565b61080d6001600160a01b03821633848b6109fc565b6040517fca8fb25c0000000000000000000000000000000000000000000000000000000081526001600160a01b0383169063ca8fb25c9061085e908e908d9033908d908d908d908d90600401610ed3565b602060405180830381600087803b15801561087857600080fd5b505af115801561088c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108b09190610e4e565b9b9a5050505050505050505050565b6000808260048111156108e257634e487b7160e01b600052602160045260246000fd5b141580156109105750600182600481111561090d57634e487b7160e01b600052602160045260246000fd5b14155b61092c5760405162461bcd60e51b81526004016101b1906110b3565b6000600283600481111561095057634e487b7160e01b600052602160045260246000fd5b148061097b5750600483600481111561097957634e487b7160e01b600052602160045260246000fd5b145b6109bf5760038360048111156109a157634e487b7160e01b600052602160045260246000fd5b146109ad5760006109ba565b6002546001600160a01b03165b6109cc565b6001546001600160a01b03165b90506001600160a01b0381166109f45760405162461bcd60e51b81526004016101b190611121565b90505b919050565b610a81846323b872dd60e01b858585604051602401610a1d93929190610f34565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152610ae8565b50505050565b3390565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000610b3d826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610b7c9092919063ffffffff16565b805190915015610b775780806020019051810190610b5b9190610dde565b610b775760405162461bcd60e51b81526004016101b1906112a0565b505050565b6060610b8b8484600085610b95565b90505b9392505050565b606082471015610bb75760405162461bcd60e51b81526004016101b19061101f565b610bc085610c4a565b610bdc5760405162461bcd60e51b81526004016101b190611232565b600080866001600160a01b03168587604051610bf89190610e66565b60006040518083038185875af1925050503d8060008114610c35576040519150601f19603f3d011682016040523d82523d6000602084013e610c3a565b606091505b5091509150610362828286610c50565b3b151590565b60608315610c5f575081610b8e565b825115610c6f5782518084602001fd5b8160405162461bcd60e51b81526004016101b19190610f58565b8035600581106109f757600080fd5b600060208284031215610ca9578081fd5b8135610b8e81611332565b600060208284031215610cc5578081fd5b8151610b8e81611332565b60008060008060808587031215610ce5578283fd5b8435610cf081611332565b9350610cfe60208601610c89565b92506040850135610d0e81611332565b9396929550929360600135925050565b60008060008060008060008060e0898b031215610d39578384fd5b8835610d4481611332565b9750610d5260208a01610c89565b96506040890135610d6281611332565b9550606089013594506080890135935060a0890135925060c089013567ffffffffffffffff80821115610d93578384fd5b818b0191508b601f830112610da6578384fd5b813581811115610db4578485fd5b8c6020828501011115610dc5578485fd5b6020830194508093505050509295985092959890939650565b600060208284031215610def578081fd5b81518015158114610b8e578182fd5b60008060008060808587031215610e13578384fd5b610e1c85610c89565b93506020850135610e2c81611332565b9250604085013591506060850135610e4381611332565b939692955090935050565b600060208284031215610e5f578081fd5b5051919050565b60008251610e78818460208701611306565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b0393841681529183166020830152909116604082015260600190565b60006001600160a01b03808a168352808916602084015280881660408401525085606083015284608083015260c060a08301528260c0830152828460e084013781830160e090810191909152601f909201601f191601019695505050505050565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6000602082528251806020840152610f77816040850160208701611306565b601f01601f19169190910160400192915050565b60208082526014908201527f525632533a207374616b65207265717569726564000000000000000000000000604082015260600190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201527f6464726573730000000000000000000000000000000000000000000000000000606082015260800190565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60408201527f722063616c6c0000000000000000000000000000000000000000000000000000606082015260800190565b60208082526018908201527f525632533a20616d6f756e742069732072657175697265640000000000000000604082015260600190565b60208082526016908201527f525632533a20426164207374616b696e67207479706500000000000000000000604082015260600190565b6020808252601d908201527f525632533a20726577617264546f6b656e206973207265717569726564000000604082015260600190565b6020808252601c908201527f525632533a207374616b656b207474706520697320696e76616c696400000000604082015260600190565b60208082526010908201527f525632533a20696e76616c696420696400000000000000000000000000000000604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526014908201527f525632533a20746f206973207265717569726564000000000000000000000000604082015260600190565b60208082526014908201527f525632533a206964206973207265717569726564000000000000000000000000604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b60208082526018908201527f525632533a20616c726561647920636f6e666967757265640000000000000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b90815260200190565b60005b83811015611321578181015183820152602001611309565b83811115610a815750506000910152565b6001600160a01b03811681146106c657600080fdfea26469706673582212201419a3dfc091a057c0def4af400bb757a2558cb1f5b013cbc12463bbd3bbdd6264736f6c63430008000033";

export class RouterV2Staking__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RouterV2Staking> {
    return super.deploy(overrides || {}) as Promise<RouterV2Staking>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RouterV2Staking {
    return super.attach(address) as RouterV2Staking;
  }
  connect(signer: Signer): RouterV2Staking__factory {
    return super.connect(signer) as RouterV2Staking__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RouterV2StakingInterface {
    return new utils.Interface(_abi) as RouterV2StakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RouterV2Staking {
    return new Contract(address, _abi, signerOrProvider) as RouterV2Staking;
  }
}