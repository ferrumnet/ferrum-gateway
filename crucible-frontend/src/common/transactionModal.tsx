import React, { useState } from 'react';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { ResponsiveMode } from 'office-ui-fabric-react';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { CrucibleAppState } from './CrucibleAppState';
import { FLayout, FContainer,FCard, FButton, ThemeBuilder } from "ferrum-design-system";
//@ts-ignore
import { AddTokenToMetamask } from 'component-library';
import { useHistory, useParams } from 'react-router';
import { CrucibleInfo, Utils,UserCrucibleInfo,BigUtils } from 'types';

export interface TxModalState {
    isOpen: boolean;
    status: 'waiting' | 'submitted' | 'rejected',
    txId: string
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
            txId: ''
        } as TxModalState,
        reducers: {
            toggleModal: (state,action)=>{
                state.isOpen = action.payload.show ?? !state.isOpen;
                state.status = action.payload.mode ?? state.status;
                state.txId = action.payload.txId ? action.payload.txId : state.txId
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
    let crucible = useSelector<CrucibleAppState, CrucibleInfo|undefined>(state =>state.data.state.crucible);
    let network = useSelector<CrucibleAppState, string>(state =>state.connection.account.user.accountGroups[0]?.addresses[0]?.network||'');
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
                                        <div onClick={() => window.open(Utils.linkForTransaction(crucible?.network||network,modalProps.txId), '_blank')} className='modal-sub-text link'>
                                            View on Explorer <span>⬈</span>
                                        </div>
                                        <div className='modal-mini-text'>
                                            <div className="cr-addToMetask">
                                                <AddTokenToMetamask
                                                    tokenData = {{
                                                        "currency": crucible?.contractAddress,
                                                        "address": crucible?.contractAddress,
                                                        "symbol": crucible?.symbol,
                                                        "decimals": 18,
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