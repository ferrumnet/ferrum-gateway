import {
    Waiting,
    // @ts-ignore
} from 'desktop-components-library';
import { useSelector } from 'react-redux';
import { GovernanceAppState } from './GovernanceAppState';

export function WaitingComponent() {
    const waiting = useSelector<GovernanceAppState, boolean>(appS => appS.data.state.waiting);
    return (
        <Waiting show={waiting} />
    )
}
