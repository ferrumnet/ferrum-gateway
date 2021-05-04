import { GatewayPool, GatewayProject, GatewayPublicRound } from "types";

const pool1 = {
    access: 'public',
    cap: '100000',
    allocations: [],
    network: 'ETHEREUM',
    poolId: 'testPool1',
    poolStats: {
        totalUsersParticipated: 100,
        totalSwap: '84000',
    },
} as GatewayPool;

const round1 = {
    open: Date.now() + 1000 * 3600 * 12,
    close: Date.now() + 1000 * 3600 * 24,
    name: 'Test Round 1',
    poolId: 'testPool1',
} as GatewayPublicRound;

const testProject1 = {
    projectId: 'testProject1',
    name: 'Test Project 1',
    status: 'draft',
    social: { website: 'https://testproject1.com' },
    raiseAccess: 'public',
    logo: '',
    contributionCurrencies: [{ currency: 'ETHEREUM:...', network: 'ETHERUEM', symbol: 'FRM' }],
    description: 'This is a test project that is used to fill up some space...',
    network: 'ETHEREUM',
    pools: [pool1],
    publicRounds: [round1],
} as GatewayProject;

