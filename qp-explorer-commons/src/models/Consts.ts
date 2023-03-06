
export interface QuantumPortalContracts {
    manager: string;
    gateway: string;
    poc: string;
    validatorMgr: string;
    minerMgr: string;
    staking: string;
}

export const QuantumPortalContractList: { [k: string]: QuantumPortalContracts } = {
    'DEFAULT': {
        gateway: '',
        manager: '',
        poc: '',
        minerMgr: '',
        staking: '',
        validatorMgr: ''
    },
}

export function quantumPortalContracts(network: string): QuantumPortalContracts {
    return QuantumPortalContractList[network] || QuantumPortalContractList['DEFAULT'];
}