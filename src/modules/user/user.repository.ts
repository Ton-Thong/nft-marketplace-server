import { Inject, Injectable } from "@nestjs/common";
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
import { TableName } from "src/helper/TableName";
import { UserDto } from "./dto/user.dto";
import { AddUserDto } from "src/modules/user/dto/add-user.dto";

@Injectable()
export class UserRepository {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    async create(user: AddUserDto): Promise<MessageLayerDto> {
        try {
            const { publicAddress, username } = user;
            const nonce: number = Math.floor(Math.random() * 10000);
            const newUser = { id : uuid(), publicAddress, username, nonce }

            await this.docClient.put({
                TableName: TableName.User,
                Item: newUser
            }).promise();

            return { ok: true, data: newUser, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    async get(id: string, publicAddress: string): Promise<MessageLayerDto> {
        try {
            const result = await this.docClient.get({
                TableName: TableName.User,
                Key: { id, publicAddress }
            }).promise();

            if (Object.keys(result).length == 0) {
                return { ok: false, data: null, message: `User with publicAddress ${publicAddress} is not found in database` };
            }

            return { ok: true, data: result.Item, message: `success` };
        } catch (err) {
            throw err;
        }
    }

    async findByPublicAddress(publicAddress: string): Promise<MessageLayerDto> {
        try {
            const result = await this.docClient.scan({
                TableName: TableName.User,
                FilterExpression: '#publicAddress = :publicAddress',
                ExpressionAttributeNames: { '#publicAddress': 'publicAddress' },
                ExpressionAttributeValues: { ':publicAddress': publicAddress },
            }).promise();

            if(result.Items.length > 0) {
                return { ok: true, data: result.Items, message: 'success' }
            } else {
                return { ok: false, data: null, message: `User with publicAddress ${publicAddress} is not found in database` }
            }
        }
        catch (err) {
            throw err;
        }
    }

    async updateNonce(user: UserDto): Promise<MessageLayerDto> {
        try {
            const { id, publicAddress, nonce } = user;
            const result = await this.docClient.update({
                TableName: TableName.User,
                Key: { id, publicAddress },
                UpdateExpression: "set #nonce = :n",
                ExpressionAttributeNames: { '#nonce': 'nonce' },
                ExpressionAttributeValues: { ":n": nonce }
            }).promise();

            return { ok: true, data: result, message: `success` };
        }
        catch (err) {
            throw err;
        }
    }
}