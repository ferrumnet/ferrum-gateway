/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PortalLedger, PortalLedgerInterface } from "../PortalLedger";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "overrideChainId",
        type: "uint256",
      },
    ],
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
    name: "clearContext",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "context",
    outputs: [
      {
        internalType: "uint64",
        name: "index",
        type: "uint64",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "chainId",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "timestamp",
            type: "uint64",
          },
        ],
        internalType: "struct QuantumPortalLib.Block",
        name: "blockMetadata",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "timestamp",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "remoteContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "sourceMsgSender",
            type: "address",
          },
          {
            internalType: "address",
            name: "sourceBeneficiary",
            type: "address",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "method",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256",
          },
        ],
        internalType: "struct QuantumPortalLib.RemoteTransaction",
        name: "transaction",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "uncommitedBalance",
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
        name: "blockIndex",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "chainId",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "timestamp",
            type: "uint64",
          },
        ],
        internalType: "struct QuantumPortalLib.Block",
        name: "b",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "timestamp",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "remoteContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "sourceMsgSender",
            type: "address",
          },
          {
            internalType: "address",
            name: "sourceBeneficiary",
            type: "address",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "method",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256",
          },
        ],
        internalType: "struct QuantumPortalLib.RemoteTransaction",
        name: "t",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "gas",
        type: "uint256",
      },
    ],
    name: "executeRemoteTransaction",
    outputs: [
      {
        internalType: "uint256",
        name: "gasUsed",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mgr",
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
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "remoteBalanceOf",
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
        name: "_mgr",
        type: "address",
      },
    ],
    name: "setManager",
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
  "0x60a060405234801561001057600080fd5b5060405161152438038061152483398101604081905261002f9161009f565b6100383361004f565b80156100445780610046565b465b608052506100b7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100b0578081fd5b5051919050565b6080516114526100d2600039600061069a01526114526000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063d0496d6a11610071578063d0496d6a1461012d578063d0ebdbe714610145578063d5929db814610158578063db99bddd1461016b578063f2fde38b14610173578063f851a44014610186576100a9565b80632ff778de146100ae578063704b6c02146100d457806370c85d46146100e9578063715018a6146101145780638da5cb5b1461011c575b600080fd5b6100c16100bc366004610fd5565b610199565b6040519081526020015b60405180910390f35b6100e76100e2366004610f48565b610320565b005b6002546100fc906001600160a01b031681565b6040516001600160a01b0390911681526020016100cb565b6100e76103a7565b6000546001600160a01b03166100fc565b6101356103dd565b6040516100cb9493929190611229565b6100e7610153366004610f48565b610524565b6100c1610166366004611010565b6105a5565b6100e761094b565b6100e7610181366004610f48565b610a73565b6001546100fc906001600160a01b031681565b60408051610100810182526006805467ffffffffffffffff811683526001600160a01b03600160401b90910481166020840152600754811693830193909352600854831660608301526009549092166080820152600a5460a0820152600b8054600093849392909160c084019190610210906113b5565b80601f016020809104026020016040519081016040528092919081815260200182805461023c906113b5565b80156102895780601f1061025e57610100808354040283529160200191610289565b820191906000526020600020905b81548152906001019060200180831161026c57829003601f168201915b50505050508152602001600682015481525050905080602001516001600160a01b0316836001600160a01b03161480156102d8575080608001516001600160a01b0316846001600160a01b0316145b156102e7575050600d54610319565b505060008381526003602090815260408083206001600160a01b03808716855290835281842090851684529091529020545b9392505050565b6000546001600160a01b031633146103535760405162461bcd60e51b815260040161034a906111f4565b60405180910390fd5b600180546001600160a01b0319166001600160a01b0383169081179091556040519081527f8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c9060200160405180910390a150565b6000546001600160a01b031633146103d15760405162461bcd60e51b815260040161034a906111f4565b6103db6000610b0e565b565b60048054604080516060808201835260055467ffffffffffffffff8082168452600160401b8083048216602080870191909152600160801b909304821685870152855161010081018752600680548085168352929092046001600160a01b03908116948201949094526007548416968101969096526008548316938601939093526009549091166080850152600a5460a0850152600b80549190951695929492939260c084019161048d906113b5565b80601f01602080910402602001604051908101604052809291908181526020018280546104b9906113b5565b80156105065780601f106104db57610100808354040283529160200191610506565b820191906000526020600020905b8154815290600101906020018083116104e957829003601f168201915b50505050508152602001600682015481525050908060090154905084565b6001546001600160a01b031633148061054757506000546001600160a01b031633145b6105835760405162461bcd60e51b815260206004820152600d60248201526c2ba09d103737ba1030b236b4b760991b604482015260640161034a565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6002546000906001600160a01b031633146105f45760405162461bcd60e51b815260206004820152600f60248201526e14130e88139bdd08185b1b1bddd959608a1b604482015260640161034a565b604080518082019091526009815268457865637574696e6760b81b6020820152459061061f90610b5e565b61064b60405180604001604052806006815260200165185b5bdd5b9d60d21b8152508560a00151610ba1565b61067f6040518060400160405280600e81526020016d1c995b5bdd1950dbdb9d1c9858dd60921b8152508560200151610bea565b60c08401515161070b5760a0840151156107065760a08401517f0000000000000000000000000000000000000000000000000000000000000000600090815260036020908152604080832060808901516001600160a01b039081168552908352818420838a0151909116845290915281208054909190610700908490611356565b90915550505b610935565b604080516080808201835267ffffffffffffffff808a16835260208084018a905283850189905260a08901518a51909216600090815260038252858120938a01516001600160a01b0390811682529382528581208a830151909416815292905292812054909260608301916107809190611356565b905280516004805467ffffffffffffffff92831667ffffffffffffffff19918216178255602080850151805160058054838501516040948501518916600160801b0267ffffffffffffffff60801b19918a16600160401b9081026fffffffffffffffff000000000000000019968c16948a169490941795909516929092171617905581870151805160068054838701516001600160a01b0390811690950268010000000000000000600160e01b031993909a169716969096171696909617845590850151600780549183166001600160a01b031992831617905560608601516008805491841691831691909117905560808601516009805491909316911617905560a0840151600a5560c0840151805195965086959394936108a692600b920190610df2565b5060e0820151816006015550506060820151816009015590505060006108d586602001518760c0015187610c2f565b9050801561092957600d54875167ffffffffffffffff16600090815260036020908152604080832060808b01516001600160a01b0390811685529083528184208b8401519091168452909152902055610932565b61093282610cca565b50505b45610940828261136e565b979650505050505050565b6002546001600160a01b031633146109975760405162461bcd60e51b815260206004820152600f60248201526e14130e88139bdd08185b1b1bddd959608a1b604482015260640161034a565b600580546001600160c01b0319169055600680546001600160e01b0319168155600780546001600160a01b031990811690915560088054821690556009805490911690556000600a8190556109ed600b82610e76565b50600060069182018190556004805467ffffffffffffffff19168155600580546001600160c01b031916905582546001600160e01b0319168355600780546001600160a01b03199081169091556008805482169055600980549091169055600a8290559181610a5d600b82610e76565b6006820160009055505060098201600090555050565b6000546001600160a01b03163314610a9d5760405162461bcd60e51b815260040161034a906111f4565b6001600160a01b038116610b025760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161034a565b610b0b81610b0e565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610b0b81604051602401610b729190611195565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b179052610d94565b610be68282604051602401610bb79291906111d2565b60408051601f198184030181529190526020810180516001600160e01b03166309710a9d60e41b179052610d94565b5050565b610be68282604051602401610c009291906111a8565b60408051601f198184030181529190526020810180516001600160e01b031663319af33360e01b179052610d94565b6000825160001415610c4357506001610319565b6060846001600160a01b031684604051610c5d9190611179565b6000604051808303816000865af19150503d8060008114610c9a576040519150601f19603f3d011682016040523d82523d6000602084013e610c9f565b606091505b50909250905081610cc2576000610cb582610db5565b9050610cc081610b5e565b505b509392505050565b6002546020820151516040808401516060810151608082015160a083015160e0909301519351634ec0465760e11b815267ffffffffffffffff90951660048601526001600160a01b03918216602486015260006044860181905260648601819052908216608486015260a485019290925260c484019290925261010060e484015261010483015290911690639d808cae9061012401600060405180830381600087803b158015610d7957600080fd5b505af1158015610d8d573d6000803e3d6000fd5b5050505050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b80516060906064811115610dc7575060645b600483018051600319830182529093610de99083810160200190602401610f62565b93525090919050565b828054610dfe906113b5565b90600052602060002090601f016020900481019282610e205760008555610e66565b82601f10610e3957805160ff1916838001178555610e66565b82800160010185558215610e66579182015b82811115610e66578251825591602001919060010190610e4b565b50610e72929150610eae565b5090565b508054610e82906113b5565b6000825580601f10610e945750610b0b565b601f016020900490600052602060002090810190610b0b91905b5b80821115610e725760008155600101610eaf565b80356001600160a01b0381168114610eda57600080fd5b919050565b600082601f830112610eef578081fd5b8135610f02610efd8261132e565b6112fd565b818152846020838601011115610f16578283fd5b816020850160208301379081016020019190915292915050565b803567ffffffffffffffff81168114610eda57600080fd5b600060208284031215610f59578081fd5b61031982610ec3565b600060208284031215610f73578081fd5b815167ffffffffffffffff811115610f89578182fd5b8201601f81018413610f99578182fd5b8051610fa7610efd8261132e565b818152856020838501011115610fbb578384fd5b610fcc826020830160208601611385565b95945050505050565b600080600060608486031215610fe9578182fd5b83359250610ff960208501610ec3565b915061100760408501610ec3565b90509250925092565b60008060008084860360c0811215611026578182fd5b853594506060601f198201121561103b578182fd5b5061104660606112fd565b61105260208701610f30565b815261106060408701610f30565b602082015261107160608701610f30565b60408201529250608085013567ffffffffffffffff80821115611092578283fd5b818701915061010080838a0312156110a8578384fd5b6110b1816112fd565b90506110bc83610f30565b81526110ca60208401610ec3565b60208201526110db60408401610ec3565b60408201526110ec60608401610ec3565b60608201526110fd60808401610ec3565b608082015260a083013560a082015260c08301358281111561111d578485fd5b6111298a828601610edf565b60c08301525060e09283013592810192909252509396929550929360a00135925050565b60008151808452611165816020860160208601611385565b601f01601f19169290920160200192915050565b6000825161118b818460208701611385565b9190910192915050565b600060208252610319602083018461114d565b6000604082526111bb604083018561114d565b905060018060a01b03831660208301529392505050565b6000604082526111e5604083018561114d565b90508260208301529392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b600067ffffffffffffffff808716835280865116602084015280602087015116604084015280604087015116606084015260c060808401528085511660c08401525060018060a01b0360208501511660e08301526040840151610100611299818501836001600160a01b03169052565b60608601516001600160a01b0390811661012086015260808701511661014085015260a086015161016085015260c086015161018085019190915290506112e46101c084018261114d565b60e095909501516101a0840152505060a0015292915050565b604051601f8201601f1916810167ffffffffffffffff8111828210171561132657611326611406565b604052919050565b600067ffffffffffffffff82111561134857611348611406565b50601f01601f191660200190565b60008219821115611369576113696113f0565b500190565b600082821015611380576113806113f0565b500390565b60005b838110156113a0578181015183820152602001611388565b838111156113af576000848401525b50505050565b6002810460018216806113c957607f821691505b602082108114156113ea57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea26469706673582212202d2576787d256fa194ac0cb88cbadbd43ccb6cf0645c2b05db93faf96e351b7364736f6c63430008020033";

export class PortalLedger__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrideChainId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PortalLedger> {
    return super.deploy(
      overrideChainId,
      overrides || {}
    ) as Promise<PortalLedger>;
  }
  getDeployTransaction(
    overrideChainId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrideChainId, overrides || {});
  }
  attach(address: string): PortalLedger {
    return super.attach(address) as PortalLedger;
  }
  connect(signer: Signer): PortalLedger__factory {
    return super.connect(signer) as PortalLedger__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PortalLedgerInterface {
    return new utils.Interface(_abi) as PortalLedgerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PortalLedger {
    return new Contract(address, _abi, signerOrProvider) as PortalLedger;
  }
}