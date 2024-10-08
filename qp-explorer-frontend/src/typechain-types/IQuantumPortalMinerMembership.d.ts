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

interface IQuantumPortalMinerMembershipInterface
  extends ethers.utils.Interface {
  functions: {
    "findMiner(bytes32,uint256)": FunctionFragment;
    "findMinerAtTime(bytes32,uint256,uint256)": FunctionFragment;
    "registerMiner(address)": FunctionFragment;
    "selectMiner(address,bytes32,uint256)": FunctionFragment;
    "unregister()": FunctionFragment;
    "unregisterMiner(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "findMiner",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "findMinerAtTime",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "registerMiner",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "selectMiner",
    values: [string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "unregister",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "unregisterMiner",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "findMiner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "findMinerAtTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerMiner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "selectMiner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unregister", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "unregisterMiner",
    data: BytesLike
  ): Result;

  events: {};
}

export class IQuantumPortalMinerMembership extends BaseContract {
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

  interface: IQuantumPortalMinerMembershipInterface;

  functions: {
    findMiner(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    findMinerAtTime(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      chainTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    registerMiner(
      miner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    selectMiner(
      requestedMiner: string,
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unregister(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unregisterMiner(
      miner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  findMiner(
    blockHash: BytesLike,
    blockTimestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  findMinerAtTime(
    blockHash: BytesLike,
    blockTimestamp: BigNumberish,
    chainTimestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  registerMiner(
    miner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  selectMiner(
    requestedMiner: string,
    blockHash: BytesLike,
    blockTimestamp: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unregister(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unregisterMiner(
    miner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    findMiner(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    findMinerAtTime(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      chainTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    registerMiner(miner: string, overrides?: CallOverrides): Promise<void>;

    selectMiner(
      requestedMiner: string,
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    unregister(overrides?: CallOverrides): Promise<void>;

    unregisterMiner(miner: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    findMiner(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    findMinerAtTime(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      chainTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerMiner(
      miner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    selectMiner(
      requestedMiner: string,
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unregister(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unregisterMiner(
      miner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    findMiner(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    findMinerAtTime(
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      chainTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerMiner(
      miner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    selectMiner(
      requestedMiner: string,
      blockHash: BytesLike,
      blockTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unregister(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unregisterMiner(
      miner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
