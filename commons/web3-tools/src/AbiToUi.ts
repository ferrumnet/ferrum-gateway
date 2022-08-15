import { AbiItem, AbiItemInputType, AbiModel } from "./AbiModel";

export interface AbiUiItem {
    actionType: 'write' | 'read' | 'log';
    label: string;
    abiItem: AbiItem;
}

export interface AbiUiLogItem extends AbiUiItem {
    actionType: 'log';
    value: string;
}

export interface AbiUiReadableItem extends AbiUiItem {
    actionType: 'read';
    value: string;
}

export interface AbiUiWritableItemInput {
    type: AbiItemInputType;
    label: string;
    value: string;
    dirty: boolean;
    valid: boolean;
}

export interface AbiUiWritableItem extends AbiUiItem {
    actionType: 'write';
    transactionId?: string;
    inputs: AbiUiWritableItemInput[];
}

export class AbiToUi {
    static map(abi: AbiModel): AbiUiItem[] {
        return abi.map(a => AbiToUi.mapItem(a));
    }

    static mapItem(item: AbiItem): AbiUiItem {
        switch(item.type) {
            case 'event':
                return {
                    abiItem: item,
                    actionType: 'log',
                    label: '',
                    value: '',
                } as AbiUiLogItem;
            case 'function':
                switch(item.stateMutability) {
                    case 'view': 
                        return {
                            abiItem: item,
                            actionType: 'read',
                            label: item.name,
                            value: '',
                        } as AbiUiReadableItem;
                    default: // Writable
                        return {
                            abiItem: item,
                            actionType: 'write',
                            label: item.name,
                            inputs: item.inputs.map(i => ({
                                label: i.name,
                                type: i.type,
                                dirty: false,
                                valid: false,
                                value: '',
                            } as AbiUiWritableItemInput))
                        } as AbiUiWritableItem;
                }
            default:
                throw new Error('Unsuppoerted item of type ' + item.type);
        }
    }
}