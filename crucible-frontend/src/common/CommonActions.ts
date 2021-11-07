
export const CommonActions = {
    WAITING: 'WAITING',
    WAITING_DONE: 'WAITING_DONE',
    CONTINUATION_DATA_RECEIVED: 'CONTINUATION_DATA_RECEIVED',
    CONTINUATION_DATA_FAILED: 'CONTINUATION_DATA_FAILED',
    GROUP_INFO_LOADED: 'GROUP_INFO_LOADED',
    ERROR_OCCURED: 'ERROR_OCCURED',
    RESET_ERROR: 'RESET_ERROR'
};

export function addAction(type: string, payload: any) {
    return { type, payload };
}

export const APPLICATION_NAME = 'CRUCIBLE';