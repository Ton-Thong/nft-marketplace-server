import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { DaoInterface } from "src/helper/dao-interface";
import { Billing, BillingModel } from "src/models/billing.model";
import { UserDto } from "../user/dto/user.dto";
import { IBillingDao } from "./interfaces/billing.dao.interface";
import { v4 as uuid } from 'uuid';
import { BillingStatus } from "src/helper/billing-status";
import * as dynamoose from "dynamoose";
import { Condition } from "dynamoose/dist/Condition";
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
class BillingDao implements IBillingDao {
    constructor() { }

    public async createMintBilling(txFee: string, u: UserDto): Promise<MessageLayerDtoT<Billing>> {
        const newBilling = {
            id: uuid(),
            txFee,
            callerAddress: u.publicAddress,
            status: BillingStatus.Pending,
            createdBy: u.id,
            createdDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
            timeStamp: Math.floor(Date.now() / 1000),
        }

        const billing: Billing = await BillingModel.create(newBilling);
        return { ok: true, data: billing, message: 'success' };
    }

    public async getMintBilling(txFee: string, callerAddress: string, blockTimeStamp: number): Promise<MessageLayerDtoT<Billing>> {
        const c: Condition = new dynamoose.Condition()
            .where("txFee").eq(txFee)
            .where("callerAddress").eq(callerAddress).and()
            .where("timeStamp").lt(blockTimeStamp).and()
            .where("status").eq(BillingStatus.Pending);

        const billing = await BillingModel.query(c).limit(1).exec();
        if (!billing) {
            return { ok: false, data: null, message: `Billing is not found in database` };
        }

        return { ok: true, data: billing, message: 'success' };
    }

    public async updateMintBilling(id: string, status: string): Promise<void> {
        await BillingModel.update({ id }, { status });
    }

    public async getBillingById(id: string): Promise<MessageLayerDtoT<Billing>> {
        const billing: Billing = await BillingModel.get({ id });
        if (!billing) {
            return { ok: false, data: null, message: `Billing key is not found in database` };
        }
        return { ok: false, data: billing, message: `succes` };
    }
}

export const BillingDaoProvider = {
    provide: DaoInterface.IBillingDao,
    useClass: BillingDao
}