import { IsString, IsUUID } from "class-validator";

export class ProductDto {
    @IsUUID()
    id: string;

    @IsString()
    assetUrl: string;
}