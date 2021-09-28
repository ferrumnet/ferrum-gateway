import {Network, AddressStorageItem} from "ferrum-plumbing";
import {SimpleTransferTransaction} from "ferrum-chain-clients";
import {LongRunningScheduler} from "ferrum-plumbing/dist/scheduler/LongRunningScheduler";

export interface ProcessedBlockCounter {
    network: Network;
    lastBlockNumber: number;
    lastBlockNumberForNonstandardTransactions: number;
}

export interface TransactionListener {
    isTransactionRelevant(t: SimpleTransferTransaction): Promise<boolean>;
    processRelevantTransaction(t: SimpleTransferTransaction): Promise<void>;
}

export interface AddressListenerSqsMessage {
    network: Network;
    address: string;
    createdAt: number;
    sweepable: boolean;
}

export const AddressListenerSqsMessageVersion = '1';

export const AddressListenerSqsMessageId = 'AddressListenerSqsMessage';

export interface AddressListener {
    subscribeAddress(a: AddressStorageItem): Promise<void>;
    listen(scheduler: LongRunningScheduler): Promise<void>;
}

export interface AddressRepository {
    addAddress(a: AddressStorageItem): Promise<void>;
    initialize(): Promise<void>;
    getAddress(n: Network, address: string): Promise<AddressStorageItem|undefined>;
}

export interface AddressLoader {
    load(): Promise<AddressStorageItem[]>;
}

export interface BlockIdentifierProducer {
    getCurrent(): Promise<ProcessedBlockCounter>
    saveBlockNumber(blockNo: number,
        nonStandardBlockNumber: number,): Promise<void>;
}