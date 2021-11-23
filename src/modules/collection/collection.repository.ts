import { Inject, Injectable } from "@nestjs/common";
import * as AWS from 'aws-sdk';
import { AddCollectionDto } from "src/dto/collection/add-collection.dto";
import { CollectionDto } from "src/dto/collection/collection.dto";
import { MessageLayerDto } from "src/dto/messageLayer.dto";
import { UserDto } from "src/dto/user/user.dto";
import { TableName } from "src/helper/Option";
import { Collection } from "src/models/collection.model";
import { v4 as uuid } from 'uuid';

@Injectable()
export class CollectionRepository {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    async create(c: AddCollectionDto, u: UserDto): Promise<MessageLayerDto> {
        try {
            const id = uuid();
            const collection = new Collection();
            collection.id = id;
            collection.name = c.name;
            collection.createdBy = u.id;

            await this.docClient.put({
                TableName: TableName.Collection,
                Item: collection,
            }).promise();

            return { ok: true, data: collection, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    async updateCollectionName(c: CollectionDto): Promise<MessageLayerDto> {
        try {
            await this.docClient.update({
                TableName: TableName.Collection,
                Key: { id: c.id } ,
                UpdateExpression: "set #name = :n",
                ExpressionAttributeNames: { '#name': 'name' },
                ExpressionAttributeValues: { ":n": c.name }
            }).promise();

            return { ok: true, data: c, message: 'success' };
        } catch (err) {
            throw err;
        }
    }

    async delete(c: CollectionDto): Promise<MessageLayerDto> {
        try {
            await this.docClient.delete({
                TableName: TableName.Collection,
                Key: { id: c.id}
            }).promise();

            return { ok: true, data: null, message: 'success' };
        } catch(err) {
            throw err;
        }
    }

    async getById(id: string): Promise<MessageLayerDto> {
        const result = await this.docClient.get({
            TableName: TableName.Collection,
            Key: { id }
        }).promise();

        if (Object.keys(result).length == 0) {
            return { ok: false, data: null, message: `Collection with ${id} is not found in database` };
        }

        return { ok: true, data: result.Item, message: `success` };
    }

    async getAllฺByUser(u: UserDto): Promise<MessageLayerDto> {
        try {
            const result = await this.docClient.scan({
                TableName: TableName.Collection,
                FilterExpression: '#createdBy = :createdBy',
                ExpressionAttributeNames: { '#createdBy': 'createdBy' },
                ExpressionAttributeValues: { ':createdBy': u.id },
            }).promise();

            if (result.Items.length > 0) {
                return { ok: true, data: result.Items, message: 'success' };
            } else {
                return { ok: false, data: null, message: 'Collections is not found in database' };
            }
        } catch (err) {
            throw err;
        }
    }
}