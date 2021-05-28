import {
    Waiting,
    // @ts-ignore
} from 'desktop-components-library';
import { useSelector } from 'react-redux';
import { BridgeAppState } from '../common/BridgeAppState';

export function WaitingComponent() {
    const waiting = useSelector<BridgeAppState, boolean>(appS => appS.data.state.waiting);
    return (
        <Waiting show={waiting} />
    )
}
