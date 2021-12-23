import { Collection } from "src/models/collection.model";
import { UserDto } from "src/modules/user/dto/user.dto";
import { AddCollectionDto } from "../dto/add-collection.dto";
import { CollectionDto } from "../dto/collection.dto";

export interface ICollectionService {
    create(c: AddCollectionDto, u: UserDto): Promise<Collection>;
    getById(id: string): Promise<Collection>;
    getAllฺByUser(u: UserDto): Promise<Array<Collection>>;
    updateCollectionName(uc: CollectionDto): Promise<void>;
    delete(c: CollectionDto): Promise<void>;
}