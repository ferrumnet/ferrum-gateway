import { Network } from 'ferrum-plumbing';
import { Connection, Schema, Document } from 'mongoose';
import { GroupInfo } from 'types';
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
	targetNetwork: string;
	targetToken: string;
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
  
  export const GroupInfoModel = (c: Connection) => c.model<GroupInfo&Document>('groupInfo', groupInfoSchema);
