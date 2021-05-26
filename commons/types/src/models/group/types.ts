import { Schema, Connection, Document } from "mongoose";

export interface GroupInfo {
    _id: string;
    groupId: string;
    themeVariables: any;
    defaultCurrency: string;
    homepage: string;
    noMainPage: boolean; // Main page should redirect to home page
    headerHtml?: string;
    footerHtml?: string;
  }
//@ts-ignore
export const groupInfoSchema: Schema = new Schema<GroupInfo>({
  groupId: String,
  themeVariables: Object,
  homepage: String,
  defaultCurrency: String,
  noMainPage: String,
});

export const GroupInfoModel = (c: Connection) => c.model<GroupInfo&Document>('groupInfo', groupInfoSchema);
