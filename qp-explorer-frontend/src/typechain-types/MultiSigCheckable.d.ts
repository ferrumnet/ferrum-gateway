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

interface MultiSigCheckableInterface extends ethers.utils.Interface {
  functions: {
    "GOVERNANCE_GROUP_ID_MAX()": FunctionFragment;
    "addToQuorum(address,address,bytes32,uint64,bytes)": FunctionFragment;
    "admin()": FunctionFragment;
    "cancelSaltedSignature(bytes32,uint64,bytes)": FunctionFragment;
    "eip712Domain()": FunctionFragment;
    "forceRemoveFromQuorum(address)": FunctionFragment;
    "initialize(address,uint64,uint16,uint8,address[])": FunctionFragment;
    "owner()": FunctionFragment;
    "quorumList(uint256)": FunctionFragment;
    "quorumSubscriptions(address)": FunctionFragment;
    "quorums(address)": FunctionFragment;
    "quorumsSubscribers(address)": FunctionFragment;
    "removeFromQuorum(address,bytes32,uint64,bytes)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateMinSignature(address,uint16,bytes32,uint64,bytes)": FunctionFragment;
    "usedHashes(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "GOVERNANCE_GROUP_ID_MAX",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addToQuorum",
    values: [string, string, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "cancelSaltedSignature",
    values: [BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "eip712Domain",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "forceRemoveFromQuorum",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, BigNumberish, BigNumberish, BigNumberish, string[]]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "quorumList",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "quorumSubscriptions",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "quorums", values: [string]): string;
  encodeFunctionData(
    functionFragment: "quorumsSubscribers",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeFromQuorum",
    values: [string, BytesLike, BigNumberish, BytesLike]
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
    functionFragment: "updateMinSignature",
    values: [string, BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "usedHashes",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "GOVERNANCE_GROUP_ID_MAX",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addToQuorum",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelSaltedSignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "eip712Domain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "forceRemoveFromQuorum",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "quorumList", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quorumSubscriptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "quorums", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quorumsSubscribers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeFromQuorum",
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
    functionFragment: "updateMinSignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "usedHashes", data: BytesLike): Result;

  events: {
    "AddedToQuorum(address,address)": EventFragment;
    "AdminSet(address)": EventFragment;
    "EIP712DomainChanged()": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "QuorumCreated(tuple)": EventFragment;
    "QuorumUpdated(tuple)": EventFragment;
    "RemovedFromQuorum(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddedToQuorum"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AdminSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EIP712DomainChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuorumCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuorumUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemovedFromQuorum"): EventFragment;
}

export type AddedToQuorumEvent = TypedEvent<
  [string, string] & { quorumId: string; subscriber: string }
>;

export type AdminSetEvent = TypedEvent<[string] & { admin: string }>;

export type EIP712DomainChangedEvent = TypedEvent<[] & {}>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type QuorumCreatedEvent = TypedEvent<
  [
    [string, BigNumber, number, number] & {
      id: string;
      groupId: BigNumber;
      minSignatures: number;
      ownerGroupId: number;
    }
  ] & {
    quorum: [string, BigNumber, number, number] & {
      id: string;
      groupId: BigNumber;
      minSignatures: number;
      ownerGroupId: number;
    };
  }
>;

export type QuorumUpdatedEvent = TypedEvent<
  [
    [string, BigNumber, number, number] & {
      id: string;
      groupId: BigNumber;
      minSignatures: number;
      ownerGroupId: number;
    }
  ] & {
    quorum: [string, BigNumber, number, number] & {
      id: string;
      groupId: BigNumber;
      minSignatures: number;
      ownerGroupId: number;
    };
  }
>;

export type RemovedFromQuorumEvent = TypedEvent<
  [string, string] & { quorumId: string; subscriber: string }
>;

export class MultiSigCheckable extends BaseContract {
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

  interface: MultiSigCheckableInterface;

  functions: {
    GOVERNANCE_GROUP_ID_MAX(overrides?: CallOverrides): Promise<[number]>;

    addToQuorum(
      _address: string,
      quorumId: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    cancelSaltedSignature(
      salt: BytesLike,
      expectedGroupId: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    eip712Domain(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, string, BigNumber[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: BigNumber;
        verifyingContract: string;
        salt: string;
        extensions: BigNumber[];
      }
    >;

    forceRemoveFromQuorum(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      quorumId: string,
      groupId: BigNumberish,
      minSignatures: BigNumberish,
      ownerGroupId: BigNumberish,
      addresses: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    quorumList(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    quorumSubscriptions(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, number, number] & {
        id: string;
        groupId: BigNumber;
        minSignatures: number;
        ownerGroupId: number;
      }
    >;

    quorums(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, number, number] & {
        id: string;
        groupId: BigNumber;
        minSignatures: number;
        ownerGroupId: number;
      }
    >;

    quorumsSubscribers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    removeFromQuorum(
      _address: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
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

    updateMinSignature(
      quorumId: string,
      minSignature: BigNumberish,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
  };

  GOVERNANCE_GROUP_ID_MAX(overrides?: CallOverrides): Promise<number>;

  addToQuorum(
    _address: string,
    quorumId: string,
    salt: BytesLike,
    expiry: BigNumberish,
    multiSignature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  admin(overrides?: CallOverrides): Promise<string>;

  cancelSaltedSignature(
    salt: BytesLike,
    expectedGroupId: BigNumberish,
    multiSignature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  eip712Domain(
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, BigNumber, string, string, BigNumber[]] & {
      fields: string;
      name: string;
      version: string;
      chainId: BigNumber;
      verifyingContract: string;
      salt: string;
      extensions: BigNumber[];
    }
  >;

  forceRemoveFromQuorum(
    _address: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    quorumId: string,
    groupId: BigNumberish,
    minSignatures: BigNumberish,
    ownerGroupId: BigNumberish,
    addresses: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  quorumList(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  quorumSubscriptions(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, number, number] & {
      id: string;
      groupId: BigNumber;
      minSignatures: number;
      ownerGroupId: number;
    }
  >;

  quorums(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, number, number] & {
      id: string;
      groupId: BigNumber;
      minSignatures: number;
      ownerGroupId: number;
    }
  >;

  quorumsSubscribers(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  removeFromQuorum(
    _address: string,
    salt: BytesLike,
    expiry: BigNumberish,
    multiSignature: BytesLike,
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

  updateMinSignature(
    quorumId: string,
    minSignature: BigNumberish,
    salt: BytesLike,
    expiry: BigNumberish,
    multiSignature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    GOVERNANCE_GROUP_ID_MAX(overrides?: CallOverrides): Promise<number>;

    addToQuorum(
      _address: string,
      quorumId: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    admin(overrides?: CallOverrides): Promise<string>;

    cancelSaltedSignature(
      salt: BytesLike,
      expectedGroupId: BigNumberish,
      multiSignature: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    eip712Domain(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, string, BigNumber[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: BigNumber;
        verifyingContract: string;
        salt: string;
        extensions: BigNumber[];
      }
    >;

    forceRemoveFromQuorum(
      _address: string,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      quorumId: string,
      groupId: BigNumberish,
      minSignatures: BigNumberish,
      ownerGroupId: BigNumberish,
      addresses: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    quorumList(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    quorumSubscriptions(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, number, number] & {
        id: string;
        groupId: BigNumber;
        minSignatures: number;
        ownerGroupId: number;
      }
    >;

    quorums(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, number, number] & {
        id: string;
        groupId: BigNumber;
        minSignatures: number;
        ownerGroupId: number;
      }
    >;

    quorumsSubscribers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeFromQuorum(
      _address: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAdmin(_admin: string, overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateMinSignature(
      quorumId: string,
      minSignature: BigNumberish,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    "AddedToQuorum(address,address)"(
      quorumId?: null,
      subscriber?: null
    ): TypedEventFilter<
      [string, string],
      { quorumId: string; subscriber: string }
    >;

    AddedToQuorum(
      quorumId?: null,
      subscriber?: null
    ): TypedEventFilter<
      [string, string],
      { quorumId: string; subscriber: string }
    >;

    "AdminSet(address)"(
      admin?: null
    ): TypedEventFilter<[string], { admin: string }>;

    AdminSet(admin?: null): TypedEventFilter<[string], { admin: string }>;

    "EIP712DomainChanged()"(): TypedEventFilter<[], {}>;

    EIP712DomainChanged(): TypedEventFilter<[], {}>;

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

    "QuorumCreated(tuple)"(
      quorum?: null
    ): TypedEventFilter<
      [
        [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        }
      ],
      {
        quorum: [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        };
      }
    >;

    QuorumCreated(
      quorum?: null
    ): TypedEventFilter<
      [
        [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        }
      ],
      {
        quorum: [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        };
      }
    >;

    "QuorumUpdated(tuple)"(
      quorum?: null
    ): TypedEventFilter<
      [
        [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        }
      ],
      {
        quorum: [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        };
      }
    >;

    QuorumUpdated(
      quorum?: null
    ): TypedEventFilter<
      [
        [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        }
      ],
      {
        quorum: [string, BigNumber, number, number] & {
          id: string;
          groupId: BigNumber;
          minSignatures: number;
          ownerGroupId: number;
        };
      }
    >;

    "RemovedFromQuorum(address,address)"(
      quorumId?: null,
      subscriber?: null
    ): TypedEventFilter<
      [string, string],
      { quorumId: string; subscriber: string }
    >;

    RemovedFromQuorum(
      quorumId?: null,
      subscriber?: null
    ): TypedEventFilter<
      [string, string],
      { quorumId: string; subscriber: string }
    >;
  };

  estimateGas: {
    GOVERNANCE_GROUP_ID_MAX(overrides?: CallOverrides): Promise<BigNumber>;

    addToQuorum(
      _address: string,
      quorumId: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    cancelSaltedSignature(
      salt: BytesLike,
      expectedGroupId: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    eip712Domain(overrides?: CallOverrides): Promise<BigNumber>;

    forceRemoveFromQuorum(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      quorumId: string,
      groupId: BigNumberish,
      minSignatures: BigNumberish,
      ownerGroupId: BigNumberish,
      addresses: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    quorumList(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quorumSubscriptions(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quorums(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    quorumsSubscribers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeFromQuorum(
      _address: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
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

    updateMinSignature(
      quorumId: string,
      minSignature: BigNumberish,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    usedHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    GOVERNANCE_GROUP_ID_MAX(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addToQuorum(
      _address: string,
      quorumId: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    cancelSaltedSignature(
      salt: BytesLike,
      expectedGroupId: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    eip712Domain(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    forceRemoveFromQuorum(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      quorumId: string,
      groupId: BigNumberish,
      minSignatures: BigNumberish,
      ownerGroupId: BigNumberish,
      addresses: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    quorumList(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quorumSubscriptions(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quorums(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quorumsSubscribers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeFromQuorum(
      _address: string,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
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

    updateMinSignature(
      quorumId: string,
      minSignature: BigNumberish,
      salt: BytesLike,
      expiry: BigNumberish,
      multiSignature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    usedHashes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
