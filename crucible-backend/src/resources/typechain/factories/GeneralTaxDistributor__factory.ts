/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  GeneralTaxDistributor,
  GeneralTaxDistributorInterface,
} from "../GeneralTaxDistributor";

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
    name: "distributeTax",
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
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "origSender",
        type: "address",
      },
    ],
    name: "distributeTaxDirect",
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
    name: "globalTargetConfig",
    outputs: [
      {
        internalType: "uint8",
        name: "len",
        type: "uint8",
      },
      {
        internalType: "uint32",
        name: "totalW",
        type: "uint32",
      },
      {
        internalType: "uint216",
        name: "weights",
        type: "uint216",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lowThresholdX1000",
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
        components: [
          {
            internalType: "address",
            name: "tgt",
            type: "address",
          },
          {
            internalType: "enum GeneralTaxDistributor.TargetType",
            name: "tType",
            type: "uint8",
          },
        ],
        internalType: "struct GeneralTaxDistributor.TargetInfo[]",
        name: "infos",
        type: "tuple[]",
      },
      {
        internalType: "uint216",
        name: "weights",
        type: "uint216",
      },
    ],
    name: "setGlobalTargetInfos",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAdress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bufferSize",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "tokenSpecificConfig",
        type: "uint8",
      },
    ],
    name: "setTokenInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddess",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "tgt",
            type: "address",
          },
          {
            internalType: "enum GeneralTaxDistributor.TargetType",
            name: "tType",
            type: "uint8",
          },
        ],
        internalType: "struct GeneralTaxDistributor.TargetInfo[]",
        name: "infos",
        type: "tuple[]",
      },
      {
        internalType: "uint216",
        name: "weights",
        type: "uint216",
      },
    ],
    name: "setTokenTargetInfos",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "targetInfos",
    outputs: [
      {
        internalType: "address",
        name: "tgt",
        type: "address",
      },
      {
        internalType: "enum GeneralTaxDistributor.TargetType",
        name: "tType",
        type: "uint8",
      },
    ],
    stateMutability: "view",
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
    name: "tokenInfo",
    outputs: [
      {
        internalType: "uint248",
        name: "bufferSize",
        type: "uint248",
      },
      {
        internalType: "uint8",
        name: "tokenSpecificConfig",
        type: "uint8",
      },
    ],
    stateMutability: "view",
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
    name: "tokenTargetConfigs",
    outputs: [
      {
        internalType: "uint8",
        name: "len",
        type: "uint8",
      },
      {
        internalType: "uint32",
        name: "totalW",
        type: "uint32",
      },
      {
        internalType: "uint216",
        name: "weights",
        type: "uint216",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenTargetInfos",
    outputs: [
      {
        internalType: "address",
        name: "tgt",
        type: "address",
      },
      {
        internalType: "enum GeneralTaxDistributor.TargetType",
        name: "tType",
        type: "uint8",
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
  "0x60a06040523480156200001157600080fd5b506200002662000020620000c5565b620000c9565b6000336001600160a01b0316638eb36e3d6040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156200006457600080fd5b505af115801562000079573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620000a3919081019062000119565b905080806020019051810190620000bb9190620001e8565b6080525062000217565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600060208083850312156200012c578182fd5b82516001600160401b038082111562000143578384fd5b818501915085601f83011262000157578384fd5b8151818111156200016c576200016c62000201565b604051601f8201601f191681018501838111828210171562000192576200019262000201565b6040528181528382018501881015620001a9578586fd5b8592505b81831015620001cc5783830185015181840186015291840191620001ad565b81831115620001dd57858583830101525b979650505050505050565b600060208284031215620001fa578081fd5b5051919050565b634e487b7160e01b600052604160045260246000fd5b608051611ccb6200023a6000396000818161067301526109780152611ccb6000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063adb49a9711610097578063f1dc119a11610066578063f1dc119a146101ff578063f2fde38b14610212578063f5dab71114610225578063f851a4401461024657610100565b8063adb49a97146101ba578063c70c666b146101dc578063d46f0c4d146101ef578063da5d627d146101f757610100565b806376a8a0f8116100d357806376a8a0f8146101485780637ac09750146101725780638da5cb5b14610192578063aacb6f68146101a757610100565b80630a4248be14610105578063410be8cf1461011a578063704b6c021461012d578063715018a614610140575b600080fd5b610118610113366004611733565b61024e565b005b6101186101283660046116ef565b610437565b61011861013b36600461161e565b610517565b6101186105b9565b61015b610156366004611796565b610604565b60405161016992919061183c565b60405180910390f35b61018561018036600461161e565b610639565b6040516101699190611af9565b61019a6106c1565b6040516101699190611828565b61015b6101b53660046116c6565b6106d0565b6101cd6101c836600461161e565b610713565b60405161016993929190611b02565b6101186101ea36600461166a565b610748565b610185610976565b6101cd61099a565b61018561020d366004611638565b6109c3565b61011861022036600461161e565b610a0a565b61023861023336600461161e565b610a7b565b604051610169929190611ac5565b61019a610aba565b6001546001600160a01b031633148061027f575061026a6106c1565b6001600160a01b0316336001600160a01b0316145b6102a45760405162461bcd60e51b815260040161029b906119c3565b60405180910390fd5b601b8251106102c55760405162461bcd60e51b815260040161029b90611957565b60006102db8351836001600160d81b0316610ac9565b60408051606081018252855160ff1680825263ffffffff8416602083018190526001600160d81b0387169383018490526005805460ff191690921764ffffffff0019166101009091021764ffffffffff16650100000000009093029290921790915590915061034c600660006114b5565b60005b845181101561043057600685828151811061037a57634e487b7160e01b600052603260045260246000fd5b602090810291909101810151825460018101845560009384529282902081519301805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03909416939093178084559181015190929182907fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff16600160a01b83600381111561041657634e487b7160e01b600052602160045260246000fd5b02179055505050808061042890611c2e565b91505061034f565b5050505050565b6001546001600160a01b031633148061046857506104536106c1565b6001600160a01b0316336001600160a01b0316145b6104845760405162461bcd60e51b815260040161029b906119c3565b6040805180820182527effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff938416815260ff92831660208083019182526001600160a01b039096166000908152600290965291909420935184549151909216600160f81b029183167fff0000000000000000000000000000000000000000000000000000000000000090911617909116179055565b61051f610b69565b6001600160a01b03166105306106c1565b6001600160a01b0316146105565760405162461bcd60e51b815260040161029b9061198e565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383161790556040517f8fe72c3e0020beb3234e76ae6676fa576fbfcae600af1c4fea44784cf0db329c906105ae908390611828565b60405180910390a150565b6105c1610b69565b6001600160a01b03166105d26106c1565b6001600160a01b0316146105f85760405162461bcd60e51b815260040161029b9061198e565b6106026000610b6d565b565b6006818154811061061457600080fd5b6000918252602090912001546001600160a01b0381169150600160a01b900460ff1682565b60408051808201909152600754603081901b65ffffffffffff19168252600160d01b900463ffffffff1660208201526000908161069782327f0000000000000000000000000000000000000000000000000000000000000000610bca565b9092509050806106ac576000925050506106bc565b6106b7843284610c21565b925050505b919050565b6000546001600160a01b031690565b600460205281600052604060002081815481106106ec57600080fd5b6000918252602090912001546001600160a01b0381169250600160a01b900460ff16905082565b60036020526000908152604090205460ff811690610100810463ffffffff16906501000000000090046001600160d81b031683565b6001546001600160a01b031633148061077957506107646106c1565b6001600160a01b0316336001600160a01b0316145b6107955760405162461bcd60e51b815260040161029b906119c3565b601b8251106107b65760405162461bcd60e51b815260040161029b90611957565b60006107cc8351836001600160d81b0316610ac9565b60408051606081018252855160ff908116825263ffffffff80851660208085019182526001600160d81b03808a168688019081526001600160a01b038d166000908152600384528881208851815496519351909416650100000000000264ffffffffff939097166101000264ffffffff00199490981660ff19909616959095179290921695909517949094169290921790556004905291822092935091610872916114b5565b60005b845181101561096e576001600160a01b038616600090815260046020526040902085518690839081106108b857634e487b7160e01b600052603260045260246000fd5b602090810291909101810151825460018101845560009384529282902081519301805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03909416939093178084559181015190929182907fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff16600160a01b83600381111561095457634e487b7160e01b600052602160045260246000fd5b02179055505050808061096690611c2e565b915050610875565b505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60055460ff811690610100810463ffffffff16906501000000000090046001600160d81b031683565b60408051808201909152600754603081901b65ffffffffffff19168252600160d01b900463ffffffff166020820152600090610a00848483610c21565b9150505b92915050565b610a12610b69565b6001600160a01b0316610a236106c1565b6001600160a01b031614610a495760405162461bcd60e51b815260040161029b9061198e565b6001600160a01b038116610a6f5760405162461bcd60e51b815260040161029b906118c3565b610a7881610b6d565b50565b6002602052600090815260409020547effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811690600160f81b900460ff1682565b6001546001600160a01b031681565b600080602060ff851610610aef5760405162461bcd60e51b815260040161029b90611920565b60005b8460ff168160ff161015610b61576000610b0d826008611bd5565b905060ff80821690811b90868216901c610100811115610b3f5760405162461bcd60e51b815260040161029b90611a8e565b610b498186611b6e565b94505050508080610b5990611c49565b915050610af2565b509392505050565b3390565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610bd26114d3565b6000806000610be5876000015187610eb9565b65ffffffffffff19821689528895509092509050610c0885640100000000611bb6565b610c14826103e8611bb6565b1192505050935093915050565b6001600160a01b03831660008181526002602090815260408083208151808301835290547effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81168252600160f81b900460ff1692810192909252517f70a08231000000000000000000000000000000000000000000000000000000008152919290918391906370a0823190610cb9903090600401611828565b60206040518083038186803b158015610cd157600080fd5b505afa158015610ce5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d0991906117ae565b82519091507effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff16811015610d4157600092505050610eb2565b600080610d52866000015188610eb9565b65ffffffffffff1982168852600780546020808b01517fffffffffffff0000000000000000000000000000000000000000000000000000909216603086901c177fffff00000000ffffffffffffffffffffffffffffffffffffffffffffffffffff16600160d01b63ffffffff9093169290920291909117909155860151919350915060009060ff16610de5576005610dfe565b6001600160a01b03891660009081526003602052604090205b60408051606081018252915460ff8116808452610100820463ffffffff166020850152650100000000009091046001600160d81b031691830191909152909150610e8b575060006020858101919091526040805160608101825260055460ff81168252610100810463ffffffff1693820193909352650100000000009092046001600160d81b0316908201525b6000610e978383610f1a565b9050610ea98187602001518c88610fda565b96505050505050505b9392505050565b600080837f2e0bbc5de4d611391441d62c8a6fc9439cc80a3e7ceaf4e6f85575437f187d5d60001b84604051602001610ef4939291906117c6565b60408051601f1981840301815291905280516020909101209460e086901c945092505050565b6040810151602082015160009182916001600160d81b039091169064010000000090610f4c9063ffffffff1687611bb6565b610f569190611b96565b945060005b846000015160ff168160ff161015610fce576000610f7a826008611bd5565b905060ff80821690811b90848216901c610f948187611b56565b9550888610158015610fa557508015155b15610fb857839650505050505050610a04565b5050508080610fc690611c49565b915050610f5b565b50600095945050505050565b60008060ff85166110185760068660ff168154811061100957634e487b7160e01b600052603260045260246000fd5b9060005260206000200161105e565b6001600160a01b0384166000908152600460205260409020805460ff881690811061105357634e487b7160e01b600052603260045260246000fd5b906000526020600020015b6040805180820190915281546001600160a01b03811682529091906020830190600160a01b900460ff1660038111156110a757634e487b7160e01b600052602160045260246000fd5b60038111156110c657634e487b7160e01b600052602160045260246000fd5b90525090506001816020015160038111156110f157634e487b7160e01b600052602160045260246000fd5b1415611177576040517f42966c680000000000000000000000000000000000000000000000000000000081526001600160a01b038516906342966c689061113c908690600401611af9565b600060405180830381600087803b15801561115657600080fd5b505af115801561116a573d6000803e3d6000fd5b50505050829150506112ae565b60028160200151600381111561119d57634e487b7160e01b600052602160045260246000fd5b14156111c35780516111ba906001600160a01b03861690856112b6565b829150506112ae565b6003816020015160038111156111e957634e487b7160e01b600052602160045260246000fd5b14156112a8578051611206906001600160a01b03861690856112b6565b80516040517f39ef9fdc0000000000000000000000000000000000000000000000000000000081526001600160a01b03909116906339ef9fdc9061124e908790600401611828565b602060405180830381600087803b15801561126857600080fd5b505af115801561127c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112a091906117ae565b9150506112ae565b60009150505b949350505050565b6113398363a9059cbb60e01b84846040516024016112d5929190611877565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915261133e565b505050565b6000611393826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166113cd9092919063ffffffff16565b80519091501561133957808060200190518101906113b19190611776565b6113395760405162461bcd60e51b815260040161029b90611a31565b60606112ae8484600085856113e185611476565b6113fd5760405162461bcd60e51b815260040161029b906119fa565b600080866001600160a01b03168587604051611419919061180c565b60006040518083038185875af1925050503d8060008114611456576040519150601f19603f3d011682016040523d82523d6000602084013e61145b565b606091505b509150915061146b82828661147c565b979650505050505050565b3b151590565b6060831561148b575081610eb2565b82511561149b5782518084602001fd5b8160405162461bcd60e51b815260040161029b9190611890565b5080546000825590600052602060002090810190610a7891906114ea565b604080518082019091526000808252602082015290565b5b808211156115215780547fffffffffffffffffffffff0000000000000000000000000000000000000000001681556001016114eb565b5090565b80356001600160a01b03811681146106bc57600080fd5b600082601f83011261154c578081fd5b8135602067ffffffffffffffff8083111561156957611569611c7f565b6115768283850201611b2c565b838152828101908684016040808702890186018a1015611594578788fd5b875b878110156115f85781838c0312156115ac578889fd5b815182810181811088821117156115c5576115c5611c7f565b83526115d084611525565b815287840135600481106115e2578a8bfd5b8189015285529386019391810191600101611596565b50919998505050505050505050565b80356001600160d81b03811681146106bc57600080fd5b60006020828403121561162f578081fd5b610eb282611525565b6000806040838503121561164a578081fd5b61165383611525565b915061166160208401611525565b90509250929050565b60008060006060848603121561167e578081fd5b61168784611525565b9250602084013567ffffffffffffffff8111156116a2578182fd5b6116ae8682870161153c565b9250506116bd60408501611607565b90509250925092565b600080604083850312156116d8578182fd5b6116e183611525565b946020939093013593505050565b600080600060608486031215611703578283fd5b61170c84611525565b925060208401359150604084013560ff81168114611728578182fd5b809150509250925092565b60008060408385031215611745578182fd5b823567ffffffffffffffff81111561175b578283fd5b6117678582860161153c565b92505061166160208401611607565b600060208284031215611787578081fd5b81518015158114610eb2578182fd5b6000602082840312156117a7578081fd5b5035919050565b6000602082840312156117bf578081fd5b5051919050565b65ffffffffffff19939093168352601a83019190915260601b7fffffffffffffffffffffffffffffffffffffffff00000000000000000000000016603a820152604e0190565b6000825161181e818460208701611bfe565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b0383168152604081016004831061186a57634e487b7160e01b600052602160045260246000fd5b8260208301529392505050565b6001600160a01b03929092168252602082015260400190565b60006020825282518060208401526118af816040850160208701611bfe565b601f01601f19169190910160400192915050565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201527f6464726573730000000000000000000000000000000000000000000000000000606082015260800190565b60208082526011908201527f4754443a206c656e20746f6f206c6f6e67000000000000000000000000000000604082015260600190565b60208082526014908201527f4754443a20696e666f7320746f6f206c61726765000000000000000000000000604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252600d908201527f57413a206e6f742061646d696e00000000000000000000000000000000000000604082015260600190565b6020808252601d908201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604082015260600190565b6020808252602a908201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60408201527f6f74207375636365656400000000000000000000000000000000000000000000606082015260800190565b60208082526019908201527f4754443a20706f6f6c20726174696f20746f6f206c6172676500000000000000604082015260600190565b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff92909216825260ff16602082015260400190565b90815260200190565b60ff93909316835263ffffffff9190911660208301526001600160d81b0316604082015260600190565b60405181810167ffffffffffffffff81118282101715611b4e57611b4e611c7f565b604052919050565b60008219821115611b6957611b69611c69565b500190565b600063ffffffff808316818516808303821115611b8d57611b8d611c69565b01949350505050565b600082611bb157634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615611bd057611bd0611c69565b500290565b600060ff821660ff84168160ff0481118215151615611bf657611bf6611c69565b029392505050565b60005b83811015611c19578181015183820152602001611c01565b83811115611c28576000848401525b50505050565b6000600019821415611c4257611c42611c69565b5060010190565b600060ff821660ff811415611c6057611c60611c69565b60010192915050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea2646970667358221220e7f9884c3da600a9db6aa1a2546b174e4a0c2887bfcd8d201ab086ba96f0845564736f6c63430008000033";

export class GeneralTaxDistributor__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<GeneralTaxDistributor> {
    return super.deploy(overrides || {}) as Promise<GeneralTaxDistributor>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): GeneralTaxDistributor {
    return super.attach(address) as GeneralTaxDistributor;
  }
  connect(signer: Signer): GeneralTaxDistributor__factory {
    return super.connect(signer) as GeneralTaxDistributor__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GeneralTaxDistributorInterface {
    return new utils.Interface(_abi) as GeneralTaxDistributorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GeneralTaxDistributor {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as GeneralTaxDistributor;
  }
}