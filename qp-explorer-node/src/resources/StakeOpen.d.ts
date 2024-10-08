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

interface StakeOpenInterface extends ethers.utils.Interface {
  functions: {
    "addMarginalReward(address)": FunctionFragment;
    "addMarginalRewardToPool(address,address)": FunctionFragment;
    "admins(address,address)": FunctionFragment;
    "allowedRewardTokenList(address)": FunctionFragment;
    "allowedRewardTokens(address,address)": FunctionFragment;
    "baseToken(address)": FunctionFragment;
    "creationSigner()": FunctionFragment;
    "factory()": FunctionFragment;
    "fakeRewardOf(address,address,address)": FunctionFragment;
    "fakeRewardsTotal(address,address)": FunctionFragment;
    "freezeSweep()": FunctionFragment;
    "init(address,string,address[])": FunctionFragment;
    "initDefault(address)": FunctionFragment;
    "inventory(address)": FunctionFragment;
    "isTokenizable(address)": FunctionFragment;
    "lockSeconds(address)": FunctionFragment;
    "name(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardOf(address,address,address[])": FunctionFragment;
    "rewardsTotal(address,address)": FunctionFragment;
    "setAdmin(address,address,uint8)": FunctionFragment;
    "setCreationSigner(address)": FunctionFragment;
    "setLockSeconds(address,uint256)": FunctionFragment;
    "stake(address,address)": FunctionFragment;
    "stakeFor(address,address)": FunctionFragment;
    "stakeOf(address,address)": FunctionFragment;
    "stakeWithAllocation(address,address,uint256,bytes32,bytes)": FunctionFragment;
    "stakedBalance(address)": FunctionFragment;
    "stakings(address)": FunctionFragment;
    "sweepBase(address)": FunctionFragment;
    "sweepFrozen()": FunctionFragment;
    "sweepRewards(address,address[])": FunctionFragment;
    "sweepToken(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "usedHashes(bytes32)": FunctionFragment;
    "withdraw(address,address,uint256)": FunctionFragment;
    "withdrawRewards(address,address)": FunctionFragment;
    "withdrawTimeOf(address,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addMarginalReward",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "addMarginalRewardToPool",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "admins",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowedRewardTokenList",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowedRewardTokens",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "baseToken", values: [string]): string;
  encodeFunctionData(
    functionFragment: "creationSigner",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "fakeRewardOf",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "fakeRewardsTotal",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "freezeSweep",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [string, string, string[]]
  ): string;
  encodeFunctionData(functionFragment: "initDefault", values: [string]): string;
  encodeFunctionData(functionFragment: "inventory", values: [string]): string;
  encodeFunctionData(
    functionFragment: "isTokenizable",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "lockSeconds", values: [string]): string;
  encodeFunctionData(functionFragment: "name", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardOf",
    values: [string, string, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsTotal",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setAdmin",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setCreationSigner",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setLockSeconds",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "stake",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "stakeFor",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "stakeOf",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "stakeWithAllocation",
    values: [string, string, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "stakedBalance",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "stakings", values: [string]): string;
  encodeFunctionData(functionFragment: "sweepBase", values: [string]): string;
  encodeFunctionData(
    functionFragment: "sweepFrozen",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sweepRewards",
    values: [string, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "sweepToken",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "usedHashes",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawRewards",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTimeOf",
    values: [string, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addMarginalReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addMarginalRewardToPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "admins", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "allowedRewardTokenList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "allowedRewardTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "baseToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "creationSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "fakeRewardOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fakeRewardsTotal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "freezeSweep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initDefault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "inventory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTokenizable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockSeconds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardsTotal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCreationSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLockSeconds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakeFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakeOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "stakeWithAllocation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakedBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stakings", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sweepBase", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sweepFrozen",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sweepRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sweepToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "usedHashes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTimeOf",
    data: BytesLike
  ): Result;

  events: {
    "BasePaid(address,address,address,address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RewardAdded(address,address,uint256)": EventFragment;
    "RewardPaid(address,address,address,address[],uint256[])": EventFragment;
    "Staked(address,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BasePaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
}

export class StakeOpen extends BaseContract {
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

  interface: StakeOpenInterface;

  functions: {
    addMarginalReward(
      rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addMarginalRewardToPool(
      id: string,
      rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    admins(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    allowedRewardTokenList(
      id: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    allowedRewardTokens(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    baseToken(id: string, overrides?: CallOverrides): Promise<[string]>;

    creationSigner(overrides?: CallOverrides): Promise<[string]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    fakeRewardOf(
      id: string,
      staker: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    fakeRewardsTotal(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    freezeSweep(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    init(
      token: string,
      name: string,
      rewardTokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initDefault(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    inventory(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    isTokenizable(id: string, overrides?: CallOverrides): Promise<[boolean]>;

    lockSeconds(id: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    name(
      id: string,
      overrides?: CallOverrides
    ): Promise<[string] & { _name: string }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardOf(
      id: string,
      staker: string,
      rewardTokens: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { amounts: BigNumber[] }>;

    rewardsTotal(
      id: string,
      rewardAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setAdmin(
      id: string,
      admin: string,
      role: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setCreationSigner(
      _signer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setLockSeconds(
      id: string,
      _lockSeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stake(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakeFor(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    stakeWithAllocation(
      staker: string,
      id: string,
      allocation: BigNumberish,
      salt: BytesLike,
      allocatorSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakedBalance(id: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    stakings(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, boolean, number, number, number, number, number] & {
        stakeType: number;
        restrictedRewards: boolean;
        contribStart: number;
        contribEnd: number;
        endOfLife: number;
        configHardCutOff: number;
        flags: number;
      }
    >;

    sweepBase(
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sweepFrozen(overrides?: CallOverrides): Promise<[boolean]>;

    sweepRewards(
      id: string,
      rewardTokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sweepToken(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;

    withdraw(
      to: string,
      id: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawRewards(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawTimeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  addMarginalReward(
    rewardToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addMarginalRewardToPool(
    id: string,
    rewardToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  admins(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<number>;

  allowedRewardTokenList(
    id: string,
    overrides?: CallOverrides
  ): Promise<string[]>;

  allowedRewardTokens(
    id: string,
    rewardToken: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  baseToken(id: string, overrides?: CallOverrides): Promise<string>;

  creationSigner(overrides?: CallOverrides): Promise<string>;

  factory(overrides?: CallOverrides): Promise<string>;

  fakeRewardOf(
    id: string,
    staker: string,
    rewardToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  fakeRewardsTotal(
    id: string,
    rewardToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  freezeSweep(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  init(
    token: string,
    name: string,
    rewardTokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initDefault(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  inventory(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  isTokenizable(id: string, overrides?: CallOverrides): Promise<boolean>;

  lockSeconds(id: string, overrides?: CallOverrides): Promise<BigNumber>;

  name(id: string, overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardOf(
    id: string,
    staker: string,
    rewardTokens: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  rewardsTotal(
    id: string,
    rewardAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setAdmin(
    id: string,
    admin: string,
    role: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setCreationSigner(
    _signer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setLockSeconds(
    id: string,
    _lockSeconds: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stake(
    to: string,
    id: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakeFor(
    to: string,
    id: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakeOf(
    id: string,
    staker: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  stakeWithAllocation(
    staker: string,
    id: string,
    allocation: BigNumberish,
    salt: BytesLike,
    allocatorSignature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakedBalance(id: string, overrides?: CallOverrides): Promise<BigNumber>;

  stakings(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [number, boolean, number, number, number, number, number] & {
      stakeType: number;
      restrictedRewards: boolean;
      contribStart: number;
      contribEnd: number;
      endOfLife: number;
      configHardCutOff: number;
      flags: number;
    }
  >;

  sweepBase(
    id: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sweepFrozen(overrides?: CallOverrides): Promise<boolean>;

  sweepRewards(
    id: string,
    rewardTokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sweepToken(
    token: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  withdraw(
    to: string,
    id: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawRewards(
    to: string,
    id: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawTimeOf(
    id: string,
    staker: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    addMarginalReward(
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addMarginalRewardToPool(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    admins(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<number>;

    allowedRewardTokenList(
      id: string,
      overrides?: CallOverrides
    ): Promise<string[]>;

    allowedRewardTokens(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    baseToken(id: string, overrides?: CallOverrides): Promise<string>;

    creationSigner(overrides?: CallOverrides): Promise<string>;

    factory(overrides?: CallOverrides): Promise<string>;

    fakeRewardOf(
      id: string,
      staker: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fakeRewardsTotal(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    freezeSweep(overrides?: CallOverrides): Promise<void>;

    init(
      token: string,
      name: string,
      rewardTokens: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    initDefault(token: string, overrides?: CallOverrides): Promise<void>;

    inventory(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    isTokenizable(id: string, overrides?: CallOverrides): Promise<boolean>;

    lockSeconds(id: string, overrides?: CallOverrides): Promise<BigNumber>;

    name(id: string, overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardOf(
      id: string,
      staker: string,
      rewardTokens: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    rewardsTotal(
      id: string,
      rewardAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAdmin(
      id: string,
      admin: string,
      role: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setCreationSigner(
      _signer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setLockSeconds(
      id: string,
      _lockSeconds: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stake(
      to: string,
      id: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakeFor(
      to: string,
      id: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakeWithAllocation(
      staker: string,
      id: string,
      allocation: BigNumberish,
      salt: BytesLike,
      allocatorSignature: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakedBalance(id: string, overrides?: CallOverrides): Promise<BigNumber>;

    stakings(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, boolean, number, number, number, number, number] & {
        stakeType: number;
        restrictedRewards: boolean;
        contribStart: number;
        contribEnd: number;
        endOfLife: number;
        configHardCutOff: number;
        flags: number;
      }
    >;

    sweepBase(id: string, overrides?: CallOverrides): Promise<void>;

    sweepFrozen(overrides?: CallOverrides): Promise<boolean>;

    sweepRewards(
      id: string,
      rewardTokens: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    sweepToken(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    withdraw(
      to: string,
      id: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawRewards(
      to: string,
      id: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawTimeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    BasePaid(
      id?: null,
      staker?: null,
      to?: null,
      token?: null,
      amountPaid?: null
    ): TypedEventFilter<
      [string, string, string, string, BigNumber],
      {
        id: string;
        staker: string;
        to: string;
        token: string;
        amountPaid: BigNumber;
      }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    RewardAdded(
      id?: null,
      rewardToken?: null,
      rewardAmount?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { id: string; rewardToken: string; rewardAmount: BigNumber }
    >;

    RewardPaid(
      id?: null,
      staker?: null,
      to?: null,
      rewardTokens?: null,
      rewards?: null
    ): TypedEventFilter<
      [string, string, string, string[], BigNumber[]],
      {
        id: string;
        staker: string;
        to: string;
        rewardTokens: string[];
        rewards: BigNumber[];
      }
    >;

    Staked(
      id?: null,
      tokenAddress?: null,
      staker?: null,
      amount?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { id: string; tokenAddress: string; staker: string; amount: BigNumber }
    >;
  };

  estimateGas: {
    addMarginalReward(
      rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addMarginalRewardToPool(
      id: string,
      rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    admins(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowedRewardTokenList(
      id: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowedRewardTokens(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    baseToken(id: string, overrides?: CallOverrides): Promise<BigNumber>;

    creationSigner(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    fakeRewardOf(
      id: string,
      staker: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fakeRewardsTotal(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    freezeSweep(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    init(
      token: string,
      name: string,
      rewardTokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initDefault(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    inventory(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    isTokenizable(id: string, overrides?: CallOverrides): Promise<BigNumber>;

    lockSeconds(id: string, overrides?: CallOverrides): Promise<BigNumber>;

    name(id: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardOf(
      id: string,
      staker: string,
      rewardTokens: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsTotal(
      id: string,
      rewardAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAdmin(
      id: string,
      admin: string,
      role: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setCreationSigner(
      _signer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setLockSeconds(
      id: string,
      _lockSeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stake(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakeFor(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakeWithAllocation(
      staker: string,
      id: string,
      allocation: BigNumberish,
      salt: BytesLike,
      allocatorSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakedBalance(id: string, overrides?: CallOverrides): Promise<BigNumber>;

    stakings(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    sweepBase(
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sweepFrozen(overrides?: CallOverrides): Promise<BigNumber>;

    sweepRewards(
      id: string,
      rewardTokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sweepToken(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      to: string,
      id: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawRewards(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawTimeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addMarginalReward(
      rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addMarginalRewardToPool(
      id: string,
      rewardToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    admins(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allowedRewardTokenList(
      id: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allowedRewardTokens(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    baseToken(
      id: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    creationSigner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fakeRewardOf(
      id: string,
      staker: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fakeRewardsTotal(
      id: string,
      rewardToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    freezeSweep(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    init(
      token: string,
      name: string,
      rewardTokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initDefault(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    inventory(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTokenizable(
      id: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockSeconds(
      id: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(id: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardOf(
      id: string,
      staker: string,
      rewardTokens: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardsTotal(
      id: string,
      rewardAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setAdmin(
      id: string,
      admin: string,
      role: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setCreationSigner(
      _signer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setLockSeconds(
      id: string,
      _lockSeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stake(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakeFor(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stakeWithAllocation(
      staker: string,
      id: string,
      allocation: BigNumberish,
      salt: BytesLike,
      allocatorSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakedBalance(
      id: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stakings(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sweepBase(
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sweepFrozen(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sweepRewards(
      id: string,
      rewardTokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sweepToken(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    usedHashes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      to: string,
      id: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawRewards(
      to: string,
      id: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTimeOf(
      id: string,
      staker: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
