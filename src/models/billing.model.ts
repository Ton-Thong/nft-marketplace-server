import { Injectable, Scope } from "@nestjs/common";
import { BillingStatus } from "src/helper/billing-status";
import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";

export class Billing extends Document {
    public id: string;
    public txFee: string;
    public callerAddress: string;
    public status: string = BillingStatus.Pending;
    public timeStamp: number = Math.floor(Date.now() / 1000);
    public createdBy: string;
    public createdDate: string = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
}

@Injectable({ scope: Scope.REQUEST })
export class BillingModel {
    public client = dynamoose.model<Billing>("Billings", {
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
}