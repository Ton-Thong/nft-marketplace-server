import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { DaoInterface } from "src/helper/dao-interface";
import { UserDto } from "../user/dto/user.dto";
import { IBillingDao } from "./interfaces/billing.dao.interface";
import { v4 as uuid } from 'uuid';
import { BillingCategory, BillingStatus } from "src/helper/billing-status";
import { BillingDto } from "src/modules/billing/dto/billing.dto";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { TableName } from "src/helper/table-name";
import * as AWS from 'aws-sdk';
import { DynamoExpression } from "src/dto/dynamoExpression.dto";

@Injectable({ scope: Scope.REQUEST })
class BillingDao implements IBillingDao {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    public async createBilling(txFee: string, billingCate: BillingCategory, user: UserDto): Promise<MessageLayerDtoT<BillingDto>> {
        const id = uuid();
        const newBilling = {
            id,
            txFee,
            callerAddress: user.publicAddress,
            createdBy: user.id,
            createdDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
            timeStamp: Math.floor(Date.now() / 1000),
            status: BillingStatus.Pending,
            tokenId: null,
            category: billingCate
        }

        await this.docClient.put({ TableName: TableName.Billing, Item: newBilling }).promise();
        return { ok: true, data: id, message: 'success' };
    }

    public async getBilling(txFee: string, callerAddress: string, billingCate: BillingCategory): Promise<MessageLayerDtoT<BillingDto>> {
        const result = await this.docClient.scan({
            TableName: TableName.Billing,
            FilterExpression: '#callerAddress = :callerAddress and #txFee = :txFee and #status = :status and #category = :category',
            ExpressionAttributeNames: {
                '#callerAddress': 'callerAddress',
                '#txFee': 'txFee',
                '#status': 'status',
                '#category': 'category'
            },
            ExpressionAttributeValues: {
                ':callerAddress': callerAddress,
                ':txFee': txFee,
                ':status': BillingStatus.Pending,
                ':category': billingCate,
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

    public async updateBillingByExpression(id: string, expression: DynamoExpression): Promise<void> {
        const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = expression;
        await this.docClient.update({
            TableName: TableName.Billing,
            Key: { id },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        }).promise();
    }
}

export const BillingDaoProvider = {
    provide: DaoInterface.IBillingDao,
    useClass: BillingDao
}