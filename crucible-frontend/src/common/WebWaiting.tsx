import {
    Waiting,
    // @ts-ignore
} from 'desktop-components-library';
import { useSelector } from 'react-redux';
import { CrucibleAppState } from './CrucibleAppState';

export function WaitingComponent() {
    const waiting = useSelector<CrucibleAppState, boolean>(appS => appS.data.state.waiting);
    return (
        <Waiting show={waiting} />
    )
}
