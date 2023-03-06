import { Injectable, Logger, LoggerFactory, ValidationUtils, Networks, LocalCache } from "ferrum-plumbing";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { MongooseConnection } from 'aws-lambda-helper';
import { Connection, Document, Model } from 'mongoose';
import { QuantumPortalMinedBlockModel, QuantumPortalRemoteTransactoin,
    QuantumPortalRemoteTransactoinModel, QuantumPortalMinedBlock, QuantumPortalAccount, QuantumPortalAccountModel, QuantumPortalAccountBalance,
    QuantumPortalContractObject, QuantumPortalContractAccount, QuantumPortalContractObjectModel } from 'qp-explorer-commons';
import { QpExplorerNodeConfig } from "../QpExplorerNodeConfig";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { sha256sync } from 'ferrum-crypto';
import { AbiItem } from "web3-tools";
import Web3 from "web3";

export class QpExplorerService extends MongooseConnection implements Injectable  {
    private cache = new LocalCache();
    private log: Logger;
    private blockModel: Model<QuantumPortalMinedBlock&Document> | undefined;
    private txModel: Model<QuantumPortalRemoteTransactoin&Document> | undefined;
    private accountModel: Model<QuantumPortalAccount&Document> | undefined;
    private contractModel: Model<QuantumPortalContractObject&Document> | undefined;

    constructor(
        logFac: LoggerFactory,
        private helper: EthereumSmartContractHelper,
    ) {
        super();
        this.log = logFac.getLogger(QpExplorerService);
    }

    __name__(): string { return 'QpExplorerService'; }

    initModels(con: Connection): void {
        this.blockModel = QuantumPortalMinedBlockModel(con);
        this.txModel = QuantumPortalRemoteTransactoinModel(con);
        this.accountModel = QuantumPortalAccountModel(con);
        this.contractModel = QuantumPortalContractObjectModel(con);
    }

    async recentBlocks(page: number, pageSize: number): Promise<QuantumPortalMinedBlock[]> {
        ValidationUtils.isTrue(pageSize > 0, '"pageSize" required');
        this.verifyInit();
        const rv = await this.blockModel.find().sort({timestamp: -1}).skip(page * pageSize).limit(pageSize).exec();
        return rv.map(b => b.toJSON());
    }

   async recentTxs(page: number, pageSize: number): Promise<QuantumPortalRemoteTransactoin[]> {
        ValidationUtils.isTrue(pageSize > 0, '"pageSize" required');
        this.verifyInit();
        const rv = await this.txModel.find().sort({timestamp: -1}).skip(page * pageSize).limit(pageSize).exec();
        return rv.map(b => b.toJSON());
   }

   async blockByHash(networkId: string, blockHash: string): Promise<QuantumPortalMinedBlock> {
       ValidationUtils.isTrue(!!networkId, '"networkId" required');
       ValidationUtils.isTrue(!!blockHash, '"blockHash" required');
       this.verifyInit();
       const rv = await this.blockModel.findOne({networkId, blockHash}).exec();
       ValidationUtils.isTrue(!!rv, `Block with hash ${networkId}:${blockHash} not found`);
       return rv.toJSON();
   }

   async blockTxs(networkId: string, blockHash: string): Promise<QuantumPortalRemoteTransactoin[]> {
       ValidationUtils.isTrue(!!networkId, '"networkId" required');
       ValidationUtils.isTrue(!!blockHash, '"blockHash" required');
       this.verifyInit();
       const rv = await this.txModel.find({blockHash}).sort({timesstamp: -1}).exec();
       return rv.map(t => t.toJSON());
   }

   async tx(networkId: string, txId: string): Promise<QuantumPortalRemoteTransactoin> {
       ValidationUtils.isTrue(!!networkId, '"networkId" required');
       ValidationUtils.isTrue(!!txId, '"txId" required');
       this.verifyInit();
       const rv = await this.txModel.findOne({hash: txId}).sort({timesstamp: -1}).exec();
       ValidationUtils.isTrue(!!rv, `Tx with hash ${networkId}:${txId} not found`);
       return rv.toJSON();
   }

   async account(address: string): Promise<QuantumPortalAccount&{contractObjects: any}> {
       ValidationUtils.isTrue(!!address, '"address" required');
       this.verifyInit();
       const rv = await this.accountModel.findOne({address}).exec();
       if (!rv) {
           return {
               address: address.toLowerCase(),
               contract: {},
               isContract: false,
               contractObjects: {},
           };
       }
       const account = rv.toJSON() as any as QuantumPortalAccount;
       const contractObjects: any = {};
       if (account.isContract) {
            for(let network of Object.keys(account.contract)) {
                const contractId = account.contract[network].contractId;
                if (!contractObjects[contractId]) {
                    const ao = await this.contractModel.findOne({contractId}).exec();
                    contractObjects[contractId] = ao.toJSON();
                }
            }
       }
       return {
            ...account,
            contractObjects,
       }
   }

   async accountTransactions(address: string, page: number = 0, pageSize: number = 40): Promise<QuantumPortalRemoteTransactoin[]> {
        ValidationUtils.isTrue(!!address, '"address" required');
        address = address.toLocaleLowerCase();
        this.verifyInit();
        const rv = await this.txModel.find(
            { '$or': [
                { remoteContract: address },
                { sourceMsgSender: address },
                { sourceBeneficiary: address },
            ]}
        ).sort({timestamp: -1}).skip(page * pageSize).limit(pageSize).exec();
        if (!rv) {
           return [];
        }
        return rv.map(r => r.toJSON());
   }

   async accountBalances(address: string): Promise<QuantumPortalAccountBalance[]> {
       // TODO:
       // Get balance for all the base chains at least.
       // TODO2:
       // On the node, also check all the "Transfer" events and keep list of potential
       // tokens in an account address.
       // Also cache aggressively
       return [];
   }

   async callMethod(network: string,
            contractAddress: string,
            abi: AbiItem,
            method: string,
            args: string[]) {
		const web3 = await this.helper.web3(network);
        const contract = new web3.Contract(abi, contractAddress);
        const res = await contract.methods[method](...args).call();
        if (!Array.isArray(res)) {
            return res.toString();
        }
        const rv = { result: [], obj: {} } as any;
        abi.outputs.forEach((out, i) => {
            rv.result.push(res[i].toString());
            rv.obj[out.name] = res[i].toString();
        });
        return rv;
   }

   async methodGetTransaction(network: string,
            contractAddress: string,
            abi: AbiItem,
            method: string,
            args: string[],
            from: string): Promise<CustomTransactionCallRequest> {
		const web3 = await this.helper.web3(network);
        const contract = new web3.Contract(abi, contractAddress);
        const p = contract.methods[method](...args);
        const nonce = await this.helper.web3(network).getTransactionCount(from, 'pending');
        return EthereumSmartContractHelper.callRequest(
            contractAddress,
            '',
            from,
            p.encodeABI(),
            undefined,
            nonce,
            `Custom Transaction`);
   }

   async registerQpContract(
            networks: string[],
            contractAddress: string,
            contract: QuantumPortalContractObject,): Promise<void> {
        this.verifyInit();
        // TODO: Validate the contract object
        ValidationUtils.isTrue(contract.deployedBytecode.startsWith('0x'), '"deployedByteCode" must be hex');
        contractAddress = contractAddress.toLowerCase();
        ValidationUtils.isTrue(Web3.utils.isAddress(contractAddress), 'Invalid address');
        const contractId = sha256sync(contract.deployedBytecode.toLowerCase().replace('0x', ''));
        contract.contractId = contractId;
        console.log('Registering contract with ID', contractId);
        const existing = await this.contractModel.findOne({contractId}).exec();
        if (!existing) {
            await new this.contractModel(contract).save();
        }
        let accountObj = await this.accountModel.findOne({address: contractAddress}).exec();
        const account: QuantumPortalAccount = !!accountObj ? accountObj.toJSON() as any : {
            address: contractAddress,
            isContract: true,
            contract: {},
        } as QuantumPortalAccount;
        for (const net of networks) {
            account.contract[net] = {
                address: contractAddress,
                network: net,
                contractId,
            } as any as QuantumPortalContractAccount;
        }
        if (!accountObj) {
            await new this.accountModel(account).save();
        } else {
            await this.accountModel.findOneAndUpdate({address: contractAddress}, account).exec();
        }

        const newAccount = await this.account(contractAddress);
        console.log('REGISTERED', newAccount)
   }
}