import { ActionButton } from '@fluentui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { PageWrapperUtils, ReponsivePageWrapperDispatch, ReponsivePageWrapperProps } from './PageWrapperTypes';
import { ResponsivePageWrapper } from './ResponsivePageWrapper';
import { Utils } from '../common/Utils';
import { useBoolean } from '@uifabric/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { SidePane } from './../components/SidePanel';
import { BridgeAppState } from '../common/BridgeAppState';
import { openPanelHandler } from './../pages/Swap'
export function WebPageWrapper(props: {
    children: any, noMainPage?: boolean,panelOpen?:boolean}&ReponsivePageWrapperProps&ReponsivePageWrapperDispatch) {
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const groupId = Utils.getGroupIdFromHref();
    const dispatch = useDispatch();
    const panelOpen =  useSelector<BridgeAppState, any>(state => state.ui.swapPage.panelOpen);

    const handleDismiss = () => {
        openPanelHandler(dispatch)
        setOpen(false);
    }
    
    const bridgeItems = (
        <>
            <div onClick={()=>setOpen(!open)}>
                My Withdrawals
            </div>
            <div onClick={()=>history.push('./')}>
                My Pair
            </div>
        </>
    );
    return (
        <>
        <ResponsivePageWrapper 
            {...props}
            navBarContent={
                <>
                    {bridgeItems}
                </>
            }
        >
             {props.children}
             <SidePane
                isOpen={open||panelOpen}
                dismissPanel={handleDismiss}
             />
        </ResponsivePageWrapper>
        </>
    );
}
