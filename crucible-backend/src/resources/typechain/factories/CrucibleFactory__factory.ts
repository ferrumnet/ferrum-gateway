/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CrucibleFactory,
  CrucibleFactoryInterface,
} from "../CrucibleFactory";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeOnTransferX10000",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeOnWithdrawX10000",
        type: "uint256",
      },
    ],
    name: "CrucibleCreated",
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
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
    ],
    name: "createCrucible",
    outputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
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
    ],
    name: "createCrucibleDirect",
    outputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
    ],
    name: "getCrucible",
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
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
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
  "0x60c06040523480156200001157600080fd5b503060601b6080526200002d62000027620000d3565b620000d7565b336001600160a01b0316638eb36e3d6040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156200006957600080fd5b505af11580156200007e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620000a8919081019062000159565b806020019051810190620000bd919062000129565b60601b6001600160601b03191660a0526200023e565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000602082840312156200013b578081fd5b81516001600160a01b038116811462000152578182fd5b9392505050565b600060208083850312156200016c578182fd5b82516001600160401b038082111562000183578384fd5b818501915085601f83011262000197578384fd5b815181811115620001ac57620001ac62000228565b604051601f8201601f1916810185018381118282101715620001d257620001d262000228565b6040528181528382018501881015620001e9578586fd5b8592505b818310156200020c5783830185015181840186015291840191620001ed565b818311156200021d57858583830101525b979650505050505050565b634e487b7160e01b600052604160045260246000fd5b60805160601c60a05160601c613b706200026a60003960006106de0152600061070b0152613b706000f3fe60806040523480156200001157600080fd5b5060043610620000dc5760003560e01c80638da5cb5b116200008d578063f61485c01162000063578063f61485c014620001a0578063f851a44014620001b7578063f887ea4014620001c157620000dc565b80638da5cb5b1462000168578063e70dc9441462000172578063f2fde38b146200018957620000dc565b8063715018a611620000c3578063715018a6146200012957806389035730146200013357806389afcb44146200015157620000dc565b80632aa616eb14620000e1578063704b6c021462000110575b600080fd5b620000f8620000f2366004620011e9565b620001cb565b604051620001079190620014b1565b60405180910390f35b620001276200012136600462001125565b62000202565b005b62000127620002b6565b6200013d6200030a565b6040516200010796959493929190620014fa565b620001276200016236600462001125565b6200047d565b620000f86200059d565b620000f862000183366004620011e9565b620005ac565b620001276200019a36600462001125565b620005e1565b620000f8620001b136600462001149565b6200065e565b620000f8620006cd565b620000f8620006dc565b6000620001d762000700565b620001fa84620001e78662000736565b620001f2876200085b565b86866200094f565b949350505050565b6200020c62000b99565b6001600160a01b03166200021f6200059d565b6001600160a01b031614620002515760405162461bcd60e51b8152600401620002489062001620565b60405180910390fd5b6006805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383161790556040517f8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c90620002ab908390620014b1565b60405180910390a150565b620002c062000b99565b6001600160a01b0316620002d36200059d565b6001600160a01b031614620002fc5760405162461bcd60e51b8152600401620002489062001620565b62000308600062000b9d565b565b60008054600154600254600380546001600160a01b0394851695948416947401000000000000000000000000000000000000000090940467ffffffffffffffff9081169493169291906200035e90620018b6565b80601f01602080910402602001604051908101604052809291908181526020018280546200038c90620018b6565b8015620003dd5780601f10620003b157610100808354040283529160200191620003dd565b820191906000526020600020905b815481529060010190602001808311620003bf57829003601f168201915b505050505090806004018054620003f490620018b6565b80601f01602080910402602001604051908101604052809291908181526020018280546200042290620018b6565b8015620004735780601f10620004475761010080835404028352916020019162000473565b820191906000526020600020905b8154815290600101906020018083116200045557829003601f168201915b5050505050905086565b6040517f70a082310000000000000000000000000000000000000000000000000000000081526000906001600160a01b038316906370a0823190620004c7903090600401620014b1565b60206040518083038186803b158015620004e057600080fd5b505afa158015620004f5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200051b9190620012ae565b6040517f42966c680000000000000000000000000000000000000000000000000000000081529091506001600160a01b038316906342966c6890620005659084906004016200179d565b600060405180830381600087803b1580156200058057600080fd5b505af115801562000595573d6000803e3d6000fd5b505050505050565b6005546001600160a01b031690565b600060076000620005bf86868662000bfc565b81526020810191909152604001600020546001600160a01b0316949350505050565b620005eb62000b99565b6001600160a01b0316620005fe6200059d565b6001600160a01b031614620006275760405162461bcd60e51b8152600401620002489062001620565b6001600160a01b038116620006505760405162461bcd60e51b815260040162000248906200158c565b6200065b8162000b9d565b50565b6006546000906001600160a01b0316331480620006955750620006806200059d565b6001600160a01b0316336001600160a01b0316145b620006b45760405162461bcd60e51b8152600401620002489062001655565b620006c386868686866200094f565b9695505050505050565b6006546001600160a01b031681565b7f000000000000000000000000000000000000000000000000000000000000000081565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146200030857600080fd5b60408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f06fdde0300000000000000000000000000000000000000000000000000000000179052905160609160009182916001600160a01b03861691620007ad91906200135b565b600060405180830381855afa9150503d8060008114620007ea576040519150601f19603f3d011682016040523d82523d6000602084013e620007ef565b606091505b509150915081156200081b578080602001905181019062000811919062001232565b9250505062000856565b6040518060400160405280600881526020017f4372756369626c65000000000000000000000000000000000000000000000000815250925050505b919050565b60408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f95d89b4100000000000000000000000000000000000000000000000000000000179052905160609160009182916001600160a01b03861691620008d291906200135b565b600060405180830381855afa9150503d80600081146200090f576040519150601f19603f3d011682016040523d82523d6000602084013e62000914565b606091505b509150915081620009395760405162461bcd60e51b815260040162000248906200172f565b80806020019051810190620001fa919062001232565b6000845160001415620009765760405162461bcd60e51b81526004016200024890620015e9565b8351620009975760405162461bcd60e51b81526004016200024890620016f8565b67ffffffffffffffff8316151580620009b9575067ffffffffffffffff821615155b620009d85760405162461bcd60e51b81526004016200024890620016c3565b61271067ffffffffffffffff84161062000a065760405162461bcd60e51b8152600401620002489062001766565b61271067ffffffffffffffff83161062000a345760405162461bcd60e51b8152600401620002489062001766565b600062000a4387858562000bfc565b6000818152600760205260409020549091506001600160a01b03161562000a7e5760405162461bcd60e51b815260040162000248906200168c565b600062000a958567ffffffffffffffff1662000c34565b9050600062000aae8567ffffffffffffffff1662000c34565b9050600088838360405160200162000ac993929190620013eb565b6040516020818303038152906040529050600088848460405160200162000af39392919062001379565b604051602081830303815290604052905062000b14308c8a8a868662000dc7565b60008681526007602052604090819020805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b038416179055519096507f1de56ee5fcc5431963e106cbafb2764982400ddd2962680474e2e46d41796dd89062000b839088908e908c908c90620014c5565b60405180910390a1505050505095945050505050565b3390565b600580546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600083838360405160200162000c1593929190620012f5565b6040516020818303038152906040528051906020012090509392505050565b60608162000c77575060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015262000856565b8160005b811562000ca7578062000c8e81620018f3565b915062000c9f9050600a8362001826565b915062000c7b565b60008167ffffffffffffffff81111562000cd157634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f19166020018201604052801562000cfc576020820181803683370190505b509050815b851562000dbe5762000d1560018262001869565b9050600062000d26600a8862001826565b62000d3390600a62001847565b62000d3f908862001869565b62000d4c906030620017fe565b905060008160f81b90508084848151811062000d7857634e487b7160e01b600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535062000db4600a8962001826565b9750505062000d01565b50949350505050565b6040805160c0810182526001600160a01b03888116808352908816602080840182905267ffffffffffffffff8981169585018690528816606085018190526080850188905260a085018790526000805473ffffffffffffffffffffffffffffffffffffffff199081169095178155600180549095169093177fffffffff0000000000000000ffffffffffffffffffffffffffffffffffffffff1674010000000000000000000000000000000000000000909602959095179092556002805467ffffffffffffffff19169094179093558451839162000eab9160039188019062000fac565b5060a0820151805162000ec991600484019160209091019062000fac565b505060405162000ee3915087908790879060200162001561565b6040516020818303038152906040528051906020012060405162000f07906200103b565b8190604051809103906000f590508015801562000f28573d6000803e3d6000fd5b506000805473ffffffffffffffffffffffffffffffffffffffff19168155600180547fffffffff000000000000000000000000000000000000000000000000000000001690556002805467ffffffffffffffff191690559091508062000f9060038262001049565b62000fa060048301600062001049565b50509695505050505050565b82805462000fba90620018b6565b90600052602060002090601f01602090048101928262000fde576000855562001029565b82601f1062000ff957805160ff191683800117855562001029565b8280016001018555821562001029579182015b82811115620010295782518255916020019190600101906200100c565b506200103792915062001086565b5090565b6121fd806200193e83390190565b5080546200105790620018b6565b6000825580601f106200106b57506200065b565b601f0160209004906000526020600020908101906200065b91905b5b8082111562001037576000815560010162001087565b80356001600160a01b03811681146200085657600080fd5b600082601f830112620010c6578081fd5b8135620010dd620010d782620017d3565b620017a6565b818152846020838601011115620010f2578283fd5b816020850160208301379081016020019190915292915050565b803567ffffffffffffffff811681146200085657600080fd5b60006020828403121562001137578081fd5b62001142826200109d565b9392505050565b600080600080600060a0868803121562001161578081fd5b6200116c866200109d565b9450602086013567ffffffffffffffff8082111562001189578283fd5b6200119789838a01620010b5565b95506040880135915080821115620011ad578283fd5b50620011bc88828901620010b5565b935050620011cd606087016200110c565b9150620011dd608087016200110c565b90509295509295909350565b600080600060608486031215620011fe578283fd5b62001209846200109d565b925062001219602085016200110c565b915062001229604085016200110c565b90509250925092565b60006020828403121562001244578081fd5b815167ffffffffffffffff8111156200125b578182fd5b8201601f810184136200126c578182fd5b80516200127d620010d782620017d3565b81815285602083850101111562001292578384fd5b620012a582602083016020860162001883565b95945050505050565b600060208284031215620012c0578081fd5b5051919050565b60008151808452620012e181602086016020860162001883565b601f01601f19169290920160200192915050565b60609390931b7fffffffffffffffffffffffffffffffffffffffff00000000000000000000000016835260c091821b7fffffffffffffffff0000000000000000000000000000000000000000000000009081166014850152911b16601c82015260240190565b600082516200136f81846020870162001883565b9190910192915050565b600084516200138d81846020890162001883565b845190830190620013a381836020890162001883565b7f580000000000000000000000000000000000000000000000000000000000000091019081528351620013de81600184016020880162001883565b0160010195945050505050565b60007f4372756369626c653a2000000000000000000000000000000000000000000000825284516200142581600a85016020890162001883565b7f2000000000000000000000000000000000000000000000000000000000000000600a9184019182015284516200146481600b84016020890162001883565b7f5800000000000000000000000000000000000000000000000000000000000000600b92909101918201528351620014a481600c84016020880162001883565b01600c0195945050505050565b6001600160a01b0391909116815260200190565b6001600160a01b03948516815292909316602083015267ffffffffffffffff9081166040830152909116606082015260800190565b6001600160a01b0387811682528616602082015267ffffffffffffffff85811660408301528416606082015260c0608082018190526000906200154090830185620012c7565b82810360a0840152620015548185620012c7565b9998505050505050505050565b6001600160a01b0393909316835267ffffffffffffffff918216602084015216604082015260600190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201527f6464726573730000000000000000000000000000000000000000000000000000606082015260800190565b60208082526014908201527f43463a206e616d65206973207265717569726564000000000000000000000000604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252600d908201527f57413a206e6f742061646d696e00000000000000000000000000000000000000604082015260600190565b60208082526012908201527f43463a20616c7265616479206578697374730000000000000000000000000000604082015260600190565b6020808252818101527f43463a206174206c65617374206f6e6520666565206973207265717569726564604082015260600190565b60208082526016908201527f43463a2073796d626f6c20697320726571756972656400000000000000000000604082015260600190565b60208082526017908201527f43463a20546f6b656e20686173206e6f2073796d626f6c000000000000000000604082015260600190565b60208082526010908201527f43463a2066656520746f6f206869676800000000000000000000000000000000604082015260600190565b90815260200190565b60405181810167ffffffffffffffff81118282101715620017cb57620017cb62001927565b604052919050565b600067ffffffffffffffff821115620017f057620017f062001927565b50601f01601f191660200190565b600060ff821660ff84168060ff038211156200181e576200181e62001911565b019392505050565b6000826200184257634e487b7160e01b81526012600452602481fd5b500490565b600081600019048311821515161562001864576200186462001911565b500290565b6000828210156200187e576200187e62001911565b500390565b60005b83811015620018a057818101518382015260200162001886565b83811115620018b0576000848401525b50505050565b600281046001821680620018cb57607f821691505b60208210811415620018ed57634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156200190a576200190a62001911565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfe6101206040526002805460ff191660121790553480156200001f57600080fd5b50600080336001600160a01b031663890357306040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156200005f57600080fd5b505af115801562000074573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526200009e919081019062000402565b80516000908190620000b89060019060208601906200027f565b50508251620000cd919060208501906200027f565b5050506001600160c01b031960c091821b81166101005291901b1660e05292509050620000fa82620001bd565b6002805460ff191660ff92909216919091179055606082901b6001600160601b03191660c052604080516303e21fa960e61b815290516001600160a01b0383169163f887ea40916004808301926020929190829003018186803b1580156200016157600080fd5b505afa15801562000176573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200019c9190620003de565b6001600160601b0319606091821b811660a05291901b16608052506200057a565b60408051600481526024810182526020810180516001600160e01b031663313ce56760e01b1790529051600091829182916001600160a01b03861691620002059190620004d6565b600060405180830381855afa9150503d806000811462000242576040519150601f19603f3d011682016040523d82523d6000602084013e62000247565b606091505b50915091508115620002735780806020019051810190620002699190620004b3565b925050506200027a565b6012925050505b919050565b8280546200028d9062000527565b90600052602060002090601f016020900481019282620002b15760008555620002fc565b82601f10620002cc57805160ff1916838001178555620002fc565b82800160010185558215620002fc579182015b82811115620002fc578251825591602001919060010190620002df565b506200030a9291506200030e565b5090565b5b808211156200030a57600081556001016200030f565b80516001600160a01b03811681146200027a57600080fd5b600082601f8301126200034e578081fd5b81516001600160401b03808211156200036b576200036b62000564565b604051601f8301601f19168101602001828111828210171562000392576200039262000564565b604052828152848301602001861015620003aa578384fd5b620003bd836020830160208801620004f4565b95945050505050565b80516001600160401b03811681146200027a57600080fd5b600060208284031215620003f0578081fd5b620003fb8262000325565b9392505050565b60008060008060008060c087890312156200041b578182fd5b620004268762000325565b9550620004366020880162000325565b94506200044660408801620003c6565b93506200045660608801620003c6565b60808801519093506001600160401b038082111562000473578384fd5b620004818a838b016200033d565b935060a089015191508082111562000497578283fd5b50620004a689828a016200033d565b9150509295509295509295565b600060208284031215620004c5578081fd5b815160ff81168114620003fb578182fd5b60008251620004ea818460208701620004f4565b9190910192915050565b60005b8381101562000511578181015183820152602001620004f7565b8381111562000521576000848401525b50505050565b6002810460018216806200053c57607f821691505b602082108114156200055e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b60805160601c60a05160601c60c05160601c60e05160c01c6101005160c01c611be962000614600039600081816104d00152610ea90152600081816103c30152610c380152600081816106130152818161083a01528181610cb10152610f9601526000818161065d015281816107f8015281816108a701528181610a780152610ee90152600081816105ef0152610cd20152611be96000f3fe608060405234801561001057600080fd5b50600436106101775760003560e01c806395d89b41116100d8578063c55dae631161008c578063f340fa0111610066578063f340fa01146102e1578063f3fef3a3146102f4578063f887ea401461031557610177565b8063c55dae63146102b3578063dd62ed3e146102bb578063e56a5ec5146102ce57610177565b8063aa9d881c116100bd578063aa9d881c1461026a578063b5fd282a1461028b578063c45a01551461029e57610177565b806395d89b411461024f578063a9059cbb1461025757610177565b8063313ce5671161012f57806370a082311161011457806370a08231146102215780637651b2841461023457806379cc67901461023c57610177565b8063313ce567146101f757806342966c681461020c57610177565b806313cf47a21161016057806313cf47a2146101ba57806318160ddd146101cf57806323b872dd146101e457610177565b806306fdde031461017c578063095ea7b31461019a575b600080fd5b61018461031d565b604051610191919061184e565b60405180910390f35b6101ad6101a8366004611703565b6103ab565b604051610191919061181e565b6101c26103c1565b6040516101919190611a8c565b6101d76103e5565b6040516101919190611a4e565b6101ad6101f236600461166a565b6103eb565b6101ff610480565b6040516101919190611aa1565b61021f61021a36600461174e565b610489565b005b6101d761022f3660046115fa565b6104bc565b6101c26104ce565b61021f61024a366004611703565b6104f2565b61018461059b565b6101ad610265366004611703565b6105a8565b61027d6102783660046115fa565b6105b5565b604051610191929190611829565b6101d76102993660046115fa565b6105db565b6102a66105ed565b60405161019191906117bc565b6102a6610611565b6101d76102c9366004611632565b610635565b61021f6102dc3660046116aa565b610652565b6101d76102ef3660046115fa565b6107eb565b610307610302366004611703565b61088c565b604051610191929190611a57565b6102a66108a5565b6000805461032a90611b29565b80601f016020809104026020016040519081016040528092919081815260200182805461035690611b29565b80156103a35780601f10610378576101008083540402835291602001916103a3565b820191906000526020600020905b81548152906001019060200180831161038657829003601f168201915b505050505081565b60006103b83384846108c9565b50600192915050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60035481565b6001600160a01b03831660009081526005602090815260408083203384529091528120546000191461046a576001600160a01b03841660009081526005602090815260408083203384529091529020546104459083610931565b6001600160a01b03851660009081526005602090815260408083203384529091529020555b61047584848461093d565b5060015b9392505050565b60025460ff1681565b806104af5760405162461bcd60e51b81526004016104a690611881565b60405180910390fd5b6104b93382610cac565b50565b60046020526000908152604090205481565b7f000000000000000000000000000000000000000000000000000000000000000081565b6001600160a01b0382166105185760405162461bcd60e51b81526004016104a690611881565b806105355760405162461bcd60e51b81526004016104a690611881565b600061057f82604051806060016040528060248152602001611b90602491396001600160a01b03861660009081526005602090815260408083203384529091529020549190610d05565b905061058c8333836108c9565b6105968383610cac565b505050565b6001805461032a90611b29565b60006103b833848461093d565b60076020526000908152604090205460ff811690610100900467ffffffffffffffff1682565b60066020526000908152604090205481565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b600560209081526000928352604080842090915290825290205481565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461069a5760405162461bcd60e51b81526004016104a690611983565b6117708167ffffffffffffffff16106106c55760405162461bcd60e51b81526004016104a690611915565b60405180604001604052808360038111156106f057634e487b7160e01b600052602160045260246000fd5b815267ffffffffffffffff83166020918201526001600160a01b03851660009081526007909152604090208151815482907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600183600381111561076557634e487b7160e01b600052602160045260246000fd5b021790555060209190910151815467ffffffffffffffff909116610100027fffffffffffffffffffffffffffffffffffffffffffffff0000000000000000ff9091161790556040517f322a14cd72711b473bdc3549ec949cbc27451339a81997e028f2996445b29ded906107de908590859085906117d0565b60405180910390a1505050565b6000336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146108355760405162461bcd60e51b81526004016104a690611983565b61085e7f0000000000000000000000000000000000000000000000000000000000000000610d31565b90508061087d5760405162461bcd60e51b81526004016104a690611a17565b6108878282610e12565b919050565b60008061089a338585610ea0565b909590945092505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b6001600160a01b0380841660008181526005602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92590610924908590611a4e565b60405180910390a3505050565b60006104798284611ae6565b6001600160a01b0383166000908152600760205260408082208151808301909252805483929190829060ff16600381111561098857634e487b7160e01b600052602160045260246000fd5b60038111156109a757634e487b7160e01b600052602160045260246000fd5b81529054610100900467ffffffffffffffff166020918201526001600160a01b038616600090815260079091526040808220815180830190925280549394509192909190829060ff166003811115610a0f57634e487b7160e01b600052602160045260246000fd5b6003811115610a2e57634e487b7160e01b600052602160045260246000fd5b81529054610100900467ffffffffffffffff16602091820152604080517fb4a735b200000000000000000000000000000000000000000000000000000000815290519293506000927f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169263b4a735b2926004808201939182900301818787803b158015610ac357600080fd5b505af1158015610ad7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610afb9190611616565b90506000816001600160a01b0316886001600160a01b03161480610b305750816001600160a01b0316876001600160a01b0316145b15610b3a57610c66565b6000600285516003811115610b5f57634e487b7160e01b600052602160045260246000fd5b1480610b8b5750600385516003811115610b8957634e487b7160e01b600052602160045260246000fd5b145b15610ba4575050602083015167ffffffffffffffff1660015b600184516003811115610bc757634e487b7160e01b600052602160045260246000fd5b1480610bf35750600384516003811115610bf157634e487b7160e01b600052602160045260246000fd5b145b8015610c0c575081846020015167ffffffffffffffff16115b15610c25575050602083015167ffffffffffffffff1660015b81158015610c31575080155b15610c64577f000000000000000000000000000000000000000000000000000000000000000067ffffffffffffffff1691505b505b8015610c7b57610c768682611002565b610c7e565b60005b9450610c8a8686610931565b9550610c97888387611011565b610ca28888886110b9565b5050505050505050565b610cf77f00000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000000000000836110c4565b610d01828261111c565b5050565b60008184841115610d295760405162461bcd60e51b81526004016104a6919061184e565b505050900390565b6001600160a01b0381166000818152600660205260408082205490517f70a0823100000000000000000000000000000000000000000000000000000000815291929091610de49183916370a0823190610d8e9030906004016117bc565b60206040518083038186803b158015610da657600080fd5b505afa158015610dba573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dde9190611766565b90610931565b9150610df081836111a6565b6001600160a01b03909316600090815260066020526040902092909255919050565b600354610e1f90826111a6565b6003556001600160a01b038216600090815260046020526040902054610e4590826111a6565b6001600160a01b0383166000818152600460205260408082209390935591519091907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610e94908590611a4e565b60405180910390a35050565b600080610ed7837f000000000000000000000000000000000000000000000000000000000000000067ffffffffffffffff16611002565b9150610ee38383610931565b905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663b4a735b26040518163ffffffff1660e01b8152600401602060405180830381600087803b158015610f4257600080fd5b505af1158015610f56573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f7a9190611616565b9050610f87868285611011565b610f91868361111c565b610fbc7f000000000000000000000000000000000000000000000000000000000000000086846110c4565b7ffc40624533f3a6341b6cd846b808821ff3de38e50edbcbdfc55db74e9c13119084848888604051610ff19493929190611a65565b60405180910390a150935093915050565b600061047983836127106111b2565b61101c8383836110b9565b6040517f7ac097500000000000000000000000000000000000000000000000000000000081526001600160a01b03831690637ac09750906110619030906004016117bc565b602060405180830381600087803b15801561107b57600080fd5b505af115801561108f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110b39190611766565b50505050565b610596838383611333565b6110d86001600160a01b03841683836113d7565b6001600160a01b0383166000908152600660205260409020546110fb9082610931565b6001600160a01b039093166000908152600660205260409020929092555050565b6001600160a01b03821660009081526004602052604090205461113f9082610931565b6001600160a01b0383166000908152600460205260409020556003546111659082610931565b6003556040516000906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610e94908590611a4e565b60006104798284611aaf565b60008080600019858709868602925082811090839003039050806111e857600084116111dd57600080fd5b508290049050610479565b8084116111f457600080fd5b60008486880980840393811190920391905060008561121581600019611ae6565b611220906001611aaf565b169586900495938490049360008190030460010190506112408184611ac7565b909317926000611251876003611ac7565b60021890506112608188611ac7565b61126b906002611ae6565b6112759082611ac7565b90506112818188611ac7565b61128c906002611ae6565b6112969082611ac7565b90506112a28188611ac7565b6112ad906002611ae6565b6112b79082611ac7565b90506112c38188611ac7565b6112ce906002611ae6565b6112d89082611ac7565b90506112e48188611ac7565b6112ef906002611ae6565b6112f99082611ac7565b90506113058188611ac7565b611310906002611ae6565b61131a9082611ac7565b90506113268186611ac7565b9998505050505050505050565b6001600160a01b0383166000908152600460205260409020546113569082610931565b6001600160a01b03808516600090815260046020526040808220939093559084168152205461138590826111a6565b6001600160a01b0380841660008181526004602052604090819020939093559151908516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610924908590611a4e565b6105968363a9059cbb60e01b84846040516024016113f6929190611805565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915260006114aa826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166114e49092919063ffffffff16565b80519091501561059657808060200190518101906114c8919061172e565b6105965760405162461bcd60e51b81526004016104a6906119ba565b60606114f384846000856114fb565b949350505050565b60608247101561151d5760405162461bcd60e51b81526004016104a6906118b8565b611526856115bb565b6115425760405162461bcd60e51b81526004016104a69061194c565b600080866001600160a01b0316858760405161155e91906117a0565b60006040518083038185875af1925050503d806000811461159b576040519150601f19603f3d011682016040523d82523d6000602084013e6115a0565b606091505b50915091506115b08282866115c1565b979650505050505050565b3b151590565b606083156115d0575081610479565b8251156115e05782518084602001fd5b8160405162461bcd60e51b81526004016104a6919061184e565b60006020828403121561160b578081fd5b813561047981611b7a565b600060208284031215611627578081fd5b815161047981611b7a565b60008060408385031215611644578081fd5b823561164f81611b7a565b9150602083013561165f81611b7a565b809150509250929050565b60008060006060848603121561167e578081fd5b833561168981611b7a565b9250602084013561169981611b7a565b929592945050506040919091013590565b6000806000606084860312156116be578283fd5b83356116c981611b7a565b92506020840135600481106116dc578283fd5b9150604084013567ffffffffffffffff811681146116f8578182fd5b809150509250925092565b60008060408385031215611715578182fd5b823561172081611b7a565b946020939093013593505050565b60006020828403121561173f578081fd5b81518015158114610479578182fd5b60006020828403121561175f578081fd5b5035919050565b600060208284031215611777578081fd5b5051919050565b6004811061179c57634e487b7160e01b600052602160045260246000fd5b9052565b600082516117b2818460208701611afd565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b0384168152606081016117ed602083018561177e565b67ffffffffffffffff83166040830152949350505050565b6001600160a01b03929092168252602082015260400190565b901515815260200190565b60408101611837828561177e565b67ffffffffffffffff831660208301529392505050565b600060208252825180602084015261186d816040850160208701611afd565b601f01601f19169190910160400192915050565b60208082526013908201527f43543a20616d6f756e7420726571756972656400000000000000000000000000604082015260600190565b60208082526026908201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60408201527f722063616c6c0000000000000000000000000000000000000000000000000000606082015260800190565b60208082526011908201527f43543a2066656520746f6f206c61726765000000000000000000000000000000604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b6020808252600f908201527f43543a206e6f7420616c6c6f7765640000000000000000000000000000000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b60208082526009908201527f43543a20656d7074790000000000000000000000000000000000000000000000604082015260600190565b90815260200190565b918252602082015260400190565b93845260208401929092526001600160a01b03908116604084015216606082015260800190565b67ffffffffffffffff91909116815260200190565b60ff91909116815260200190565b60008219821115611ac257611ac2611b64565b500190565b6000816000190483118215151615611ae157611ae1611b64565b500290565b600082821015611af857611af8611b64565b500390565b60005b83811015611b18578181015183820152602001611b00565b838111156110b35750506000910152565b600281046001821680611b3d57607f821691505b60208210811415611b5e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b03811681146104b957600080fdfe45524332303a206275726e20616d6f756e74206578636565647320616c6c6f77616e6365a2646970667358221220922185c77fec1586e453ccfd24da030198843d156919afde273d52087f1298a764736f6c63430008000033a26469706673582212202fca2a43321271d7774eb8e4bcf8372eeb1d406d022d9f5a19605f289c84013864736f6c63430008000033";

export class CrucibleFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CrucibleFactory> {
    return super.deploy(overrides || {}) as Promise<CrucibleFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CrucibleFactory {
    return super.attach(address) as CrucibleFactory;
  }
  connect(signer: Signer): CrucibleFactory__factory {
    return super.connect(signer) as CrucibleFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CrucibleFactoryInterface {
    return new utils.Interface(_abi) as CrucibleFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CrucibleFactory {
    return new Contract(address, _abi, signerOrProvider) as CrucibleFactory;
  }
}