import { HexString, Networks, ValidationUtils } from "ferrum-plumbing";
import { UserBridgeWithdrawableBalanceItem } from "types";
import Web3 from "web3";
import * as Eip712 from "web3-tools";
import { Eip712Params, produceSignature } from "web3-tools";
import { BridgeSwapEvent } from "../../common/TokenBridgeTypes";

export const EXPECTED_WI_SCHEMA_VERSIONS = ["0.1", "1.0", "1.2"];

export class NodeUtils {
    static bridgeV1Salt(wi: UserBridgeWithdrawableBalanceItem): HexString {
      return Web3.utils.keccak256(
        wi.receiveTransactionId.toLocaleLowerCase()
      );
    }

    static bridgeV1Hash(
        wi: UserBridgeWithdrawableBalanceItem,
    ): HexString {
        const params = {
            contractName: wi.payBySig.contractName,
            contractVersion: wi.payBySig.contractAddress,
            method: "WithdrawSigned",
            args: [
                { type: "address", name: "token", value: wi.payBySig.token },
                { type: "address", name: "payee", value: wi.payBySig.payee },
                { type: "uint256", name: "amount", value: wi.payBySig.amount },
                { type: "bytes32", name: "salt", value: wi.payBySig.swapTxId || 
                    NodeUtils.bridgeV1Salt(wi) },
            ],
        } as Eip712.Eip712Params;

        const sig = Eip712.produceSignature(
            new Web3().eth,
            Networks.for(wi.receiveNetwork).chainId,
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

    static withdrawItemFromSwap(swap: BridgeSwapEvent): UserBridgeWithdrawableBalanceItem {
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
            "toToken",
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
        ValidationUtils.isTrue(wi.payBySig.payee === wi.sendAddress, 'Invalid payBySig.payee');
        ValidationUtils.isTrue(wi.payBySig.token === 
            Utils.parseCurrency(wi.sendToCurrency)[0], 'Invalid payBySig.token');
        ValidationUtils.isTrue(wi.payBySig.sourceChainId ===
            Networks.for(wi.receiveNetwork).chainId, 'Invalid payBySig.sourceChainId');
        ValidationUtils.isTrue(wi.payBySig.toToken ===
            Utils.parseCurrency(wi.sendToCurrency)[0], 'Invalid payBySig.toToken');
        const expectedSwapTxId = contractVer == BridgeContractVersions.V1_0 ?
            NodeUtils.bridgeV1Salt(wi) : wi.receiveTransactionId;
        ValidationUtils.isTrue(wi.payBySig.swapTxId === expectedSwapTxId,
            'Invalid payBySig.swapTxId');
        ValidationUtils.isTrue(wi.payBySig.contractVersion === contractVer, 
            'Invalid payBySig.contractVersion');
        const expectedContractName = contractVer === BridgeContractVersions.V1_0 ?
            BridgeContractNames.V1_0 : BridgeContractNames.V1_2;
        ValidationUtils.isTrue(wi.payBySig.contractName === expectedContractName,
            'Invalid payBySig.contractName');
        const expectedContractAddress = contractVer === BridgeContractVersions.V1_0 ?
            BRIDGE_V1_CONTRACTS[wi.sendNetwork] :
            BRIDGE_V12_CONTRACTS[wi.sendNetwork]?.router;
        ValidationUtils.isTrue(wi.payBySig.contractAddress === expectedContractAddress,
            'Invalid payBySig.contractAddress');
        const expectedHash = contractVer === BridgeContractVersions.V1_0 ?
            NodeUtils.bridgeV1Hash(wi) : NodeUtils.bridgeV12Hash(wi);
        ValidationUtils.isTrue(wi.payBySig.hash === expectedHash,
            'Invalid payBySig.hash');
    }
}