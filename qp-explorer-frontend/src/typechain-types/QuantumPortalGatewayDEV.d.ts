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

interface QuantumPortalGatewayDEVInterface extends ethers.utils.Interface {
  functions: {
    "VERSION()": FunctionFragment;
    "admin()": FunctionFragment;
    "feeTarget()": FunctionFragment;
    "feeToken()": FunctionFragment;
    "owner()": FunctionFragment;
    "quantumPortalAuthorityMgr()": FunctionFragment;
    "quantumPortalLedgerMgr()": FunctionFragment;
    "quantumPortalPoc()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "state()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "upgrade(address,address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "VERSION", values?: undefined): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(functionFragment: "feeTarget", values?: undefined): string;
  encodeFunctionData(functionFragment: "feeToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "quantumPortalAuthorityMgr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "quantumPortalLedgerMgr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "quantumPortalPoc",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setAdmin", values: [string]): string;
  encodeFunctionData(functionFragment: "state", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "upgrade",
    values: [string, string]
  ): string;

  decodeFunctionResult(functionFragment: "VERSION", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeTarget", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quantumPortalAuthorityMgr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quantumPortalLedgerMgr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quantumPortalPoc",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "state", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgrade", data: BytesLike): Result;

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

export class QuantumPortalGatewayDEV extends BaseContract {
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

  interface: QuantumPortalGatewayDEVInterface;

  functions: {
    VERSION(overrides?: CallOverrides): Promise<[string]>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    feeTarget(overrides?: CallOverrides): Promise<[string]>;

    feeToken(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    quantumPortalAuthorityMgr(overrides?: CallOverrides): Promise<[string]>;

    quantumPortalLedgerMgr(overrides?: CallOverrides): Promise<[string]>;

    quantumPortalPoc(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    state(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgrade(
      poc: string,
      ledgerMgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  VERSION(overrides?: CallOverrides): Promise<string>;

  admin(overrides?: CallOverrides): Promise<string>;

  feeTarget(overrides?: CallOverrides): Promise<string>;

  feeToken(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  quantumPortalAuthorityMgr(overrides?: CallOverrides): Promise<string>;

  quantumPortalLedgerMgr(overrides?: CallOverrides): Promise<string>;

  quantumPortalPoc(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAdmin(
    _admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  state(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgrade(
    poc: string,
    ledgerMgr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    VERSION(overrides?: CallOverrides): Promise<string>;

    admin(overrides?: CallOverrides): Promise<string>;

    feeTarget(overrides?: CallOverrides): Promise<string>;

    feeToken(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    quantumPortalAuthorityMgr(overrides?: CallOverrides): Promise<string>;

    quantumPortalLedgerMgr(overrides?: CallOverrides): Promise<string>;

    quantumPortalPoc(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAdmin(_admin: string, overrides?: CallOverrides): Promise<void>;

    state(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgrade(
      poc: string,
      ledgerMgr: string,
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
    VERSION(overrides?: CallOverrides): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    feeTarget(overrides?: CallOverrides): Promise<BigNumber>;

    feeToken(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    quantumPortalAuthorityMgr(overrides?: CallOverrides): Promise<BigNumber>;

    quantumPortalLedgerMgr(overrides?: CallOverrides): Promise<BigNumber>;

    quantumPortalPoc(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    state(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgrade(
      poc: string,
      ledgerMgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    VERSION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeTarget(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    quantumPortalAuthorityMgr(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quantumPortalLedgerMgr(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quantumPortalPoc(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    state(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgrade(
      poc: string,
      ledgerMgr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
