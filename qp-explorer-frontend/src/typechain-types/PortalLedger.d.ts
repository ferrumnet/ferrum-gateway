/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface PortalLedgerInterface extends ethers.utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "clearContext()": FunctionFragment;
    "context()": FunctionFragment;
    "estimateGasForRemoteTransaction(uint256,address,address,address,bytes,address,uint256)": FunctionFragment;
    "executeRemoteTransaction(uint256,(uint64,uint64,uint64),(uint64,address,address,address,address,uint256,bytes[],uint256,uint256),uint256)": FunctionFragment;
    "mgr()": FunctionFragment;
    "owner()": FunctionFragment;
    "rejectRemoteTransaction(uint256,(uint64,address,address,address,address,uint256,bytes[],uint256,uint256))": FunctionFragment;
    "remoteBalanceOf(uint256,address,address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "setManager(address,address)": FunctionFragment;
    "state()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "clearContext",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "context", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "estimateGasForRemoteTransaction",
    values: [
      BigNumberish,
      string,
      string,
      string,
      BytesLike,
      string,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeRemoteTransaction",
    values: [
      BigNumberish,
      { chainId: BigNumberish; nonce: BigNumberish; timestamp: BigNumberish },
      {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "mgr", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rejectRemoteTransaction",
    values: [
      BigNumberish,
      {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "remoteBalanceOf",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setManager",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "state", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "clearContext",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "context", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "estimateGasForRemoteTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeRemoteTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mgr", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rejectRemoteTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "remoteBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setManager", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "state", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "AdminSet(address)": EventFragment;
    "ExecutionReverted(uint64,address,bytes4,uint128,uint128,bytes32)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RemoteTransfer(uint256,address,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExecutionReverted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoteTransfer"): EventFragment;
}

export type AdminSetEvent = TypedEvent<[string] & { admin: string }>;

export type ExecutionRevertedEvent = TypedEvent<
  [BigNumber, string, string, BigNumber, BigNumber, string] & {
    remoteChainId: BigNumber;
    localContract: string;
    methodHash: string;
    gasProvided: BigNumber;
    gasUsed: BigNumber;
    revertReason: string;
  }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type RemoteTransferEvent = TypedEvent<
  [BigNumber, string, string, string, BigNumber] & {
    chainId: BigNumber;
    token: string;
    from: string;
    to: string;
    amount: BigNumber;
  }
>;

export class PortalLedger extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: PortalLedgerInterface;

  functions: {
    admin(overrides?: CallOverrides): Promise<[string]>;

    clearContext(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    context(
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        [BigNumber, BigNumber, BigNumber] & {
          chainId: BigNumber;
          nonce: BigNumber;
          timestamp: BigNumber;
        },
        [
          BigNumber,
          string,
          string,
          string,
          string,
          BigNumber,
          string[],
          BigNumber,
          BigNumber
        ] & {
          timestamp: BigNumber;
          remoteContract: string;
          sourceMsgSender: string;
          sourceBeneficiary: string;
          token: string;
          amount: BigNumber;
          methods: string[];
          gas: BigNumber;
          fixedFee: BigNumber;
        },
        BigNumber
      ] & {
        index: BigNumber;
        blockMetadata: [BigNumber, BigNumber, BigNumber] & {
          chainId: BigNumber;
          nonce: BigNumber;
          timestamp: BigNumber;
        };
        transaction: [
          BigNumber,
          string,
          string,
          string,
          string,
          BigNumber,
          string[],
          BigNumber,
          BigNumber
        ] & {
          timestamp: BigNumber;
          remoteContract: string;
          sourceMsgSender: string;
          sourceBeneficiary: string;
          token: string;
          amount: BigNumber;
          methods: string[];
          gas: BigNumber;
          fixedFee: BigNumber;
        };
        uncommitedBalance: BigNumber;
      }
    >;

    estimateGasForRemoteTransaction(
      remoteChainId: BigNumberish,
      sourceMsgSender: string,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    executeRemoteTransaction(
      blockIndex: BigNumberish,
      b: {
        chainId: BigNumberish;
        nonce: BigNumberish;
        timestamp: BigNumberish;
      },
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      gas: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mgr(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rejectRemoteTransaction(
      sourceChainId: BigNumberish,
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    remoteBalanceOf(
      chainId: BigNumberish,
      token: string,
      addr: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setManager(
      _mgr: string,
      _state: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    state(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  admin(overrides?: CallOverrides): Promise<string>;

  clearContext(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  context(
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      [BigNumber, BigNumber, BigNumber] & {
        chainId: BigNumber;
        nonce: BigNumber;
        timestamp: BigNumber;
      },
      [
        BigNumber,
        string,
        string,
        string,
        string,
        BigNumber,
        string[],
        BigNumber,
        BigNumber
      ] & {
        timestamp: BigNumber;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumber;
        methods: string[];
        gas: BigNumber;
        fixedFee: BigNumber;
      },
      BigNumber
    ] & {
      index: BigNumber;
      blockMetadata: [BigNumber, BigNumber, BigNumber] & {
        chainId: BigNumber;
        nonce: BigNumber;
        timestamp: BigNumber;
      };
      transaction: [
        BigNumber,
        string,
        string,
        string,
        string,
        BigNumber,
        string[],
        BigNumber,
        BigNumber
      ] & {
        timestamp: BigNumber;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumber;
        methods: string[];
        gas: BigNumber;
        fixedFee: BigNumber;
      };
      uncommitedBalance: BigNumber;
    }
  >;

  estimateGasForRemoteTransaction(
    remoteChainId: BigNumberish,
    sourceMsgSender: string,
    remoteContract: string,
    beneficiary: string,
    method: BytesLike,
    token: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  executeRemoteTransaction(
    blockIndex: BigNumberish,
    b: { chainId: BigNumberish; nonce: BigNumberish; timestamp: BigNumberish },
    t: {
      timestamp: BigNumberish;
      remoteContract: string;
      sourceMsgSender: string;
      sourceBeneficiary: string;
      token: string;
      amount: BigNumberish;
      methods: BytesLike[];
      gas: BigNumberish;
      fixedFee: BigNumberish;
    },
    gas: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mgr(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  rejectRemoteTransaction(
    sourceChainId: BigNumberish,
    t: {
      timestamp: BigNumberish;
      remoteContract: string;
      sourceMsgSender: string;
      sourceBeneficiary: string;
      token: string;
      amount: BigNumberish;
      methods: BytesLike[];
      gas: BigNumberish;
      fixedFee: BigNumberish;
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  remoteBalanceOf(
    chainId: BigNumberish,
    token: string,
    addr: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAdmin(
    _admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setManager(
    _mgr: string,
    _state: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  state(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    clearContext(overrides?: CallOverrides): Promise<void>;

    context(
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        [BigNumber, BigNumber, BigNumber] & {
          chainId: BigNumber;
          nonce: BigNumber;
          timestamp: BigNumber;
        },
        [
          BigNumber,
          string,
          string,
          string,
          string,
          BigNumber,
          string[],
          BigNumber,
          BigNumber
        ] & {
          timestamp: BigNumber;
          remoteContract: string;
          sourceMsgSender: string;
          sourceBeneficiary: string;
          token: string;
          amount: BigNumber;
          methods: string[];
          gas: BigNumber;
          fixedFee: BigNumber;
        },
        BigNumber
      ] & {
        index: BigNumber;
        blockMetadata: [BigNumber, BigNumber, BigNumber] & {
          chainId: BigNumber;
          nonce: BigNumber;
          timestamp: BigNumber;
        };
        transaction: [
          BigNumber,
          string,
          string,
          string,
          string,
          BigNumber,
          string[],
          BigNumber,
          BigNumber
        ] & {
          timestamp: BigNumber;
          remoteContract: string;
          sourceMsgSender: string;
          sourceBeneficiary: string;
          token: string;
          amount: BigNumber;
          methods: string[];
          gas: BigNumber;
          fixedFee: BigNumber;
        };
        uncommitedBalance: BigNumber;
      }
    >;

    estimateGasForRemoteTransaction(
      remoteChainId: BigNumberish,
      sourceMsgSender: string,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    executeRemoteTransaction(
      blockIndex: BigNumberish,
      b: {
        chainId: BigNumberish;
        nonce: BigNumberish;
        timestamp: BigNumberish;
      },
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      gas: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mgr(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    rejectRemoteTransaction(
      sourceChainId: BigNumberish,
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    remoteBalanceOf(
      chainId: BigNumberish,
      token: string,
      addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAdmin(_admin: string, overrides?: CallOverrides): Promise<void>;

    setManager(
      _mgr: string,
      _state: string,
      overrides?: CallOverrides
    ): Promise<void>;

    state(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AdminSet(address)"(
      admin?: null
    ): TypedEventFilter<[string], { admin: string }>;

    AdminSet(admin?: null): TypedEventFilter<[string], { admin: string }>;

    "ExecutionReverted(uint64,address,bytes4,uint128,uint128,bytes32)"(
      remoteChainId?: null,
      localContract?: null,
      methodHash?: null,
      gasProvided?: null,
      gasUsed?: null,
      revertReason?: null
    ): TypedEventFilter<
      [BigNumber, string, string, BigNumber, BigNumber, string],
      {
        remoteChainId: BigNumber;
        localContract: string;
        methodHash: string;
        gasProvided: BigNumber;
        gasUsed: BigNumber;
        revertReason: string;
      }
    >;

    ExecutionReverted(
      remoteChainId?: null,
      localContract?: null,
      methodHash?: null,
      gasProvided?: null,
      gasUsed?: null,
      revertReason?: null
    ): TypedEventFilter<
      [BigNumber, string, string, BigNumber, BigNumber, string],
      {
        remoteChainId: BigNumber;
        localContract: string;
        methodHash: string;
        gasProvided: BigNumber;
        gasUsed: BigNumber;
        revertReason: string;
      }
    >;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "RemoteTransfer(uint256,address,address,address,uint256)"(
      chainId?: null,
      token?: null,
      from?: null,
      to?: null,
      amount?: null
    ): TypedEventFilter<
      [BigNumber, string, string, string, BigNumber],
      {
        chainId: BigNumber;
        token: string;
        from: string;
        to: string;
        amount: BigNumber;
      }
    >;

    RemoteTransfer(
      chainId?: null,
      token?: null,
      from?: null,
      to?: null,
      amount?: null
    ): TypedEventFilter<
      [BigNumber, string, string, string, BigNumber],
      {
        chainId: BigNumber;
        token: string;
        from: string;
        to: string;
        amount: BigNumber;
      }
    >;
  };

  estimateGas: {
    admin(overrides?: CallOverrides): Promise<BigNumber>;

    clearContext(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    context(overrides?: CallOverrides): Promise<BigNumber>;

    estimateGasForRemoteTransaction(
      remoteChainId: BigNumberish,
      sourceMsgSender: string,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    executeRemoteTransaction(
      blockIndex: BigNumberish,
      b: {
        chainId: BigNumberish;
        nonce: BigNumberish;
        timestamp: BigNumberish;
      },
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      gas: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mgr(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rejectRemoteTransaction(
      sourceChainId: BigNumberish,
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    remoteBalanceOf(
      chainId: BigNumberish,
      token: string,
      addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setManager(
      _mgr: string,
      _state: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    state(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    clearContext(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    context(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    estimateGasForRemoteTransaction(
      remoteChainId: BigNumberish,
      sourceMsgSender: string,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    executeRemoteTransaction(
      blockIndex: BigNumberish,
      b: {
        chainId: BigNumberish;
        nonce: BigNumberish;
        timestamp: BigNumberish;
      },
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      gas: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mgr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rejectRemoteTransaction(
      sourceChainId: BigNumberish,
      t: {
        timestamp: BigNumberish;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumberish;
        methods: BytesLike[];
        gas: BigNumberish;
        fixedFee: BigNumberish;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    remoteBalanceOf(
      chainId: BigNumberish,
      token: string,
      addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setManager(
      _mgr: string,
      _state: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    state(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}