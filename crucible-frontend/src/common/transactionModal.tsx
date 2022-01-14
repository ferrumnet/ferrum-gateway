import React, { useState } from 'react';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { ResponsiveMode } from 'office-ui-fabric-react';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from './CrucibleAppState';
import { FLayout, FContainer,FCard, FButton, ThemeBuilder } from "ferrum-design-system";
//@ts-ignore
import { AddTokenToMetamask } from 'component-library';

export interface TxModalState {
    isOpen: boolean;
    status: 'waiting' | 'submitted' | 'rejected',
}

export interface TransactionModal {
    txId: string,
    currency: string,
    message: string,
    status: 'waiting' | 'submitted' | 'rejected',
    isOpen: boolean,
    onDismiss: () => void
}

export const TransactionModalSlice = createSlice(
    {
        name: 'TransactionSlice',
        initialState: {
            isOpen: false,
            status: 'submitted',
        } as TxModalState,
        reducers: {
            toggleModal: (state,action)=>{
                state.isOpen = action.payload.show ?? !state.isOpen;
                state.status = action.payload.mode ?? state.status;
            }
        }
    }
)

export const Actions = TransactionModalSlice.actions

export interface TransactionModal {
    txId: string,
    currency: string,
    message: string,
    status: 'waiting' | 'submitted' | 'rejected',
    isOpen: boolean,
    onDismiss: () => void
}

export function TransactionModal(){
    const modalProps = useSelector<CrucibleAppState,any>(state=>state.ui.transactionModal)
    const dispatch = useDispatch();
    return (
        <>
            <Modal
                isOpen={modalProps.isOpen}
                closeButtonAriaLabel='x'
                onDismiss={()=>{}}
                isBlocking={false}
                isClickableOutsideFocusTrap={true}
                responsiveMode={ResponsiveMode.medium}
                className='tr-modal-container'
            >
                <div className='modal-body'>
                    <div className='content'>
                        {
                            modalProps.status === 'waiting' &&  <div className='loader'></div>
                        }
                        {
                            modalProps.status === 'submitted' &&  <div className='arrows circle up'></div>
                        }
                        {
                            modalProps.status === 'rejected' &&  <div className='gg-close-o'></div>
                        }
                    </div>
                    <div className='modal-main-text'>
                        {
                                modalProps.status === 'submitted' &&  <div className='modal-main-text'>Transaction Submitted</div>        
                        }
                        {
                                modalProps.status === 'rejected' &&   <div className='modal-sub-text'>Transaction Rejected By User.</div>        
                        }
                    </div>
                        {
                                modalProps.status === 'waiting' && <div className='modal-sub-text'> Confirm This Transaction in your Wallet.</div>
                        }
                        
                        {
                                modalProps.status === 'submitted' && 
                                    <div className='spaced-out'>
                                        <div className='modal-sub-text link'>
                                            View on Explorer <span>⬈</span>
                                        </div>
                                        <div className='modal-mini-text'>
                                            <div className="cr-addToMetask">
                                                <AddTokenToMetamask
                                                    tokenData = {{
                                                        "currency": '0xff',
                                                        "symbol":'sym',
                                                        "decimals":14,
                                                        "logoURI": ''
                                                    }}
                                                />
                                            </div>
                                            
                                        </div>
                                    </div>
                        }
                        <FButton 
                            title={'Close'}
                            className={'lg-btn'}                                    
                            onClick={()=>dispatch(Actions.toggleModal({}))}
                        />
                </div>
               
            </Modal>
        </>
    )
}