import { FCard } from "ferrum-design-system";
import { QuantumPortalAccount } from "qp-explorer-commons";
import { useDispatch, useSelector } from "react-redux"
import { QpAppState } from "../common/QpAppState"
import { AbiItem, AbiModel, AbiToUi, AbiUiItem, AbiUiReadableItem } from 'web3-tools';
import { Pair } from "./Pair";
import { FButton } from "ferrum-design-system";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { inject } from "types";
import { QpExplorerClient } from "../QpExplorerClient";
import { AbiInputGroup, abiInputGroupKey } from "./AbiInputGroup";

export const readContractSlice = createSlice({
    name: 'qp-frontend/readContractSlice',
    initialState: {
        errors: {} as { [k: string]: string },
        values: {} as { [k: string]: string },
        pending: {} as { [k: string]: boolean },
    },
    reducers: {
        valueRead: (state, action) => {
            const {method, value} = action.payload;
            state.values[method as string] = (value || '').toString();
            state.pending[method as string] = false;
            delete state.errors[method as string];
        },
        fieldError: (state, action) => {
            const {method, error} = action.payload;
            state.errors[method as string] = error;
            state.pending[method as string] = false;
            delete state.values[method as string];
        },
        pending: (state, action) => {
            const {method} = action.payload;
            state.pending[method as string] = true;
        }
    },
});

const readContractField = createAsyncThunk('qp-frontend/readContractField',
	async (payload: {
        network: string,
        address: string,
		abiItem: AbiItem,
        fieldName: string,
        values: string[],
	}, ctx) => {
		const client = inject<QpExplorerClient>(QpExplorerClient);
        try {
            ctx.dispatch(readContractSlice.actions.pending({method: payload.abiItem.name}));
            const val = await client.readContractField(
                payload.network,
                payload.address,
                [payload.abiItem],
                payload.abiItem.name,
                payload.values || [],
            );
            ctx.dispatch(readContractSlice.actions.valueRead({method: payload.abiItem.name, value: val}));
        } catch (e) {
            ctx.dispatch(readContractSlice.actions.fieldError({method: payload.abiItem.name, error: e}));
        }
	}
);

export function ContractInteractionReader(props: {network: string}) {
    const account = useSelector<
        QpAppState,
        QuantumPortalAccount&{contractObjects: any} | undefined
    >((state) => state.data.state.selectedAddress?.account);
    const readState = useSelector<
        QpAppState,
        { errors: {[k: string]: string}, values: {[k: string]: string}, pending: {[k: string]: string} }
    >((state) => state.ui.readContract);
    const fields = useSelector<
        QpAppState,
        { errors: {[k: string]: string}, values: {[k: string]: string} }
    >((state) => state.ui.abiInputGroup);

    const dispatch = useDispatch();
    const contract = account?.contract[props.network];
    if (!account || !contract) {
        return (
            <></>
        );
    }
    const abi = account.contractObjects[contract.contractId].abi as any;
    const uiAbi = AbiToUi.map(abi);
    
    return (
        <>
            <FCard>
                <Pair
                    itemKey={<h2>Read</h2>}
                    value={''}
                />
                {
                    uiAbi.filter(i => i.actionType === 'read')
                        .map((a: AbiUiItem, i: number) => (
                            <Pair
                                key={i}
                                itemKey={a.label}
                                value={
                                    a.abiItem.inputs.length > 0 ? (
                                        <>
                                            <div className="pair-abi-readable">
                                                {readState.values[a.abiItem.name] || readState.errors[a.abiItem.name]}
                                            </div><br/>
                                            <AbiInputGroup
                                                itemIdx={i}
                                                prefix={'reader'}
                                                item={a.abiItem}>
                                                <FButton 
                                                    title={'read' + (readState.pending[a.abiItem.name] ? ' (wait...)' : '')}
                                                    rounded={true}
                                                    onClick={() => dispatch(readContractField({
                                                        network: props.network,
                                                        address: account.address,
                                                        abiItem: a.abiItem,
                                                        fieldName: a.abiItem.name,
                                                        values: a.abiItem.inputs.map((_, inputIdx) =>
                                                            fields.values[abiInputGroupKey('reader', i, inputIdx)] )
                                                    }))}
                                                />
                                            </AbiInputGroup>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <div className="pair-abi-readable">
                                                {readState.values[a.abiItem.name] || readState.errors[a.abiItem.name]}
                                            </div>
                                            <FButton 
                                                title={'read' + (readState.pending[a.abiItem.name] ? ' (wait...)' : '')}
                                                rounded={true}
                                                onClick={() => dispatch(readContractField({
                                                    network: props.network,
                                                    address: account.address,
                                                    abiItem: a.abiItem,
                                                    fieldName: a.abiItem.name,
                                                    values: []
                                                }))}
                                            />
                                        </>
                                    )
                                }
                            />
                        ))
                }
            </FCard>
            <div> &nbsp; </div>
        </>
    )
}