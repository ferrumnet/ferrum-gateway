
export interface QuantumPortalContracts {
    manager: string;
    poc: string;
}

export const QuantumPortalContractList: { [k: string]: QuantumPortalContracts } = {
    'RINKEBY': {
        manager: '0xd36312D594852462d6760042E779164EB97301cd',
        poc: '0x010aC4c06D5aD5Ad32bF29665b18BcA555553151',
    },
}

export function quantumPortalContracts(network: string): QuantumPortalContracts {
    return QuantumPortalContractList[network] || QuantumPortalContractList['DEFAULT'];
}