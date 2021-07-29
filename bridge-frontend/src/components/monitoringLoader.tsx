import React,{useContext} from 'react';
import {ThemeContext,ThemeConstantProvider, Theme} from 'unifyre-react-helper';
import { ChainEventBase,Utils } from 'types';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from './../common/BridgeAppState';
import { LoadingOutlined } from '@ant-design/icons';

interface MonitoringLoaderProps {
    eventId: string
}

export function MonitoringLoader(props: MonitoringLoaderProps){
    const theme = useContext(ThemeContext);   
    const styles = themedStyles(theme);
    const Events =  useSelector<BridgeAppState, {[k: string]: ChainEventBase}>(state => state.data.watchEvents);
    const eventItems = Object.values(Events);
    const MonitoredEvent = (eventItems.filter(e=>e.id === props.eventId)[0] || {})
    return (
        <span style={styles.container}>
            <LoadingOutlined
                spin={MonitoredEvent.status === 'pending'}
            /> 
        </span>
    )
}

const themedStyles = (theme: ThemeConstantProvider) => ({
    container: {
        "display":"flex",
        "alignItems":"center",
        "fontSize":"20px",
        padding:"0px 10px"
    }
})