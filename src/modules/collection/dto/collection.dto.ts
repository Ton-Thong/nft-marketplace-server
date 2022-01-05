import { IsString } from "class-validator";
import { Collection } from "src/models/collection.model";

export class CollectionDto {
    constructor(c: any) {
        const { id, name, createdBy } = c;
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
    }

    @IsString()
    public id: string;
    @IsString()
    public name: string;
    @IsString()
    public createdBy: string;
}