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

interface GeneralTaxDistributorInterface extends ethers.utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "configureToken(address,uint256,tuple[],uint216)": FunctionFragment;
    "distributeTax(address)": FunctionFragment;
    "distributeTaxDirect(address)": FunctionFragment;
    "globalTargetConfig()": FunctionFragment;
    "lowThresholdX1000()": FunctionFragment;
    "owner()": FunctionFragment;
    "poolRoutingTable(address,address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "setGlobalTargetInfos(tuple[],uint216)": FunctionFragment;
    "setPoolRouting(address,address,address)": FunctionFragment;
    "setTokenInfo(address,uint256,uint8)": FunctionFragment;
    "setTokenTargetInfos(address,tuple[],uint216)": FunctionFragment;
    "targetInfos(uint256)": FunctionFragment;
    "tokenInfo(address)": FunctionFragment;
    "tokenTargetConfigs(address)": FunctionFragment;
    "tokenTargetInfos(address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "configureToken",
    values: [
      string,
      BigNumberish,
      { tgt: string; tType: BigNumberish }[],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "distributeTax",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "distributeTaxDirect",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "globalTargetConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lowThresholdX1000",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "poolRoutingTable",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setGlobalTargetInfos",
    values: [{ tgt: string; tType: BigNumberish }[], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolRouting",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenInfo",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenTargetInfos",
    values: [string, { tgt: string; tType: BigNumberish }[], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "targetInfos",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "tokenInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "tokenTargetConfigs",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenTargetInfos",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "configureToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributeTax",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributeTaxDirect",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "globalTargetConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lowThresholdX1000",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "poolRoutingTable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setGlobalTargetInfos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolRouting",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenTargetInfos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "targetInfos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenInfo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenTargetConfigs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenTargetInfos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "AdminSet(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export class GeneralTaxDistributor extends BaseContract {
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

  interface: GeneralTaxDistributorInterface;

  functions: {
    admin(overrides?: CallOverrides): Promise<[string]>;

    configureToken(
      tokenAddress: string,
      bufferSize: BigNumberish,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    distributeTax(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    distributeTaxDirect(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    globalTargetConfig(
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber] & {
        len: number;
        totalW: number;
        weights: BigNumber;
      }
    >;

    lowThresholdX1000(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    poolRoutingTable(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setGlobalTargetInfos(
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPoolRouting(
      tokenAddress: string,
      msgSender: string,
      poolId: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTokenInfo(
      tokenAdress: string,
      bufferSize: BigNumberish,
      tokenSpecificConfig: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTokenTargetInfos(
      tokenAddress: string,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    targetInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, number] & { tgt: string; tType: number }>;

    tokenInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number] & {
        bufferSize: BigNumber;
        tokenSpecificConfig: number;
      }
    >;

    tokenTargetConfigs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber] & {
        len: number;
        totalW: number;
        weights: BigNumber;
      }
    >;

    tokenTargetInfos(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, number] & { tgt: string; tType: number }>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  admin(overrides?: CallOverrides): Promise<string>;

  configureToken(
    tokenAddress: string,
    bufferSize: BigNumberish,
    infos: { tgt: string; tType: BigNumberish }[],
    weights: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  distributeTax(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  distributeTaxDirect(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  globalTargetConfig(
    overrides?: CallOverrides
  ): Promise<
    [number, number, BigNumber] & {
      len: number;
      totalW: number;
      weights: BigNumber;
    }
  >;

  lowThresholdX1000(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  poolRoutingTable(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAdmin(
    _admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setGlobalTargetInfos(
    infos: { tgt: string; tType: BigNumberish }[],
    weights: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPoolRouting(
    tokenAddress: string,
    msgSender: string,
    poolId: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTokenInfo(
    tokenAdress: string,
    bufferSize: BigNumberish,
    tokenSpecificConfig: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTokenTargetInfos(
    tokenAddress: string,
    infos: { tgt: string; tType: BigNumberish }[],
    weights: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  targetInfos(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[string, number] & { tgt: string; tType: number }>;

  tokenInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number] & { bufferSize: BigNumber; tokenSpecificConfig: number }
  >;

  tokenTargetConfigs(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [number, number, BigNumber] & {
      len: number;
      totalW: number;
      weights: BigNumber;
    }
  >;

  tokenTargetInfos(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[string, number] & { tgt: string; tType: number }>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    configureToken(
      tokenAddress: string,
      bufferSize: BigNumberish,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    distributeTax(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    distributeTaxDirect(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    globalTargetConfig(
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber] & {
        len: number;
        totalW: number;
        weights: BigNumber;
      }
    >;

    lowThresholdX1000(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    poolRoutingTable(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAdmin(_admin: string, overrides?: CallOverrides): Promise<void>;

    setGlobalTargetInfos(
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPoolRouting(
      tokenAddress: string,
      msgSender: string,
      poolId: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenInfo(
      tokenAdress: string,
      bufferSize: BigNumberish,
      tokenSpecificConfig: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenTargetInfos(
      tokenAddress: string,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    targetInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, number] & { tgt: string; tType: number }>;

    tokenInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number] & {
        bufferSize: BigNumber;
        tokenSpecificConfig: number;
      }
    >;

    tokenTargetConfigs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber] & {
        len: number;
        totalW: number;
        weights: BigNumber;
      }
    >;

    tokenTargetInfos(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, number] & { tgt: string; tType: number }>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    AdminSet(admin?: null): TypedEventFilter<[string], { admin: string }>;

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

    configureToken(
      tokenAddress: string,
      bufferSize: BigNumberish,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    distributeTax(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    distributeTaxDirect(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    globalTargetConfig(overrides?: CallOverrides): Promise<BigNumber>;

    lowThresholdX1000(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    poolRoutingTable(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setGlobalTargetInfos(
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPoolRouting(
      tokenAddress: string,
      msgSender: string,
      poolId: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTokenInfo(
      tokenAdress: string,
      bufferSize: BigNumberish,
      tokenSpecificConfig: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTokenTargetInfos(
      tokenAddress: string,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    targetInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    tokenTargetConfigs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenTargetInfos(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    configureToken(
      tokenAddress: string,
      bufferSize: BigNumberish,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    distributeTax(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    distributeTaxDirect(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    globalTargetConfig(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lowThresholdX1000(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolRoutingTable(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAdmin(
      _admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setGlobalTargetInfos(
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPoolRouting(
      tokenAddress: string,
      msgSender: string,
      poolId: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTokenInfo(
      tokenAdress: string,
      bufferSize: BigNumberish,
      tokenSpecificConfig: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTokenTargetInfos(
      tokenAddress: string,
      infos: { tgt: string; tType: BigNumberish }[],
      weights: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    targetInfos(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenTargetConfigs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenTargetInfos(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
