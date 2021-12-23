import { BillingStatus } from "src/helper/billing-status";


export class Billing {
    constructor() {
        this.createdDate = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
        this.status = BillingStatus.Pending;
        this.timeStamp = Math.floor(Date.now() / 1000);
    }

    public id: string;
    public txFee: string;
    public callerAddress: string;
    public status: string;
    public timeStamp: number;
    public createdBy: string;
    public createdDate: string;
}