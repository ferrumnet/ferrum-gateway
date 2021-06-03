import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ReponsivePageWrapperDispatch, ReponsivePageWrapperProps } from './PageWrapperTypes';
import { ResponsivePageWrapper } from './ResponsivePageWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { SidePane } from './../components/SidePanel';
import { BridgeAppState } from '../common/BridgeAppState';
import { openPanelHandler } from './../pages/Swap'
import { Badge } from 'antd';
import {SidePanelProps} from './../components/SidePanel';

export function WebPageWrapper(props: {
    children: any, noMainPage?: boolean,panelOpen?:boolean}&ReponsivePageWrapperProps&ReponsivePageWrapperDispatch) {
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const panelOpen =  useSelector<BridgeAppState, boolean>(state => state.ui.swapPage.panelOpen);

    const handleDismiss = () => {
        openPanelHandler(dispatch)
        setOpen(false);
    }
    const withdrawalsProps =  useSelector<BridgeAppState, SidePanelProps>(state => state.ui.sidePanel);
    let unUsedItems = withdrawalsProps.userWithdrawalItems.filter(e=>e.used === '').length;

    const bridgeItems = (
        <>
            <div onClick={()=>setOpen(!open)}>
                My Withdrawals 
                <span>
                    <Badge
                        className="site-badge-count-109"
                        count={unUsedItems || 0}
                        style={{ backgroundColor: '#52c41a' }}
                    />
                </span>
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
