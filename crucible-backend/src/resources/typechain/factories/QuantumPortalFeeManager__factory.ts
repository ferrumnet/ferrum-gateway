/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  QuantumPortalFeeManager,
  QuantumPortalFeeManagerInterface,
} from "../QuantumPortalFeeManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "chargeFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "depositFee",
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
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600160005561056a806100256000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063476343ee1461005c57806380352cfd1461005e578063a3b660aa1461006f578063b5fd282a14610082578063d3beb298146100b4575b600080fd5b005b61005c61006c36600461041b565b50565b61005c61007d366004610435565b6100c6565b6100a261009036600461041b565b60016020526000908152604090205481565b60405190815260200160405180910390f35b61005c6100c2366004610470565b5050565b6002600054141561011e5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b60026000556101386001600160a01b038416833084610142565b5050600160005550565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261019c9085906101a2565b50505050565b60006101f7826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166102799092919063ffffffff16565b80519091501561027457808060200190518101906102159190610499565b6102745760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610115565b505050565b60606102888484600085610292565b90505b9392505050565b6060824710156102f35760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610115565b6102fc856103c1565b6103485760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610115565b600080866001600160a01b0316858760405161036491906104b9565b60006040518083038185875af1925050503d80600081146103a1576040519150601f19603f3d011682016040523d82523d6000602084013e6103a6565b606091505b50915091506103b68282866103cb565b979650505050505050565b803b15155b919050565b606083156103da57508161028b565b8251156103ea5782518084602001fd5b8160405162461bcd60e51b815260040161011591906104d5565b80356001600160a01b03811681146103c657600080fd5b60006020828403121561042c578081fd5b61028b82610404565b600080600060608486031215610449578182fd5b61045284610404565b925061046060208501610404565b9150604084013590509250925092565b60008060408385031215610482578182fd5b61048b83610404565b946020939093013593505050565b6000602082840312156104aa578081fd5b8151801515811461028b578182fd5b600082516104cb818460208701610508565b9190910192915050565b60006020825282518060208401526104f4816040850160208701610508565b601f01601f19169190910160400192915050565b60005b8381101561052357818101518382015260200161050b565b8381111561019c575050600091015256fea2646970667358221220d7751a52563c350c755db5852aa22783f4ab019449cc0f58c67c9c294269284964736f6c63430008020033";

export class QuantumPortalFeeManager__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<QuantumPortalFeeManager> {
    return super.deploy(overrides || {}) as Promise<QuantumPortalFeeManager>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): QuantumPortalFeeManager {
    return super.attach(address) as QuantumPortalFeeManager;
  }
  connect(signer: Signer): QuantumPortalFeeManager__factory {
    return super.connect(signer) as QuantumPortalFeeManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): QuantumPortalFeeManagerInterface {
    return new utils.Interface(_abi) as QuantumPortalFeeManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): QuantumPortalFeeManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as QuantumPortalFeeManager;
  }
}