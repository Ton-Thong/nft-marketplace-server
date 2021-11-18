import { IsString, IsUUID } from "class-validator";

export class AddProductResponseDto {
    public id: string;
    public s3Url: string;
}