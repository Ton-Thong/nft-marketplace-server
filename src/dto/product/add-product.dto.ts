import { IsString } from "class-validator";

export class AddProductDto {
    @IsString()
    public name: string;
    @IsString()
    public description: string;
    @IsString()
    public imageName: string;
    @IsString()
    public imageType: string;
}