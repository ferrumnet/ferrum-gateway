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

interface DeployQpInterface extends ethers.utils.Interface {
  functions: {
    "deploy(address,uint64,address,address)": FunctionFragment;
    "deployFeeToken()": FunctionFragment;
    "deployWithToken(uint64,address,address)": FunctionFragment;
    "feeToken()": FunctionFragment;
    "gateway()": FunctionFragment;
    "realChainId()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "deploy",
    values: [string, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "deployFeeToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deployWithToken",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(functionFragment: "feeToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "gateway", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "realChainId",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "deployFeeToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployWithToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "feeToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gateway", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "realChainId",
    data: BytesLike
  ): Result;

  events: {};
}

export class DeployQp extends BaseContract {
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

  interface: DeployQpInterface;

  functions: {
    deploy(
      _feeToken: string,
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deployFeeToken(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deployWithToken(
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    feeToken(overrides?: CallOverrides): Promise<[string]>;

    gateway(overrides?: CallOverrides): Promise<[string]>;

    realChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  deploy(
    _feeToken: string,
    overrideChainId: BigNumberish,
    mgr: string,
    ledger: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deployFeeToken(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deployWithToken(
    overrideChainId: BigNumberish,
    mgr: string,
    ledger: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  feeToken(overrides?: CallOverrides): Promise<string>;

  gateway(overrides?: CallOverrides): Promise<string>;

  realChainId(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    deploy(
      _feeToken: string,
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: CallOverrides
    ): Promise<void>;

    deployFeeToken(overrides?: CallOverrides): Promise<void>;

    deployWithToken(
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: CallOverrides
    ): Promise<void>;

    feeToken(overrides?: CallOverrides): Promise<string>;

    gateway(overrides?: CallOverrides): Promise<string>;

    realChainId(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    deploy(
      _feeToken: string,
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deployFeeToken(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deployWithToken(
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    feeToken(overrides?: CallOverrides): Promise<BigNumber>;

    gateway(overrides?: CallOverrides): Promise<BigNumber>;

    realChainId(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    deploy(
      _feeToken: string,
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deployFeeToken(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deployWithToken(
      overrideChainId: BigNumberish,
      mgr: string,
      ledger: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    feeToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    gateway(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    realChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
