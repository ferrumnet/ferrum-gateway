import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { AppConfig } from "common-backend";
import { HexString, NetworkedConfig, Networks, ValidationUtils } from "ferrum-plumbing";
import { BridgeContractNames, BridgeContractVersions, BRIDGE_V12_CONTRACTS, BRIDGE_V1_CONTRACTS, PayBySignatureData, UserBridgeWithdrawableBalanceItem, Utils } from "types";
import Web3 from "web3";
import * as Eip712 from "web3-tools";
import { Eip712Params, produceSignature } from "web3-tools";
import { BridgeSwapEvent } from "../../common/TokenBridgeTypes";
import { BridgeNodeConfig } from "../BridgeNodeConfig";

export const EXPECTED_WI_SCHEMA_VERSIONS = ["0.1", "1.0", "1.2"];

export class NodeUtils {
    static bridgeV1Salt(wi: UserBridgeWithdrawableBalanceItem): HexString {
      return Web3.utils.keccak256(
        wi.receiveTransactionId.toLocaleLowerCase()
      );
    }

    static bridgeV1ContractsForNode(): NetworkedConfig<string> {
        const nets = AppConfig.instance().get<BridgeNodeConfig>('')?.bridgeV1Contracts || BRIDGE_V1_CONTRACTS
        const rv = {} as any;
        Object.keys(nets).forEach(k => {
            rv[k] = (nets[k] || '').toLowerCase();
        });
        return rv;
    }

    static bridgeV1Hash(
        wi: UserBridgeWithdrawableBalanceItem,
    ): HexString {
        const params = {
            contractName: wi.payBySig.contractName,
            contractVersion: wi.payBySig.contractVersion,
            method: "WithdrawSigned",
            args: [
                { type: "address", name: "token", value: wi.payBySig.token },
                { type: "address", name: "payee", value: wi.payBySig.payee },
                { type: "uint256", name: "amount", value: wi.payBySig.amount },
                { type: "bytes32", name: "salt", value: NodeUtils.bridgeV1Salt(wi) },
            ],
        } as Eip712.Eip712Params;

        const sig = Eip712.produceSignature(
            new Web3().eth,
            Networks.for(wi.sendNetwork).chainId,
            wi.payBySig.contractAddress,
            params
        );
        return sig.hash!;
    }

    static bridgeV12Hash(wi: UserBridgeWithdrawableBalanceItem): HexString {
        const sourceChainId = Networks.for(wi.receiveNetwork).chainId;
        const chainId = Networks.for(wi.sendNetwork).chainId;
		// WithdrawSigned(address token,address payee,
		//  uint256 amount,address toToken,uint32 sourceChainId,bytes32 swapTxId)
		const params = {
			contractName: wi.payBySig.contractName,
			contractVersion: wi.payBySig.contractVersion,
			method: 'WithdrawSigned',
			args: [
				{ type: 'address', name: 'token', value: wi.payBySig.token },
				{ type: 'address', name: 'payee', value: wi.payBySig.payee },
				{ type: 'uint256', name: 'amount', value: wi.payBySig.amount },
				{ type: 'address', name: 'toToken', value: wi.payBySig.toToken },
				{ type: 'uint32', name: 'sourceChainId', value: sourceChainId },
				{ type: 'bytes32', name: 'swapTxId', value: wi.payBySig.swapTxId },
			]
		} as Eip712Params;

		const bridgeContractAddress = wi.payBySig.contractAddress;
		const sig = produceSignature(
			new Web3().eth,
			chainId,
            bridgeContractAddress,
			params);
        return sig.hash!;
    }

    static async withdrawItemFromSwap(
            schemaVersion: string,
            creator: string,
            swap: BridgeSwapEvent,
            helper: EthereumSmartContractHelper,): Promise<UserBridgeWithdrawableBalanceItem> {
        ValidationUtils.isTrue(
            EXPECTED_WI_SCHEMA_VERSIONS.indexOf(schemaVersion) >= 0,
            "Invalid schema version");
        const isV12 = schemaVersion === '1.2';
        const txSummary = await helper.getTransactionSummary(swap.network, swap.transactionId);
		const payBySig = isV12 ?
            await NodeUtils.createSignedPaymentV12(swap, helper) :
            await NodeUtils.createSignedPaymentV1(swap, helper);
		const newItem = {
			id: swap.transactionId,
			timestamp: new Date().valueOf(),
			receiveNetwork: swap.network,
			receiveCurrency: Utils.toCurrency(swap.network, swap.token),
			receiveTransactionId: swap.transactionId,
			receiveAddress: swap.targetAddress,
			receiveAmount: swap.amount,
			payBySig,
			sendNetwork: swap.targetNetwork,
			sendAddress: swap.targetAddress,
			sendTimestamp: 0,
			sendCurrency: Utils.toCurrency(swap.targetNetwork, swap.targetToken),
			sendAmount: swap.amount,

			originCurrency: Utils.toCurrency(swap.network, swap.originToken),
			sendToCurrency: Utils.toCurrency(swap.targetNetwork, swap.swapTargetTokenTo),

			used: '',
			useTransactions: [],
            creator,
            execution: { status: '', transactions: [] },
            receiveTransactionTimestamp: txSummary.confirmationTime,
            v: 0,
            version: schemaVersion,
            signatures: 0,
		} as UserBridgeWithdrawableBalanceItem;

        // Update version specific fields
        if (isV12) {
            newItem.payBySig.hash = NodeUtils.bridgeV12Hash(newItem);
        } else {
            newItem.payBySig.swapTxId = NodeUtils.bridgeV1Salt(newItem);
            newItem.payBySig.hash = NodeUtils.bridgeV1Hash(newItem);
        }
		return newItem;
    }

    private static async createSignedPaymentV12(
            tx: BridgeSwapEvent,
            helper: EthereumSmartContractHelper,)
        : Promise<PayBySignatureData> {
        const sourceChainId = Networks.for(tx.network).chainId;
        const chainId = Networks.for(tx.targetNetwork).chainId;
		const amountStr = await helper.amountToMachine(
			Utils.toCurrency(tx.targetNetwork, tx.targetToken), tx.amount);
		// WithdrawSigned(address token,address payee,
		//  uint256 amount,address toToken,uint32 sourceChainId,bytes32 swapTxId)
		const params = {
			contractName: 'FERRUM_TOKEN_BRIDGE_POOL',
			contractVersion: BridgeContractVersions.V1_2,
			method: 'WithdrawSigned',
			args: [
				{ type: 'address', name: 'token', value: tx.targetToken },
				{ type: 'address', name: 'payee', value: tx.targetAddress },
				{ type: 'uint256', name: 'amount', value: amountStr },
				{ type: 'address', name: 'toToken', value: tx.swapTargetTokenTo },
				{ type: 'uint32', name: 'sourceChainId', value: sourceChainId },
				{ type: 'bytes32', name: 'swapTxId', value: tx.transactionId },
			]
		} as Eip712Params;

		const bridgeContractAddress = BRIDGE_V12_CONTRACTS[tx.targetNetwork].bridge;
		return {
			token: tx.targetToken,
			payee: tx.targetAddress,
			amount: amountStr,
			toToken: tx.swapTargetTokenTo,
			sourceChainId: sourceChainId,
			swapTxId: tx.transactionId,
			contractName: params.contractName,
			contractVersion: params.contractVersion,
			contractAddress: bridgeContractAddress,
			hash: '',
			signatures: [],
		} as PayBySignatureData;
    }


    private static async createSignedPaymentV1(
            tx: BridgeSwapEvent,
            helper: EthereumSmartContractHelper,)
        : Promise<PayBySignatureData> {
        const sourceChainId = Networks.for(tx.network).chainId;
		const amountStr = await helper.amountToMachine(
			Utils.toCurrency(tx.targetNetwork, tx.targetToken), tx.amount);
		// WithdrawSigned(address token,address payee,
		//  uint256 amount,address toToken,uint32 sourceChainId,bytes32 swapTxId)
		const params = {
			contractName: 'FERRUM_TOKEN_BRIDGE_POOL',
			contractVersion: BridgeContractVersions.V1_0,
			method: 'WithdrawSigned',
			args: [
				{ type: 'address', name: 'token', value: tx.targetToken },
				{ type: 'address', name: 'payee', value: tx.targetAddress },
				{ type: 'uint256', name: 'amount', value: amountStr },
				{ type: 'address', name: 'toToken', value: tx.swapTargetTokenTo },
				{ type: 'uint32', name: 'sourceChainId', value: sourceChainId },
				{ type: 'bytes32', name: 'swapTxId', value: tx.transactionId },
			]
		} as Eip712Params;

		const bridgeContractAddress = NodeUtils.bridgeV1ContractsForNode()[tx.targetNetwork];
		return {
			token: tx.targetToken,
			payee: tx.targetAddress,
			amount: amountStr,
			toToken: tx.swapTargetTokenTo,
			sourceChainId: sourceChainId,
			swapTxId: '',
			contractName: params.contractName,
			contractVersion: params.contractVersion,
			contractAddress: bridgeContractAddress,
			hash: '',
			signatures: [],
		} as PayBySignatureData;
    }

    static validateWithdrawItem(wi: UserBridgeWithdrawableBalanceItem) {
        ValidationUtils.isTrue(
            EXPECTED_WI_SCHEMA_VERSIONS.indexOf(wi.version) >= 0,
            "Invalid schema version"
        );
        ValidationUtils.allRequired(
        [
            "receiveNetwork",
            "receiveCurrency",
            "receiveTransactionId",
            "receiveAddress",
            "receiveAmount",

            "sendNetwork",
            "sendAddress",
            "sendCurrency",
            "payBySig",
        ],
        wi
        );
        ValidationUtils.allRequired(
        [
            "token",
            "payee",
            "amount",
            "sourceChainId",
            "swapTxId",
            "contractName",
            "contractVersion",
            "contractAddress",
            "hash",
            "signatures",
        ],
        wi.payBySig
        );
        const contractVer = (wi.version === '0.1' || wi.version == '1.0') ?
            BridgeContractVersions.V1_0 : BridgeContractVersions.V1_2;
        const isV12 = contractVer === BridgeContractVersions.V1_2;
        ValidationUtils.isTrue(wi.payBySig.payee === wi.sendAddress, 'Invalid payBySig.payee');
        ValidationUtils.isTrue(wi.payBySig.token === 
            Utils.parseCurrency(wi.sendCurrency || '')[1], 'Invalid payBySig.token');
        ValidationUtils.isTrue(wi.payBySig.sourceChainId ===
            Networks.for(wi.receiveNetwork).chainId, 'Invalid payBySig.sourceChainId');
        ValidationUtils.isTrue(wi.payBySig.contractVersion === contractVer, 
            'Invalid payBySig.contractVersion');

        if (isV12) {
            // V12 specific validations
            ValidationUtils.isTrue(!!wi.sendToCurrency, 'sendToCurrency required');
            ValidationUtils.isTrue(!!wi.payBySig.toToken, 'payBySig.toToken required');
            ValidationUtils.isTrue(wi.payBySig.toToken ===
                Utils.parseCurrency(wi.sendToCurrency || '')[1], 'Invalid payBySig.toToken');
            ValidationUtils.isTrue(wi.payBySig.swapTxId === wi.receiveTransactionId, 'Invalid payBySig.swapTxId');
            ValidationUtils.isTrue(wi.payBySig.contractName === BridgeContractNames.V1_2,
                'Invalid payBySig.contractName');
            ValidationUtils.isTrue(wi.payBySig.contractAddress === BRIDGE_V12_CONTRACTS[wi.sendNetwork]?.router,
                'Invalid payBySig.contractAddress');
            ValidationUtils.isTrue(wi.payBySig.hash === NodeUtils.bridgeV12Hash(wi),
                'Invalid payBySig.hash');
        } else {
            // V1 specific validations
            ValidationUtils.isTrue(wi.payBySig.swapTxId === NodeUtils.bridgeV1Salt(wi),
                'Invalid payBySig.swapTxId');
            ValidationUtils.isTrue(wi.payBySig.contractName === BridgeContractNames.V1_0,
                'Invalid payBySig.contractName');
            ValidationUtils.isTrue(wi.payBySig.contractAddress === NodeUtils.bridgeV1ContractsForNode()[wi.sendNetwork],
                'Invalid payBySig.contractAddress');
            ValidationUtils.isTrue(wi.payBySig.hash === NodeUtils.bridgeV1Hash(wi),
                'Invalid payBySig.hash');
        }
    }
}