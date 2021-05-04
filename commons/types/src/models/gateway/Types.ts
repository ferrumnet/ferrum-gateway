
export type ProjectStatus = 'draft' | 'pending' | 'open' | 'closed';

export type ProjectRaiseAccess = 'private' | 'public';

export interface ProjectSocial {
    website?: string;
    twitter?: string;
    reddit?: string;
    facebook?: string;
    whitePaper?: string;
}

export interface CurrencyInfo {
    name?: string;
    totalSupply?: string;
    decimals?: number;
    network: string;
    currency: string;
    symbol: string;
}

export interface GatewayStakings {
}

export interface GatewayPoolStat {
    totalUsersParticipated: number;
    totalSwap: string;
}

export interface GatewayPoolAllocation {
    poolId: string;
    address: string;
    allocation: string;
    claimed: string;
}

export interface GatewayPool {
    poolId: string;
    network: string;
    currency: string;
    openTime: number;
    closeTime: number;
    swapRate: string;
    cap: string;
    poolStats: GatewayPoolStat;
    access: 'private' | 'public';
    allocations: GatewayPoolAllocation[];
}

export interface GatewayPublicRound {
    poolId: string;
    name: string;
    open: number;
    close: number;
}

export interface GatewayProject {
    projectId: string;
    network: string;
    name: string;
    logo: string;
    description: string;
    status: ProjectStatus;
    social: ProjectSocial;
    contributionCurrencies: CurrencyInfo[];
    pools: GatewayPool[];
    publicRounds: GatewayPublicRound[];
    raiseAccess: ProjectRaiseAccess;
    priority: number;
}

export interface UserProjectAllocation {
    userId: string;
    projectId: string;
    allocation: string;
    claimed: string;
}

export interface UserProjects {
    userId: string;
    favoriteProjectIds: string[];
    allocations: UserProjectAllocation[];
}