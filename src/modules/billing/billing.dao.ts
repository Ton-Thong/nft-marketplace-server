import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { DaoInterface } from "src/helper/dao-interface";
import { UserDto } from "../user/dto/user.dto";
import { IBillingDao } from "./interfaces/billing.dao.interface";
import { v4 as uuid } from 'uuid';
import { BillingStatus } from "src/helper/billing-status";
import { BillingDto } from "src/modules/billing/dto/billing.dto";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { TableName } from "src/helper/table-name";

@Injectable({ scope: Scope.REQUEST })
class BillingDao implements IBillingDao {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    public async createMintBilling(txFee: string, u: UserDto): Promise<MessageLayerDtoT<BillingDto>> {
        const id = uuid();
        const newBilling = {
            id,
            txFee,
            callerAddress: u.publicAddress,
            status: BillingStatus.Pending,
            createdBy: u.id,
            createdDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
            timeStamp: Math.floor(Date.now() / 1000),
        }

        await this.docClient.put({ TableName: TableName.Billing, Item: newBilling }).promise();
        return { ok: true, data: id, message: 'success' };
    }

    public async getMintBilling(txFee: string, callerAddress: string, blockTimeStamp: number): Promise<MessageLayerDtoT<BillingDto>> {
        const result = await this.docClient.scan({
            TableName: TableName.Billing,
            FilterExpression: '#callerAddress = :callerAddress and #txFee = :txFee and #timeStamp <= :blockTimeStamp and #status = :status',
            ExpressionAttributeNames: {
                '#callerAddress': 'callerAddress',
                '#txFee': 'txFee',
                '#timeStamp': 'timeStamp',
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':callerAddress': callerAddress,
                ':txFee': txFee,
                ':blockTimeStamp': blockTimeStamp,
                ':status': BillingStatus.Pending,
            }
        }).promise();

        if (!result || result.Count <= 0) {
            return { ok: false, data: null, message: `error` };
        }

        return { ok: true, data: new BillingDto(result.Items[0]), message: 'success' };
    }

    public async getBillingById(id: string): Promise<MessageLayerDtoT<BillingDto>> {
        const result = await this.docClient.get({
            TableName: TableName.Billing,
            Key: { id }
        }).promise();

        if (Object.keys(result).length == 0) {
            return { ok: false, data: null, message: 'success' };
        }

        return { ok: true, data: new BillingDto(result.Item), message: `success` };
    }

    public async updateMintBilling(id: string, status: string): Promise<void> {
        await this.docClient.update({
            TableName: TableName.Billing,
            Key: { id },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ":status": status }
        }).promise();
    }
}

export const BillingDaoProvider = {
    provide: DaoInterface.IBillingDao,
    useClass: BillingDao
}