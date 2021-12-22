import { Inject, Injectable, Scope } from "@nestjs/common";
import * as AWS from 'aws-sdk';
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { BillingStatus } from "src/helper/BillingStatus";
import { TableName } from "src/helper/TableName";
import { Billing } from "src/models/billing.model";
import { v4 as uuid } from 'uuid';
import { UserDto } from "../user/dto/user.dto";

@Injectable({ scope: Scope.REQUEST })
export class BillingRepository {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    public async createMintBilling(txFee: string, u: UserDto): Promise<MessageLayerDto> {
        try {
            const id = uuid();
            const billing = new Billing();
            billing.id = id;
            billing.txFee = txFee;
            billing.callerAddress = u.publicAddress;
            billing.createdBy = u.id;

            await this.docClient.put({
                TableName: TableName.Billing,
                Item: billing
            }).promise();

            return { ok: true, data: id, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    public async getMintBilling(txFee: string, callerAddress: string, blockTimeStamp: number): Promise<MessageLayerDto> {
        try {
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

            return { ok: true, data: result.Items[0], message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    public async updateMintBilling(id: string, status: string): Promise<MessageLayerDto> {
        try {
            const result = await this.docClient.update({
                TableName: TableName.Billing,
                Key: { id },
                UpdateExpression: "set #status = :status",
                ExpressionAttributeNames: { '#status': 'status' },
                ExpressionAttributeValues: { ":status": status }
            }).promise();

            return { ok: true, data: result, message: `success` };
        } catch (err) {
            throw err;
     
        }
    }

    public async getBillingById(id: string): Promise<MessageLayerDto> {
        try {
            const result = await this.docClient.get({
                TableName: TableName.Billing,
                Key: { id }
            }).promise();

            if (Object.keys(result).length == 0) {
                return { ok: false, data: null, message: 'success' };
            }

            return { ok: true, data: result.Item, message: `success` };
        } catch (err) {
            throw err;
        }
    }
}