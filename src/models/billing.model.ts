import { Injectable, Scope } from "@nestjs/common";
import { BillingStatus } from "src/helper/billing-status";
import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { TableName } from "src/helper/table-name";

export class Billing extends Document {
    public id: string;
    public txFee: string;
    public callerAddress: string;
    public status: string = BillingStatus.Pending;
    public timeStamp: number = Math.floor(Date.now() / 1000);
    public createdBy: string;
    public createdDate: string = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });

    //field reference to NFT
    //bield billing category
}

export const BillingModel = dynamoose.model<Billing>(TableName.Billing, {
    "id": {
        "type": String,
        "hashKey": true,
    },
    "txFee": String,
    "callerAddress": String,
    "status": String,
    "timeStamp": Number,
    "createdBy": String,
    "createdDate": String,
})