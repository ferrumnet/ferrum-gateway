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
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IQuantumPortalPocInterface extends ethers.utils.Interface {
  functions: {
    "feeTarget()": FunctionFragment;
    "feeToken()": FunctionFragment;
    "localTransfer(address,address,uint256)": FunctionFragment;
    "msgSender()": FunctionFragment;
    "remoteTransfer(uint256,address,address,uint256)": FunctionFragment;
    "run(uint64,address,address,bytes)": FunctionFragment;
    "runFromToken(uint64,address,address,bytes,uint256)": FunctionFragment;
    "runFromTokenNativeFee(uint64,address,address,bytes,uint256)": FunctionFragment;
    "runNativeFee(uint64,address,address,bytes)": FunctionFragment;
    "runWithValue(uint64,address,address,address,bytes)": FunctionFragment;
    "runWithValueNativeFee(uint64,address,address,address,bytes)": FunctionFragment;
    "runWithdraw(uint64,address,address,uint256)": FunctionFragment;
    "txContext()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "feeTarget", values?: undefined): string;
  encodeFunctionData(functionFragment: "feeToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "localTransfer",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "msgSender", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "remoteTransfer",
    values: [BigNumberish, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "run",
    values: [BigNumberish, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "runFromToken",
    values: [BigNumberish, string, string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "runFromTokenNativeFee",
    values: [BigNumberish, string, string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "runNativeFee",
    values: [BigNumberish, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "runWithValue",
    values: [BigNumberish, string, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "runWithValueNativeFee",
    values: [BigNumberish, string, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "runWithdraw",
    values: [BigNumberish, string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "txContext", values?: undefined): string;

  decodeFunctionResult(functionFragment: "feeTarget", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "localTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "msgSender", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "remoteTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "run", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "runFromToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "runFromTokenNativeFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "runNativeFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "runWithValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "runWithValueNativeFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "runWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "txContext", data: BytesLike): Result;

  events: {};
}

export class IQuantumPortalPoc extends BaseContract {
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

  interface: IQuantumPortalPocInterface;

  functions: {
    feeTarget(overrides?: CallOverrides): Promise<[string]>;

    feeToken(overrides?: CallOverrides): Promise<[string]>;

    localTransfer(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    msgSender(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string] & {
        sourceNetwork: BigNumber;
        sourceMsgSender: string;
        sourceBeneficiary: string;
      }
    >;

    remoteTransfer(
      chainId: BigNumberish,
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    run(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    runFromToken(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    runFromTokenNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    runNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    runWithValue(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    runWithValueNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    runWithdraw(
      remoteChainId: BigNumberish,
      remoteAddress: string,
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    txContext(
      overrides?: CallOverrides
    ): Promise<
      [
        [
          BigNumber,
          [BigNumber, BigNumber, BigNumber] & {
            chainId: BigNumber;
            nonce: BigNumber;
            timestamp: BigNumber;
          },
          [
            BigNumber,
            string,
            string,
            string,
            string,
            BigNumber,
            string[],
            BigNumber,
            BigNumber
          ] & {
            timestamp: BigNumber;
            remoteContract: string;
            sourceMsgSender: string;
            sourceBeneficiary: string;
            token: string;
            amount: BigNumber;
            methods: string[];
            gas: BigNumber;
            fixedFee: BigNumber;
          },
          BigNumber
        ] & {
          index: BigNumber;
          blockMetadata: [BigNumber, BigNumber, BigNumber] & {
            chainId: BigNumber;
            nonce: BigNumber;
            timestamp: BigNumber;
          };
          transaction: [
            BigNumber,
            string,
            string,
            string,
            string,
            BigNumber,
            string[],
            BigNumber,
            BigNumber
          ] & {
            timestamp: BigNumber;
            remoteContract: string;
            sourceMsgSender: string;
            sourceBeneficiary: string;
            token: string;
            amount: BigNumber;
            methods: string[];
            gas: BigNumber;
            fixedFee: BigNumber;
          };
          uncommitedBalance: BigNumber;
        }
      ]
    >;
  };

  feeTarget(overrides?: CallOverrides): Promise<string>;

  feeToken(overrides?: CallOverrides): Promise<string>;

  localTransfer(
    token: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  msgSender(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, string] & {
      sourceNetwork: BigNumber;
      sourceMsgSender: string;
      sourceBeneficiary: string;
    }
  >;

  remoteTransfer(
    chainId: BigNumberish,
    token: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  run(
    remoteChain: BigNumberish,
    remoteContract: string,
    beneficiary: string,
    remoteMethodCall: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  runFromToken(
    remoteChain: BigNumberish,
    remoteContract: string,
    beneficiary: string,
    method: BytesLike,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  runFromTokenNativeFee(
    remoteChain: BigNumberish,
    remoteContract: string,
    beneficiary: string,
    method: BytesLike,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  runNativeFee(
    remoteChain: BigNumberish,
    remoteContract: string,
    beneficiary: string,
    remoteMethodCall: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  runWithValue(
    remoteChain: BigNumberish,
    remoteContract: string,
    beneficiary: string,
    token: string,
    method: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  runWithValueNativeFee(
    remoteChain: BigNumberish,
    remoteContract: string,
    beneficiary: string,
    token: string,
    method: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  runWithdraw(
    remoteChainId: BigNumberish,
    remoteAddress: string,
    token: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  txContext(
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      [BigNumber, BigNumber, BigNumber] & {
        chainId: BigNumber;
        nonce: BigNumber;
        timestamp: BigNumber;
      },
      [
        BigNumber,
        string,
        string,
        string,
        string,
        BigNumber,
        string[],
        BigNumber,
        BigNumber
      ] & {
        timestamp: BigNumber;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumber;
        methods: string[];
        gas: BigNumber;
        fixedFee: BigNumber;
      },
      BigNumber
    ] & {
      index: BigNumber;
      blockMetadata: [BigNumber, BigNumber, BigNumber] & {
        chainId: BigNumber;
        nonce: BigNumber;
        timestamp: BigNumber;
      };
      transaction: [
        BigNumber,
        string,
        string,
        string,
        string,
        BigNumber,
        string[],
        BigNumber,
        BigNumber
      ] & {
        timestamp: BigNumber;
        remoteContract: string;
        sourceMsgSender: string;
        sourceBeneficiary: string;
        token: string;
        amount: BigNumber;
        methods: string[];
        gas: BigNumber;
        fixedFee: BigNumber;
      };
      uncommitedBalance: BigNumber;
    }
  >;

  callStatic: {
    feeTarget(overrides?: CallOverrides): Promise<string>;

    feeToken(overrides?: CallOverrides): Promise<string>;

    localTransfer(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    msgSender(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string] & {
        sourceNetwork: BigNumber;
        sourceMsgSender: string;
        sourceBeneficiary: string;
      }
    >;

    remoteTransfer(
      chainId: BigNumberish,
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    run(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    runFromToken(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    runFromTokenNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    runNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    runWithValue(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    runWithValueNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    runWithdraw(
      remoteChainId: BigNumberish,
      remoteAddress: string,
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    txContext(
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        [BigNumber, BigNumber, BigNumber] & {
          chainId: BigNumber;
          nonce: BigNumber;
          timestamp: BigNumber;
        },
        [
          BigNumber,
          string,
          string,
          string,
          string,
          BigNumber,
          string[],
          BigNumber,
          BigNumber
        ] & {
          timestamp: BigNumber;
          remoteContract: string;
          sourceMsgSender: string;
          sourceBeneficiary: string;
          token: string;
          amount: BigNumber;
          methods: string[];
          gas: BigNumber;
          fixedFee: BigNumber;
        },
        BigNumber
      ] & {
        index: BigNumber;
        blockMetadata: [BigNumber, BigNumber, BigNumber] & {
          chainId: BigNumber;
          nonce: BigNumber;
          timestamp: BigNumber;
        };
        transaction: [
          BigNumber,
          string,
          string,
          string,
          string,
          BigNumber,
          string[],
          BigNumber,
          BigNumber
        ] & {
          timestamp: BigNumber;
          remoteContract: string;
          sourceMsgSender: string;
          sourceBeneficiary: string;
          token: string;
          amount: BigNumber;
          methods: string[];
          gas: BigNumber;
          fixedFee: BigNumber;
        };
        uncommitedBalance: BigNumber;
      }
    >;
  };

  filters: {};

  estimateGas: {
    feeTarget(overrides?: CallOverrides): Promise<BigNumber>;

    feeToken(overrides?: CallOverrides): Promise<BigNumber>;

    localTransfer(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    msgSender(overrides?: CallOverrides): Promise<BigNumber>;

    remoteTransfer(
      chainId: BigNumberish,
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    run(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    runFromToken(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    runFromTokenNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    runNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    runWithValue(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    runWithValueNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    runWithdraw(
      remoteChainId: BigNumberish,
      remoteAddress: string,
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    txContext(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    feeTarget(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    localTransfer(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    msgSender(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    remoteTransfer(
      chainId: BigNumberish,
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    run(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    runFromToken(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    runFromTokenNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      method: BytesLike,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    runNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      remoteMethodCall: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    runWithValue(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    runWithValueNativeFee(
      remoteChain: BigNumberish,
      remoteContract: string,
      beneficiary: string,
      token: string,
      method: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    runWithdraw(
      remoteChainId: BigNumberish,
      remoteAddress: string,
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    txContext(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
