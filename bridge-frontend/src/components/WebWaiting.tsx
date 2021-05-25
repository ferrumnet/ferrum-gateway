import {
    Waiting,
    // @ts-ignore
} from 'desktop-components-library';
import { useDispatch, useSelector } from 'react-redux';
import { BridgeAppState } from '../common/BridgeAppState';

export function WaitingComponent() {
    const waiting = useSelector<BridgeAppState, any>(appS => appS.data.state.waiting);
    console.log(waiting,'waiting')

    return (
        <Waiting show={waiting} />
    )
}
