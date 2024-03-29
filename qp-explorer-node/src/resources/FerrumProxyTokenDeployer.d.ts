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

interface FerrumProxyTokenDeployerInterface extends ethers.utils.Interface {
  functions: {
    "deployToken(address,string,string,uint256,address)": FunctionFragment;
    "updateTotalSupplyMethodData(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "deployToken",
    values: [string, string, string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTotalSupplyMethodData",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "deployToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTotalSupplyMethodData",
    data: BytesLike
  ): Result;

  events: {
    "ProxyContsuctorArgs(bytes)": EventFragment;
    "TokenDeployed(address,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ProxyContsuctorArgs"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenDeployed"): EventFragment;
}

export class FerrumProxyTokenDeployer extends BaseContract {
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

  interface: FerrumProxyTokenDeployerInterface;

  functions: {
    deployToken(
      logic: string,
      name: string,
      symbol: string,
      totalSupply: BigNumberish,
      admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateTotalSupplyMethodData(
      to: string,
      newTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { data: string }>;
  };

  deployToken(
    logic: string,
    name: string,
    symbol: string,
    totalSupply: BigNumberish,
    admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateTotalSupplyMethodData(
    to: string,
    newTotalSupply: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    deployToken(
      logic: string,
      name: string,
      symbol: string,
      totalSupply: BigNumberish,
      admin: string,
      overrides?: CallOverrides
    ): Promise<string>;

    updateTotalSupplyMethodData(
      to: string,
      newTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    ProxyContsuctorArgs(
      args?: null
    ): TypedEventFilter<[string], { args: string }>;

    TokenDeployed(
      token?: null,
      data?: null
    ): TypedEventFilter<[string, string], { token: string; data: string }>;
  };

  estimateGas: {
    deployToken(
      logic: string,
      name: string,
      symbol: string,
      totalSupply: BigNumberish,
      admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateTotalSupplyMethodData(
      to: string,
      newTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    deployToken(
      logic: string,
      name: string,
      symbol: string,
      totalSupply: BigNumberish,
      admin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateTotalSupplyMethodData(
      to: string,
      newTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
