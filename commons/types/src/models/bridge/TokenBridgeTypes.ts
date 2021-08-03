import { Connection, Document, Schema } from "mongoose";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { ValidationUtils } from "ferrum-plumbing";
import {
  DomainSeparator,
  Eip712TypeDefinition,
} from "unifyre-extension-web3-retrofit/dist/client/Eip712";

export interface RequestMayNeedApprove {
  isApprove: boolean;
  requests: CustomTransactionCallRequest[];
}

export const PairedAddressType: Eip712TypeDefinition = {
  Pair: [
    { name: "network1", type: "string" },
    { name: "address1", type: "address" },
    { name: "network2", type: "string" },
    { name: "address2", type: "address" },
  ],
};

export interface PairedAddress {
  network1: string;
  address1: string;
  network2: string;
  address2: string;
}

export interface SignedPairAddress {
  pair: PairedAddress;
  signature1: string;
  signature2: string;
}

export const TOKEN_BRIDGE_DOMAIN_SALT =
  "0xebb7c67ee709a29f4d80f3ac6db9cd0e84fccb20437963314b825afc2463825c";

export const CHAIN_ID_FOR_NETWORK = {
  ETHEREUM: 1,
  RINKEBY: 4,
  BSC: 56,
  BSC_TESTNET: 97,
  POLYGON: 137,
  MUMBAI_TESTNET: 80001,
} as any;

export interface PayBySignatureData {
  token: string;
  payee: string;
  amount: string;
  salt: string;
  signature: string;
  hash: string;
}

// Every transaction sent by user using a paired address to the bridge contract,
// will produced a Withdrawable Balance Item
export interface UserBridgeWithdrawableBalanceItem {
  id: string; // same as signedWithdrawHash
  timestamp: number;
  receiveNetwork: string;
  receiveCurrency: string;
  receiveTransactionId: string;
  receiveAddress: string;
  receiveAmount: string;

  sendNetwork: string;
  sendAddress: string;
  sendTimestamp: number;
  sendCurrency: string;
  sendAmount: string;
  payBySig: PayBySignatureData;

  used: "" | "pending" | "failed" | "completed";
  useTransactions: { id: string; status: string; timestamp: number }[];
}

export interface UserBridgeLiquidityItem {
  network: string;
  address: string;
  currency: string;
  liquidity: string;
}

//@ts-ignore
const payBySignatureDataSchema: Schema = new Schema<
  PayBySignatureData & Document
>({
  token: String,
  payee: String,
  amount: String,
  salt: String,
  signature: String,
  hash: String,
});

//@ts-ignore
const userBridgeWithdrawableBalanceItemSchema: Schema = new Schema<
  UserBridgeWithdrawableBalanceItem & Document
>({
  id: String, // same as signedWithdrawHash
  timestamp: Number,
  receiveNetwork: String,
  receiveCurrency: String,
  receiveAddress: String,
  receiveAmount: String,
  receiveTransactionId: String,
  salt: String,
  signedWithdrawHash: String,
  signedWithdrawSignature: String,

  sendNetwork: String,
  sendAddress: String,
  sendTimestamp: Number,
  sendTransactionId: String,
  sendCurrency: String,
  sendAmount: String,

  payBySig: payBySignatureDataSchema,

  used: String,
  useTransactions: [{ id: String, status: String, timestamp: Number }],
});

//@ts-ignore
const SignedPairAddressSchema: Schema = new Schema<
  SignedPairAddress & Document
>({
  pair: new Schema<PairedAddress & Document>({
    network1: String,
    address1: String,
    network2: String,
    address2: String,
  }),
  signature1: String,
  signature2: String,
});

export function getEnv(env: string) {
  const res = process.env[env];
  ValidationUtils.isTrue(
    !!res,
    `Make sure to set environment variable '${env}'`
  );
  return res!;
}

export const UserBridgeWithdrawableBalanceItemModel = (c: Connection) =>
  c.model<UserBridgeWithdrawableBalanceItem & Document>(
    "userBridgeWithdrawableBalanceItem",
    userBridgeWithdrawableBalanceItemSchema
  );

export const SignedPairAddressSchemaModel = (c: Connection) =>
  c.model<SignedPairAddress & Document>(
    "signedPairAddress",
    SignedPairAddressSchema
  );

export function domainSeparator(network: string): DomainSeparator {
  const chainId = CHAIN_ID_FOR_NETWORK[network];
  return {
    chainId: chainId,
    name: "PairedUnifyreWallet",
    salt: TOKEN_BRIDGE_DOMAIN_SALT,
    verifyingContract: BRIDGE_CONTRACT[network],
    version: "0.1.0",
  };
}

export const BRIDGE_CONTRACT = {
  ETHEREUM: "0x8e01cc26d6dd73581347c4370573ce9e59e74802",
  RINKEBY: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877",
  BSC: "0x8e01cc26d6dd73581347c4370573ce9e59e74802",
  BSC_TESTNET: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877",
  POLYGON: "0x8e01cc26d6dd73581347c4370573ce9e59e74802",
  MUMBAI_TESTNET: "0x89262b7bd8244b01fbce9e1610bf1d9f5d97c877",
} as any;

export interface PairedAddress {
  network1: string;
  address1: string;
  network2: string;
  address2: string;
}

// Balance related types

// Every transaction sent by user using a paired address to the bridge contract,
// will produced a Withdrawable Balance Item
export interface UserBridgeWithdrawableBalanceItem {
  id: string; // same as signedWithdrawHash
  timestamp: number;
  receiveNetwork: string;
  receiveCurrency: string;
  receiveAddress: string;
  receiveAmount: string;
  salt: string;
  signedWithdrawHash: string;
  signedWithdrawSignature: string;

  sendNetwork: string;
  sendAddress: string;
  sendTimestamp: number;
  sendTransactionId: string;
  sendCurrency: string;
  sendAmount: string;

  used: "" | "pending" | "failed" | "completed";
  useTransactionIds: string[];
}

export interface UserBridgeLiquidityItem {
  network: string;
  address: string;
  currency: string;
  liquidity: string;
}

export interface BridgeTokenConfig {
  sourceNetwork: string;
  targetNetwork: string;
  sourceCurrency: string;
  targetCurrency: string;
  feeConstant: string;
  fee: string;
}

export interface NetworkedConfig<T> {
  [network: string]: T;
}

export interface NetworkRelatedConfig {
  [network: string]: string;
}
