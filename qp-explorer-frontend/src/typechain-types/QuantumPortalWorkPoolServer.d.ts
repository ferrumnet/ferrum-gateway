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

interface QuantumPortalWorkPoolServerInterface extends ethers.utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "baseToken()": FunctionFragment;
    "collectFee(uint256,uint256,uint256)": FunctionFragment;
    "collectedFixedFee(uint256)": FunctionFragment;
    "collectedVarFee(uint256)": FunctionFragment;
    "initializeWithLedgerMgr(address)": FunctionFragment;
    "initializeWithQp(address)": FunctionFragment;
    "inventory(address)": FunctionFragment;
    "lastEpoch(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "portal()": FunctionFragment;
    "qpLedgerMgr()": FunctionFragment;
    "remotePeers(uint256)": FunctionFragment;
    "removeRemotePeers(uint256[])": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateBaseToken(address)": FunctionFragment;
    "updateLedgerMgr(address)": FunctionFragment;
    "updatePortal(address)": FunctionFragment;
    "updateRemotePeers(uint256[],address[])": FunctionFragment;
    "withdrawFixedRemote(address,uint256,uint256)": FunctionFragment;
    "withdrawVariableRemote(address,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(functionFragment: "baseToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "collectFee",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collectedFixedFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collectedVarFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeWithLedgerMgr",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeWithQp",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "inventory", values: [string]): string;
  encodeFunctionData(
    functionFragment: "lastEpoch",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "portal", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "qpLedgerMgr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "remotePeers",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeRemotePeers",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateBaseToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateLedgerMgr",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePortal",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRemotePeers",
    values: [BigNumberish[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFixedRemote",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawVariableRemote",
    values: [string, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "baseToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collectFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "collectedFixedFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collectedVarFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeWithLedgerMgr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeWithQp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "inventory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lastEpoch", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "portal", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "qpLedgerMgr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "remotePeers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeRemotePeers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateBaseToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateLedgerMgr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePortal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRemotePeers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFixedRemote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawVariableRemote",
    data: BytesLike
  ): Result;

  events: {
    "AdminSet(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type AdminSetEvent = TypedEvent<[string] & { admin: string }>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export class QuantumPortalWorkPoolServer extends BaseContract {
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

  interface: QuantumPortalWorkPoolServerInterface;

  functions: {
    admin(overrides?: CallOverrides): Promise<[string]>;

    baseToken(overrides?: CallOverrides): Promise<[string]>;

    collectFee(
      targetChainId: BigNumberish,
      localEpoch: BigNumberish,
      fixedFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    collectedFixedFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    collectedVarFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initializeWithLedgerMgr(
      mgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initializeWithQp(
      _portal: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    inventory(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    lastEpoch(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    portal(overrides?: CallOverrides): Promise<[string]>;

    qpLedgerMgr(overrides?: CallOverrides): Promise<[string]>;

    remotePeers(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    removeRemotePeers(
      chainIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateBaseToken(
      _baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateLedgerMgr(
      mgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updatePortal(
      _portal: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateRemotePeers(
      chainIds: BigNumberish[],
      remotes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawFixedRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawVariableRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  admin(overrides?: CallOverrides): Promise<string>;

  baseToken(overrides?: CallOverrides): Promise<string>;

  collectFee(
    targetChainId: BigNumberish,
    localEpoch: BigNumberish,
    fixedFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  collectedFixedFee(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  collectedVarFee(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initializeWithLedgerMgr(
    mgr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initializeWithQp(
    _portal: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  inventory(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  lastEpoch(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  portal(overrides?: CallOverrides): Promise<string>;

  qpLedgerMgr(overrides?: CallOverrides): Promise<string>;

  remotePeers(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  removeRemotePeers(
    chainIds: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAdmin(
    _admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateBaseToken(
    _baseToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateLedgerMgr(
    mgr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updatePortal(
    _portal: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateRemotePeers(
    chainIds: BigNumberish[],
    remotes: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawFixedRemote(
    to: string,
    workRatioX128: BigNumberish,
    epoch: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawVariableRemote(
    to: string,
    workRatioX128: BigNumberish,
    epoch: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    baseToken(overrides?: CallOverrides): Promise<string>;

    collectFee(
      targetChainId: BigNumberish,
      localEpoch: BigNumberish,
      fixedFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collectedFixedFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collectedVarFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initializeWithLedgerMgr(
      mgr: string,
      overrides?: CallOverrides
    ): Promise<void>;

    initializeWithQp(_portal: string, overrides?: CallOverrides): Promise<void>;

    inventory(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    lastEpoch(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    portal(overrides?: CallOverrides): Promise<string>;

    qpLedgerMgr(overrides?: CallOverrides): Promise<string>;

    remotePeers(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    removeRemotePeers(
      chainIds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAdmin(_admin: string, overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateBaseToken(
      _baseToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateLedgerMgr(mgr: string, overrides?: CallOverrides): Promise<void>;

    updatePortal(_portal: string, overrides?: CallOverrides): Promise<void>;

    updateRemotePeers(
      chainIds: BigNumberish[],
      remotes: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawFixedRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawVariableRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AdminSet(address)"(
      admin?: null
    ): TypedEventFilter<[string], { admin: string }>;

    AdminSet(admin?: null): TypedEventFilter<[string], { admin: string }>;

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
  };

  estimateGas: {
    admin(overrides?: CallOverrides): Promise<BigNumber>;

    baseToken(overrides?: CallOverrides): Promise<BigNumber>;

    collectFee(
      targetChainId: BigNumberish,
      localEpoch: BigNumberish,
      fixedFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    collectedFixedFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collectedVarFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initializeWithLedgerMgr(
      mgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initializeWithQp(
      _portal: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    inventory(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    lastEpoch(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    portal(overrides?: CallOverrides): Promise<BigNumber>;

    qpLedgerMgr(overrides?: CallOverrides): Promise<BigNumber>;

    remotePeers(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeRemotePeers(
      chainIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateBaseToken(
      _baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateLedgerMgr(
      mgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updatePortal(
      _portal: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateRemotePeers(
      chainIds: BigNumberish[],
      remotes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawFixedRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawVariableRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    baseToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    collectFee(
      targetChainId: BigNumberish,
      localEpoch: BigNumberish,
      fixedFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    collectedFixedFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    collectedVarFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initializeWithLedgerMgr(
      mgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initializeWithQp(
      _portal: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    inventory(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastEpoch(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    portal(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    qpLedgerMgr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    remotePeers(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeRemotePeers(
      chainIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateBaseToken(
      _baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateLedgerMgr(
      mgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updatePortal(
      _portal: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateRemotePeers(
      chainIds: BigNumberish[],
      remotes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFixedRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawVariableRemote(
      to: string,
      workRatioX128: BigNumberish,
      epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}