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

interface DummyUpgradedTokenInterface extends ethers.utils.Interface {
  functions: {
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balanceOfBtc(string)": FunctionFragment;
    "btcAddress(string)": FunctionFragment;
    "decimals()": FunctionFragment;
    "factory()": FunctionFragment;
    "initialize(uint256,uint64,string,string,uint8,uint256,bytes32)": FunctionFragment;
    "inventory(address)": FunctionFragment;
    "isQpSelfManagedToken()": FunctionFragment;
    "multiTransfer(address[],uint256[],address[],uint256[],uint256,bytes32,uint256,bytes)": FunctionFragment;
    "name()": FunctionFragment;
    "processedTxs(bytes32)": FunctionFragment;
    "remoteTransfer()": FunctionFragment;
    "settle(string,uint256)": FunctionFragment;
    "settleTo(string,uint256,uint256)": FunctionFragment;
    "settledBalanceOf(address)": FunctionFragment;
    "settledBalanceOfBtc(string)": FunctionFragment;
    "symbol()": FunctionFragment;
    "syncInventory(address)": FunctionFragment;
    "tokenId()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "totalSupplyQp()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "version()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "balanceOfBtc",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "btcAddress", values: [string]): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      BigNumberish,
      BigNumberish,
      string,
      string,
      BigNumberish,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(functionFragment: "inventory", values: [string]): string;
  encodeFunctionData(
    functionFragment: "isQpSelfManagedToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "multiTransfer",
    values: [
      string[],
      BigNumberish[],
      string[],
      BigNumberish[],
      BigNumberish,
      BytesLike,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "processedTxs",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "remoteTransfer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "settle",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "settleTo",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "settledBalanceOf",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "settledBalanceOfBtc",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "syncInventory",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "tokenId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupplyQp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "version", values?: undefined): string;

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfBtc",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "btcAddress", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "inventory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isQpSelfManagedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "multiTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "processedTxs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "remoteTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "settle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "settleTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "settledBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settledBalanceOfBtc",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "syncInventory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupplyQp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "BtcTransfer(address,address,uint256)": EventFragment;
    "Initialized(uint64)": EventFragment;
    "QpTransfer(address,address,uint256)": EventFragment;
    "RemoteCallProcessFailedWithData(address,tuple,uint256,bytes)": EventFragment;
    "RemoteCallProcessFailedWithReason(address,tuple,uint256,string)": EventFragment;
    "RemoteCallProcessed(address,tuple,uint256)": EventFragment;
    "SettlementInitiated(address,string,uint256,uint256,bytes32)": EventFragment;
    "TransactionProcessed(address,uint256,bytes32,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BtcTransfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QpTransfer"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "RemoteCallProcessFailedWithData"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "RemoteCallProcessFailedWithReason"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoteCallProcessed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SettlementInitiated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransactionProcessed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber] & {
    owner: string;
    spender: string;
    value: BigNumber;
  }
>;

export type BtcTransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; value: BigNumber }
>;

export type InitializedEvent = TypedEvent<[BigNumber] & { version: BigNumber }>;

export type QpTransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; value: BigNumber }
>;

export type RemoteCallProcessFailedWithDataEvent = TypedEvent<
  [
    string,
    [BigNumber, string, string, string, BigNumber] & {
      targetNetwork: BigNumber;
      beneficiary: string;
      targetContract: string;
      methodCall: string;
      fee: BigNumber;
    },
    BigNumber,
    string
  ] & {
    beneficiary: string;
    remoteCall: [BigNumber, string, string, string, BigNumber] & {
      targetNetwork: BigNumber;
      beneficiary: string;
      targetContract: string;
      methodCall: string;
      fee: BigNumber;
    };
    amount: BigNumber;
    data: string;
  }
>;

export type RemoteCallProcessFailedWithReasonEvent = TypedEvent<
  [
    string,
    [BigNumber, string, string, string, BigNumber] & {
      targetNetwork: BigNumber;
      beneficiary: string;
      targetContract: string;
      methodCall: string;
      fee: BigNumber;
    },
    BigNumber,
    string
  ] & {
    beneficiary: string;
    remoteCall: [BigNumber, string, string, string, BigNumber] & {
      targetNetwork: BigNumber;
      beneficiary: string;
      targetContract: string;
      methodCall: string;
      fee: BigNumber;
    };
    amount: BigNumber;
    reason: string;
  }
>;

export type RemoteCallProcessedEvent = TypedEvent<
  [
    string,
    [BigNumber, string, string, string, BigNumber] & {
      targetNetwork: BigNumber;
      beneficiary: string;
      targetContract: string;
      methodCall: string;
      fee: BigNumber;
    },
    BigNumber
  ] & {
    beneficiary: string;
    remoteCall: [BigNumber, string, string, string, BigNumber] & {
      targetNetwork: BigNumber;
      beneficiary: string;
      targetContract: string;
      methodCall: string;
      fee: BigNumber;
    };
    amount: BigNumber;
  }
>;

export type SettlementInitiatedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, string] & {
    sender: string;
    btcAddress: string;
    amount: BigNumber;
    btcFee: BigNumber;
    settlementId: string;
  }
>;

export type TransactionProcessedEvent = TypedEvent<
  [string, BigNumber, string, BigNumber] & {
    miner: string;
    blocknumber: BigNumber;
    txid: string;
    timestamp: BigNumber;
  }
>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; value: BigNumber }
>;

export class DummyUpgradedToken extends BaseContract {
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

  interface: DummyUpgradedTokenInterface;

  functions: {
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      spender: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(addr: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    btcAddress(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _tokenId: BigNumberish,
      _version: BigNumberish,
      _name: string,
      _symbol: string,
      _decimals: BigNumberish,
      _totalSupply: BigNumberish,
      arg6: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    inventory(token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    isQpSelfManagedToken(overrides?: CallOverrides): Promise<[boolean]>;

    multiTransfer(
      froms: string[],
      inputs: BigNumberish[],
      tos: string[],
      values: BigNumberish[],
      blocknumber: BigNumberish,
      txid: BytesLike,
      timestamp: BigNumberish,
      remoteCall: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

    processedTxs(
      txid: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    remoteTransfer(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settle(
      _btcAddress: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settleTo(
      _btcAddress: string,
      amount: BigNumberish,
      btcFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settledBalanceOf(
      addr: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    settledBalanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    syncInventory(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    tokenId(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupplyQp(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      to: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
      from: string,
      to: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    version(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  allowance(
    owner: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: string,
    value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfBtc(
    _btcAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  btcAddress(_btcAddress: string, overrides?: CallOverrides): Promise<string>;

  decimals(overrides?: CallOverrides): Promise<number>;

  factory(overrides?: CallOverrides): Promise<string>;

  initialize(
    _tokenId: BigNumberish,
    _version: BigNumberish,
    _name: string,
    _symbol: string,
    _decimals: BigNumberish,
    _totalSupply: BigNumberish,
    arg6: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  inventory(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  isQpSelfManagedToken(overrides?: CallOverrides): Promise<boolean>;

  multiTransfer(
    froms: string[],
    inputs: BigNumberish[],
    tos: string[],
    values: BigNumberish[],
    blocknumber: BigNumberish,
    txid: BytesLike,
    timestamp: BigNumberish,
    remoteCall: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

  processedTxs(txid: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

  remoteTransfer(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settle(
    _btcAddress: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settleTo(
    _btcAddress: string,
    amount: BigNumberish,
    btcFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settledBalanceOf(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  settledBalanceOfBtc(
    _btcAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  symbol(overrides?: CallOverrides): Promise<string>;

  syncInventory(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  tokenId(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupplyQp(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    to: string,
    value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferFrom(
    from: string,
    to: string,
    value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  version(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    balanceOf(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    btcAddress(_btcAddress: string, overrides?: CallOverrides): Promise<string>;

    decimals(overrides?: CallOverrides): Promise<number>;

    factory(overrides?: CallOverrides): Promise<string>;

    initialize(
      _tokenId: BigNumberish,
      _version: BigNumberish,
      _name: string,
      _symbol: string,
      _decimals: BigNumberish,
      _totalSupply: BigNumberish,
      arg6: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    inventory(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    isQpSelfManagedToken(overrides?: CallOverrides): Promise<boolean>;

    multiTransfer(
      froms: string[],
      inputs: BigNumberish[],
      tos: string[],
      values: BigNumberish[],
      blocknumber: BigNumberish,
      txid: BytesLike,
      timestamp: BigNumberish,
      remoteCall: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    name(overrides?: CallOverrides): Promise<string>;

    processedTxs(
      txid: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    remoteTransfer(overrides?: CallOverrides): Promise<void>;

    settle(
      _btcAddress: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    settleTo(
      _btcAddress: string,
      amount: BigNumberish,
      btcFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    settledBalanceOf(
      addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    settledBalanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<string>;

    syncInventory(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    tokenId(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyQp(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      to: string,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      from: string,
      to: string,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    version(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; spender: string; value: BigNumber }
    >;

    Approval(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; spender: string; value: BigNumber }
    >;

    "BtcTransfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;

    BtcTransfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;

    "Initialized(uint64)"(
      version?: null
    ): TypedEventFilter<[BigNumber], { version: BigNumber }>;

    Initialized(
      version?: null
    ): TypedEventFilter<[BigNumber], { version: BigNumber }>;

    "QpTransfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;

    QpTransfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;

    "RemoteCallProcessFailedWithData(address,tuple,uint256,bytes)"(
      beneficiary?: string | null,
      remoteCall?: null,
      amount?: null,
      data?: null
    ): TypedEventFilter<
      [
        string,
        [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        },
        BigNumber,
        string
      ],
      {
        beneficiary: string;
        remoteCall: [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        };
        amount: BigNumber;
        data: string;
      }
    >;

    RemoteCallProcessFailedWithData(
      beneficiary?: string | null,
      remoteCall?: null,
      amount?: null,
      data?: null
    ): TypedEventFilter<
      [
        string,
        [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        },
        BigNumber,
        string
      ],
      {
        beneficiary: string;
        remoteCall: [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        };
        amount: BigNumber;
        data: string;
      }
    >;

    "RemoteCallProcessFailedWithReason(address,tuple,uint256,string)"(
      beneficiary?: string | null,
      remoteCall?: null,
      amount?: null,
      reason?: null
    ): TypedEventFilter<
      [
        string,
        [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        },
        BigNumber,
        string
      ],
      {
        beneficiary: string;
        remoteCall: [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        };
        amount: BigNumber;
        reason: string;
      }
    >;

    RemoteCallProcessFailedWithReason(
      beneficiary?: string | null,
      remoteCall?: null,
      amount?: null,
      reason?: null
    ): TypedEventFilter<
      [
        string,
        [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        },
        BigNumber,
        string
      ],
      {
        beneficiary: string;
        remoteCall: [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        };
        amount: BigNumber;
        reason: string;
      }
    >;

    "RemoteCallProcessed(address,tuple,uint256)"(
      beneficiary?: string | null,
      remoteCall?: null,
      amount?: null
    ): TypedEventFilter<
      [
        string,
        [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        },
        BigNumber
      ],
      {
        beneficiary: string;
        remoteCall: [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        };
        amount: BigNumber;
      }
    >;

    RemoteCallProcessed(
      beneficiary?: string | null,
      remoteCall?: null,
      amount?: null
    ): TypedEventFilter<
      [
        string,
        [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        },
        BigNumber
      ],
      {
        beneficiary: string;
        remoteCall: [BigNumber, string, string, string, BigNumber] & {
          targetNetwork: BigNumber;
          beneficiary: string;
          targetContract: string;
          methodCall: string;
          fee: BigNumber;
        };
        amount: BigNumber;
      }
    >;

    "SettlementInitiated(address,string,uint256,uint256,bytes32)"(
      sender?: string | null,
      btcAddress?: null,
      amount?: null,
      btcFee?: null,
      settlementId?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, string],
      {
        sender: string;
        btcAddress: string;
        amount: BigNumber;
        btcFee: BigNumber;
        settlementId: string;
      }
    >;

    SettlementInitiated(
      sender?: string | null,
      btcAddress?: null,
      amount?: null,
      btcFee?: null,
      settlementId?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, string],
      {
        sender: string;
        btcAddress: string;
        amount: BigNumber;
        btcFee: BigNumber;
        settlementId: string;
      }
    >;

    "TransactionProcessed(address,uint256,bytes32,uint256)"(
      miner?: string | null,
      blocknumber?: null,
      txid?: null,
      timestamp?: null
    ): TypedEventFilter<
      [string, BigNumber, string, BigNumber],
      {
        miner: string;
        blocknumber: BigNumber;
        txid: string;
        timestamp: BigNumber;
      }
    >;

    TransactionProcessed(
      miner?: string | null,
      blocknumber?: null,
      txid?: null,
      timestamp?: null
    ): TypedEventFilter<
      [string, BigNumber, string, BigNumber],
      {
        miner: string;
        blocknumber: BigNumber;
        txid: string;
        timestamp: BigNumber;
      }
    >;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;

    Transfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;
  };

  estimateGas: {
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    btcAddress(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _tokenId: BigNumberish,
      _version: BigNumberish,
      _name: string,
      _symbol: string,
      _decimals: BigNumberish,
      _totalSupply: BigNumberish,
      arg6: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    inventory(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    isQpSelfManagedToken(overrides?: CallOverrides): Promise<BigNumber>;

    multiTransfer(
      froms: string[],
      inputs: BigNumberish[],
      tos: string[],
      values: BigNumberish[],
      blocknumber: BigNumberish,
      txid: BytesLike,
      timestamp: BigNumberish,
      remoteCall: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    processedTxs(
      txid: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    remoteTransfer(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settle(
      _btcAddress: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settleTo(
      _btcAddress: string,
      amount: BigNumberish,
      btcFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settledBalanceOf(
      addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    settledBalanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    syncInventory(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    tokenId(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyQp(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      to: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    version(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    btcAddress(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _tokenId: BigNumberish,
      _version: BigNumberish,
      _name: string,
      _symbol: string,
      _decimals: BigNumberish,
      _totalSupply: BigNumberish,
      arg6: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    inventory(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isQpSelfManagedToken(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    multiTransfer(
      froms: string[],
      inputs: BigNumberish[],
      tos: string[],
      values: BigNumberish[],
      blocknumber: BigNumberish,
      txid: BytesLike,
      timestamp: BigNumberish,
      remoteCall: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    processedTxs(
      txid: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    remoteTransfer(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settle(
      _btcAddress: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settleTo(
      _btcAddress: string,
      amount: BigNumberish,
      btcFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settledBalanceOf(
      addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    settledBalanceOfBtc(
      _btcAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    syncInventory(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    tokenId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupplyQp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      to: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    version(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
