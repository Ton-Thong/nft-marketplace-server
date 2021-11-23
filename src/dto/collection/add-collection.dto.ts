import { IsString } from "class-validator";

export class AddCollectionDto {
    @IsString()
    public name: string;
}