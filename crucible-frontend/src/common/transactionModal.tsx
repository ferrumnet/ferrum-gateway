import React, { useState } from 'react';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { ResponsiveMode } from 'office-ui-fabric-react';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { CrucibleAppState } from './CrucibleAppState';

export interface TxModalState {
    isOpen: boolean
}

export interface TransactionModal {
    txId: string,
    currency: string,
    message: string,
    status: 'waiting' | 'submitted',
    isOpen: boolean,
    onDismiss: () => void
}

export const TransactionModalSlice = createSlice(
    {
        name: 'TransactionSlice',
        initialState: {
            isOpen: false,
        } as TxModalState,
        reducers: {
            toggleModal: (state,)=>{
                state.isOpen = !state.isOpen
            }
        }
    }
)

export interface TransactionModal {
    txId: string,
    currency: string,
    message: string,
    status: 'waiting' | 'submitted',
    isOpen: boolean,
    onDismiss: () => void
}

export function TransactionModal(){
    const modalProps = useSelector<CrucibleAppState,any>(state=>state.ui.transactionModal)
    return (
        <>
            <Modal
                isOpen={modalProps.isOpen}
                onDismiss={()=>{}}
                isBlocking={false}
                isClickableOutsideFocusTrap={false}
                responsiveMode={ResponsiveMode.medium}
                className='tr-modal-container'
            >
                helelo
                {}
            </Modal>
        </>
    )
}