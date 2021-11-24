import { IsString } from "class-validator";

export class CollectionDto {
    @IsString()
    public id: string;
    @IsString()
    public name: string;
}