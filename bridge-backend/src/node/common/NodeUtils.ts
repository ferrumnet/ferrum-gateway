import { HexString, Networks } from "ferrum-plumbing";
import { UserBridgeWithdrawableBalanceItem } from "types";
import Web3 from "web3";
import * as Eip712 from "web3-tools";
import { Eip712Params, produceSignature } from "web3-tools";

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
}