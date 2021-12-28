import { Inject, Injectable, Scope } from "@nestjs/common";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { Collection } from "src/models/collection.model";
import { UserDto } from "../user/dto/user.dto";
import { AddCollectionDto } from "./dto/add-collection.dto";
import { CollectionDto } from "./dto/collection.dto";
import { ICollectionDao } from "./interface/collection.dao.interface";
import { v4 as uuid } from 'uuid';
import { DaoInterface } from "src/helper/dao-interface";
import { TableName } from "src/helper/table-name";

@Injectable({ scope: Scope.REQUEST })
class CollectionDao implements ICollectionDao {
    constructor(@Inject('DynamoDb') private docClient: AWS.DynamoDB.DocumentClient) { }

    public async createCollection(c: AddCollectionDto, u: UserDto): Promise<MessageLayerDtoT<CollectionDto>> {
        const id = uuid();
        const collection: Collection = { id, name: c.name, createdBy: u.id }

        await this.docClient.put({ TableName: TableName.Collection, Item: collection }).promise();
        return { ok: true, data: new CollectionDto(collection), message: 'success' };
    }

    public async getCollectionById(id: string): Promise<MessageLayerDtoT<CollectionDto>> {
        const collection = await this.docClient.get({ TableName: TableName.Collection, Key: { id } }).promise();
        if (Object.keys(collection).length == 0) {
            return { ok: false, data: null, message: `Collection with ${id} is not found in database` };
        }

        return { ok: true, data: new CollectionDto(collection.Item), message: `success` };
    }

    public async getCollectionAllByUser(u: UserDto): Promise<MessageLayerDtoT<Array<CollectionDto>>> {
        const collections = await this.docClient.scan({
            TableName: TableName.Collection,
            FilterExpression: '#createdBy = :createdBy',
            ExpressionAttributeNames: { '#createdBy': 'createdBy' },
            ExpressionAttributeValues: { ':createdBy': u.id },
        }).promise();

        if (!collections || collections.Items.length > 0) {
            return { ok: true, data: collections.Items.map(e => new CollectionDto(e)), message: 'success' };
        } else {
            return { ok: false, data: null, message: 'Collections is not found in database' };
        }
    }

    public async updateCollectionName(c: CollectionDto): Promise<void> {
        await this.docClient.update({
            TableName: TableName.Collection,
            Key: { id: c.id },
            UpdateExpression: "set #name = :n",
            ExpressionAttributeNames: { '#name': 'name' },
            ExpressionAttributeValues: { ":n": c.name }
        }).promise();
    }

    public async deleteColletion(c: CollectionDto): Promise<void> {
        await this.docClient.delete({ TableName: TableName.Collection, Key: { id: c.id } }).promise();
    }
}

export const CollectionDaoProvider = {
    provide: DaoInterface.ICollectionDao,
    useClass: CollectionDao
}