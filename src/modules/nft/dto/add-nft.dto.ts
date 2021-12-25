import { IsBoolean, IsString, IsUUID } from "class-validator";

export class AddNFTDto {
    @IsString()
    public name: string;
    @IsString()
    public description: string;
    @IsUUID()
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
    @IsString()
    public txHash: string;
    @IsBoolean()
    public forceTest: boolean;
}