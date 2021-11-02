import { Network } from 'ferrum-plumbing';
import { Connection, Schema, Document } from 'mongoose';
import { CrossSwapRequest, GroupInfo } from 'types';
import { Eip712TypeDefinition} from 'unifyre-extension-web3-retrofit/dist/client/Eip712';

export const PairedAddressType: Eip712TypeDefinition =  {
    Pair: [
        { name: 'network1', type: 'string' },
        { name: 'address1', type: 'address' },
        { name: 'network2', type: 'string' },
        { name: 'address2', type: 'address' },
    ],
};

export interface BridgeSwapEvent {
	network: Network;
	transactionId: string;
	from: string;
	token: string;
	originToken: string;
	targetNetwork: string;
	targetToken: string;
	swapTargetTokenTo: string;
	senderAddress: string;
	targetAddress: string;
	amount: string;
}

export const groupInfoSchema: Schema = new Schema<Document&GroupInfo>({
	groupId: String,
	themeVariables: Object,
	homepage: String,
	defaultCurrency: String,
	noMainPage: String,
  });

  export interface BridgeTransaction {
	  network: string;
	  transactionId: string;
	  failed: boolean;
	  error?: string;
	  type: 'unknown' | 'swap' | 'withdrawSigned' | 'addLiquidity' | 'removeLiquidity',
	//   event: BridgeSwapEvent | BridgeWithdrawSignedEvent | BridgeAddLiquidityEvent |
	  	// BridgeRemoveLiquidityEvent;
  }
  
export const GroupInfoModel = (c: Connection) => c.model<GroupInfo&Document>('groupInfo', groupInfoSchema);

const crossSwapRequestSchema: Schema = new Schema<Document&CrossSwapRequest>({
	userAddress: String,
	network: String,
	transactionId: String,
	fromCurrency: String,
	toCurrency: String,
	amountIn: String,
	throughCurrency: String,
	targetThroughCurrency: String,
	fromProtocol: String,
	toProtocol: String,
	status: new Schema({ status: String }),
});

export const CrossSwapRequestModel = (c: Connection) =>
c.model<CrossSwapRequest&Document>('crossSwapRequest', crossSwapRequestSchema);