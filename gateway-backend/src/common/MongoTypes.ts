import { Connection, Document, Schema } from "mongoose";
import { CurrencyInfo, GatewayPool, GatewayPoolAllocation, GatewayPoolStat, GatewayProject, GatewayPublicRound, ProjectSocial } from 'types';

export const projectSocialSchema = new Schema<Document<ProjectSocial>>({
    website: String,
    twitter: String,
    reddit: String,
    facebook: String,
    whitePaper: String,
});

export const currencyInfoSchema = new Schema<Document<CurrencyInfo>>({
    name: String,
    totalSupply: String,
    decimals: Number,
    network: String,
    currency: String,
    symbol: String,
});

export interface GatewayStakings {
}

export const gatewayPoolStatSchema = new Schema<Document<GatewayPoolStat>>({
    totalUsersParticipated: Number,
    totalSwap: String,
});

export const gatewayPoolAllocationSchema = new Schema<Document<GatewayPoolAllocation>>({
    poolId: String,
    address: String,
    allocation: String,
    claimed: String,
});

export const gatewayPoolSchema = new Schema<Document<GatewayPool>>({
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

export const gatewayPublicRoundSchema = new Schema<Document<GatewayPublicRound>>({
    poolId: String,
    name: String,
    open: Number,
    close: Number,
});

export const gatewayProjectSchema = new Schema<Document<GatewayProject>>({
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
});

export const GatewayProjectModels = (c: Connection) => c.model<GatewayProject&Document>(
    'gatewayProjects', gatewayProjectSchema);
