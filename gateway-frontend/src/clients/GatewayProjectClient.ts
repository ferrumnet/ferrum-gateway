import { Injectable, JsonRpcRequest } from "ferrum-plumbing";
import { ApiClient } from 'common-containers';
import { ProjectStatus, ProjectRaiseAccess, UserProjects, GatewayProject } from 'types';

export class GatewayProjectClient implements Injectable {
    constructor(private api: ApiClient) { }

    __name__() { return 'GatewayProjectClient'; }

    async getProjects(filter: {status: ProjectStatus, access: ProjectRaiseAccess}): Promise<GatewayProject[]> {
        return await this.api.api({ 
            command: 'getProjects', data: {filter} as any
        } as JsonRpcRequest);
    }

    async getProjectById(projectId: string): Promise<GatewayProject> {
        return await this.api.api({ 
            command: 'getProjectById', data: {projectId} as any
        } as JsonRpcRequest);
    }

    async getUserProjects(userId?: string): Promise<UserProjects> {
        return await this.api.api({ 
            command: 'getUserProjects', data: {userId: userId || this.api.getAddress()} as any
        } as JsonRpcRequest);
    }
}