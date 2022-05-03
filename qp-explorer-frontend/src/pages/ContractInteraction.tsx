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

export const readContractSlice = createSlice({
    name: 'qp-frontend/readContractSlice',
    initialState: {
        errors: {} as { [k: string]: string },
        values: {} as { [k: string]: string },
    },
    reducers: {
        valueRead: (state, action) => {
            const {method, value} = action.payload;
            state.values[method as string] = (value || '').toString();
            delete state.errors[method as string];
        },
        fieldError: (state, action) => {
            const {method, error} = action.payload;
            state.errors[method as string] = error;
            delete state.values[method as string];
        }
    },
});

const readContractField = createAsyncThunk('qp-frontend/readContractField',
	async (payload: {
        network: string,
        address: string,
		abiItem: AbiItem,
        fieldName: string,
	}, ctx) => {
		const client = inject<QpExplorerClient>(QpExplorerClient);
        try {
            const val = await client.readContractField(
                payload.network,
                payload.address,
                [payload.abiItem],
                payload.abiItem.name,
                []
            );
            ctx.dispatch(readContractSlice.actions.valueRead({method: payload.abiItem.name, value: val}));
        } catch (e) {
            ctx.dispatch(readContractSlice.actions.fieldError({method: payload.abiItem.name, error: e}));
        }
	}
);

export function ContractInteraction(props: {network: string}) {
    const init = useSelector<QpAppState, boolean>(
        (state) => state.data.init.initialized
    );
    const account = useSelector<
        QpAppState,
        QuantumPortalAccount | undefined
    >((state) => state.data.state.selectedAddress?.account);
    const readState = useSelector<
        QpAppState,
        { errors: {[k: string]: string}, values: {[k: string]: string} }
    >((state) => state.ui.readContract);
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
                                    <div className="pair-abi-readable">
                                        {readState.values[a.abiItem.name] || readState.errors[a.abiItem.name]}
                                        <FButton 
                                            title={'read'}
                                            rounded={true}
                                            onClick={() => dispatch(readContractField({
                                                network: props.network,
                                                address: account.address,
                                                abiItem: a.abiItem,
                                                fieldName: a.abiItem.name,
                                            }))}
                                        />
                                    </div>
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