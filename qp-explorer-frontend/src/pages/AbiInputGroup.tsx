import { createSlice } from "@reduxjs/toolkit";
import { FInputText } from "ferrum-design-system";
import { useDispatch, useSelector } from "react-redux";
import { Utils } from "types";
import { AbiItem, AbiItemInputType } from "web3-tools";
import { QpAppState } from "../common/QpAppState";

export const updateInputSlice = createSlice({
    name: 'qp-frontend/updateInputSlice',
    initialState: {
        errors: {} as { [k: string]: string },
        values: {} as { [k: string]: string },
    },
    reducers: {
        valueChanged: (state, action) => {
            const {key, value, error} = action.payload;
            state.values[key as string] = (value || '').toString();
            state.errors[key as string] = error;
        },
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
        { errors: {[k: string]: string}, values: {[k: string]: string} }
    >((state) => state.ui.abiInputGroup);
    return (
        <>
        {props.item.inputs.map((input, i) => (
            <>
                <FInputText
                    key={i}
                    label={input.name}
                    value={fields.values[abiInputGroupKey(props.prefix, props.itemIdx, i)]}
                    error={fields.errors[abiInputGroupKey(props.prefix, props.itemIdx, i)]}
                    onChange={(e: any) => {
                        const key = abiInputGroupKey(props.prefix, props.itemIdx, i);
                        const value = e.target.value as string;
                        const error = validateForType(input.type, value);
                        dispatch(updateInputSlice.actions.valueChanged({ key, value, error }));
                    }}
                />
            </>
        ))}
        {props.children}
        </>
    );
}