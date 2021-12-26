import { Injectable, Scope } from "@nestjs/common";
import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { Collection, CollectionModel } from "src/models/collection.model";
import { UserDto } from "../user/dto/user.dto";
import { AddCollectionDto } from "./dto/add-collection.dto";
import { CollectionDto } from "./dto/collection.dto";
import { ICollectionDao } from "./interface/collection.dao.interface";
import { v4 as uuid } from 'uuid';
import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { DaoInterface } from "src/helper/dao-interface";

@Injectable({ scope: Scope.REQUEST })
class CollectionDao implements ICollectionDao {
    constructor() { }

    public async createCollection(c: AddCollectionDto, u: UserDto): Promise<MessageLayerDtoT<Collection>> {
        const collection: Collection = await CollectionModel.create({
            id: uuid(),
            name: c.name,
            createdBy: u.id
        });

        return { ok: true, data: collection, message: 'success' };
    }

    public async getCollectionById(id: string): Promise<MessageLayerDtoT<Collection>> {
        const collection: Collection = await CollectionModel.get({ id });
        if (!collection) {
            return { ok: false, data: null, message: `Collection key is not found in database` };
        }
        return { ok: true, data: collection, message: `success` };
    }

    public async getCollectionAllByUser(u: UserDto): Promise<MessageLayerDtoT<Collection[]>> {
        const collections: ScanResponse<Collection> = await CollectionModel.scan("createdBy").eq(u.id).exec();

        return !collections || collections.count <= 0
            ? { ok: false, data: null, message: 'Collections is not found in database' }
            : { ok: true, data: collections, message: 'success' };
    }

    public async updateCollectionName(c: CollectionDto): Promise<void> {
        const { id, name } = c
        await CollectionModel.update({ id }, { name });
    }

    public async deleteColletion(c: CollectionDto): Promise<void> {
        const { id } = c;
        await CollectionModel.delete(id);
    }
}

export const CollectionDaoProvider = {
    provide: DaoInterface.ICollectionDao,
    useClass: CollectionDao
}