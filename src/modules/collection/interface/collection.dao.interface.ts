import { MessageLayerDtoT } from "src/dto/messageLayer.dto";
import { Collection } from "src/models/collection.model";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddCollectionDto } from "../dto/add-collection.dto";
import { CollectionDto } from "../dto/collection.dto";

export interface ICollectionDao {
    createCollection(c: AddCollectionDto, u: UserDto): Promise<MessageLayerDtoT<Collection>>;
    getCollectionById(id: string): Promise<MessageLayerDtoT<Collection>>;
    getCollectionAllByUser(u: UserDto): Promise<MessageLayerDtoT<Array<Collection>>>;
    updateCollectionName(c: CollectionDto): Promise<void>;
    deleteColletion(c: CollectionDto): Promise<void>;
}