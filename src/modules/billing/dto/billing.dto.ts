import { IsString } from 'class-validator';

export class BillingDto {
    constructor(b: any) {
        const { id, txFee, callerAddress, status, createdBy, createdDate } = b;
        this.id = id;
        this.txFee = txFee;
        this.callerAddress = callerAddress;
        this.status = status;
        this.createdBy = createdBy;
        this.createDate = createdDate;
    }

    @IsString()
    public id: string;
    @IsString()
    public txFee: string;
    @IsString()
    public callerAddress: string;
    @IsString()
    public status: string;
    @IsString()
    public createdBy: string;
    @IsString()
    public createDate: string;
}