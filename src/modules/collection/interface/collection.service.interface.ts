import { Collection } from "src/models/collection.model";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddCollectionDto } from "../dto/add-collection.dto";
import { CollectionDto } from "../dto/collection.dto";

export interface ICollectionService {
    createCollection(c: AddCollectionDto, u: UserDto): Promise<CollectionDto>;
    getCollectionById(id: string): Promise<CollectionDto>;
    getCollectionAllฺByUser(u: UserDto): Promise<Array<CollectionDto>>;
    updateCollectionName(uc: CollectionDto): Promise<void>;
    deleteCollection(c: CollectionDto): Promise<void>;
}