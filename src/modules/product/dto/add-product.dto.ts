import { IsString } from "class-validator";

export class AddProductDto {
    @IsString()
    public name: string;
    @IsString()
    public description: string;
    @IsString()
    public collectionId: string;
    @IsString()
    public collectionName: string;
    @IsString()
    public fileName: string;
    @IsString()
    public fileType: string;
    @IsString()
    public cid: string;
    @IsString()
    public metadata: string;
}