/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PoolDrop, PoolDropInterface } from "../PoolDrop";

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
        name: "id",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PoolDropTaken",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
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
        name: "id",
        type: "address",
      },
    ],
    name: "close",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "inventory",
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
        name: "id",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "pool",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
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
        name: "",
        type: "address",
      },
    ],
    name: "signers",
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
        name: "to",
        type: "address",
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
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "take",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokens",
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
      {
        internalType: "address[]",
        name: "tos",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferManyFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "tos",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "transferManyFromMultiValue",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
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

const _bytecode =
  "0x61012060405234801561001157600080fd5b50604080518082018252601081526f046455252554d5f504f4f4c5f44524f560841b60208083019182528351808501855260078152663030302e30303160c81b9082015260016000559151902060c08181527f216997d4e5731c53bb28f92073a02b69ff283b713a79ae155248b0198261acf960e08190524660a081815286517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818801819052818901969096526060810193909352608080840192909252308382015286518084039091018152919092019094528351939092019290922090526101005260805160a05160c05160e0516101005161187261013a6000396000610eae01526000610efd01526000610ed801526000610e5a01526000610e8301526118726000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063747af0c911610066578063747af0c914610162578063aef18bf714610175578063b5fd282a14610198578063c74073a1146101b8578063e4860339146101cb5761009e565b806327e235e3146100a35780635295be80146100d65780635d6aa843146100e95780636f0385661461010c578063736c0d5b14610121575b600080fd5b6100c36100b1366004611498565b60056020526000908152604090205481565b6040519081526020015b60405180910390f35b6100c36100e43660046114b2565b6101f4565b6100fc6100f73660046115d5565b610366565b60405190151581526020016100cd565b61011f61011a3660046114f4565b6104c9565b005b61014a61012f366004611498565b6004602052600090815260409020546001600160a01b031681565b6040516001600160a01b0390911681526020016100cd565b6100fc610170366004611653565b61072c565b6100fc6101833660046116cb565b60026020526000908152604090205460ff1681565b6100c36101a6366004611498565b60016020526000908152604090205481565b61011f6101c6366004611498565b610883565b61014a6101d9366004611498565b6003602052600090815260409020546001600160a01b031681565b60006001600160a01b0384166102255760405162461bcd60e51b815260040161021c9061174a565b60405180910390fd5b6001600160a01b0380851660009081526003602052604090205416801561031357836001600160a01b0316816001600160a01b0316146102a75760405162461bcd60e51b815260206004820152601e60248201527f50443a20506f6f6c64726f70206578697374732c2062616420746f6b656e0000604482015260640161021c565b6001600160a01b038581166000908152600460205260409020548116908416146103135760405162461bcd60e51b815260206004820152601f60248201527f50443a20506f6f6c64726f70206578697374732c20626164207369676e657200604482015260640161021c565b61031c84610a06565b6001600160a01b0386166000908152600560205260409020549092506103429083610b1c565b6001600160a01b039095166000908152600560205260409020949094559392505050565b60006001600160a01b0386166103ae5760405162461bcd60e51b815260206004820152600d60248201526c28221d102130b2103a37b5b2b760991b604482015260640161021c565b60006103b987610a06565b9050806103fe5760405162461bcd60e51b815260206004820152601360248201527250443a206e6f20706f6f6c2062616c616e636560681b604482015260640161021c565b60005b858110156104bb5761044285858381811061042c57634e487b7160e01b600052603260045260246000fd5b9050602002013583610b2f90919063ffffffff16565b91506104a98888888481811061046857634e487b7160e01b600052603260045260246000fd5b905060200201602081019061047d9190611498565b87878581811061049d57634e487b7160e01b600052603260045260246000fd5b90506020020135610b3b565b806104b3816117f5565b915050610401565b506001979650505050505050565b6001600160a01b0384166104ef5760405162461bcd60e51b815260040161021c9061174a565b6001600160a01b03851661053a5760405162461bcd60e51b815260206004820152601260248201527114110e881d1bc81a5cc81c995c5d5c9a595960721b604482015260640161021c565b826105805760405162461bcd60e51b815260206004820152601660248201527514110e88185b5bdd5b9d081a5cc81c995c5d5c9a595960521b604482015260640161021c565b6001600160a01b0380851660009081526003602090815260408083205460048352818420546005909352922054918316921690858110156105fc5760405162461bcd60e51b815260206004820152601660248201527550443a206e6f7420656e6f7567682062616c616e636560501b604482015260640161021c565b604080517f2f701b03b58ac4312c36540737f30a15c0c79919afb2069d6a1c5875fe1dbb156020808301919091526001600160a01b038b8116838501528a1660608301526080820189905260a08083018990528351808403909101815260c0909201909252805191012060006106728287610be7565b9050836001600160a01b0316816001600160a01b0316146106ca5760405162461bcd60e51b815260206004820152601260248201527128221d1024b73b30b634b21039b4b3b732b960711b604482015260640161021c565b6106d5858b8a610b3b565b604080516001600160a01b03808c1682528c1660208201529081018990527f601d183db767d1ae1d00e4e3e5f277bc8ca8f1df2d6f659fbbd47d675c0fef609060600160405180910390a150505050505050505050565b60006001600160a01b0385166107745760405162461bcd60e51b815260206004820152600d60248201526c28221d102130b2103a37b5b2b760991b604482015260640161021c565b816107b05760405162461bcd60e51b815260206004820152600c60248201526b50443a206e6f2076616c756560a01b604482015260640161021c565b60006107bb86610a06565b90508083111561080d5760405162461bcd60e51b815260206004820152601b60248201527f50443a206e6f7420656e6f75676820706f6f6c2062616c616e63650000000000604482015260640161021c565b60006108198486610c6f565b905060005b858110156104bb576108308383610b2f565b92506108718888888481811061085657634e487b7160e01b600052603260045260246000fd5b905060200201602081019061086b9190611498565b84610b3b565b8061087b816117f5565b91505061081e565b6001600160a01b0381166108a95760405162461bcd60e51b815260040161021c9061174a565b6001600160a01b03808216600090815260046020526040902054163381146109135760405162461bcd60e51b815260206004820152601760248201527f50443a204e6f742074686520706f6f6c207369676e6572000000000000000000604482015260640161021c565b6001600160a01b038216600090815260056020526040902054806109795760405162461bcd60e51b815260206004820152601760248201527f50443a204e6f2062616c616e636520746f20636c6f7365000000000000000000604482015260640161021c565b6001600160a01b0380841660009081526003602052604090205461099f91168383610b3b565b6001600160a01b038381166000818152600560209081526040808320929092558151928352928516928201929092529081018290527f601d183db767d1ae1d00e4e3e5f277bc8ca8f1df2d6f659fbbd47d675c0fef609060600160405180910390a1505050565b600060026000541415610a5b5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161021c565b600260009081556001600160a01b038316808252600160205260408083205490516370a0823160e01b8152306004820152909291906370a082319060240160206040518083038186803b158015610ab157600080fd5b505afa158015610ac5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ae991906116e3565b9050610af582826117ae565b6001600160a01b039094166000908152600160208190526040822092909255555090919050565b6000610b288284611776565b9392505050565b6000610b2882846117ae565b60026000541415610b8e5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161021c565b600260009081556001600160a01b038416815260016020526040902054610bb69082906117ae565b6001600160a01b038416600081815260016020526040902091909155610bdd908383610c7b565b5050600160005550565b600080610bf48484610cd2565b60008281526002602052604090205490935090915060ff1615610c505760405162461bcd60e51b815260206004820152601460248201527313595cdcd859d948185b1c9958591e481d5cd95960621b604482015260640161021c565b6000908152600260205260409020805460ff1916600117905592915050565b6000610b28828461178e565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610ccd908490610cf3565b505050565b600080610cde84610dc5565b9150610cea8284610e1b565b90509250929050565b6000610d48826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610e3f9092919063ffffffff16565b805190915015610ccd5780806020019051810190610d6691906116ab565b610ccd5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161021c565b6000610e13610dd2610e56565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b90505b919050565b6000806000610e2a8585610f4c565b91509150610e3781610fbc565b509392505050565b6060610e4e84846000856111c2565b949350505050565b60007f0000000000000000000000000000000000000000000000000000000000000000461415610ea757507f0000000000000000000000000000000000000000000000000000000000000000610f49565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c090920190925280519101205b90565b600080825160411415610f835760208301516040840151606085015160001a610f77878285856112ea565b94509450505050610fb5565b825160401415610fad5760208301516040840151610fa28683836113d7565b935093505050610fb5565b506000905060025b9250929050565b6000816004811115610fde57634e487b7160e01b600052602160045260246000fd5b1415610fe9576111bf565b600181600481111561100b57634e487b7160e01b600052602160045260246000fd5b14156110595760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161021c565b600281600481111561107b57634e487b7160e01b600052602160045260246000fd5b14156110c95760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161021c565b60038160048111156110eb57634e487b7160e01b600052602160045260246000fd5b14156111445760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161021c565b600481600481111561116657634e487b7160e01b600052602160045260246000fd5b14156111bf5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b606482015260840161021c565b50565b6060824710156112235760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161021c565b843b6112715760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161021c565b600080866001600160a01b0316858760405161128d91906116fb565b60006040518083038185875af1925050503d80600081146112ca576040519150601f19603f3d011682016040523d82523d6000602084013e6112cf565b606091505b50915091506112df828286611406565b979650505050505050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561132157506000905060036113ce565b8460ff16601b1415801561133957508460ff16601c14155b1561134a57506000905060046113ce565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561139e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166113c7576000600192509250506113ce565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b016113f8878288856112ea565b935093505050935093915050565b60608315611415575081610b28565b8251156114255782518084602001fd5b8160405162461bcd60e51b815260040161021c9190611717565b80356001600160a01b0381168114610e1657600080fd5b60008083601f840112611467578081fd5b50813567ffffffffffffffff81111561147e578182fd5b6020830191508360208083028501011115610fb557600080fd5b6000602082840312156114a9578081fd5b610b288261143f565b6000806000606084860312156114c6578182fd5b6114cf8461143f565b92506114dd6020850161143f565b91506114eb6040850161143f565b90509250925092565b600080600080600060a0868803121561150b578081fd5b6115148661143f565b94506115226020870161143f565b93506040860135925060608601359150608086013567ffffffffffffffff8082111561154c578283fd5b818801915088601f83011261155f578283fd5b81358181111561157157611571611826565b604051601f8201601f19908116603f0116810190838211818310171561159957611599611826565b816040528281528b60208487010111156115b1578586fd5b82602086016020830137856020848301015280955050505050509295509295909350565b6000806000806000606086880312156115ec578081fd5b6115f58661143f565b9450602086013567ffffffffffffffff80821115611611578283fd5b61161d89838a01611456565b90965094506040880135915080821115611635578283fd5b5061164288828901611456565b969995985093965092949392505050565b60008060008060608587031215611668578384fd5b6116718561143f565b9350602085013567ffffffffffffffff81111561168c578384fd5b61169887828801611456565b9598909750949560400135949350505050565b6000602082840312156116bc578081fd5b81518015158114610b28578182fd5b6000602082840312156116dc578081fd5b5035919050565b6000602082840312156116f4578081fd5b5051919050565b6000825161170d8184602087016117c5565b9190910192915050565b60006020825282518060208401526117368160408501602087016117c5565b601f01601f19169190910160400192915050565b60208082526012908201527114110e881a59081a5cc81c995c5d5c9a595960721b604082015260600190565b6000821982111561178957611789611810565b500190565b6000826117a957634e487b7160e01b81526012600452602481fd5b500490565b6000828210156117c0576117c0611810565b500390565b60005b838110156117e05781810151838201526020016117c8565b838111156117ef576000848401525b50505050565b600060001982141561180957611809611810565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea2646970667358221220bf8b9a6b62603bb907b9ba3192d6d83180273e4f12ce3d1e597c9a2aa5a3908364736f6c63430008020033";

export class PoolDrop__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PoolDrop> {
    return super.deploy(overrides || {}) as Promise<PoolDrop>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PoolDrop {
    return super.attach(address) as PoolDrop;
  }
  connect(signer: Signer): PoolDrop__factory {
    return super.connect(signer) as PoolDrop__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PoolDropInterface {
    return new utils.Interface(_abi) as PoolDropInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PoolDrop {
    return new Contract(address, _abi, signerOrProvider) as PoolDrop;
  }
}