/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestCrucibleTokenDeployer,
  TestCrucibleTokenDeployerInterface,
} from "../TestCrucibleTokenDeployer";

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
  {
    inputs: [
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
    name: "testDeploy",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061297e806100206000396000f3fe60806040523480156200001157600080fd5b50600436106200003a5760003560e01c806339fdc646146200003f578063890357301462000073575b600080fd5b620000566200005036600462000577565b62000091565b6040516001600160a01b0390911681526020015b60405180910390f35b6200007d620000ae565b6040516200006a9695949392919062000676565b6000620000a387878787878762000210565b979650505050505050565b60008054600154600254600380546001600160a01b039485169594841694600160a01b90940467ffffffffffffffff908116949316929190620000f190620006dd565b80601f01602080910402602001604051908101604052809291908181526020018280546200011f90620006dd565b8015620001705780601f10620001445761010080835404028352916020019162000170565b820191906000526020600020905b8154815290600101906020018083116200015257829003601f168201915b5050505050908060040180546200018790620006dd565b80601f0160208091040260200160405190810160405280929190818152602001828054620001b590620006dd565b8015620002065780601f10620001da5761010080835404028352916020019162000206565b820191906000526020600020905b815481529060010190602001808311620001e857829003601f168201915b5050505050905086565b6040805160c0810182526001600160a01b03888116808352908816602080840182905267ffffffffffffffff8981169585018690528816606085018190526080850188905260a08501879052600080546001600160a01b031990811690951781556001805490951690931767ffffffffffffffff60a01b1916600160a01b909602959095179092556002805467ffffffffffffffff191690941790935584518391620002c291600391880190620003b9565b5060a08201518051620002e0916004840191602090910190620003b9565b5050604080516001600160a01b038916602082015267ffffffffffffffff808916928201929092529086166060820152608001905060405160208183030381529060405280519060200120604051620003399062000448565b8190604051809103906000f59050801580156200035a573d6000803e3d6000fd5b50600080546001600160a01b0319168155600180546001600160e01b03191690556002805467ffffffffffffffff19169055909150806200039d60038262000456565b620003ad60048301600062000456565b50509695505050505050565b828054620003c790620006dd565b90600052602060002090601f016020900481019282620003eb576000855562000436565b82601f106200040657805160ff191683800117855562000436565b8280016001018555821562000436579182015b828111156200043657825182559160200191906001019062000419565b50620004449291506200049b565b5090565b612218806200073183390190565b5080546200046490620006dd565b6000825580601f1062000478575062000498565b601f0160209004906000526020600020908101906200049891906200049b565b50565b5b808211156200044457600081556001016200049c565b80356001600160a01b0381168114620004ca57600080fd5b919050565b600082601f830112620004e0578081fd5b813567ffffffffffffffff80821115620004fe57620004fe6200071a565b604051601f8301601f19908116603f011681019082821181831017156200052957620005296200071a565b8160405283815286602085880101111562000542578485fd5b8360208701602083013792830160200193909352509392505050565b803567ffffffffffffffff81168114620004ca57600080fd5b60008060008060008060c0878903121562000590578182fd5b6200059b87620004b2565b9550620005ab60208801620004b2565b9450620005bb604088016200055e565b9350620005cb606088016200055e565b9250608087013567ffffffffffffffff80821115620005e8578384fd5b620005f68a838b01620004cf565b935060a08901359150808211156200060c578283fd5b506200061b89828a01620004cf565b9150509295509295509295565b60008151808452815b818110156200064f5760208185018101518683018201520162000631565b81811115620006615782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0387811682528616602082015267ffffffffffffffff85811660408301528416606082015260c060808201819052600090620006bc9083018562000628565b82810360a0840152620006d0818562000628565b9998505050505050505050565b600281046001821680620006f257607f821691505b602082108114156200071457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fdfe60a06040526002805460ff191660121790553480156200001e57600080fd5b506001600681905550600080336001600160a01b031663890357306040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156200006657600080fd5b505af11580156200007b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620000a591908101906200047f565b8051600990601490600a9060009081908190620000ca9060019060208a0190620002f6565b50508651620000df91906020890190620002f6565b508691906101000a8154816001600160401b0302191690836001600160401b031602179055508591906101000a8154816001600160401b0302191690836001600160401b0316021790555084975085965050505050505062000147826200023460201b60201c565b600260006101000a81548160ff021916908360ff16021790555081600960006101000a8154816001600160a01b0302191690836001600160a01b03160217905550806001600160a01b031663f887ea406040518163ffffffff1660e01b815260040160206040518083038186803b158015620001c257600080fd5b505afa158015620001d7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001fd91906200045b565b600880546001600160a01b0319166001600160a01b039290921691909117905560601b6001600160601b03191660805250620005f7565b60408051600481526024810182526020810180516001600160e01b031663313ce56760e01b1790529051600091829182916001600160a01b038616916200027c919062000553565b600060405180830381855afa9150503d8060008114620002b9576040519150601f19603f3d011682016040523d82523d6000602084013e620002be565b606091505b50915091508115620002ea5780806020019051810190620002e0919062000530565b92505050620002f1565b6012925050505b919050565b8280546200030490620005a4565b90600052602060002090601f01602090048101928262000328576000855562000373565b82601f106200034357805160ff191683800117855562000373565b8280016001018555821562000373579182015b828111156200037357825182559160200191906001019062000356565b506200038192915062000385565b5090565b5b8082111562000381576000815560010162000386565b80516001600160a01b0381168114620002f157600080fd5b600082601f830112620003c5578081fd5b81516001600160401b0380821115620003e257620003e2620005e1565b604051601f8301601f19908116603f011681019082821181831017156200040d576200040d620005e1565b8160405283815286602085880101111562000426578485fd5b6200043984602083016020890162000571565b9695505050505050565b80516001600160401b0381168114620002f157600080fd5b6000602082840312156200046d578081fd5b62000478826200039c565b9392505050565b60008060008060008060c0878903121562000498578182fd5b620004a3876200039c565b9550620004b3602088016200039c565b9450620004c36040880162000443565b9350620004d36060880162000443565b60808801519093506001600160401b0380821115620004f0578384fd5b620004fe8a838b01620003b4565b935060a089015191508082111562000514578283fd5b506200052389828a01620003b4565b9150509295509295509295565b60006020828403121562000542578081fd5b815160ff8116811462000478578182fd5b600082516200056781846020870162000571565b9190910192915050565b60005b838110156200058e57818101518382015260200162000574565b838111156200059e576000848401525b50505050565b600281046001821680620005b957607f821691505b60208210811415620005db57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b60805160601c611bfb6200061d600039600081816102fd0152610e4b0152611bfb6000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c806395d89b41116100c3578063d4e6e0461161007c578063d4e6e0461461034a578063dd62ed3e1461035d578063e56a5ec514610388578063f340fa011461039b578063f3fef3a3146103ae578063f887ea40146103d65761014d565b806395d89b411461027c578063a9059cbb14610284578063aa9d881c14610297578063b5fd282a146102d8578063c45a0155146102f8578063c55dae63146103375761014d565b8063313ce56711610115578063313ce567146101ef57806342966c681461020e57806355565fce1461022357806370a08231146102365780637651b2841461025657806379cc6790146102695761014d565b806306fdde0314610152578063095ea7b31461017057806313cf47a21461019357806318160ddd146101c557806323b872dd146101dc575b600080fd5b61015a6103e9565b6040516101679190611a5e565b60405180910390f35b61018361017e36600461191b565b610477565b6040519015158152602001610167565b6009546101ad90600160a01b90046001600160401b031681565b6040516001600160401b039091168152602001610167565b6101ce60035481565b604051908152602001610167565b6101836101ea366004611892565b61048d565b6002546101fc9060ff1681565b60405160ff9091168152602001610167565b61022161021c366004611966565b610522565b005b610221610231366004611822565b610577565b6101ce610244366004611822565b60046020526000908152604090205481565b600a546101ad906001600160401b031681565b61022161027736600461191b565b61060f565b61015a6106e7565b61018361029236600461191b565b6106f4565b6102ca6102a5366004611822565b600b6020526000908152604090205460ff81169061010090046001600160401b031682565b604051610167929190611a3a565b6101ce6102e6366004611822565b60076020526000908152604090205481565b61031f7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610167565b60095461031f906001600160a01b031681565b610221610358366004611996565b610701565b6101ce61036b36600461185a565b600560209081526000928352604080842090915290825290205481565b6102216103963660046118d2565b610868565b6101ce6103a9366004611822565b6109ac565b6103c16103bc36600461191b565b610a85565b60408051928352602083019190915201610167565b60085461031f906001600160a01b031681565b600080546103f690611b5f565b80601f016020809104026020016040519081016040528092919081815260200182805461042290611b5f565b801561046f5780601f106104445761010080835404028352916020019161046f565b820191906000526020600020905b81548152906001019060200180831161045257829003601f168201915b505050505081565b6000610484338484610a9e565b50600192915050565b6001600160a01b03831660009081526005602090815260408083203384529091528120546000191461050c576001600160a01b03841660009081526005602090815260408083203384529091529020546104e79083610b00565b6001600160a01b03851660009081526005602090815260408083203384529091529020555b610517848484610b0c565b5060015b9392505050565b8061056a5760405162461bcd60e51b815260206004820152601360248201527210d50e88185b5bdd5b9d081c995c5d5a5c9959606a1b60448201526064015b60405180910390fd5b6105743382610e39565b50565b6008546001600160a01b031633146105a15760405162461bcd60e51b815260040161056190611abc565b6001600160a01b0381166105ed5760405162461bcd60e51b815260206004820152601360248201527210d50e881c9bdd5d195c881c995c5d5a5c9959606a1b6044820152606401610561565b600880546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b0382166106595760405162461bcd60e51b815260206004820152601160248201527010d50e88199c9bdb481c995c5d5a5c9959607a1b6044820152606401610561565b8061069c5760405162461bcd60e51b815260206004820152601360248201527210d50e88185b5bdd5b9d081c995c5d5a5c9959606a1b6044820152606401610561565b6001600160a01b03821660009081526005602090815260408083203384529091528120546106cb908390611b1c565b90506106d8833383610a9e565b6106e28383610e39565b505050565b600180546103f690611b5f565b6000610484338484610b0c565b6008546001600160a01b0316331461072b5760405162461bcd60e51b815260040161056190611abc565b611770826001600160401b0316106107555760405162461bcd60e51b815260040161056190611a91565b611770816001600160401b03161061077f5760405162461bcd60e51b815260040161056190611a91565b6001600160401b0382161580159061079f57506001600160401b03811615155b6107e25760405162461bcd60e51b815260206004820152601460248201527310d50e881bdb9948199959481c995c5d5a5c995960621b6044820152606401610561565b6009805467ffffffffffffffff60a01b1916600160a01b6001600160401b0385811682029290921792839055600a805467ffffffffffffffff1916858416179081905560408051929094048316825290911660208201527f13c339074f104e125abc4623e58b8550f8a82863a245dad226be40bec66156c4910160405180910390a15050565b6008546001600160a01b031633146108925760405162461bcd60e51b815260040161056190611abc565b611770816001600160401b0316106108bc5760405162461bcd60e51b815260040161056190611a91565b60405180604001604052808360038111156108e757634e487b7160e01b600052602160045260246000fd5b81526001600160401b0383166020918201526001600160a01b0385166000908152600b9091526040902081518154829060ff1916600183600381111561093d57634e487b7160e01b600052602160045260246000fd5b02179055506020919091015181546001600160401b039091166101000268ffffffffffffffff00199091161790556040517f322a14cd72711b473bdc3549ec949cbc27451339a81997e028f2996445b29ded9061099f90859085908590611a06565b60405180910390a1505050565b6008546000906001600160a01b031633146109d95760405162461bcd60e51b815260040161056190611abc565b6009546109ee906001600160a01b0316610e7e565b905080610a295760405162461bcd60e51b815260206004820152600960248201526843543a20656d70747960b81b6044820152606401610561565b610a338282610f90565b600954604080516001600160a01b0392831681526020810184905291841682820152517fb4e1304f97b5093610f51b33ddab6622388422e2dac138b0d32f93dcfbd39edf9181900360600190a1919050565b600080610a93338585611020565b909590945092505050565b6001600160a01b0383811660008181526005602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b600061051b8284611b1c565b6001600160a01b0383166000908152600b602052604080822081518083019092528054829060ff166003811115610b5357634e487b7160e01b600052602160045260246000fd5b6003811115610b7257634e487b7160e01b600052602160045260246000fd5b8152905461010090046001600160401b03166020918201526001600160a01b0385166000908152600b9091526040808220815180830190925280549394509192909190829060ff166003811115610bd957634e487b7160e01b600052602160045260246000fd5b6003811115610bf857634e487b7160e01b600052602160045260246000fd5b8152905461010090046001600160401b031660209182015260085460408051635a539ad960e11b815290519394506000936001600160a01b039092169263b4a735b29260048084019382900301818787803b158015610c5657600080fd5b505af1158015610c6a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c8e919061183e565b9050806001600160a01b0316866001600160a01b03161480610cc15750806001600160a01b0316856001600160a01b0316145b15610cd957610cd186868661115b565b5050506106e2565b600080600285516003811115610cff57634e487b7160e01b600052602160045260246000fd5b1480610d2b5750600385516003811115610d2957634e487b7160e01b600052602160045260246000fd5b145b15610d4357505060208301516001600160401b031660015b600184516003811115610d6657634e487b7160e01b600052602160045260246000fd5b1480610d925750600384516003811115610d9057634e487b7160e01b600052602160045260246000fd5b145b8015610dab57508184602001516001600160401b031610155b15610dc357505060208201516001600160401b031660015b81158015610dcf575080155b15610dea57600954600160a01b90046001600160401b031691505b60008215610e0157610dfc8784611166565b610e04565b60005b9050610e108188611b1c565b96508015610e2357610e23898583611175565b610e2e89898961115b565b505050505050505050565b600954610e70906001600160a01b03167f000000000000000000000000000000000000000000000000000000000000000083611207565b610e7a82826112b4565b5050565b600060026006541415610ed35760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610561565b60026006556001600160a01b0382166000818152600760205260408082205490516370a0823160e01b81523060048201529092906370a082319060240160206040518083038186803b158015610f2857600080fd5b505afa158015610f3c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f60919061197e565b9050610f6c8282611b1c565b6001600160a01b039094166000908152600760205260409020555050600160065590565b600354610f9d908261133e565b6003556001600160a01b038216600090815260046020526040902054610fc3908261133e565b6001600160a01b0383166000818152600460205260408082209390935591519091907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906110149085815260200190565b60405180910390a35050565b600a54600090819061103c9084906001600160401b0316611166565b91506110488284611b1c565b90506000600860009054906101000a90046001600160a01b03166001600160a01b031663b4a735b26040518163ffffffff1660e01b8152600401602060405180830381600087803b15801561109c57600080fd5b505af11580156110b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110d4919061183e565b90506110e1868285611175565b6110eb86836112b4565b600954611102906001600160a01b03168684611207565b60408051858152602081018590526001600160a01b03888116828401528716606082015290517ffc40624533f3a6341b6cd846b808821ff3de38e50edbcbdfc55db74e9c1311909181900360800190a150935093915050565b6106e283838361134a565b600061051b83836127106113f0565b61118083838361115b565b60405163826150b560e01b81523060048201526001600160a01b03848116602483015283169063826150b590604401602060405180830381600087803b1580156111c957600080fd5b505af11580156111dd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611201919061197e565b50505050565b6002600654141561125a5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610561565b60026006556001600160a01b038316600090815260076020526040902054611283908290611b1c565b6001600160a01b0384166000818152600760205260409020919091556112aa908383611575565b5050600160065550565b6001600160a01b0382166000908152600460205260409020546112d79082610b00565b6001600160a01b0383166000908152600460205260409020556003546112fd9082610b00565b6003556040518181526000906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001611014565b600061051b8284611ae5565b6001600160a01b03831660009081526004602052604090205461136d9082610b00565b6001600160a01b03808516600090815260046020526040808220939093559084168152205461139c908261133e565b6001600160a01b0380841660008181526004602052604090819020939093559151908516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610af39085815260200190565b60008080600019858709858702925082811083820303915050806000141561142a576000841161141f57600080fd5b50829004905061051b565b80841161143657600080fd5b60008486880980840393811190920391905060008561145781600019611b1c565b611462906001611ae5565b169586900495938490049360008190030460010190506114828184611afd565b909317926000611493876003611afd565b60021890506114a28188611afd565b6114ad906002611b1c565b6114b79082611afd565b90506114c38188611afd565b6114ce906002611b1c565b6114d89082611afd565b90506114e48188611afd565b6114ef906002611b1c565b6114f99082611afd565b90506115058188611afd565b611510906002611b1c565b61151a9082611afd565b90506115268188611afd565b611531906002611b1c565b61153b9082611afd565b90506115478188611afd565b611552906002611b1c565b61155c9082611afd565b90506115688186611afd565b9998505050505050505050565b604080516001600160a01b03848116602483015260448083018590528351808403909101815260649092018352602080830180516001600160e01b031663a9059cbb60e01b17905283518085019094528084527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564908401526106e292869291600091611605918516908490611682565b8051909150156106e257808060200190518101906116239190611946565b6106e25760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610561565b60606116918484600085611699565b949350505050565b6060824710156116fa5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610561565b611703856117c8565b61174f5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610561565b600080866001600160a01b0316858760405161176b91906119ea565b60006040518083038185875af1925050503d80600081146117a8576040519150601f19603f3d011682016040523d82523d6000602084013e6117ad565b606091505b50915091506117bd8282866117d2565b979650505050505050565b803b15155b919050565b606083156117e157508161051b565b8251156117f15782518084602001fd5b8160405162461bcd60e51b81526004016105619190611a5e565b80356001600160401b03811681146117cd57600080fd5b600060208284031215611833578081fd5b813561051b81611bb0565b60006020828403121561184f578081fd5b815161051b81611bb0565b6000806040838503121561186c578081fd5b823561187781611bb0565b9150602083013561188781611bb0565b809150509250929050565b6000806000606084860312156118a6578081fd5b83356118b181611bb0565b925060208401356118c181611bb0565b929592945050506040919091013590565b6000806000606084860312156118e6578283fd5b83356118f181611bb0565b9250602084013560048110611904578283fd5b91506119126040850161180b565b90509250925092565b6000806040838503121561192d578182fd5b823561193881611bb0565b946020939093013593505050565b600060208284031215611957578081fd5b8151801515811461051b578182fd5b600060208284031215611977578081fd5b5035919050565b60006020828403121561198f578081fd5b5051919050565b600080604083850312156119a8578182fd5b6119b18361180b565b91506119bf6020840161180b565b90509250929050565b600481106119e657634e487b7160e01b600052602160045260246000fd5b9052565b600082516119fc818460208701611b33565b9190910192915050565b6001600160a01b038416815260608101611a2360208301856119c8565b6001600160401b0383166040830152949350505050565b60408101611a4882856119c8565b6001600160401b03831660208301529392505050565b6000602082528251806020840152611a7d816040850160208701611b33565b601f01601f19169190910160400192915050565b60208082526011908201527043543a2066656520746f6f206c6172676560781b604082015260600190565b6020808252600f908201526e10d50e881b9bdd08185b1b1bddd959608a1b604082015260600190565b60008219821115611af857611af8611b9a565b500190565b6000816000190483118215151615611b1757611b17611b9a565b500290565b600082821015611b2e57611b2e611b9a565b500390565b60005b83811015611b4e578181015183820152602001611b36565b838111156112015750506000910152565b600281046001821680611b7357607f821691505b60208210811415611b9457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b038116811461057457600080fdfea2646970667358221220526f216f26473687cb81f5ba28200e11e542f482b2c0a1eb17253f0005c34d6064736f6c63430008020033a26469706673582212201e12c4b3c856fdf37e61058761c1cd1b7a479f94be640caeda7c4a3d4dbfa67c64736f6c63430008020033";

export class TestCrucibleTokenDeployer__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestCrucibleTokenDeployer> {
    return super.deploy(overrides || {}) as Promise<TestCrucibleTokenDeployer>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TestCrucibleTokenDeployer {
    return super.attach(address) as TestCrucibleTokenDeployer;
  }
  connect(signer: Signer): TestCrucibleTokenDeployer__factory {
    return super.connect(signer) as TestCrucibleTokenDeployer__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestCrucibleTokenDeployerInterface {
    return new utils.Interface(_abi) as TestCrucibleTokenDeployerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestCrucibleTokenDeployer {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestCrucibleTokenDeployer;
  }
}