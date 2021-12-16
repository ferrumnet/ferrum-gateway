import { Connection, Document, Schema } from "mongoose";
import { CurrencyInfo, GatewayPool, GatewayPoolAllocation,
    GatewayPoolStat, GatewayProject, GatewayPublicRound,
    ProjectSocial, UserProjectAllocation, UserProjects } from 'types';

export const projectSocialSchema = new Schema<ProjectSocial&Document>({
    website: String,
    twitter: String,
    reddit: String,
    facebook: String,
    whitePaper: String,
});

export const currencyInfoSchema = new Schema<CurrencyInfo&Document>({
    name: String,
    totalSupply: String,
    decimals: Number,
    network: String,
    currency: String,
    symbol: String,
});

export interface GatewayStakings {
}

export const gatewayPoolStatSchema = new Schema<GatewayPoolStat&Document>({
    totalUsersParticipated: Number,
    totalSwap: String,
});

export const gatewayPoolAllocationSchema = new Schema<GatewayPoolAllocation&Document>({
    poolId: String,
    address: String,
    allocation: String,
    claimed: String,
});

export const gatewayPoolSchema = new Schema<GatewayPool&Document>({
    poolId: String,
    network: String,
    currency: String,
    openTime: Number,
    closeTime: Number,
    swapRate: String,
    cap: String,
    poolStats: gatewayPoolStatSchema,
    access: String,
    allocations: [gatewayPoolAllocationSchema],
});

export const gatewayPublicRoundSchema = new Schema<GatewayPublicRound&Document>({
    poolId: String,
    name: String,
    open: Number,
    close: Number,
});

export const gatewayProjectSchema = new Schema<GatewayProject&Document>({
    projectId: String,
    network: String,
    name: String,
    logo: String,
    description: String,
    status: String,
    social: projectSocialSchema,
    contributionCurrencies: [currencyInfoSchema],
    pools: [gatewayPoolSchema],
    publicRounds: [gatewayPublicRoundSchema],
    raiseAccess: String,
});

export const userProjectAllocationSchema = new Schema<UserProjectAllocation&Document>({
    userId: String,
    projectId: String,
    allocation: String,
    claimed: String,
});

export const userProjectsSchema = new Schema<UserProjects&Document>({
    userId: String,
    favoriteProjectIds: [String],
    allocations: [userProjectAllocationSchema],
});

export const GatewayProjectsModel = (c: Connection) => c.model<GatewayProject&Document>(
    'gatewayProjects', gatewayProjectSchema);

export const UserProjectsModel = (c: Connection) => c.model<UserProjects&Document>(
    'userProjects', userProjectsSchema);
