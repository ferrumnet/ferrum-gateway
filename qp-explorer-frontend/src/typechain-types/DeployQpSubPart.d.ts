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

interface DeployQpSubPartInterface extends ethers.utils.Interface {
  functions: {
    "deploy(uint256)": FunctionFragment;
    "ledger()": FunctionFragment;
    "mgr()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "deploy",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "ledger", values?: undefined): string;
  encodeFunctionData(functionFragment: "mgr", values?: undefined): string;

  decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ledger", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mgr", data: BytesLike): Result;

  events: {};
}

export class DeployQpSubPart extends BaseContract {
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

  interface: DeployQpSubPartInterface;

  functions: {
    deploy(
      overrideChainId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ledger(overrides?: CallOverrides): Promise<[string]>;

    mgr(overrides?: CallOverrides): Promise<[string]>;
  };

  deploy(
    overrideChainId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ledger(overrides?: CallOverrides): Promise<string>;

  mgr(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    deploy(
      overrideChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    ledger(overrides?: CallOverrides): Promise<string>;

    mgr(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    deploy(
      overrideChainId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ledger(overrides?: CallOverrides): Promise<BigNumber>;

    mgr(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    deploy(
      overrideChainId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ledger(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mgr(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}