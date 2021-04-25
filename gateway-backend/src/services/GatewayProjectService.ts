import { MongooseConnection } from "aws-lambda-helper";
import { Injectable } from "ferrum-plumbing";
import { Connection, Model, Document } from "mongoose";
import { GatewayProjectsModel, UserProjectsModel } from "../common/MongoTypes";
import { GatewayProject, ProjectStatus, ProjectRaiseAccess, UserProjects } from 'types';

export class GatewayProjectService extends MongooseConnection implements Injectable {
    projectModel: Model<GatewayProject & Document, {}> | undefined;
    userProjectsModel: Model<UserProjects & Document, {}> | undefined;
    __name__() { return 'GatewayProjectService'; }

    initModels(con: Connection): void {
        this.projectModel = GatewayProjectsModel(con);
        this.userProjectsModel = UserProjectsModel(con);
    }

    async getProjects(filter: { status: ProjectStatus, access: ProjectRaiseAccess}): Promise<GatewayProject[]> {
        this.verifyInit();
        const filt = {} as any;
        if (filter.status) { filt.status = filter.status; }
        if (filter.access) { filt.raiseAccess = filter.access; }
        const res = await this.projectModel.find(filt).exec();
        return res.map(r => r.toJSON());
    }

    async getProjectById(projectId: string): Promise<GatewayProject|undefined> {
        this.verifyInit();
        const res = await this.projectModel.findOne({projectId}).exec();
        return !!res ? res.toJSON() : undefined;
    }

    async getUserProjects(userId: string): Promise<UserProjects|undefined> {
        this.verifyInit();
        const res = await this.userProjectsModel.findOne({userId}).exec();
        return !!res ? res.toJSON() : undefined;
    }
}