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

export const writeContractSlice = createSlice({
    name: 'qp-frontend/writeContractSlice',
    initialState: {
        errors: {} as { [k: string]: string },
        values: {} as { [k: string]: string },
        pending: {} as { [k: string]: boolean },
    },
    reducers: {
        valueRead: (state, action) => {
            const {method, txid} = action.payload;
            state.values[method as string] = (txid || '').toString();
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

const writeContractField = createAsyncThunk('qp-frontend/writeContractField',
	async (payload: {
        network: string,
        address: string,
		abiItem: AbiItem,
        fieldName: string,
        values: string[],
	}, ctx) => {
		const client = inject<QpExplorerClient>(QpExplorerClient);
        try {
            ctx.dispatch(writeContractSlice.actions.pending({method: payload.abiItem.name}));
            const txid = await client.writeContractField(
                payload.address,
                [payload.abiItem],
                payload.abiItem.name,
                payload.values,
            );
            ctx.dispatch(writeContractSlice.actions.valueRead({method: payload.abiItem.name, txid}));
        } catch (e) {
            ctx.dispatch(writeContractSlice.actions.fieldError({method: payload.abiItem.name, error: e}));
        }
	}
);

export function ContractInteractionWriter(props: {network: string}) {
    const account = useSelector<
        QpAppState,
        QuantumPortalAccount | undefined
    >((state) => state.data.state.selectedAddress?.account);
    const writeState = useSelector<
        QpAppState,
        { errors: {[k: string]: string}, values: {[k: string]: string}, pending: {[k: string]: string} }
    >((state) => state.ui.writeContract);
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
    const abi = account.contract[props.network].abi as any;
    const uiAbi = AbiToUi.map(abi);
    
    return (
        <>
            <FCard>
                <Pair
                    itemKey={<h2>Write</h2>}
                    value={''}
                />
                {
                    uiAbi.filter(i => i.actionType === 'write')
                        .map((a: AbiUiItem, i: number) => (
                            <Pair
                                key={i}
                                itemKey={a.label}
                                value={
                                    a.abiItem.inputs.length > 0 ? (
                                        <>
                                            <div className="pair-abi-readable">
                                                {writeState.values[a.abiItem.name] || writeState.errors[a.abiItem.name]}
                                            </div><br/>
                                            <AbiInputGroup
                                                itemIdx={i}
                                                prefix={'reader'}
                                                item={a.abiItem}>
                                                <FButton 
                                                    title={'write' + (writeState.pending[a.abiItem.name] ? ' (wait...)' : '')}
                                                    rounded={true}
                                                    onClick={() => dispatch(writeContractField({
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
                                                {writeState.values[a.abiItem.name] || writeState.errors[a.abiItem.name]}
                                            </div>
                                            <FButton 
                                                title={'read' + (writeState.pending[a.abiItem.name] ? ' (wait...)' : '')}
                                                rounded={true}
                                                onClick={() => dispatch(writeContractField({
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
            <FCard>
                <Pair
                    itemKey={<h2>Write</h2>}
                    value={''}
                />
            </FCard>
        </>
    )
}