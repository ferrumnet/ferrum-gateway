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
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface CrucibleFactoryInterface extends ethers.utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "burn(address)": FunctionFragment;
    "createCrucible(address,uint64,uint64)": FunctionFragment;
    "createCrucibleDirect(address,string,string,uint64,uint64)": FunctionFragment;
    "getCrucible(address,uint64,uint64)": FunctionFragment;
    "owner()": FunctionFragment;
    "parameters()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "router()": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(functionFragment: "burn", values: [string]): string;
  encodeFunctionData(
    functionFragment: "createCrucible",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createCrucibleDirect",
    values: [string, string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCrucible",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "parameters",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "router", values?: undefined): string;
  encodeFunctionData(functionFragment: "setAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createCrucible",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createCrucibleDirect",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCrucible",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "parameters", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "router", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "AdminSet(address)": EventFragment;
    "CrucibleCreated(address,address,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CrucibleCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export class CrucibleFactory extends BaseContract {
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

  interface: CrucibleFactoryInterface;

  functions: {
    admin(overrides?: CallOverrides): Promise<[string]>;

    burn(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createCrucibleDirect(
      baseToken: string,
      name: string,
      symbol: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    parameters(
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber, string, string] & {
        factory: string;
        baseToken: string;
        feeOnTransferX10000: BigNumber;
        feeOnWithdrawX10000: BigNumber;
        name: string;
        symbol: string;
      }
    >;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    router(overrides?: CallOverrides): Promise<[string]>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  admin(overrides?: CallOverrides): Promise<string>;

  burn(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createCrucible(
    baseToken: string,
    feeOnTransferX10000: BigNumberish,
    feeOnWithdrawX10000: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createCrucibleDirect(
    baseToken: string,
    name: string,
    symbol: string,
    feeOnTransferX10000: BigNumberish,
    feeOnWithdrawX10000: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getCrucible(
    baseToken: string,
    feeOnTransferX10000: BigNumberish,
    feeOnWithdrawX10000: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  parameters(
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber, BigNumber, string, string] & {
      factory: string;
      baseToken: string;
      feeOnTransferX10000: BigNumber;
      feeOnWithdrawX10000: BigNumber;
      name: string;
      symbol: string;
    }
  >;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  router(overrides?: CallOverrides): Promise<string>;

  setAdmin(
    _admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    burn(token: string, overrides?: CallOverrides): Promise<void>;

    createCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    createCrucibleDirect(
      baseToken: string,
      name: string,
      symbol: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    parameters(
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber, string, string] & {
        factory: string;
        baseToken: string;
        feeOnTransferX10000: BigNumber;
        feeOnWithdrawX10000: BigNumber;
        name: string;
        symbol: string;
      }
    >;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    router(overrides?: CallOverrides): Promise<string>;

    setAdmin(_admin: string, overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    AdminSet(admin?: null): TypedEventFilter<[string], { admin: string }>;

    CrucibleCreated(
      token?: null,
      baseToken?: null,
      feeOnTransferX10000?: null,
      feeOnWithdrawX10000?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber],
      {
        token: string;
        baseToken: string;
        feeOnTransferX10000: BigNumber;
        feeOnWithdrawX10000: BigNumber;
      }
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

    burn(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createCrucibleDirect(
      baseToken: string,
      name: string,
      symbol: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    parameters(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    router(overrides?: CallOverrides): Promise<BigNumber>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    burn(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createCrucibleDirect(
      baseToken: string,
      name: string,
      symbol: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getCrucible(
      baseToken: string,
      feeOnTransferX10000: BigNumberish,
      feeOnWithdrawX10000: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    parameters(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    router(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}