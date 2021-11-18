import { IsString, IsUUID } from "class-validator";

export class AddProductResponseDto {
    @IsUUID()
    public id: string;

    @IsString()
    public s3Url: string;
}