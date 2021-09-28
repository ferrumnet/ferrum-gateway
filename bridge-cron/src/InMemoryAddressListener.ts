import {AddressListener, AddressListenerSqsMessage, AddressRepository} from "./types";
import {AddressStorageItem, Injectable, Logger, LoggerFactory} from "ferrum-plumbing";
import {SqsWrapper} from "aws-lambda-helper";
import {LongRunningScheduler} from "ferrum-plumbing/dist/scheduler/LongRunningScheduler";

export class InMemoryAddressListener implements AddressListener, Injectable {
    private log: Logger;
    constructor(
        private repo: AddressRepository,
        private sqs: SqsWrapper<AddressListenerSqsMessage>,
        loggerFactory: LoggerFactory) {
        this.log = loggerFactory.getLogger(InMemoryAddressListener);
        this.subscribeAddress = this.subscribeAddress.bind(this);
        this.onNewAddress = this.onNewAddress.bind(this);
        this.sqs.listen(this.onNewAddress);
    }

    __name__(): string {
        return 'InMemoryAddressListener';
    }

    async subscribeAddress(a: AddressStorageItem): Promise<void> {
        this.log.info(`subscribeAddress: New address received: ${JSON.stringify(a)}`);
        await this.repo.addAddress(a);
    }

    private async onNewAddress(t: AddressListenerSqsMessage) {
        this.log.info('onNewAddress: subscribing :', t);
        await this.subscribeAddress({
            address: t.address,
            network: t.network,
            createdAt: t.createdAt,
            sweepable: t.sweepable,
        } as AddressStorageItem)
        this.log.info('onNewAddress: subscribing completed.');
    }

    listen(scheduler: LongRunningScheduler): Promise<void> {
        this.log.info('Listening to SQS queue for address messages');
        return this.sqs.startPeriodicalFetch(scheduler);
    }
}