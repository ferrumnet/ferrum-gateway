
export interface QuantumPortalContracts {
    manager: string;
    poc: string;
}

export const QuantumPortalContractList: { [k: string]: QuantumPortalContracts } = {
    'DEFAULT': {
        manager: '0x3d7d171d02d5f37c8eb0d3eea72859d5fc758ffb',
        poc: '0x2c24a6b225b4c82d3241f5c7c037cc374a979b17',
    },
}

export function quantumPortalContracts(network: string): QuantumPortalContracts {
    return QuantumPortalContractList[network] || QuantumPortalContractList['DEFAULT'];
}