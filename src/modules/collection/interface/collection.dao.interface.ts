import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { Collection } from "src/models/collection.model";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddCollectionDto } from "../dto/add-collection.dto";
import { CollectionDto } from "../dto/collection.dto";

export interface ICollectionDao {
    createCollection(c: AddCollectionDto, u: UserDto): Promise<MessageLayerDtoT<CollectionDto>>;
    getCollectionById(id: string): Promise<MessageLayerDtoT<CollectionDto>>;
    getCollectionAllByUser(u: UserDto): Promise<MessageLayerDtoT<Array<CollectionDto>>>;
    updateCollectionName(c: CollectionDto): Promise<void>;
    deleteColletion(c: CollectionDto): Promise<void>;
}