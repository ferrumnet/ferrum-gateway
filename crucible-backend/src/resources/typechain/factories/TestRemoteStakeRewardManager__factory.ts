/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestRemoteStakeRewardManager,
  TestRemoteStakeRewardManagerInterface,
} from "../TestRemoteStakeRewardManager";

const _abi = [
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
        name: "rewardToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "staker_",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
    ],
    name: "PaidOut",
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
        name: "staker_",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakedAmount_",
        type: "uint256",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
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
    inputs: [
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
    ],
    name: "addRewardPublic",
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
        name: "staker",
        type: "address",
      },
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
    ],
    name: "fakeRewardOf",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "fakeRewards",
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
        name: "",
        type: "address",
      },
    ],
    name: "fakeRewardsTotal",
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
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "receiveTokenFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reflectionContract",
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
        name: "staker",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "rewardOf",
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
        name: "",
        type: "address",
      },
    ],
    name: "rewardTokens",
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
        name: "",
        type: "address",
      },
    ],
    name: "rewardsTotal",
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
    ],
    name: "setStake",
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
    name: "stakedBalance",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakes",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "syncStake",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "userStake",
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
        name: "baseToken",
        type: "address",
      },
    ],
    name: "withdrawRewards",
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
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
    ],
    name: "withdrawRewardsFor",
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
];

const _bytecode =
  "0x60c06040523480156200001157600080fd5b506001600081905550336001600160a01b0316638eb36e3d6040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156200005657600080fd5b505af11580156200006b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526200009591908101906200011e565b806020019051810190620000aa9190620000e7565b6001600160601b0319606091821b811660a05291901b166080526200020a565b80516001600160a01b0381168114620000e257600080fd5b919050565b60008060408385031215620000fa578182fd5b6200010583620000ca565b91506200011560208401620000ca565b90509250929050565b6000602080838503121562000131578182fd5b82516001600160401b038082111562000148578384fd5b818501915085601f8301126200015c578384fd5b815181811115620001715762000171620001f4565b604051601f8201601f19908116603f011681019083821181831017156200019c576200019c620001f4565b816040528281528886848701011115620001b4578687fd5b8693505b82841015620001d75784840186015181850187015292850192620001b8565b82841115620001e857868684830101525b98975050505050505050565b634e487b7160e01b600052604160045260246000fd5b60805160601c60a05160601c61186d62000259600039600081816101aa0152818161058f0152818161067a0152610dbb0152600081816103760152818161043a01526106ad015261186d6000f3fe608060405234801561001057600080fd5b50600436106101215760003560e01c806360217267116100ad578063b5fd282a11610071578063b5fd282a146102ef578063c16fc5451461030f578063f5ab16cc14610348578063f887ea4014610371578063fdbfc4741461039857610121565b806360217267146102425780636a1d4c89146102625780639046ac821461029c578063a3b660aa146102af578063a4e47b66146102c457610121565b80634732aa1d116100f45780634732aa1d146101925780634afc7187146101a557806351bdca3e146101e45780635471bcdd146101f75780635aed85f91461022257610121565b806322803774146101265780632513502a1461014c57806340b47e1a1461016c57806342d866931461017f575b600080fd5b610139610134366004611662565b6103ab565b6040519081526020015b60405180910390f35b61013961015a366004611662565b60076020526000908152604090205481565b61013961017a36600461167c565b61042d565b61013961018d366004611662565b6104b5565b6101396101a036600461167c565b610535565b6101cc7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610143565b6101396101f236600461167c565b610673565b61013961020536600461167c565b600360209081526000928352604080842090915290825290205481565b610139610230366004611662565b60066020526000908152604090205481565b610139610250366004611662565b60046020526000908152604090205481565b61013961027036600461167c565b6001600160a01b0380821660009081526003602090815260408083209386168352929052205492915050565b6101396102aa36600461167c565b6106a0565b6102c26102bd3660046116ae565b61079d565b005b6101396102d236600461167c565b600260209081526000928352604080842090915290825290205481565b6101396102fd366004611662565b60016020526000908152604090205481565b6102c261031d3660046116ae565b6001600160a01b03918216600090815260086020908152604080832095909416825293909352912055565b6101cc610356366004611662565b6005602052600090815260409020546001600160a01b031681565b6101cc7f000000000000000000000000000000000000000000000000000000000000000081565b6102c26103a636600461167c565b6107e4565b6001600160a01b038082166000908152600560205260408120549091168061041a5760405162461bcd60e51b815260206004820152601e60248201527f5253524d3a207374616b65206973206e6f7420696e697469616c697a6564000060448201526064015b60405180910390fd5b610424838261081f565b9150505b919050565b6000336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104a25760405162461bcd60e51b81526020600482015260186024820152771494d4934e8813db9b1e481c9bdd5d195c881b595d1a1bd960421b6044820152606401610411565b6104ac838361081f565b90505b92915050565b6000600260005414156104da5760405162461bcd60e51b815260040161041190611770565b6002600055336105205760405162461bcd60e51b81526020600482015260116024820152705253524d3a20426164206164647265737360781b6044820152606401610411565b61052a3383610969565b600160005592915050565b6001600160a01b0380821660008181526002602090815260408083209487168084529482528083205484845260038352818420958452948252808320549383526004825280832054600790925282205491939291846105b57f00000000000000000000000000000000000000000000000000000000000000008989610b2a565b90508481111561061c5760008080806105d98c8c8b6105d4818a6117de565b610b58565b935093509350935083896105ed91906117a7565b98506105f983896117a7565b975061060582886117a7565b965061061181876117a7565b955050505050610648565b8481101561064857600061063b89898861063686826117de565b610bc6565b5090985090965094509250505b8461065b576000955050505050506104af565b61066785858585610cea565b98975050505050505050565b60006104ac7f00000000000000000000000000000000000000000000000000000000000000008484610b2a565b6000336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107155760405162461bcd60e51b81526020600482015260186024820152771494d4934e8813db9b1e481c9bdd5d195c881b595d1a1bd960421b6044820152606401610411565b600260005414156107385760405162461bcd60e51b815260040161041190611770565b60026000556001600160a01b0383166107875760405162461bcd60e51b81526020600482015260116024820152705253524d3a20426164206164647265737360781b6044820152606401610411565b6107918383610969565b60016000559392505050565b600260005414156107c05760405162461bcd60e51b815260040161041190611770565b60026000556107da6001600160a01b038416833084610d1c565b5050600160005550565b600260005414156108075760405162461bcd60e51b815260040161041190611770565b60026000556108168282610d8d565b50506001600055565b6001600160a01b038083166000908152600560205260408120549091168015801561085257506001600160a01b03831615155b1561088857506001600160a01b03838116600090815260056020526040902080546001600160a01b031916918416919091179055815b6001600160a01b0381166108d65760405162461bcd60e51b81526020600482015260156024820152742929a9269d102737903932bbb0b932103a37b5b2b760591b6044820152606401610411565b60006108e182610e34565b9050806108f3576000925050506104af565b6001600160a01b0385166000908152600660205260409020546109179082906117a7565b6001600160a01b0386166000908152600660209081526040808320939093556007905220546109479082906117a7565b6001600160a01b03861660009081526007602052604090205591505092915050565b60006109758383610d8d565b6001600160a01b03808316600090815260026020908152604080832093871683529290522054806109e85760405162461bcd60e51b815260206004820152601760248201527f5253524d3a207573657220686173206e6f207374616b650000000000000000006044820152606401610411565b6001600160a01b03808416600090815260046020908152604080832054600783528184205460038452828520958a16855294909252822054909291610a2f85838686610cea565b6001600160a01b038816600090815260066020526040902054909150610a569082906117de565b6001600160a01b038816600090815260066020526040902055610a7981836117a7565b6001600160a01b038089166000908152600360209081526040808320938d16835292905220558015610b1f576001600160a01b0380881660009081526005602052604090205416610acb818a84610f1a565b604080516001600160a01b038a8116825283811660208301528b16818301526060810184905290517fac0c09f599ad30636a442dcfe0b0eac1612c7c9b1bceedf65a278526838c35979181900360800190a1505b979650505050505050565b6001600160a01b038082166000908152600860209081526040808320938616835292905220545b9392505050565b6001600160a01b0383166000908152600460209081526040808320546007909252822054829182918291908115158381610b925782610b9d565b610b9d898486610f8c565b905088818a84610bae576000610bb0565b835b929f919e509c50909a5098505050505050505050565b600080600080600086861115610c1e5760405162461bcd60e51b815260206004820152601860248201527f5253524d3a204e6f7420656e6f7567682062616c616e636500000000000000006044820152606401610411565b6001600160a01b038089166000818152600360209081526040808320948e16835293815283822054928252600781528382205460049091529281205491929190610c698a8484610f8c565b9050600084821115610ca057610c7f85836117de565b945084905080610c8f83866117de565b610c9991906117a7565b9350610cb9565b610caa82866117de565b9450610cb682856117de565b93505b8385610cc58d8f6117de565b610ccf8e876117de565b84995099509950995099505050505050945094509450945094565b600080610cf8848488610fa1565b9050848111610d08576000610d12565b610d1285826117de565b9695505050505050565b6040516001600160a01b0380851660248301528316604482015260648101829052610d879085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610fae565b50505050565b6001600160a01b03808216600090815260026020908152604080832093861683529290529081205490610de17f00000000000000000000000000000000000000000000000000000000000000008585610b2a565b905081811115610e0b576000610df783836117de565b9050610e0585858584611085565b50610d87565b81811015610d87576000610e1f82846117de565b9050610e2d858585846110e2565b5050505050565b600060026000541415610e595760405162461bcd60e51b815260040161041190611770565b600260009081556001600160a01b038316808252600160205260408083205490516370a0823160e01b8152306004820152909291906370a082319060240160206040518083038186803b158015610eaf57600080fd5b505afa158015610ec3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ee79190611709565b9050610ef382826117de565b6001600160a01b039094166000908152600160208190526040822092909255555090919050565b60026000541415610f3d5760405162461bcd60e51b815260040161041190611770565b600260009081556001600160a01b038416815260016020526040902054610f659082906117de565b6001600160a01b0384166000818152600160205260409020919091556107da9083836110f8565b6000610f99848484611128565b949350505050565b6000610f99838386611128565b6000611003826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166112ad9092919063ffffffff16565b805190915015611080578080602001905181019061102191906116e9565b6110805760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610411565b505050565b611091848484846112bc565b604080516001600160a01b038086168252861660208201529081018290527f5dac0c1b1112564a045ba943c9d50270893e8e826c49be8e7073adc713ab7bd79060600160405180910390a150505050565b806110ec57610d87565b610e2d848484846113d3565b6040516001600160a01b03831660248201526044810182905261108090849063a9059cbb60e01b90606401610d50565b600080806000198587098587029250828110838203039150508060001415611162576000841161115757600080fd5b508290049050610b51565b80841161116e57600080fd5b60008486880980840393811190920391905060008561118f816000196117de565b61119a9060016117a7565b169586900495938490049360008190030460010190506111ba81846117bf565b9093179260006111cb8760036117bf565b60021890506111da81886117bf565b6111e59060026117de565b6111ef90826117bf565b90506111fb81886117bf565b6112069060026117de565b61121090826117bf565b905061121c81886117bf565b6112279060026117de565b61123190826117bf565b905061123d81886117bf565b6112489060026117de565b61125290826117bf565b905061125e81886117bf565b6112699060026117de565b61127390826117bf565b905061127f81886117bf565b61128a9060026117de565b61129490826117bf565b90506112a081866117bf565b9998505050505050505050565b6060610f9984846000856114fa565b6000806000806112ce88888888610b58565b935093509350935083866112e291906117a7565b6001600160a01b038089166000818152600260209081526040808320948e168084529482528083209590955591815260038252838120928152919052205461132b9084906117a7565b6001600160a01b038089166000818152600360209081526040808320948e16835293815283822094909455908152600490925290205461136c9083906117a7565b6001600160a01b03881660009081526004602052604090205580156113c9576001600160a01b0387166000908152600760205260409020546113af9082906117a7565b6001600160a01b0388166000908152600760205260409020555b5050505050505050565b60006113e185858585610bc6565b909150905060076000886001600160a01b03166001600160a01b031681526020019081526020016000206000600360008a6001600160a01b03166001600160a01b0316815260200190815260200160002060008b6001600160a01b03166001600160a01b031681526020019081526020016000206000849750859190505584919050555050508160026000866001600160a01b03166001600160a01b031681526020019081526020016000206000876001600160a01b03166001600160a01b0316815260200190815260200160002060008282546114bf91906117de565b90915550506001600160a01b038416600090815260046020526040812080548492906114ec9084906117de565b909155509095945050505050565b60608247101561155b5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610411565b843b6115a95760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610411565b600080866001600160a01b031685876040516115c59190611721565b60006040518083038185875af1925050503d8060008114611602576040519150601f19603f3d011682016040523d82523d6000602084013e611607565b606091505b5091509150610b1f82828660608315611621575081610b51565b8251156116315782518084602001fd5b8160405162461bcd60e51b8152600401610411919061173d565b80356001600160a01b038116811461042857600080fd5b600060208284031215611673578081fd5b6104ac8261164b565b6000806040838503121561168e578081fd5b6116978361164b565b91506116a56020840161164b565b90509250929050565b6000806000606084860312156116c2578081fd5b6116cb8461164b565b92506116d96020850161164b565b9150604084013590509250925092565b6000602082840312156116fa578081fd5b81518015158114610b51578182fd5b60006020828403121561171a578081fd5b5051919050565b600082516117338184602087016117f5565b9190910192915050565b600060208252825180602084015261175c8160408501602087016117f5565b601f01601f19169190910160400192915050565b6020808252601f908201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604082015260600190565b600082198211156117ba576117ba611821565b500190565b60008160001904831182151516156117d9576117d9611821565b500290565b6000828210156117f0576117f0611821565b500390565b60005b838110156118105781810151838201526020016117f8565b83811115610d875750506000910152565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220d06e982db5a578cd206701b5818e9051665ee682fa2f7fbeb9437fb7f4834fb464736f6c63430008020033";

export class TestRemoteStakeRewardManager__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestRemoteStakeRewardManager> {
    return super.deploy(
      overrides || {}
    ) as Promise<TestRemoteStakeRewardManager>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TestRemoteStakeRewardManager {
    return super.attach(address) as TestRemoteStakeRewardManager;
  }
  connect(signer: Signer): TestRemoteStakeRewardManager__factory {
    return super.connect(signer) as TestRemoteStakeRewardManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestRemoteStakeRewardManagerInterface {
    return new utils.Interface(_abi) as TestRemoteStakeRewardManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestRemoteStakeRewardManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestRemoteStakeRewardManager;
  }
}