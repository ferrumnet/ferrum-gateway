import { createSlice } from "@reduxjs/toolkit";
import { FButton, FInputText, FLink } from "ferrum-design-system";
import { useDispatch, useSelector } from "react-redux";
import { Utils } from "types";
import { AbiItem, AbiItemInputType, Uint256Type } from "web3-tools";
import { QpAppState } from "../common/QpAppState";

export const updateInputSlice = createSlice({
    name: 'qp-frontend/updateInputSlice',
    initialState: {
        errors: {} as { [k: string]: string },
        values: {} as { [k: string]: string },
        displayValues: {} as { [k: string]: string },
        convertToWei: {} as { [k: string]: boolean },
    },
    reducers: {
        valueChanged: (state, action) => {
            const {key, value, displayVal, error} = action.payload;
            state.values[key as string] = (value || '').toString();
            state.displayValues[key as string] = (displayVal || '').toString();
            state.errors[key as string] = error;
        },
        convertToWei: (state, action) => {
            const { key } = action.payload;
            state.convertToWei[key] = !state.convertToWei[key];
        }
    },
});

function validateForType(inputType: AbiItemInputType, value: string): string {
    switch (inputType) {
        case 'address':
            return Utils.isAddress(value) ? '' : 'Enter a valid address';
        case 'uint256':
            return Utils.isBigInt(value) ? '' : 'Enter a number';
        case 'boolean':
            return value === 'true' || value === 'false' ? '' : 'Enter true or false';
        case 'bytes32':
            return Utils.isHex(value) ? '' : 'Enter a valid hex';
        case 'bytes':
            return Utils.isHex(value) ? '' : 'Enter a valid hex';
    }
}

export function abiInputGroupKey(prefix: string, itemIdx: number, i: number): string {
    return `${prefix}/${itemIdx}/${i}`;
}

export function AbiInputGroup(props: {
    item: AbiItem,
    prefix: string,
    itemIdx: number,
    children: any,
 }) {
    const dispatch = useDispatch();
    const fields = useSelector<
        QpAppState,
        {
            errors: {[k: string]: string},
            values: {[k: string]: string},
            displayValues: {[k: string]: string},
            convertToWei: { [k: string]: boolean } }
    >((state) => state.ui.abiInputGroup);
    return (
        <>
        {props.item.inputs.map((input, i) => {
            const key = abiInputGroupKey(props.prefix, props.itemIdx, i);
            const convertToWei = fields.convertToWei[key];
            let displayVal = convertToWei ? (fields.displayValues[key] || '') : fields.values[key];
            return (
            <>
                <FInputText
                    key={i}
                    label={input.name}
                    value={displayVal}
                    error={fields.errors[abiInputGroupKey(props.prefix, props.itemIdx, i)]}
                    onChange={(e: any) => {
                        const key = abiInputGroupKey(props.prefix, props.itemIdx, i);
                        const valueDis = e.target.value as string;
                        const value = convertToWei ? Uint256Type.toWei(valueDis) : valueDis;
                        const error = validateForType(input.type, value);
                        dispatch(updateInputSlice.actions.valueChanged({ key, value, displayVal: valueDis, error }));
                    }}
                    postfix={
                        Uint256Type.isUint(input.type) ? (
                            <> <span>{convertToWei ? '(decimal)' : '(wei)'}</span> </>
                        ) : undefined
                    }
                    postfixAction={() =>
                        dispatch(updateInputSlice.actions.convertToWei({ key }))
                    }
                />
            </>
            );})}
            <br/>
        {props.children}
        </>
    );
}