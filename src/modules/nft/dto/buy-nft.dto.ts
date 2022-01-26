import { IsBoolean, IsNumber, IsString } from "class-validator";

export class BuyNftDto {
    @IsNumber()
    public tokenId: number;
    @IsString()
    public buyyer: string;
    @IsString()
    public txHash: string;
    @IsBoolean()
    public forceTest: boolean;
}